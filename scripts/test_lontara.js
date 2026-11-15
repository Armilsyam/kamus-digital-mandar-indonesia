function mandarToLontara(word) {
    if (!word) return '';
    let text = word.toLowerCase().trim();
    // remove punctuation except letters and glottal q
    text = text.replace(/[^a-z0-9q\- ]/g, '');

    const LONTARA_CONSONANTS = {
        'ngk': 'ᨃ', 'mpa': 'ᨇ', 'nra': 'ᨋ', 'nca': 'ᨏ',
        'ng': 'ᨂ', 'ny': 'ᨎ',
        'k': 'ᨀ', 'g': 'ᨁ',
        'p': 'ᨄ', 'b': 'ᨅ', 'm': 'ᨆ',
        't': 'ᨈ', 'd': 'ᨉ', 'n': 'ᨊ',
        'c': 'ᨌ', 'j': 'ᨍ',
        'y': 'ᨐ', 'r': 'ᨑ', 'l': 'ᨒ', 'w': 'ᨓ',
        's': 'ᨔ', 'h': 'ᨖ'
    };

    const VOWEL_DIACRITICS = {
        'i': '\u1A17',
        'u': '\u1A18',
        'e': '\u1A19',
        'o': '\u1A1A',
        'é': '\u1A1B',
        'è': '\u1A19'
    };

    let result = '';
    let i = 0;
    while (i < text.length) {
        let ch = text[i];
        
        if (ch === ' ' || ch === '-') {
            result += ' ';
            i++;
            continue;
        }

        // Check 3-char clusters
        let cluster3 = text.slice(i, i + 3);
        let cluster2 = text.slice(i, i + 2);

        let baseChar = '';
        let step = 1;

        if (cluster3 === 'ngk' || cluster3 === 'mpa' || cluster3 === 'nra' || cluster3 === 'nca') {
            baseChar = LONTARA_CONSONANTS[cluster3];
            step = 3;
        } else if (cluster2 === 'ng' || cluster2 === 'ny') {
            baseChar = LONTARA_CONSONANTS[cluster2];
            step = 2;
        } else if (LONTARA_CONSONANTS[ch]) {
            baseChar = LONTARA_CONSONANTS[ch];
            step = 1;
        } else if ('aiueo'.includes(ch)) {
            // Standalone vowel: use 'a' base (ᨕ) with diacritic if not 'a'
            baseChar = 'ᨕ';
            if (ch !== 'a' && VOWEL_DIACRITICS[ch]) {
                baseChar += VOWEL_DIACRITICS[ch];
            }
            result += baseChar;
            i++;
            continue;
        } else if (ch === 'q') {
            // Glottal stop
            i++;
            continue;
        } else {
            i++;
            continue;
        }

        i += step;
        // Check next char for vowel
        if (i < text.length && 'aiueoéè'.includes(text[i])) {
            let v = text[i];
            if (v !== 'a' && VOWEL_DIACRITICS[v]) {
                baseChar += VOWEL_DIACRITICS[v];
            }
            i++;
        }
        result += baseChar;
    }
    return result;
}

const testWords = ['mandar', 'sandeq', 'boyang', 'lipa', 'saqbe', 'kalindaqdaq', 'jepa', 'tomakaka', 'maraqdia', 'passombal'];
testWords.forEach(w => {
    console.log(`${w} -> ${mandarToLontara(w)}`);
});
