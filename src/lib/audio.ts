/**
 * Mandar, Indonesian & English Speech Synthesis Engine (Multi-Lingual TTS)
 * Dilengkapi Pemrosesan Fonotaktik Penutur Asli Mandar (Balai Bahasa Sulsel 2025)
 * Mendukung profil suara AI Perempuan (Indoq Mandar & Kaka Mandar) dengan
 * frekuensi fundamental, intonasi liris, alofon intervokalik, sentak glotal, dan geminasi.
 */

export interface SpeechOptions {
  lang?: 'mandar' | 'indonesia' | 'english';
  rate?: number;
  pitch?: number;
  volume?: number;
  gender?: 'female' | 'male';
  voiceProfile?: 'indoq' | 'kaka' | 'amboq' | 'neutral';
  preferredVoiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Inisialisasi daftar suara sintetis dari browser
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/**
 * Pemilihan Suara Sintetis Terbaik untuk Penutur Asli:
 * Memprioritaskan suara perempuan Indonesia alami (Microsoft Gadis/Siti, Google Bahasa Indonesia, Apple Damayanti).
 */
export function findBestVoice(
  lang: 'mandar' | 'indonesia' | 'english' = 'mandar',
  gender: 'female' | 'male' = 'female',
  preferredVoiceName?: string
): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // Jika ada preferensi nama spesifik
  if (preferredVoiceName) {
    const found = voices.find(v => v.name.toLowerCase().includes(preferredVoiceName.toLowerCase()));
    if (found) return found;
  }

  const isIndoOrMandar = lang === 'mandar' || lang === 'indonesia';
  const targetPrefix = isIndoOrMandar ? 'id' : 'en';

  const femaleKeywords = [
    'gadis', 'siti', 'damayanti', 'female', 'wanita', 'perempuan', 
    'google bahasa indonesia', 'ayu', 'pertiwi', 'cantika'
  ];

  if (gender === 'female') {
    if (isIndoOrMandar) {
      // 1. Cari suara perempuan Indonesia online natural (Edge / Windows)
      const edgeFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return (l.startsWith('id') || n.includes('indonesia')) && 
               (n.includes('gadis') || n.includes('siti') || (n.includes('natural') && n.includes('female')));
      });
      if (edgeFemale) return edgeFemale;

      // 2. Google Bahasa Indonesia (Chrome / Android default female voice)
      const googleFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return (l.startsWith('id') || n.includes('indonesia')) && n.includes('google');
      });
      if (googleFemale) return googleFemale;

      // 3. Apple Damayanti (macOS / iOS Safari)
      const appleDamayanti = voices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('damayanti');
      });
      if (appleDamayanti) return appleDamayanti;

      // 4. Suara Indonesia apapun dengan kata kunci perempuan
      const anyFemaleId = voices.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return (l.startsWith('id') || n.includes('indonesia')) && femaleKeywords.some(k => n.includes(k));
      });
      if (anyFemaleId) return anyFemaleId;

      // 5. Suara Indonesia apapun
      const anyId = voices.find(v => v.lang.toLowerCase().startsWith('id') || v.name.toLowerCase().includes('indonesia'));
      if (anyId) return anyId;
    } else {
      // English female voice
      const enFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return l.startsWith('en') && (
          n.includes('natural') || n.includes('female') || n.includes('samantha') || 
          n.includes('zira') || n.includes('jenny') || n.includes('google')
        );
      });
      if (enFemale) return enFemale;
    }
  } else {
    // Male voice
    if (isIndoOrMandar) {
      const idMale = voices.find(v => {
        const n = v.name.toLowerCase();
        const l = v.lang.toLowerCase();
        return (l.startsWith('id') || n.includes('indonesia')) && (n.includes('andika') || n.includes('male') || n.includes('pria'));
      });
      if (idMale) return idMale;
    }
  }

  // Fallback ke suara bahasa terkait atau yang pertama
  return voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix)) || voices[0] || null;
}

/**
 * Preprocessing khusus teks Mandar untuk audio sintesis penutur asli wanita:
 * Mengikuti Pedoman Fonologi & Tata Bahasa Mandar (Kemendikbudristek & Balai Bahasa Sulsel):
 * 
 * 1. Glottal Stop Koda (Hamzah Akhir Suku Kata / Kata):
 *    - Ortografi Mandar menggunakan 'q' untuk sentakan glotis [ʔ].
 *    - Mesin TTS bahasa Indonesia melafalkan huruf 'k' pada posisi koda sebagai hentian glotis [ʔ] (seperti 'anak', 'bapak').
 *    - Mengubah 'q' di akhir kata menjadi 'k' menghasilkan pelafalan glotal koda penutur asli yang sempurna.
 * 
 * 2. Alofon Intervokalik (Pelemahan Konsonan Antara Dua Vokal):
 *    - V + b + V -> w (contoh: tabe -> tawe, sibaliparriq -> siwaliparrik, subu -> suwu)
 *    - V + d + V -> dz / r (contoh: madondong -> madzondong, poda -> podza)
 *    - V + g + V -> gh / velar frikatif (contoh: pago -> pagho, siga -> sigha)
 *    - V + j + V -> y (contoh: kaja -> kaya, majeppu -> mayeppu)
 * 
 * 3. Geminasi / Konsonan Kembar (pp, tt, kk, ss, rr, ll, mm, nn, bb, dd, cc, jj):
 *    - Dipecah menjadi jeda silabis mikro (contoh: pappasang -> pap-pasang, matte -> mat-te, tarra -> tar-ra).
 */
export function preprocessMandarForTTS(text: string): string {
  if (!text) return '';
  
  // Hapus karakter dekoratif non-fonetik
  const cleaned = text.replace(/--|~/g, '');
  
  const tokens = cleaned.split(/(\s+|[,.!?;:—–"«»()])/);
  
  const processed = tokens.map(token => {
    if (!token || /^\s+$/.test(token) || /^[,.!?;:—–"«»()]$/.test(token)) {
      return token;
    }
    
    let w = token;

    // 1. Alofon intervokalik (hanya untuk konsonan tunggal di antara dua vokal)
    w = w.replace(/(?<![bB])([aiueoAIUEO])b([aiueoAIUEO])(?![bB])/g, '$1w$2');
    w = w.replace(/(?<![dD])([aiueoAIUEO])d([aiueoAIUEO])(?![dD])/g, '$1dz$2');
    w = w.replace(/(?<![gG])([aiueoAIUEO])g([aiueoAIUEO])(?![gG])/g, '$1gh$2');
    w = w.replace(/(?<![jJ])([aiueoAIUEO])j([aiueoAIUEO])(?![jJ])/g, '$1y$2');

    // 2. Sentak glotal 'q':
    // a. Glotal koda akhir kata (itaq -> itak, malambiq -> malambik, andiq -> andik)
    w = w.replace(/([aiueoAIUEO])q(?=$|[^a-zA-Z])/g, '$1k');
    // b. Glotal pra-konsonan (paqmai -> pak-mai, saqra -> sak-ra, maqelo -> mak-elo)
    w = w.replace(/([aiueoAIUEO])q(?=[bcdfghjklmnprstvwxyzBCDFGHJKLMNPRSTVWXYZ])/g, '$1k-');
    // c. Glotal intervokalik (daqa -> da'a, taqu -> ta'u)
    w = w.replace(/([aiueoAIUEO])q([aiueoAIUEO])/g, "$1'$2");
    // d. Glotal sisa
    w = w.replace(/q/gi, 'k');

    // 3. Geminasi suku kata (konsonan kembar bertekanan khas Mandar)
    w = w.replace(/([bcdfghjklmnprstwyzBCDFGHJKLMNPRSTWYZ])\1/gi, (match) => {
      const char = match[0];
      return char + '-' + char;
    });

    return w;
  });
  
  return processed.join('');
}

/**
 * Daftar penjelasan aturan fonotaktik penutur asli Mandar untuk visualisasi & edukasi
 */
export function getMandarPhoneticRulesExplanation() {
  return [
    {
      title: "Sentak Glotal Koda /q/ → [ʔ]",
      description: "Huruf 'q' pada akhir kata dilafalkan sebagai hentian pita suara tegas (glottal stop), bukan huruf k letup atau q barat.",
      example: "itaq [itaʔ] → Anda, andiq [andiʔ] → adik, malambiq [malambiʔ] → tenang."
    },
    {
      title: "Alofon Intervokalik /b/ → [w] / [β]",
      description: "Fonem /b/ di antara dua vokal mengalami pelemahan menjadi semivokal bibir lembut [w].",
      example: "tabe [tawe] → permisi, subu [suwu] → subuh, sibaliparriq [siwali-parrik] → gotong-royong."
    },
    {
      title: "Alofon Intervokalik /d/ → [dz] / [r]",
      description: "Fonem /d/ di antara dua vokal pada dialek Pamboang & Sendana dilafalkan berdesis apiko-alveolar [dz].",
      example: "madondong [madzondong] → pagi, poda [podza] → petuah."
    },
    {
      title: "Alofon Intervokalik /g/ → [gh] / [ɣ]",
      description: "Fonem /g/ di antara dua vokal dilafalkan sebagai frikatif velar lembut [gh].",
      example: "pago [pagho] → cangkir, siga [sigha] → lincah."
    },
    {
      title: "Geminasi Silabis (Konsonan Kembar)",
      description: "Konsonan rangkap diucapkan dengan jeda penekanan silabis (mora ganda) yang membedakan makna.",
      example: "pappasang [pap-pasang] → wasiat, matte [mat-te] → berlari, tarra [tar-ra] → kencang."
    },
    {
      title: "Karakter Vokal Wanita (Indoq Mandar)",
      description: "Disintesis pada frekuensi fundamental 220–250 Hz (pitch 1.16x–1.22x) dengan tempo artikulasi liris 0.88x yang santun.",
      example: "Intonasi khas perempuan Mandar: lembut, berwibawa, dan berirama pantun (Kalindaqdaq)."
    }
  ];
}

/**
 * Fungsi utama untuk melafalkan teks pendek maupun kalimat panjang
 * Default: Suara AI Perempuan Penutur Asli Mandar (Indoq Mandar)
 */
export function speakText(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined' || !text) return;

  const {
    lang = 'mandar',
    gender = 'female',
    voiceProfile = 'indoq',
    preferredVoiceName,
    volume = 1.0,
    onStart,
    onEnd,
    onError
  } = options;

  // Nilai pitch dan rate optimal berdasarkan gender dan profil suara
  let defaultPitch = 1.16; // Pitch vokal wanita natural (220-250 Hz)
  let defaultRate = 0.88;  // Tempo berbicara wanita Mandar yang teratur dan anggun

  if (gender === 'female') {
    if (voiceProfile === 'indoq') {
      defaultPitch = 1.15; // Suara ibu Mandar: bijak, santun, hangat
      defaultRate = 0.86;
    } else if (voiceProfile === 'kaka') {
      defaultPitch = 1.22; // Suara kakak pengajar: ramah, ceria, artikulatif
      defaultRate = 0.90;
    }
  } else {
    // Male
    defaultPitch = 0.92;
    defaultRate = 0.88;
  }

  const finalPitch = options.pitch !== undefined ? options.pitch : defaultPitch;
  const finalRate = options.rate !== undefined ? options.rate : defaultRate;

  stopSpeaking();

  if (!('speechSynthesis' in window)) {
    playWebAudioBeepSequence(text, onEnd);
    return;
  }

  let speechString = text;
  let targetLocale = 'id-ID';

  if (lang === 'mandar') {
    speechString = preprocessMandarForTTS(text);
    targetLocale = 'id-ID';
  } else if (lang === 'indonesia') {
    speechString = text.replace(/--|~/g, '');
    targetLocale = 'id-ID';
  } else if (lang === 'english') {
    speechString = text;
    targetLocale = 'en-US';
  }

  const utterance = new SpeechSynthesisUtterance(speechString);
  utterance.lang = targetLocale;
  utterance.rate = finalRate;
  utterance.pitch = finalPitch;
  utterance.volume = volume;

  // Pilih suara terbaik yang sesuai (khususnya suara perempuan penutur asli)
  const matchedVoice = findBestVoice(lang, gender, preferredVoiceName);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    activeUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function playWebAudioBeepSequence(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) {
      if (onEnd) onEnd();
      return;
    }

    const ctx = new AudioCtxClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 260 + (text.length % 7) * 35;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.41);

    osc.onended = () => {
      ctx.close();
      if (onEnd) onEnd();
    };
  } catch {
    if (onEnd) onEnd();
  }
}

/**
 * Pemanggil cepat pelafalan kata Mandar dengan profil Penutur Asli Perempuan (Default)
 */
export function speakMandar(word: string, onEnd?: () => void) {
  speakText(word, { lang: 'mandar', gender: 'female', voiceProfile: 'indoq', onEnd });
}
