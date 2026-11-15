/**
 * Mandar Speech Synthesis & Web Audio Engine
 * Mengonversi ortografi Mandar ke representasi fonetik audio
 * yang akurat untuk SpeechSynthesis dan Web Audio Synthesizer
 */

export function speakMandar(word: string, onEnd?: () => void) {
  if (typeof window === 'undefined') return;

  // Hentikan suara yang sedang berjalan
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Pre-processing kata Mandar agar diucapkan dengan aksen Mandar yang tepat:
  // 1. Ganti 'q' menjadi tanda henti glotal (apostrof yang memicu penutupan glotis)
  // 2. Terapkan alofon intervokalik: b -> w, d -> dz, g -> gh
  let spoken = word.toLowerCase();

  // Glottal stop
  spoken = spoken.replace(/q/g, "’");

  // Alofon b -> w di antara vokal
  spoken = spoken.replace(/([aiueo])b([aiueo])/g, '$1w$2');
  // Alofon d -> dz di antara vokal
  spoken = spoken.replace(/([aiueo])d([aiueo])/g, '$1dz$2');
  // Alofon g -> gh di antara vokal
  spoken = spoken.replace(/([aiueo])g([aiueo])/g, '$1gh$2');

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = 'id-ID'; // Bahasa Indonesia sebagai fonetik dasar terdekat
    utterance.rate = 0.88; // Sedikit lebih lambat agar artikulasi jelas
    utterance.pitch = 1.05;

    // Cari suara bahasa Indonesia jika ada
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('Indonesian'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } else {
    // Fallback Web Audio beep sequence jika Web Speech tidak didukung
    playWebAudioFallback(word, onEnd);
  }
}

export function playWebAudioFallback(word: string, onEnd?: () => void) {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) {
      if (onEnd) onEnd();
      return;
    }

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency based on word length / vowels
    const baseFreq = 260 + (word.length % 5) * 40;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);

    osc.onended = () => {
      ctx.close();
      if (onEnd) onEnd();
    };
  } catch {
    if (onEnd) onEnd();
  }
}
