const fs = require('fs');

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

// Let's test the parser on the first 50 pages (index 47 to 97)
console.log("Testing detailed parsing on first 50 pages...");

let entries = [];
let currentEntry = null;

const VALID_POS = new Set(['n', 'v', 'a', 'adv', 'p', 'num', 'pron', 'ukp', 'uKP', 'pb', 'ki', 'i']);

for (let p = 47; p <= 97; p++) {
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
        
        // Match entry start: word followed by POS
        const headMatch = line.match(/^([a-zA-Z\-,~'`]+(?:\s+[a-zA-Z\-,~'`]+)?)\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki)\b(?:\s+(.*))?$/);
        
        if (headMatch && !line.startsWith('uissangmi') && !line.includes('saya tahu!')) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            const lemma = headMatch[1].trim();
            const pos = headMatch[2].toLowerCase();
            const rest = headMatch[3] ? headMatch[3].trim() : '';
            
            currentEntry = {
                page: p - 46,
                lemma: lemma,
                pos: pos,
                rawContent: rest ? [rest] : []
            };
        } else if (currentEntry) {
            currentEntry.rawContent.push(line);
        }
    }
}

if (currentEntry) entries.push(currentEntry);

console.log(`Parsed ${entries.length} entries from first 50 pages.`);
console.log("Sample 5 entries with content:");
entries.slice(1, 6).forEach(e => {
    console.log(`\n--- [${e.lemma}] (${e.pos}) P.${e.page} ---`);
    console.log("Content:", expandAbbreviations(e.rawContent.join(' ')));
});
