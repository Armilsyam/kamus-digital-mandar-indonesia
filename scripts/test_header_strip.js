const fs = require('fs');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

console.log("Analyzing page headers from index 47 (page 48) to 545 (page 546)...");

let cleanPages = [];

for (let p = 47; p <= 545; p++) {
    const lines = pages[p].split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    
    // Check first few lines
    let startIdx = 0;
    // Check if line 0 is guide words (e.g. "a accurang" or "urung maqusi")
    // and line 1 is page number (digits)
    if (lines[1] && /^\d+$/.test(lines[1])) {
        startIdx = 2;
    } else if (/^\d+$/.test(lines[0])) {
        startIdx = 1;
    }
    
    // Check if next line is letter header like "A - a", "B - b", "W - w"
    if (lines[startIdx] && /^[A-Z]{1,2}\s*-\s*[a-z]{1,2}$/.test(lines[startIdx])) {
        startIdx++;
    }
    
    cleanPages.push({
        pageNum: p - 46,
        lines: lines.slice(startIdx)
    });
}

console.log("Processed pages:", cleanPages.length);
console.log("Sample page 1 lines:", cleanPages[0].lines.slice(0, 10));
console.log("Sample page 2 lines:", cleanPages[1].lines.slice(0, 10));
console.log("Sample page 499 (last page) lines:", cleanPages[cleanPages.length - 1].lines);
