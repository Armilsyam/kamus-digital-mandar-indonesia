const fs = require('fs');
const path = require('path');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

const ABBREVIATIONS = {
    'dng': 'dengan',
    'dp': 'daripada',
    'dr': 'dari',
    'kpd': 'kepada',
    'krn': 'karena',
    'msl': 'misalnya',
    'pd': 'pada',
    'sbg': 'sebagai',
    'spt': 'seperti',
    'thd': 'terhadap',
    'tt': 'tentang',
    'yg': 'yang',
    'dsb': 'dan sebagainya',
    'dll': 'dan lain-lain',
    'tsb': 'tersebut',
    'dst': 'dan seterusnya'
};

function expandAbbreviations(str) {
    if (!str) return '';
    return str.replace(/\b(dng|dp|dr|kpd|krn|msl|pd|sbg|spt|thd|tt|yg|dsb|dll|tsb|dst)\b/gi, (match) => {
        return ABBREVIATIONS[match.toLowerCase()] || match;
    });
}

function mandarToLontara(word) {
    if (!word) return '';
    let text = word.toLowerCase().trim();
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
            baseChar = 'ᨕ';
            if (ch !== 'a' && VOWEL_DIACRITICS[ch]) {
                baseChar += VOWEL_DIACRITICS[ch];
            }
            result += baseChar;
            i++;
            continue;
        } else if (ch === 'q') {
            i++;
            continue;
        } else {
            i++;
            continue;
        }

        i += step;
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

function generatePhoneticIPA(word) {
    if (!word) return '';
    let w = word.toLowerCase().trim();
    // Intervocalic allophones
    // V = a, i, u, e, o
    let res = '';
    for (let i = 0; i < w.length; i++) {
        let c = w[i];
        let prev = i > 0 ? w[i-1] : '';
        let next = i < w.length - 1 ? w[i+1] : '';
        let isIntervocalic = 'aiueo'.includes(prev) && 'aiueo'.includes(next);

        if (c === 'b' && isIntervocalic) {
            res += 'w';
        } else if (c === 'd' && isIntervocalic) {
            res += 'ð';
        } else if (c === 'g' && isIntervocalic) {
            res += 'ɣ';
        } else if (c === 'j' && isIntervocalic) {
            res += 'j';
        } else if (c === 'q') {
            res += 'ʔ';
        } else {
            res += c;
        }
    }
    return `[${res}]`;
}

function detectCategory(lemma, def, example) {
    const text = (lemma + ' ' + def + ' ' + example).toLowerCase();
    
    if (/(perahu|kapal|layar|sombal|laut|sasiq|ombak|ikan|bau|nelayan|jaring|kail|dayung|kemudi|buritan|haluan|cadik|pantai|karang|passombal|sandeq)/.test(text)) {
        return 'Maritim & Kelautan';
    }
    if (/(sarung|tenun|kain|benang|sutra|lipa|saqbe|baju|pakaian|jahit|motif|sulaman|selendang)/.test(text)) {
        return 'Tenun & Busana';
    }
    if (/(makanan|kue|nasi|ikan|sagu|jepa|pisang|kelapa|minyak|sayur|daging|masak|goreng|rebus|panggang|gula|garam|pedas|sambal|ande|kande|baqle|dapur)/.test(text)) {
        return 'Kuliner Tradisional';
    }
    if (/(adat|raja|maraqdia|tomakaka|hukum|upacara|pesta|kawin|nikah|mahar|siriq|bangsawan|sesaji|ritual|patuddu|pattudu|gelar|panggilan)/.test(text)) {
        return 'Adat & Budaya';
    }
    if (/(nyanyi|lagu|puisi|pantun|kecapi|gendang|tarian|kalindaqdaq|sastra|cerita|seni|bicara|kata|bahasa|pau|kelong)/.test(text)) {
        return 'Sastra & Kesenian';
    }
    if (/(sembahyang|puasa|zakat|masjid|tuhan|allah|nabi|al-qur|doa|dosa|pahala|akhirat|surga|neraka|agama|wajiq|ibadah|santri)/.test(text)) {
        return 'Religi & Spiritualitas';
    }
    if (/(pohon|kebun|sawah|padi|buah|tanah|gunung|sungai|hutan|batu|tanaman|daun|akar|uma|pare|hewan|binatang|burung|ayam)/.test(text)) {
        return 'Alam & Pertanian';
    }
    if (/(bapak|ibu|anak|adik|kakak|paman|bibi|kakek|nenek|mertua|menantu|saudara|suami|istri|kindo|kamaq|anaq|kandiq|luluare|keluarga)/.test(text)) {
        return 'Keluarga & Kekerabatan';
    }
    if (/(kepala|mata|telinga|tangan|kaki|hati|perut|darah|tulang|tubuh|badan|sakit|penyakit|obat|sembuh|luka|mate|mongeq|bundang)/.test(text)) {
        return 'Anatomi & Kesehatan';
    }
    if (/(rumah|tiang|tangga|atap|dinding|lantai|pintu|jendela|balok|kamar|boyang|pacceko|baqba|bangunan)/.test(text)) {
        return 'Arsitektur & Rumah';
    }
    return 'Umum';
}

const POS_MAP = {
    'n': 'Nomina (Kata Benda)',
    'v': 'Verba (Kata Kerja)',
    'a': 'Adjektiva (Kata Sifat)',
    'adv': 'Adverbia (Kata Keterangan)',
    'p': 'Partikel (Kata Tugas)',
    'num': 'Numeralia (Kata Bilangan)',
    'pron': 'Pronomina (Kata Ganti)',
    'ukp': 'Ungkapan',
    'pb': 'Peribahasa',
    'ki': 'Kiasan',
    'i': 'Interjeksi (Kata Seru)'
};

console.log("Compiling Mandar dictionary dataset from 499 pages...");

let entries = [];
let currentEntry = null;

for (let p = 47; p <= 545; p++) {
    const lines = pages[p].split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let startIdx = 0;
    if (lines[1] && /^\d+$/.test(lines[1])) {
        startIdx = 2;
    } else if (/^\d+$/.test(lines[0])) {
        startIdx = 1;
    }
    if (lines[startIdx] && /^[A-Z]{1,2}\s*-\s*[a-z]{1,2}$/.test(lines[startIdx])) {
        startIdx++;
    }

    const pageLines = lines.slice(startIdx);

    for (let i = 0; i < pageLines.length; i++) {
        const line = pageLines[i];
        const headMatch = line.match(/^([a-zA-Z\-,~'`]+(?:\s+[a-zA-Z\-,~'`]+)?)\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki)\b(?:\s+(.*))?$/);

        if (headMatch && !(headMatch[1].startsWith('uissangmi') && headMatch[2] === 'a')) {
            if (currentEntry) entries.push(currentEntry);
            currentEntry = {
                page: p - 46,
                lemma: headMatch[1].trim(),
                pos: headMatch[2].toLowerCase(),
                rawContent: headMatch[3] ? [headMatch[3].trim()] : []
            };
        } else if (currentEntry) {
            currentEntry.rawContent.push(line);
        }
    }
}
if (currentEntry) entries.push(currentEntry);

console.log(`Extracted ${entries.length} raw entries.`);

// Transform and clean entries
const finalEntries = entries.map((e, idx) => {
    const rawContentStr = expandAbbreviations(e.rawContent.join(' ')).trim();
    
    // Parse example sentence if present (indicated by '~' or '--')
    let definition = rawContentStr;
    let mandarExample = '';
    let indonesianExample = '';

    // Check for '~' or '--' marker
    const markerMatch = rawContentStr.match(/(\s*~|\s*--)(.*)/);
    if (markerMatch) {
        definition = rawContentStr.substring(0, markerMatch.index).trim();
        const examplePart = markerMatch[0].trim();
        mandarExample = examplePart;
    }

    // Clean up definition trailing punctuation
    if (definition.endsWith(':') || definition.endsWith(';')) {
        definition = definition.slice(0, -1).trim();
    }

    // Determine root word
    let rootWord = e.lemma;
    const cleanLemma = e.lemma.replace(/^[-~]/, '').trim();
    const prefixes = ['maq', 'meq', 'paq', 'peq', 'mang', 'mass', 'mapp', 'matt', 'makk', 'mamb', 'mand', 'ma', 'me', 'pa', 'pe', 'di', 'ti', 'si', 'ka'];
    for (const pref of prefixes) {
        if (cleanLemma.startsWith(pref) && cleanLemma.length > pref.length + 2) {
            rootWord = cleanLemma.substring(pref.length);
            break;
        }
    }

    const category = detectCategory(e.lemma, definition, mandarExample);
    const lontara = mandarToLontara(e.lemma);
    const phonetic = generatePhoneticIPA(e.lemma);

    return {
        id: `mandar-${idx + 1}`,
        lemma: e.lemma,
        cleanLemma: cleanLemma,
        pos: e.pos,
        posLabel: POS_MAP[e.pos] || e.pos,
        definition: definition || 'Arti kata belum tersedia secara rinci dalam naskah sumber.',
        exampleMandar: mandarExample || null,
        phonetic: phonetic,
        lontara: lontara,
        category: category,
        rootWord: rootWord,
        page: e.page
    };
});

// Create data directory
const outputDir = path.resolve('c:/Users/Administrator/kamusdigitalmandarindoesia/src/data');
fs.mkdirSync(outputDir, { recursive: true });

// Write dictionary dataset
const jsonPath = path.join(outputDir, 'mandar_dictionary.json');
fs.writeFileSync(jsonPath, JSON.stringify(finalEntries, null, 2), 'utf-8');
console.log(`Saved ${finalEntries.length} entries to ${jsonPath}`);

// Summary stats
const categoryCounts = {};
finalEntries.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
});
console.log("Category counts:", categoryCounts);
