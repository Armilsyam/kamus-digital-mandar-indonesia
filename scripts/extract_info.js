const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:/Users/Administrator/.gemini/antigravity/brain/611678f8-90f3-4fbd-ae3a-5495a598c3ab/.user_uploaded/media_1794714504569_47d31fac.pdf';

async function main() {
    console.log("Loading PDF...");
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    
    console.log("Extracting info...");
    const info = await parser.getInfo();
    console.log("Info:", info);
    
    console.log("Extracting text...");
    const textResult = await parser.getText();
    const text = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));
    console.log("Text length:", text.length);
    
    fs.writeFileSync('C:/Users/Administrator/kamusdigitalmandarindoesia/scripts/extracted_text.txt', text, 'utf-8');
    console.log("Saved to extracted_text.txt");
    
    console.log("=== PREVIEW (chars 20000 - 23000) ===");
    console.log(text.substring(20000, 23000));
}

main().catch(console.error);
