/**
 * Mandar, Indonesian & English Speech Synthesis Engine (Multi-Lingual TTS)
 * Mendukung pembacaan kata tunggal, frasa kompleks, hingga kalimat panjang
 * dengan aturan alofonik dan ortografi otentik Bahasa Mandar (Kemendikdasmen 2025).
 */

export interface SpeechOptions {
  lang?: 'mandar' | 'indonesia' | 'english';
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

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
 * Preprocessing khusus teks Mandar untuk audio sintesis:
 * 1. Menjaga tanda baca untuk ritme jeda alami
 * 2. Mengubah fonem intervokalik ke alofon:
 *    - V + b + V -> w (tabe -> tawe)
 *    - V + d + V -> dz (madondong -> madzondzong)
 *    - V + g + V -> gh (pago -> pagho)
 *    - V + j + V -> y (kaja -> kaya)
 * 3. Mengubah 'q' glotal menjadi jeda glotis mikro (’)
 * 4. Merawat konsonan geminat (pp, tt, kk, ss, rr, ll)
 */
export function preprocessMandarForTTS(text: string): string {
  if (!text) return '';
  
  const words = text.split(/(\s+|[,.!?;:—–])/);
  
  const processed = words.map(w => {
    if (!w || /^\s+$/.test(w) || /^[,.!?;:—–]$/.test(w)) {
      return w;
    }
    
    let wordLower = w.toLowerCase();
    
    // 1. Glottal stop: q diubah menjadi glottal stop apostrof
    wordLower = wordLower.replace(/q/g, "’");
    
    // 2. Intervocalic allophones
    wordLower = wordLower.replace(/([aiueo])b([aiueo])/g, '$1w$2');
    wordLower = wordLower.replace(/([aiueo])d([aiueo])/g, '$1dz$2');
    wordLower = wordLower.replace(/([aiueo])g([aiueo])/g, '$1gh$2');
    wordLower = wordLower.replace(/([aiueo])j([aiueo])/g, '$1y$2');
    
    // 3. Simbol pengganti '--' atau '~' jika ada
    wordLower = wordLower.replace(/--|~/g, '');
    
    return wordLower;
  });
  
  return processed.join('');
}

/**
 * Fungsi utama untuk melafalkan teks pendek maupun kalimat panjang
 */
export function speakText(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined') return;

  const {
    lang = 'mandar',
    rate = lang === 'mandar' ? 0.88 : 1.0,
    pitch = 1.02,
    volume = 1.0,
    onStart,
    onEnd,
    onError
  } = options;

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
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  const voices = window.speechSynthesis.getVoices();
  let matchedVoice = null;

  if (targetLocale.startsWith('id')) {
    matchedVoice = voices.find(v => v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia'));
  } else if (targetLocale.startsWith('en')) {
    matchedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  }

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

export function speakMandar(word: string, onEnd?: () => void) {
  speakText(word, { lang: 'mandar', onEnd });
}
