const fs = require('fs');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

// Look across dictionary pages (index 47 to 545)
const posTags = new Set();
const candidateHeaders = [];

// Clean headers and page numbers
for (let p = 47; p <= 545; p++) {
    const pageText = pages[p];
    if (!pageText) continue;
    
    // Scan words followed by single letter / short tag
    const matches = pageText.matchAll(/(?:^|\n)\s*([a-zA-Z\-,~'\s]+?)\s+(n|v|a|adv|p|num|pron|ukp|uKP|pb|ki|i)\b/g);
    for (const m of matches) {
        posTags.add(m[2]);
    }
}

console.log("Found POS tags:", Array.from(posTags));
