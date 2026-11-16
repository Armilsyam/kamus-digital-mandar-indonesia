/**
 * Mandar Morphological Dissector & Analyzer
 * Menganalisis kata kompleks berimbuhan dan berkulitika bahasa Mandar
 * berdasarkan kaidah Morfologi Bab II Kamus Mandar-Indonesia 2025
 */

export interface MorphemeComponent {
  type: 'prefix' | 'infix' | 'root' | 'reduplication' | 'suffix' | 'clitic';
  morpheme: string;
  name: string;
  functionDesc: string;
}

export interface MorphologicalAnalysis {
  originalWord: string;
  rootWord: string;
  components: MorphemeComponent[];
  formula: string;
  description: string;
}

const PREFIX_RULES: Record<string, { name: string; desc: string }> = {
  'maq': { name: 'Prefiks ma- / maq- (Verbal Aktif)', desc: 'Membentuk kata kerja aktif atau kata sifat' },
  'ma': { name: 'Prefiks ma- (Verbal Aktif)', desc: 'Membentuk kata kerja aktif atau kata sifat' },
  'meq': { name: 'Prefiks me- / meq- (Verbal Berulang/Arah)', desc: 'Menyatakan perbuatan berulang atau menuju ke suatu tempat' },
  'me': { name: 'Prefiks me- (Verbal Berulang/Arah)', desc: 'Menyatakan perbuatan berulang atau ke arah' },
  'paq': { name: 'Prefiks pa- / paq- (Nomina Pelaku/Alat)', desc: 'Menyatakan orang yang melakukan atau alat pekerjaan' },
  'pa': { name: 'Prefiks pa- (Nomina Pelaku/Alat)', desc: 'Menyatakan orang yang melakukan atau alat pekerjaan' },
  'peq': { name: 'Prefiks pe- / peq- (Kausatif/Pencarian)', desc: 'Menyatakan usaha, tindakan jemput/cari' },
  'pe': { name: 'Prefiks pe- (Kausatif/Pencarian)', desc: 'Menyatakan usaha atau tindakan pencarian' },
  'na': { name: 'Prefiks persona na- (Pasif / Orang Ketiga)', desc: 'Menandai subjek pelaku persona ketiga atau bentuk pasif' },
  'di': { name: 'Prefiks di- (Pasif)', desc: 'Bentuk kata kerja pasif (misal: diande = dimakan)' },
  'ti': { name: 'Prefiks ti- (Involuntari / Ter-)', desc: 'Menyatakan keadaan tidak sengaja (misal: titedo = tersandung)' },
  'si': { name: 'Prefiks si- (Resiprokal / Saling)', desc: 'Menyatakan perbuatan saling berbalasan (misal: sitimbe = saling lempar)' },
  'ka': { name: 'Prefiks ka- (Habitual / Sifat Gemar)', desc: 'Menyatakan kebiasaan atau gemar melakukan perbuatan kata dasar' },
  'ke': { name: 'Prefiks ke- (Possesif / Ber-)', desc: 'Menyatakan memiliki atau berpunya (misal: kebongang = punya rumah)' },
  'um': { name: 'Prefiks um- (Aktivitas Eksklusif)', desc: 'Menyatakan keadaan aktif spesifik (misal: ummorong = berenang)' },
};

const SUFFIX_RULES: Record<string, { name: string; desc: string }> = {
  'ang': { name: 'Sufiks -ang (Nomina Proses/Tempat/Benefaktif)', desc: 'Membentuk kata benda proses atau tempat atau tindakan untuk orang lain' },
  'i': { name: 'Sufiks -i (Kausatif / Lokatif Berulang)', desc: 'Menyatakan perbuatan terarah atau berulang kepada objek' }
};

const CLITIC_RULES: Record<string, { name: string; desc: string }> = {
  'mi': { name: 'Klitik -mi (Perfektif / Sudah)', desc: 'Penanda aspek bahwa tindakan telah selesai dilakukan' },
  'mo': { name: 'Klitik -mo (Perfektif Partikel)', desc: 'Penanda penegasan atau harapan tindakan' },
  'pa': { name: 'Klitik -pa (Imperfektif / Masih)', desc: 'Penanda aspek belum selesai atau masih berlangsung' },
  'pai': { name: 'Klitik -pai (Harapan / Kelak)', desc: 'Penanda kemungkinan atau harapan waktu nanti' },
  'di': { name: 'Klitik -di (Penegas / Fokus)', desc: 'Partikel penegas atau pronomina objek' },
  'toi': { name: 'Klitik -toi (Juga / Pula)', desc: 'Partikel penyerta (juga/pula)' },
  'toqo': { name: 'Klitik -toqo (Penegas Bersama)', desc: 'Partikel penegas kondisi bersama' },
  'tuqu': { name: 'Klitik -tuqu (Kepastian)', desc: 'Partikel penunjuk kepastian nyata' },
  'nasang': { name: 'Klitik -nasang (Kuantor Jamak / Semua)', desc: 'Menyatakan keseluruhan atau semua subjek/objek' },
  'dua': { name: 'Klitik -dua (Keterusan / Masih)', desc: 'Menyatakan tindakan masih terus berjalan' },
  'aq': { name: 'Enklitik Persona -aq (Objek Saya)', desc: 'Pronomina Seri III orang pertama tunggal' },
  'o': { name: 'Enklitik Persona -o (Objek Kamu)', desc: 'Pronomina Seri III orang kedua tunggal' },
};

export function dissectMorphology(word: string): MorphologicalAnalysis {
  if (!word) {
    return {
      originalWord: '',
      rootWord: '',
      components: [],
      formula: '',
      description: 'Silakan masukkan kata untuk dianalisis.'
    };
  }

  let current = word.toLowerCase().trim();
  const components: MorphemeComponent[] = [];

  // 1. Ekstrak klitik akhir (clitics)
  for (const [clitic, info] of Object.entries(CLITIC_RULES)) {
    if (current.endsWith(clitic) && current.length > clitic.length + 2) {
      components.push({
        type: 'clitic',
        morpheme: `-${clitic}`,
        name: info.name,
        functionDesc: info.desc
      });
      current = current.slice(0, -clitic.length);
      break;
    }
  }

  // 2. Ekstrak sufiks (-ang, -i)
  for (const [suf, info] of Object.entries(SUFFIX_RULES)) {
    if (current.endsWith(suf) && current.length > suf.length + 2) {
      components.push({
        type: 'suffix',
        morpheme: `-${suf}`,
        name: info.name,
        functionDesc: info.desc
      });
      current = current.slice(0, -suf.length);
      break;
    }
  }

  // 3. Ekstrak prefiks (awalan)
  // Urutkan prefiks berdasarkan panjang menurun
  const sortedPrefixes = Object.keys(PREFIX_RULES).sort((a, b) => b.length - a.length);
  for (const pref of sortedPrefixes) {
    if (current.startsWith(pref) && current.length > pref.length + 2) {
      const info = PREFIX_RULES[pref];
      components.unshift({
        type: 'prefix',
        morpheme: `${pref}-`,
        name: info.name,
        functionDesc: info.desc
      });
      current = current.slice(pref.length);
      break;
    }
  }

  // 4. Periksa reduplikasi (kata ulang bertanda hubung atau berulang)
  if (current.includes('-')) {
    const parts = current.split('-');
    if (parts[0] === parts[1]) {
      components.push({
        type: 'reduplication',
        morpheme: current,
        name: 'Reduplikasi Penuh (Kata Ulang Dwilingga)',
        functionDesc: 'Menyatakan perbuatan berulang-ulang, intensitas, atau jamak'
      });
      current = parts[0];
    }
  }

  // Sisa adalah akar kata (root)
  const rootComponent: MorphemeComponent = {
    type: 'root',
    morpheme: current,
    name: `Kata Dasar / Bentuk Kanonik [${current}]`,
    functionDesc: 'Lema inti asal yang belum mengalami afiksasi maupun klitisasi'
  };

  // Masukkan root pada posisi yang tepat (setelah prefiks, sebelum sufiks/klitik)
  const prefixCount = components.filter(c => c.type === 'prefix').length;
  components.splice(prefixCount, 0, rootComponent);

  const formula = components.map(c => c.morpheme).join(' + ');

  return {
    originalWord: word,
    rootWord: current,
    components,
    formula,
    description: `Kata '${word}' terdiri dari ${components.length} unsur pembentuk: ${components.map(c => `${c.morpheme} (${c.name})`).join(', ')}.`
  };
}


export function stripAffixes(word: string): { root: string; analysis: MorphologicalAnalysis } {
  const analysis = dissectMorphology(word);
  return {
    root: analysis.rootWord,
    analysis
  };
}
