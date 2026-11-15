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

const joinedText = allLines.join(' ');

// Let's identify entry patterns:
// An entry starts with: <lemma> <pos> <definition & examples...>
// where <pos> is one of: n, v, a, adv, p, num, pron, ukp, uKP, pb, ki, i
// Notice that inside an entry, there might be examples or sub-definitions (1, 2, 3), but new entries are marked by:
// [word] followed by POS tag.
// Let's test a regex that matches:
// (?:^|\s)([\w\-'`,\s]{1,40}?)\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki|i)\s+
// Let's run a test script to see the matches and evaluate accuracy.

console.log("Total joined words:", joinedText.split(/\s+/).length);
console.log("Joined text sample (first 1000 chars):", joinedText.substring(0, 1000));
