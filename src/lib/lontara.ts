/**
 * Aksara Lontara Mandar Utility Library
 * Standar Unicode U+1A00 - U+1A1F (Bugis / Lontara Block)
 * Diadaptasi khusus untuk ortografi dan fonotaktik Bahasa Mandar (Sulawesi Barat)
 */

export interface LontaraCharacter {
  char: string;
  lontara: string;
  name: string;
  type: 'consonant' | 'vowel' | 'cluster';
}

export const LONTARA_CONSONANTS: Record<string, { lontara: string; name: string }> = {
  'k': { lontara: 'ᨀ', name: 'Ka' },
  'g': { lontara: 'ᨁ', name: 'Ga' },
  'ng': { lontara: 'ᨂ', name: 'Nga' },
  'ngk': { lontara: 'ᨃ', name: 'Ngka' },
  'p': { lontara: 'ᨄ', name: 'Pa' },
  'b': { lontara: 'ᨅ', name: 'Ba' },
  'm': { lontara: 'ᨆ', name: 'Ma' },
  'mp': { lontara: 'ᨇ', name: 'Mpa' },
  't': { lontara: 'ᨈ', name: 'Ta' },
  'd': { lontara: 'ᨉ', name: 'Da' },
  'n': { lontara: 'ᨊ', name: 'Na' },
  'nr': { lontara: 'ᨋ', name: 'Nra' },
  'c': { lontara: 'ᨌ', name: 'Ca' },
  'j': { lontara: 'ᨍ', name: 'Ja' },
  'ny': { lontara: 'ᨎ', name: 'Nya' },
  'nc': { lontara: 'ᨏ', name: 'Nca' },
  'y': { lontara: 'ᨐ', name: 'Ya' },
  'r': { lontara: 'ᨑ', name: 'Ra' },
  'l': { lontara: 'ᨒ', name: 'La' },
  'w': { lontara: 'ᨓ', name: 'Wa' },
  's': { lontara: 'ᨔ', name: 'Sa' },
  'h': { lontara: 'ᨖ', name: 'Ha' },
};

export const VOWEL_DIACRITICS: Record<string, { code: string; name: string; position: string }> = {
  'i': { code: '\u1A17', name: 'Tettiq riaseq (Titik atas)', position: 'atas' },
  'u': { code: '\u1A18', name: 'Tettiq riawa (Titik bawah)', position: 'bawah' },
  'e': { code: '\u1A19', name: 'Kecce / Taling (Depan)', position: 'depan' },
  'o': { code: '\u1A1A', name: 'Titik belakang', position: 'belakang' },
  'é': { code: '\u1A1B', name: 'Pepet / Tanda Vokal Netral', position: 'atas' },
  'è': { code: '\u1A19', name: 'Taling', position: 'depan' },
};

export interface LontaraToken {
  syllable: string;
  lontara: string;
  baseChar: string;
  vowelMark: string;
  description: string;
}

export function transliterateLatinToLontara(text: string): { lontara: string; tokens: LontaraToken[] } {
  if (!text) return { lontara: '', tokens: [] };

  const clean = text.toLowerCase().trim();
  const words = clean.split(/(\s+|[-.,!?;:])/);
  let resultLontara = '';
  const tokens: LontaraToken[] = [];

  for (const word of words) {
    if (!word) continue;
    if (/^\s+$/.test(word) || /^[-.,!?;:]$/.test(word)) {
      resultLontara += word;
      continue;
    }

    let i = 0;
    while (i < word.length) {
      const ch = word[i];

      // Check 3-char clusters (ngk, mpa, nra, nca)
      const cluster3 = word.slice(i, i + 3);
      const cluster2 = word.slice(i, i + 2);

      let baseLontara = '';
      let baseName = '';
      let syllableText = '';
      let step = 1;

      if (cluster3 in LONTARA_CONSONANTS) {
        baseLontara = LONTARA_CONSONANTS[cluster3].lontara;
        baseName = LONTARA_CONSONANTS[cluster3].name;
        syllableText = cluster3;
        step = 3;
      } else if (cluster2 in LONTARA_CONSONANTS) {
        baseLontara = LONTARA_CONSONANTS[cluster2].lontara;
        baseName = LONTARA_CONSONANTS[cluster2].name;
        syllableText = cluster2;
        step = 2;
      } else if (ch in LONTARA_CONSONANTS) {
        baseLontara = LONTARA_CONSONANTS[ch].lontara;
        baseName = LONTARA_CONSONANTS[ch].name;
        syllableText = ch;
        step = 1;
      } else if ('aiueoéè'.includes(ch)) {
        // Vokal mandiri (diawali vokal 'a' ᨕ)
        baseLontara = 'ᨕ';
        baseName = 'A (vokal mandiri)';
        syllableText = ch;
        let vMark = '';
        let vName = 'vokal default /a/';
        if (ch !== 'a' && VOWEL_DIACRITICS[ch]) {
          vMark = VOWEL_DIACRITICS[ch].code;
          vName = VOWEL_DIACRITICS[ch].name;
        }
        tokens.push({
          syllable: syllableText,
          lontara: baseLontara + vMark,
          baseChar: baseLontara,
          vowelMark: vMark,
          description: `${baseName} + ${vName}`
        });
        resultLontara += baseLontara + vMark;
        i++;
        continue;
      } else if (ch === 'q') {
        // Hamzah glotal (diabaikan atau ditandai)
        i++;
        continue;
      } else {
        resultLontara += ch;
        i++;
        continue;
      }

      i += step;

      // Periksa vokal pengikut
      let vowelMark = '';
      let vowelName = 'vokal bawaan /a/';
      if (i < word.length && 'aiueoéè'.includes(word[i])) {
        const v = word[i];
        syllableText += v;
        if (v !== 'a' && VOWEL_DIACRITICS[v]) {
          vowelMark = VOWEL_DIACRITICS[v].code;
          vowelName = VOWEL_DIACRITICS[v].name;
        }
        i++;
      }

      // Check trailing glottal stop /q/
      if (i < word.length && word[i] === 'q') {
        syllableText += 'q';
        i++;
      }

      const combined = baseLontara + vowelMark;
      tokens.push({
        syllable: syllableText,
        lontara: combined,
        baseChar: baseLontara,
        vowelMark,
        description: `${baseName} (${syllableText}) [${vowelName}]`
      });

      resultLontara += combined;
    }
  }

  return { lontara: resultLontara, tokens };
}

export function transliterateLontaraToLatin(lontaraText: string): string {
  if (!lontaraText) return '';

  const REVERSE_CONSONANTS: Record<string, string> = {};
  for (const [latin, obj] of Object.entries(LONTARA_CONSONANTS)) {
    REVERSE_CONSONANTS[obj.lontara] = latin;
  }
  REVERSE_CONSONANTS['ᨕ'] = ''; // standalone vowel carrier

  const REVERSE_VOWELS: Record<string, string> = {
    '\u1A17': 'i',
    '\u1A18': 'u',
    '\u1A19': 'e',
    '\u1A1A': 'o',
    '\u1A1B': 'e',
  };

  let latinResult = '';
  let i = 0;

  while (i < lontaraText.length) {
    const ch = lontaraText[i];
    if (ch in REVERSE_CONSONANTS) {
      let syllable = REVERSE_CONSONANTS[ch];
      i++;
      if (i < lontaraText.length && lontaraText[i] in REVERSE_VOWELS) {
        syllable += REVERSE_VOWELS[lontaraText[i]];
        i++;
      } else {
        syllable += 'a';
      }
      latinResult += syllable;
    } else {
      latinResult += ch;
      i++;
    }
  }

  return latinResult;
}
