/**
 * Mandar Phonetics & Allophone Engine
 * Mengimplementasikan aturan fonologi dan alofon resmi dari buku:
 * 'Kamus Bahasa Mandar-Indonesia Edisi Revisi (2025)', Balai Bahasa Sulawesi Selatan
 */

export interface AllophoneShift {
  index: number;
  originalChar: string;
  realizedChar: string;
  ruleName: string;
  explanation: string;
}

export interface PhoneticAnalysis {
  inputWord: string;
  ipa: string;
  hasAllophones: boolean;
  shifts: AllophoneShift[];
  syllableCount: number;
  syllables: string[];
  stressPattern: string;
}

export function analyzePhonetics(word: string): PhoneticAnalysis {
  if (!word) {
    return {
      inputWord: '',
      ipa: '[]',
      hasAllophones: false,
      shifts: [],
      syllableCount: 0,
      syllables: [],
      stressPattern: 'None'
    };
  }

  const w = word.toLowerCase().trim();
  const vowels = 'aiueo';
  const shifts: AllophoneShift[] = [];
  let ipaChars: string[] = [];

  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    const prev = i > 0 ? w[i - 1] : '';
    const next = i < w.length - 1 ? w[i + 1] : '';
    const isIntervocalic = vowels.includes(prev) && vowels.includes(next);

    if (c === 'b' && isIntervocalic) {
      ipaChars.push('w');
      shifts.push({
        index: i,
        originalChar: 'b',
        realizedChar: '[w]',
        ruleName: 'Alofon /b/ Intervokalik',
        explanation: `Fonem /b/ di antara vokal '${prev}' dan '${next}' direalisasikan sebagai semi-vokal [w] (misal: 'tabe' diucapkan [tawe]).`
      });
    } else if (c === 'd' && isIntervocalic) {
      ipaChars.push('ð');
      shifts.push({
        index: i,
        originalChar: 'd',
        realizedChar: '[ð] / [dz]',
        ruleName: 'Alofon /d/ Intervokalik (huruf zal ذ)',
        explanation: `Fonem /d/ di antara vokal '${prev}' dan '${next}' direalisasikan sebagai frikatif dental [ð] / [dz] (misal: 'madondong' diucapkan [madzondzong]).`
      });
    } else if (c === 'g' && isIntervocalic) {
      ipaChars.push('ɣ');
      shifts.push({
        index: i,
        originalChar: 'g',
        realizedChar: '[ɣ] / [gh]',
        ruleName: 'Alofon /g/ Intervokalik (huruf ghain غ)',
        explanation: `Fonem /g/ di antara vokal '${prev}' dan '${next}' direalisasikan sebagai frikatif velar [ɣ] / [gh] (misal: 'pago' diucapkan [pagho]).`
      });
    } else if (c === 'j' && isIntervocalic) {
      ipaChars.push('j');
      shifts.push({
        index: i,
        originalChar: 'j',
        realizedChar: '[y]',
        ruleName: 'Alofon /j/ Intervokalik',
        explanation: `Fonem /j/ di antara vokal '${prev}' dan '${next}' direalisasikan sebagai semi-vokal palatal [y] (misal: 'kaja' diucapkan [kaya]).`
      });
    } else if (c === 'q') {
      ipaChars.push('ʔ');
      shifts.push({
        index: i,
        originalChar: 'q',
        realizedChar: '[ʔ]',
        ruleName: 'Hambat Glotal (Hamzah)',
        explanation: `Huruf 'q' melambangkan letup glotal hamzah [ʔ] (misal: 'anaq', 'saqbe').`
      });
    } else {
      ipaChars.push(c);
    }
  }

  // Sederhanakan suku kata untuk Mandar
  const syllables = splitMandarSyllables(w);
  const syllableCount = syllables.length;

  let stressPattern = 'Ekasuku (tekanan pada satu-satunya suku)';
  if (syllableCount === 2) {
    stressPattern = `Dwisuku: Tekanan utama jatuh pada suku kata penultima (ke-1: '${syllables[0]}')`;
  } else if (syllableCount === 3) {
    stressPattern = `Trisuku: Tekanan utama jatuh pada suku kata penultima (ke-2: '${syllables[1]}')`;
  } else if (syllableCount >= 4) {
    stressPattern = `Catursuku+: Tekanan sekunder pada suku kata awal ('${syllables[0]}'), tekanan primer pada penultima ('${syllables[syllables.length - 2]}')`;
  }

  return {
    inputWord: word,
    ipa: `[${ipaChars.join('')}]`,
    hasAllophones: shifts.length > 0,
    shifts,
    syllableCount,
    syllables,
    stressPattern
  };
}

export function splitMandarSyllables(word: string): string[] {
  if (!word) return [];
  const clean = word.toLowerCase().replace(/[^a-z0-9q]/g, '');
  if (!clean) return [];

  const vowels = 'aiueo';
  const syllables: string[] = [];
  let cur = '';

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    cur += ch;
    if (vowels.includes(ch)) {
      // Check if followed by glottal or double consonant
      const next1 = clean[i + 1] || '';
      const next2 = clean[i + 2] || '';

      if (next1 === 'q' && !vowels.includes(next2)) {
        cur += 'q';
        i++;
      } else if (next1 && next2 && next1 === next2) {
        // Geminate like tt, kk, pp: first stays with current syllable
        cur += next1;
        i++;
      } else if (next1 === 'n' && next2 === 'g' && !vowels.includes(clean[i + 3] || '')) {
        cur += 'ng';
        i += 2;
      }
      syllables.push(cur);
      cur = '';
    }
  }

  if (cur) {
    if (syllables.length > 0) {
      syllables[syllables.length - 1] += cur;
    } else {
      syllables.push(cur);
    }
  }

  return syllables;
}

export interface MorphoResult {
  combinedWord: string;
  ruleApplied: string;
  prefix: string;
  root: string;
  cluster: string;
  meaningNote: string;
}

export function simulateNasalCompounding(prefix: string, rootWord: string): MorphoResult {
  const cleanRoot = rootWord.toLowerCase().trim();
  const initial = cleanRoot[0] || '';
  const second = cleanRoot[1] || '';

  // Aturan Tabel III Balai Bahasa Sulsel
  const table: Record<string, { cluster: string; replacement: string; name: string }> = {
    'p': { cluster: 'pp', replacement: 'pp' + cleanRoot.slice(1), name: 'Asimilasi Total Nasal + Tak Bersuara (/p/ -> /pp/)' },
    't': { cluster: 'tt', replacement: 'tt' + cleanRoot.slice(1), name: 'Asimilasi Total Nasal + Tak Bersuara (/t/ -> /tt/)' },
    'c': { cluster: 'cc', replacement: 'cc' + cleanRoot.slice(1), name: 'Asimilasi Total Nasal + Tak Bersuara (/c/ -> /cc/)' },
    'k': { cluster: 'kk', replacement: 'kk' + cleanRoot.slice(1), name: 'Asimilasi Total Nasal + Tak Bersuara (/k/ -> /kk/)' },
    's': { cluster: 'ss', replacement: 'ss' + cleanRoot.slice(1), name: 'Asimilasi Total Nasal + Frikatif (/s/ -> /ss/)' },
    'b': { cluster: 'mb', replacement: 'mb' + cleanRoot.slice(1), name: 'Gugus Homorganik Bilabial Bersuara (/b/ -> /mb/)' },
    'd': { cluster: 'nd', replacement: 'nd' + cleanRoot.slice(1), name: 'Gugus Homorganik Alveolar Bersuara (/d/ -> /nd/)' },
    'j': { cluster: 'nj', replacement: 'nj' + cleanRoot.slice(1), name: 'Gugus Homorganik Palatal Bersuara (/j/ -> /nj/)' },
    'g': { cluster: 'ngg', replacement: 'ngg' + cleanRoot.slice(1), name: 'Gugus Homorganik Velar Bersuara (/g/ -> /ngg/)' },
    'l': { cluster: 'll', replacement: 'll' + cleanRoot.slice(1), name: 'Asimilasi Cairan Lateral (/l/ -> /ll/)' },
    'r': { cluster: 'rr', replacement: 'rr' + cleanRoot.slice(1), name: 'Asimilasi Cairan Getar (/r/ -> /rr/)' },
    'w': { cluster: 'ww', replacement: 'ww' + cleanRoot.slice(1), name: 'Asimilasi Semi-vokal (/w/ -> /ww/)' },
    'y': { cluster: 'yy', replacement: 'yy' + cleanRoot.slice(1), name: 'Asimilasi Semi-vokal (/y/ -> /yy/)' },
    'm': { cluster: 'mm', replacement: 'mm' + cleanRoot.slice(1), name: 'Asimilasi Nasal (/m/ -> /mm/)' },
    'n': { cluster: 'nn', replacement: 'nn' + cleanRoot.slice(1), name: 'Asimilasi Nasal (/n/ -> /nn/)' },
  };

  const rule = table[initial];
  const basePrefix = prefix.replace(/-$/, '').replace(/ng$/, '');

  if (rule) {
    return {
      combinedWord: basePrefix + rule.replacement,
      ruleApplied: rule.name,
      prefix: prefix,
      root: cleanRoot,
      cluster: rule.cluster,
      meaningNote: `Awalan '${prefix}' digabung dengan dasar '${cleanRoot}' menghasilkan gugus '${rule.cluster}'.`
    };
  }

  // Jika vokal
  if ('aiueo'.includes(initial)) {
    return {
      combinedWord: prefix.replace(/-$/, '') + cleanRoot,
      ruleApplied: 'Pelekatan Langsung Pada Vokal Awal',
      prefix: prefix,
      root: cleanRoot,
      cluster: 'ng' + initial,
      meaningNote: `Awalan nasal melekat langsung pada kata berawal vokal '${initial}'.`
    };
  }

  return {
    combinedWord: prefix.replace(/-$/, '') + cleanRoot,
    ruleApplied: 'Kombinasi Reguler',
    prefix: prefix,
    root: cleanRoot,
    cluster: initial,
    meaningNote: `Penggabungan kata dasar '${cleanRoot}' dengan prefiks '${prefix}'.`
  };
}
