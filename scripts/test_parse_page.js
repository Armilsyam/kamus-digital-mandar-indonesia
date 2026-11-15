const fs = require('fs');

const rawText = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');
const pages = rawText.split(/-- \d+ of 548 --/);

// Filter dictionary pages (from page 48 to 546, which are index 47 to 545)
console.log("Dictionary starts at page 48 (index 47).");

// Let's inspect page 48 (index 47) lines:
const page48Lines = pages[47].split('\n').map(l => l.trim()).filter(Boolean);
console.log("Page 48 line count:", page48Lines.length);
console.log("Lines 0-25:", page48Lines.slice(0, 25));
