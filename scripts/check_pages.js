const fs = require('fs');
const text = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');

// Find page 48 or 49
const pages = text.split(/-- \d+ of 548 --/);
console.log("Total split pages:", pages.length);

for (let i = 45; i < 55; i++) {
    if (pages[i]) {
        console.log(`\n=================== PAGE ${i+1} ===================`);
        console.log(pages[i].substring(0, 1500));
    }
}
