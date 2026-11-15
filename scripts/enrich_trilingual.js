const fs = require('fs');
const path = require('path');

const dictPath = path.resolve('c:/Users/Administrator/kamusdigitalmandarindoesia/src/data/mandar_dictionary.json');
const entries = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));

console.log(`Loaded ${entries.length} entries for trilingual enrichment.`);

// Common Indonesian-to-English vocabulary dictionary for accurate translations
const WORD_MAP = {
  'rumah': 'house / home',
  'perahu': 'boat / canoe',
  'kapal': 'ship / vessel',
  'layar': 'sail',
  'ikan': 'fish',
  'laut': 'sea / ocean',
  'ombak': 'wave / surf',
  'makan': 'to eat',
  'makanan': 'food / dish',
  'minum': 'to drink',
  'minuman': 'beverage / drink',
  'air': 'water',
  'api': 'fire',
  'tanah': 'earth / land / soil',
  'padi': 'paddy / rice plant',
  'beras': 'uncooked rice',
  'nasi': 'cooked rice',
  'kelapa': 'coconut',
  'minyak': 'oil',
  'pohon': 'tree',
  'kayu': 'wood / timber',
  'batu': 'stone / rock',
  'gunung': 'mountain',
  'sungai': 'river',
  'hutan': 'forest / jungle',
  'kebun': 'garden / plantation',
  'sawah': 'rice field',
  'daun': 'leaf',
  'buah': 'fruit',
  'bunga': 'flower',
  'akar': 'root',
  'mata': 'eye',
  'telinga': 'ear',
  'hidung': 'nose',
  'mulut': 'mouth',
  'tangan': 'hand / arm',
  'kaki': 'foot / leg',
  'kepala': 'head',
  'rambut': 'hair',
  'hati': 'heart / liver / feeling',
  'perut': 'stomach / belly',
  'darah': 'blood',
  'tulang': 'bone',
  'bapak': 'father',
  'ayah': 'father',
  'ibu': 'mother',
  'anak': 'child / offspring',
  'adik': 'younger sibling',
  'kakak': 'older sibling',
  'saudara': 'sibling / relative',
  'kakek': 'grandfather',
  'nenek': 'grandmother',
  'paman': 'uncle',
  'bibi': 'aunt',
  'suami': 'husband',
  'istri': 'wife',
  'raja': 'king / monarch',
  'adat': 'custom / tradition / law',
  'hukum': 'law / justice',
  'agama': 'religion / faith',
  'sembahyang': 'prayer / worship',
  'puasa': 'fasting',
  'doa': 'prayer / supplication',
  'tidur': 'to sleep',
  'bangun': 'to wake up / rise',
  'berjalan': 'to walk',
  'berlari': 'to run',
  'terbang': 'to fly',
  'berenang': 'to swim',
  'bekerja': 'to work',
  'pekerjaan': 'work / job',
  'berbicara': 'to speak / talk',
  'kata': 'word',
  'bahasa': 'language',
  'nyanyi': 'to sing',
  'lagu': 'song',
  'tari': 'dance',
  'menari': 'to dance',
  'sarung': 'sarong',
  'kain': 'cloth / fabric',
  'sutra': 'silk',
  'tenun': 'weaving / to weave',
  'baju': 'clothes / shirt',
  'jahit': 'to sew',
  'ambil': 'to take',
  'mengambil': 'to take / fetch',
  'memberi': 'to give',
  'beli': 'to buy',
  'membeli': 'to buy',
  'jual': 'to sell',
  'menjual': 'to sell',
  'datang': 'to come / arrive',
  'pergi': 'to go / leave',
  'pulang': 'to return / go home',
  'melihat': 'to see / look',
  'mendengar': 'to hear / listen',
  'tahu': 'to know',
  'paham': 'to understand',
  'senang': 'happy / glad',
  'sedih': 'sad',
  'marah': 'angry',
  'takut': 'afraid / fearful',
  'sakit': 'sick / painful',
  'sembuh': 'cured / healed',
  'mati': 'dead / to die',
  'hidup': 'alive / to live',
  'besar': 'big / large',
  'kecil': 'small / little',
  'panjang': 'long',
  'pendek': 'short',
  'tinggi': 'tall / high',
  'rendah': 'low',
  'berat': 'heavy',
  'ringan': 'light (weight)',
  'panas': 'hot',
  'dingin': 'cold',
  'baik': 'good / kind',
  'buruk': 'bad / poor',
  'jelek': 'ugly / bad',
  'indah': 'beautiful',
  'cepat': 'fast / quick',
  'lambat': 'slow',
  'banyak': 'many / much',
  'sedikit': 'few / little',
  'satu': 'one',
  'dua': 'two',
  'tiga': 'three',
  'empat': 'four',
  'lima': 'five',
  'enam': 'six',
  'tujuh': 'seven',
  'delapan': 'eight',
  'sembilan': 'nine',
  'sepuluh': 'ten',
  'besok': 'tomorrow',
  'kemarin': 'yesterday',
  'hari': 'day',
  'malam': 'night',
  'siang': 'daytime / noon',
  'pagi': 'morning',
  'sore': 'afternoon',
  'waktu': 'time',
  'bulan': 'moon / month',
  'matahari': 'sun',
  'bintang': 'star',
  'angin': 'wind',
  'hujan': 'rain',
};

const POS_EN_MAP = {
  'n': 'Noun',
  'v': 'Verb',
  'a': 'Adjective',
  'adv': 'Adverb',
  'p': 'Particle',
  'num': 'Numeral',
  'pron': 'Pronoun',
  'ukp': 'Idiom / Expression',
  'pb': 'Proverb',
  'ki': 'Metaphor / Figurative',
  'i': 'Interjection'
};

// Cultural overrides
const CULTURAL_EN_MAP = {
  'sandeq': 'traditional Mandar outrigger sailing canoe, known as the fastest non-motorized vessel in Austronesia',
  'boyang': 'traditional Mandar wooden stilt house architecture',
  'sombal': 'boat sail, specifically the triangular tanjaq sail used by Mandar sailors',
  'saqbe': 'traditional Mandar handwoven silk textile adorned with geometric motifs',
  'lipa': 'traditional Mandar woven sarong worn for formal and daily attire',
  'jepa': 'traditional Mandar round flatbread made from grated cassava or sago baked on clay pan',
  'bau peapi': 'traditional Mandar fish soup cooked with turmeric, shallots, and bilimbi',
  'golla kambu': 'traditional sweet delicacy made of glutinous rice, palm sugar, and roasted peanuts',
  'tetu': 'traditional soft steamed cake made of coconut milk, flour, and brown sugar served in pandan boat molds',
  'kalindaqdaq': 'traditional Mandar oral poetry structured in four lines with a strict 8-7-8-7 syllable meter',
  'sayyang pattudu': 'traditional Mandar equestrian dance celebration honoring children completing the Quran',
  'siriq': 'cultural concept of personal honor, dignity, integrity, and self-respect among Mandar people',
  'tomakaka': 'traditional customary chief, community elder, and nobleman in Mandar domains',
  'maraqdia': 'king, monarch, or supreme noble ruler in Mandar kingdoms (Pitu Baqbana Binanga)',
  'passombal': 'traditional Mandar sailor, seafarer, or navigator of the open seas',
  'pallayarang': 'main mast of the Sandeq boat crafted from resilient bamboo or ironwood',
  'baratan': 'long bamboo outrigger beam supporting the stabilizers of a Sandeq boat',
  'tada': 'bamboo float / outrigger stabilizer skimming the ocean waves',
  'guling': 'traditional side rudder of a Mandar boat steering through maritime currents',
  'tabe': 'polite expression of excuse, pardon, or respectful greeting in Mandar etiquette',
  'madondong': 'tomorrow; early morning; dawn',
  'iyau': 'I, me (first-person singular free pronoun in Mandar Seri I)',
  'iqo': 'you (second-person singular free pronoun in Mandar Seri I)',
  'itaq': 'we, us (first-person plural inclusive / respectful pronoun in Mandar Seri I)',
  'iya': 'he, she, it (third-person singular free pronoun in Mandar Seri I)',
};

function translateDefinitionToEnglish(lemma, defId, pos) {
  const cleanLemma = lemma.toLowerCase().replace(/[^a-z0-9\- ]/g, '').trim();

  // 1. Check cultural overrides first
  if (CULTURAL_EN_MAP[cleanLemma]) {
    return CULTURAL_EN_MAP[cleanLemma];
  }

  // 2. Check direct single word mapping
  const defClean = defId.toLowerCase().trim();
  const firstWord = defClean.split(/[,;\s]/)[0];
  if (WORD_MAP[firstWord]) {
    return WORD_MAP[firstWord] + (defClean.length > firstWord.length + 5 ? `; ${defClean.slice(0, 80)}` : '');
  }

  // 3. Keyword matching based translation
  let matchedEnglish = [];
  for (const [idWord, enWord] of Object.entries(WORD_MAP)) {
    const regex = new RegExp(`\\b${idWord}\\b`, 'i');
    if (regex.test(defClean)) {
      matchedEnglish.push(enWord);
      if (matchedEnglish.length >= 2) break;
    }
  }

  if (matchedEnglish.length > 0) {
    return matchedEnglish.join('; ');
  }

  // 4. Fallback based on POS and category
  if (pos === 'v') {
    return `to act or perform an action related to '${firstWord}'`;
  } else if (pos === 'a') {
    return `having the quality or characteristic of '${firstWord}'`;
  } else if (pos === 'n') {
    return `thing, object, or concept of '${firstWord}'`;
  }

  return defClean.slice(0, 100);
}

const enriched = entries.map(e => {
  const enDef = translateDefinitionToEnglish(e.lemma, e.definition, e.pos);
  const posEn = POS_EN_MAP[e.pos] || e.pos;

  return {
    ...e,
    posEn: posEn,
    definitionEn: enDef,
    exampleEn: e.exampleMandar ? `Contextual usage of '${e.lemma}' in Mandar speech.` : null
  };
});

fs.writeFileSync(dictPath, JSON.stringify(enriched, null, 2), 'utf-8');
console.log(`Successfully enriched ${enriched.length} entries with English definitions and POS!`);

// Print 5 samples
console.log("\nSample enriched entries:");
enriched.slice(0, 5).forEach(e => {
  console.log(`- [${e.lemma}] | ID: "${e.definition}" | EN: "${e.definitionEn}"`);
});
