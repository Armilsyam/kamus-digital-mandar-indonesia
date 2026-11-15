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

let entries = [];
let currentEntry = null;

const VALID_POS = new Set(['n', 'v', 'a', 'adv', 'p', 'num', 'pron', 'ukp', 'uKP', 'pb', 'ki', 'i']);

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
        
        // Match entry start: word followed by POS
        // Examples: "abi n bapak...", "agar, agar-agar n...", "uso, uso-uso v..."
        const headMatch = line.match(/^([a-zA-Z\-,~'`]+(?:\s+[a-zA-Z\-,~'`]+)?)\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki)\b(?:\s+(.*))?$/);
        
        // Exclude false positive "uissangmi a saya tahu!"
        if (headMatch && !(headMatch[1].startsWith('uissangmi') && headMatch[2] === 'a')) {
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

console.log(`Parsed total ${entries.length} entries from all 499 dictionary pages!`);

// Count by first letter
const letterCounts = {};
entries.forEach(e => {
    let cleanLemma = e.lemma.replace(/^[-~]/, '').toUpperCase();
    let letter = cleanLemma.charAt(0);
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
});

console.log("Entries per letter:", letterCounts);
