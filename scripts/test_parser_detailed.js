const fs = require('fs');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

let allLines = [];
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
    allLines.push(...lines.slice(startIdx));
}

const joined = allLines.join(' ');

// In Indonesian dictionary:
// Entry starts with:
// <lemma> <pos>
// Where pos is one of: n, v, a, adv, p, num, pron, ukp, uKP, pb, ki, i
// Also numbers 1, 2 for sub-senses.
// Let's find matches where a word (1 to 4 words max) precedes a POS marker.

const entryRegex = /(?:^|\s)([\w\-'`,~]+(?:\s+[\w\-'`,~]+){0,2})\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki|i)\b/g;

let matches = [];
let match;
while ((match = entryRegex.exec(joined)) !== null) {
    matches.push({
        fullMatch: match[0],
        lemma: match[1].trim(),
        pos: match[2].toLowerCase(),
        index: match.index
    });
}

console.log(`Total candidate entry matches found: ${matches.length}`);
console.log("Sample first 20 matches:");
matches.slice(0, 20).forEach((m, idx) => {
    console.log(`${idx + 1}. [${m.lemma}] (${m.pos}) at index ${m.index}`);
});
