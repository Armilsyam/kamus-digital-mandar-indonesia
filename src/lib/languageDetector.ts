/**
 * Mandar, Indonesian & Code-Switching Language Detector & Literal Analyzer
 * Mengidentifikasi komposisi bahasa (Mandar, Indonesia, Campuran, English),
 * melakukan pemenggalan suku kata (syllabification), dan analisis harfiah per kata.
 * Berdasarkan Leksikografi & Tata Bahasa Mandar (Balai Bahasa Sulsel 2025).
 */

export interface WordGloss {
  word: string;
  cleanWord: string;
  lang: 'mandar' | 'indonesia' | 'neutral' | 'english';
  syllables: string[];
  phonetic: string;
  literalMeaningId: string;
  literalMeaningMdr?: string;
  posTag?: string;
  isMandarSpecific: boolean;
}

export interface SentenceSegment {
  text: string;
  lang: 'mandar' | 'indonesia' | 'english';
  phoneticText: string;
  isMandar: boolean;
}

export interface LanguageAnalysisResult {
  primaryLang: 'mandar' | 'indonesia' | 'mixed' | 'english';
  mandarRatio: number;
  indonesiaRatio: number;
  englishRatio: number;
  detectedSummary: string;
  segments: SentenceSegment[];
  wordGlosses: WordGloss[];
  literalSentenceTranslation: string;
}

// Kamus leksikal penanda kata Mandar berfrekuensi tinggi
const MANDAR_CORE_LEXICON: Record<string, { id: string; pos: string; phonetic: string }> = {
  // Kata sapaan & partikel sopan
  'tabe': { id: 'permisi / maaf', pos: 'Partikel', phonetic: '[tawe]' },
  'itaq': { id: 'Anda / kamu (hormat)', pos: 'Pronomina', phonetic: '[itaʔ]' },
  'andiq': { id: 'adik', pos: 'Nomina', phonetic: '[andiʔ]' },
  'kandiq': { id: 'kekasih / dinda', pos: 'Nomina', phonetic: '[kandiʔ]' },
  'indoq': { id: 'ibu / bunda', pos: 'Nomina', phonetic: '[indoʔ]' },
  'amboq': { id: 'ayah / bapak', pos: 'Nomina', phonetic: '[amboʔ]' },
  'kaka': { id: 'kakak', pos: 'Nomina', phonetic: '[kaka]' },
  'tomatoang': { id: 'orang tua / tetua', pos: 'Nomina', phonetic: '[tomatoang]' },
  'daeng': { id: 'kakak / gelar kehormatan', pos: 'Nomina', phonetic: '[daeng]' },

  // Pertanyaan & partikel
  'apa': { id: 'apa', pos: 'Pronomina', phonetic: '[apa]' },
  'kareba': { id: 'kabar', pos: 'Nomina', phonetic: '[karewa]' },
  'inna': { id: 'mana / di mana', pos: 'Adverbia', phonetic: '[in-na]' },
  'pirang': { id: 'kapan / berapa lama', pos: 'Adverbia', phonetic: '[pirang]' },
  'dio': { id: 'di / ke arah sana', pos: 'Preposisi', phonetic: '[dio]' },
  'sau': { id: 'di / ke arah laut (selatan)', pos: 'Preposisi', phonetic: '[sau]' },
  'dae': { id: 'di / ke arah darat (utara)', pos: 'Preposisi', phonetic: '[dae]' },
  'di': { id: 'di / pada', pos: 'Preposisi', phonetic: '[di]' },
  'daqa': { id: 'jangan', pos: 'Adverbia', phonetic: "[da'a]" },
  'iqdai': { id: 'tidak / bukan', pos: 'Adverbia', phonetic: '[iʔdai]' },
  'tania': { id: 'bukan', pos: 'Adverbia', phonetic: '[tania]' },
  'iyeq': { id: 'ya (sopan)', pos: 'Partikel', phonetic: '[iyeʔ]' },
  'iyo': { id: 'ya (biasa)', pos: 'Partikel', phonetic: '[iyo]' },

  // Kata ganti orang
  'iyaq': { id: 'saya / aku', pos: 'Pronomina', phonetic: '[iyaʔ]' },
  'iqa': { id: 'aku (enklitik)', pos: 'Pronomina', phonetic: '[iʔa]' },
  'o': { id: 'kamu (enklitik)', pos: 'Pronomina', phonetic: '[o]' },
  'i': { id: 'dia (enklitik)', pos: 'Pronomina', phonetic: '[i]' },
  'kami': { id: 'kami', pos: 'Pronomina', phonetic: '[kami]' },
  'ita': { id: 'kita / Anda', pos: 'Pronomina', phonetic: '[ita]' },

  // Kata sifat & keadaan
  'malambiq': { id: 'tenang / damai / sejuk', pos: 'Adjektiva', phonetic: '[malambiʔ]' },
  'marasa': { id: 'indah / elok / cantik', pos: 'Adjektiva', phonetic: '[marasa]' },
  'manyamang': { id: 'enak / lezat / nyaman', pos: 'Adjektiva', phonetic: '[manyamang]' },
  'masannang': { id: 'senang / gembira', pos: 'Adjektiva', phonetic: '[masan-nang]' },
  'macoa': { id: 'bagus / baik', pos: 'Adjektiva', phonetic: '[macoa]' },
  'makessing': { id: 'cantik / molek', pos: 'Adjektiva', phonetic: '[makes-sing]' },
  'mabaya': { id: 'berat / sulit', pos: 'Adjektiva', phonetic: '[mawasa]' },
  'malotong': { id: 'hitam', pos: 'Adjektiva', phonetic: '[malotong]' },
  'mapute': { id: 'putih', pos: 'Adjektiva', phonetic: '[mapute]' },
  'memeaq': { id: 'merah', pos: 'Adjektiva', phonetic: '[memeaʔ]' },
  'matua': { id: 'tua', pos: 'Adjektiva', phonetic: '[matua]' },
  'malolo': { id: 'muda / lentur', pos: 'Adjektiva', phonetic: '[malolo]' },
  'masseq': { id: 'kuat / kokoh', pos: 'Adjektiva', phonetic: '[mas-seʔ]' },

  // Kata kerja
  'mande': { id: 'makan', pos: 'Verba', phonetic: '[mande]' },
  'miqngu': { id: 'minum', pos: 'Verba', phonetic: '[miʔngu]' },
  'tinindo': { id: 'tidur', pos: 'Verba', phonetic: '[tinindo]' },
  'matte': { id: 'lari', pos: 'Verba', phonetic: '[mat-te]' },
  'lumalan': { id: 'berjalan', pos: 'Verba', phonetic: '[lumalan]' },
  'mesombay': { id: 'berlayar', pos: 'Verba', phonetic: '[mesombay]' },
  'sombal': { id: 'layar / berlayar', pos: 'Nomina/Verba', phonetic: '[sombal]' },
  'massola': { id: 'berjalan bersama', pos: 'Verba', phonetic: '[mas-sola]' },
  'mangguru': { id: 'belajar / berguru', pos: 'Verba', phonetic: '[mang-guru]' },
  'mambaca': { id: 'membaca', pos: 'Verba', phonetic: '[mambaca]' },
  'manulis': { id: 'menulis', pos: 'Verba', phonetic: '[manulis]' },
  'pau': { id: 'bicara / kata', pos: 'Verba/Nomina', phonetic: '[pau]' },
  'paqmai': { id: 'hati / perasaan / batin', pos: 'Nomina', phonetic: '[paʔmai]' },
  'sibaliparriq': { id: 'saling tolong / gotong royong', pos: 'Verba/Nomina', phonetic: '[siwali-par-rik]' },

  // Alam, ruang & benda
  'sasiq': { id: 'laut', pos: 'Nomina', phonetic: '[sasiʔ]' },
  'litaq': { id: 'tanah / bumi / negeri', pos: 'Nomina', phonetic: '[litaʔ]' },
  'buttu': { id: 'gunung / bukit', pos: 'Nomina', phonetic: '[but-tu]' },
  'salu': { id: 'sungai', pos: 'Nomina', phonetic: '[salu]' },
  'urang': { id: 'hujan', pos: 'Nomina', phonetic: '[urang]' },
  'alo': { id: 'matahari / siang', pos: 'Nomina', phonetic: '[alo]' },
  'bongi': { id: 'malam', pos: 'Nomina', phonetic: '[bongi]' },
  'subu': { id: 'subuh / fajar', pos: 'Nomina', phonetic: '[suwu]' },
  'madondong': { id: 'pagi hari', pos: 'Nomina', phonetic: '[madzondong]' },
  'boyang': { id: 'rumah', pos: 'Nomina', phonetic: '[boyang]' },
  'lopi': { id: 'perahu', pos: 'Nomina', phonetic: '[lopi]' },
  'sandeq': { id: 'perahu cadik layar khas Mandar', pos: 'Nomina', phonetic: '[sandeʔ]' },
  'jepa': { id: 'lempeng singkong bakar khas Mandar', pos: 'Nomina', phonetic: '[jepa]' },
  'bau': { id: 'ikan', pos: 'Nomina', phonetic: '[bau]' },
  'peapi': { id: 'masak kuah kuning Mandar', pos: 'Nomina', phonetic: '[peapi]' },
  'kalindaqdaq': { id: 'pantun sastra 4 baris Mandar (8-7-8-7)', pos: 'Nomina', phonetic: '[kalindaʔdaʔ]' },
  'pappasang': { id: 'wasiat / petuah luhur leluhur', pos: 'Nomina', phonetic: '[pap-pasang]' },
  'siriq': { id: 'harga diri / kehormatan / martabat', pos: 'Nomina', phonetic: '[siriʔ]' },
  'lokka': { id: 'pergi', pos: 'Verba', phonetic: '[lok-ka]' },
  'sule': { id: 'kembali / pulang', pos: 'Verba', phonetic: '[sule]' },
  'pura': { id: 'sudah / selesai', pos: 'Adverbia', phonetic: '[pura]' },
  'purai': { id: 'sudah selesai (enklitik)', pos: 'Adverbia', phonetic: '[purai]' },
  'accur': { id: 'hancur / luluh', pos: 'Adjektiva', phonetic: '[ac-cur]' },
  'nilanda': { id: 'dilanda / diterpa', pos: 'Verba', phonetic: '[nilanda]' }
};

// Pola afiksasi khas Mandar
const MANDAR_AFFIX_PATTERNS = [
  /^(ma|me|mang|maq|pa|pe|pang|sa|si|ta|tu)[a-z]/i,
  /[a-z](mi|mo|di|bandi|i|o|aq|ko|ki)$/i,
  /[a-z]q$/i, // Berakhiran q glotal stop
  /([bcdfghjklmnprstwyz])\1/i // Geminasi konsonan kembar
];

// Daftar kata umum Bahasa Indonesia untuk diskriminasi
const INDONESIA_STOPWORDS = new Set([
  'dan', 'atau', 'ke', 'dari', 'yang', 'ini', 'itu', 'adalah', 'saya', 'kami', 'kita',
  'mereka', 'kamu', 'anda', 'dia', 'belajar', 'hari', 'karena', 'sangat', 'senang',
  'sudah', 'makan', 'minum', 'tidur', 'pergi', 'pulang', 'rumah', 'dengan', 'untuk',
  'pada', 'bisa', 'akan', 'harus', 'tidak', 'bukan', 'ingin', 'mau', 'saja', 'lagi',
  'telah', 'sedang', 'tentang', 'seperti', 'ada', 'banyak', 'sedikit', 'semua', 'orang'
]);

/**
 * Pemenggalan suku kata Mandar (Syllabification):
 * Pola suku kata Mandar: V, VK, KV, KVK.
 */
export function hyphenateMandarSyllables(word: string): string[] {
  if (!word) return [];
  const clean = word.toLowerCase().trim();
  if (clean.length <= 2) return [clean];

  const vowels = new Set(['a', 'i', 'u', 'e', 'o']);
  const syllables: string[] = [];
  let current = '';

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];
    const prevChar = clean[i - 1];

    current += char;

    if (vowels.has(char)) {
      // Jika setelah vokal adalah konsonan kembar geminat (misal: 'pp', 'tt')
      if (nextChar && clean[i + 2] && nextChar === clean[i + 2] && !vowels.has(nextChar)) {
        current += nextChar; // bawa konsonan pertama geminat ke suku kata ini
        syllables.push(current);
        current = '';
        i++; // lewati konsonan pertama geminat
        continue;
      }

      // Jika setelah vokal adalah 'q' atau 'ng' koda
      if (nextChar === 'q' && (!clean[i + 2] || !vowels.has(clean[i + 2]))) {
        current += 'q';
        syllables.push(current);
        current = '';
        i++;
        continue;
      }
      if (nextChar === 'n' && clean[i + 2] === 'g' && (!clean[i + 3] || !vowels.has(clean[i + 3]))) {
        current += 'ng';
        syllables.push(current);
        current = '';
        i += 2;
        continue;
      }

      // Jika vokal diikuti oleh satu konsonan lalu vokal (pola KV)
      if (nextChar && !vowels.has(nextChar) && clean[i + 2] && vowels.has(clean[i + 2])) {
        syllables.push(current);
        current = '';
        continue;
      }

      // Jika vokal diikuti vokal lain (hiatus)
      if (nextChar && vowels.has(nextChar)) {
        syllables.push(current);
        current = '';
        continue;
      }
    }
  }

  if (current) {
    if (syllables.length > 0 && !/[aiueo]/i.test(current)) {
      syllables[syllables.length - 1] += current;
    } else {
      syllables.push(current);
    }
  }

  return syllables.length > 0 ? syllables : [clean];
}

/**
 * Menganalisis satu kata secara harfiah
 */
export function analyzeSingleWord(rawWord: string): WordGloss {
  const clean = rawWord.toLowerCase().replace(/[^a-zA-Z'q’]/g, '');
  const syllables = hyphenateMandarSyllables(clean);

  // Cek kamus inti Mandar
  if (MANDAR_CORE_LEXICON[clean]) {
    const lex = MANDAR_CORE_LEXICON[clean];
    return {
      word: rawWord,
      cleanWord: clean,
      lang: 'mandar',
      syllables,
      phonetic: lex.phonetic,
      literalMeaningId: lex.id,
      posTag: lex.pos,
      isMandarSpecific: true
    };
  }

  // Cek apakah kata Indonesia umum
  if (INDONESIA_STOPWORDS.has(clean)) {
    return {
      word: rawWord,
      cleanWord: clean,
      lang: 'indonesia',
      syllables,
      phonetic: `[${clean}]`,
      literalMeaningId: `Bahasa Indonesia: "${clean}"`,
      posTag: 'Kosakata Umum',
      isMandarSpecific: false
    };
  }

  // Deteksi morfologis ciri Mandar
  const hasGlottal = clean.includes('q') || clean.includes("’");
  const hasGeminate = /([bcdfghjklmnprstwyz])\1/i.test(clean);
  const matchesMandarAffix = MANDAR_AFFIX_PATTERNS.some(p => p.test(clean));

  if (hasGlottal || hasGeminate || matchesMandarAffix) {
    return {
      word: rawWord,
      cleanWord: clean,
      lang: 'mandar',
      syllables,
      phonetic: `[${syllables.join('-')}]`,
      literalMeaningId: `Leksikon Mandar (pola alofonik/morfologis)`,
      posTag: 'Leksikon Mandar',
      isMandarSpecific: true
    };
  }

  return {
    word: rawWord,
    cleanWord: clean,
    lang: 'neutral',
    syllables,
    phonetic: `[${clean}]`,
    literalMeaningId: `Netral / Serapan`,
    posTag: 'Leksikon Terbuka',
    isMandarSpecific: false
  };
}

/**
 * Memisahkan kalimat campuran (Code-Switching) menjadi segmen terpisah
 * agar bagian Mandar dibaca dengan aturan alofon/glotal Mandar,
 * dan bagian Indonesia dibaca dengan aturan alami Indonesia.
 */
export function segmentMixedSentence(sentence: string): SentenceSegment[] {
  if (!sentence) return [];

  const rawTokens = sentence.split(/(\s+|[,.!?;:—–"«»()]+)/);
  const segments: SentenceSegment[] = [];

  let currentLang: 'mandar' | 'indonesia' | null = null;
  let currentBuffer: string[] = [];

  const flushBuffer = () => {
    if (currentBuffer.length === 0 || !currentLang) return;
    const textChunk = currentBuffer.join('');
    if (textChunk.trim().length === 0) return;

    segments.push({
      text: textChunk,
      lang: currentLang,
      phoneticText: currentLang === 'mandar' 
        ? textChunk.replace(/q/g, 'k').replace(/([aiueo])b([aiueo])/gi, '$1w$2')
        : textChunk,
      isMandar: currentLang === 'mandar'
    });
    currentBuffer = [];
  };

  for (const token of rawTokens) {
    if (!token) continue;
    if (/^\s+$/.test(token) || /^[,.!?;:—–"«»()]+$/.test(token)) {
      if (currentBuffer.length > 0) {
        currentBuffer.push(token);
      }
      continue;
    }

    const analyzed = analyzeSingleWord(token);
    const tokenLang = analyzed.lang === 'mandar' ? 'mandar' : 'indonesia';

    if (currentLang === null) {
      currentLang = tokenLang;
      currentBuffer.push(token);
    } else if (currentLang === tokenLang) {
      currentBuffer.push(token);
    } else {
      flushBuffer();
      currentLang = tokenLang;
      currentBuffer.push(token);
    }
  }

  flushBuffer();

  return segments.length > 0 
    ? segments 
    : [{ text: sentence, lang: 'mandar', phoneticText: sentence, isMandar: true }];
}

/**
 * Deteksi Bahasa Lengkap & Analisis Harfiah Kalimat
 */
export function detectLanguageAndAnalyze(text: string): LanguageAnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      primaryLang: 'indonesia',
      mandarRatio: 0,
      indonesiaRatio: 1,
      englishRatio: 0,
      detectedSummary: 'Belum ada input teks',
      segments: [],
      wordGlosses: [],
      literalSentenceTranslation: ''
    };
  }

  const rawWords = text.trim().split(/\s+/);
  const wordGlosses = rawWords.map(w => analyzeSingleWord(w));

  let mandarCount = 0;
  let indoCount = 0;
  let englishCount = 0;

  for (const gloss of wordGlosses) {
    if (gloss.lang === 'mandar') mandarCount++;
    else if (gloss.lang === 'indonesia') indoCount++;
    else if (gloss.lang === 'english') englishCount++;
  }

  const total = wordGlosses.length;
  const mandarRatio = total > 0 ? Math.round((mandarCount / total) * 100) : 0;
  const indonesiaRatio = total > 0 ? Math.round((indoCount / total) * 100) : 0;
  const englishRatio = total > 0 ? Math.round((englishCount / total) * 100) : 0;

  let primaryLang: 'mandar' | 'indonesia' | 'mixed' | 'english' = 'indonesia';
  let detectedSummary = '';

  if (mandarRatio > 65) {
    primaryLang = 'mandar';
    detectedSummary = `Bahasa Mandar Otentik (${mandarRatio}%)`;
  } else if (mandarRatio >= 25 && indonesiaRatio >= 25) {
    primaryLang = 'mixed';
    detectedSummary = `Kalimat Campuran Mandar-Indonesia (Mandar: ${mandarRatio}%, Indonesia: ${indonesiaRatio}%)`;
  } else if (englishRatio > 50) {
    primaryLang = 'english';
    detectedSummary = `English (${englishRatio}%)`;
  } else {
    primaryLang = 'indonesia';
    detectedSummary = `Bahasa Indonesia (${indonesiaRatio}%)`;
  }

  const segments = segmentMixedSentence(text);

  // Sintesis terjemahan harfiah per kata
  const literalParts = wordGlosses.map(wg => {
    if (wg.isMandarSpecific && wg.literalMeaningId) {
      return `${wg.cleanWord} [${wg.literalMeaningId}]`;
    }
    return wg.cleanWord;
  });

  return {
    primaryLang,
    mandarRatio,
    indonesiaRatio,
    englishRatio,
    detectedSummary,
    segments,
    wordGlosses,
    literalSentenceTranslation: literalParts.join(' ')
  };
}
