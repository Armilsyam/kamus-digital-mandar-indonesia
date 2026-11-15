const fs = require('fs');
const text = fs.readFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', 'utf-8');

const pages = text.split(/-- \d+ of 548 --/);
for (let i = 540; i < pages.length; i++) {
    console.log(`\n=================== PAGE ${i+1} ===================`);
    console.log(pages[i].substring(0, 1000));
}
