const fs = require('fs');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

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

// Inspect entries 100, 200, 500, 1000, 2000, 3000, 4000
[50, 120, 300, 600, 1200, 1800, 2500, 3200, 4000].forEach(idx => {
    const e = entries[idx];
    console.log(`\n================ ENTRY #${idx}: ${e.lemma} (${e.pos}) ================`);
    console.log(e.rawContent.join(' '));
});
