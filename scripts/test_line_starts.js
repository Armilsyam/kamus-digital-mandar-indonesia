const fs = require('fs');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

let startOfLineEntries = [];

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
        // Check if line starts with a lemma and POS tag
        // e.g. "abi n bapak, ayah"
        // e.g. "abong-abong n makanan"
        // e.g. "accur a hancur"
        // e.g. "maaccur v"
        // e.g. "1 meremukkan" or "2 a melebur"
        const m = line.match(/^([a-zA-Z\-,~'\s]+?)\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki)\b/);
        if (m) {
            startOfLineEntries.push({
                page: p - 46,
                line: line,
                lemma: m[1].trim(),
                pos: m[2]
            });
        }
    }
}

console.log(`Found ${startOfLineEntries.length} entries starting at the beginning of a line!`);
console.log("Sample first 30 entries:");
startOfLineEntries.slice(0, 30).forEach((e, idx) => {
    console.log(`${idx+1}. (P.${e.page}) [${e.lemma}] [${e.pos}] -> "${e.line}"`);
});
