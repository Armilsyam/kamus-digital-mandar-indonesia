"use client";

import React, { useState, useMemo } from 'react';
import { 
  Feather, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  HelpCircle, 
  RefreshCw,
  Heart,
  Compass,
  Scroll,
  Info
} from 'lucide-react';
import { speakText } from '@/lib/audio';
import { transliterateLatinToLontara } from '@/lib/lontara';

export interface KalindaqdaqVerse {
  id: string;
  category: 'paqelo' | 'pappasang' | 'agama' | 'pambolongang';
  categoryLabel: string;
  linesMandar: [string, string, string, string];
  meaningId: string;
  meaningEn: string;
  philosophy: string;
  authorOrOrigin: string;
}

export const SAMPLE_KALINDAQDAQ: KalindaqdaqVerse[] = [
  {
    id: 'kd-1',
    category: 'pappasang',
    categoryLabel: 'Pappasang (Petuah Luhur)',
    linesMandar: [
      'Mellamun bomboq di litaq',
      'Mappasombo adaq lolo',
      'Inggai siwata-watang',
      'Mappatindo kerdhaan'
    ],
    meaningId: 'Menenggelamkan keangkuhan ombak di tanah pusaka, menjunjung tinggi adat keluhuran, marilah saling tolong-menolong menegakkan kesejahteraan bersama.',
    meaningEn: 'Submerging the pride of waves in the sacred land, exalting the noble customary law, let us support one another to uphold collective prosperity.',
    philosophy: 'Filosofi kelautan Mandar yang mengajarkan kerendahan hati seorang pelaut perkasa yang tetap memuliakan daratan dan persaudaraan sejati.',
    authorOrOrigin: 'Pappasang Maraqdia Balanipa Tradisional'
  },
  {
    id: 'kd-2',
    category: 'paqelo',
    categoryLabel: 'Paqelo-elo (Kasih & Asmara)',
    linesMandar: [
      'Pao-pao di tambolang',
      'Rambaqna dio malonda',
      'Iyyaqna lele bombang',
      'Kandoang mating di sauq'
    ],
    meaningId: 'Pohon mangga di tambolang, rindangnya sampai ke Malunda. Diriku terombang-ambing gelombang, rinduku terbang tertuju kepadamu di seberang lautan.',
    meaningEn: 'Mango trees in Tambolang, their lush shade reaches Malunda. I am tossed by ocean waves, my longing flies across the sea to you.',
    philosophy: 'Ekspresi rindu para passombal (pelaut) yang berlayar jauh mengarungi Selat Makassar kepada kekasih hati di pesisir Mandar.',
    authorOrOrigin: 'Sastra Lisan Pesisir Majene'
  },
  {
    id: 'kd-3',
    category: 'agama',
    categoryLabel: 'Agama & Spiritualitas',
    linesMandar: [
      'Daqdu mai litaq tama',
      'Sambayang lima wattunna',
      'Baraq toi naung lalan',
      'Mating di alam barasakh'
    ],
    meaningId: 'Ingatlah kelak kita kembali ke tanah liat, dirikanlah salat lima waktu, agar menjadi penerang jalan kita menuju alam barzakh.',
    meaningEn: 'Remember we will return into the soil, perform your five daily prayers, that they may illuminate your path into the afterlife.',
    philosophy: 'Petuah religius masyarakat Mandar yang menyelaraskan ajaran Islam dengan nilai kearifan lokal (Kappung Qulhu).',
    authorOrOrigin: 'Pappasang Annangguru Todilaling'
  },
  {
    id: 'kd-4',
    category: 'pambolongang',
    categoryLabel: 'Pambolongang (Semangat Perjuangan)',
    linesMandar: [
      'Manna maombaq tangngali',
      'Taqeai sombal tanjaq',
      'Mettappiq di baratan',
      'Salamaq lamba di polo'
    ],
    meaningId: 'Meskipun ombak menggunung tinggi, rentangkanlah layar gunting (sombal tanjaq), bertahanlah di cadik penyeimbang, selamat berlayar sampai ke seberang.',
    meaningEn: 'Even if the waves surge as high as hills, unfold the triangle sail, stand firm on the outrigger, and sail safely to the distant shore.',
    philosophy: 'Keteguhan hati, resiliensi, dan keberanian manusia Mandar dalam menghadapi badai kehidupan tanpa pernah menyerah.',
    authorOrOrigin: 'Nyanyian Pelaut Passombal Sandeq'
  },
  {
    id: 'kd-5',
    category: 'pappasang',
    categoryLabel: 'Pappasang (Kehormatan Siriq)',
    linesMandar: [
      'Mate di litaq mamboyang',
      'Siriq diolo dipau',
      'Andianna siriq litaq',
      'Pura mai tarrang nyawa'
    ],
    meaningId: 'Meninggal di tanah perantauan, kehormatan diri yang utama dijaga. Bila kehormatan negeri telah hilang, lebih baik nyawa berpisah dari raga.',
    meaningEn: 'Even when perishing in foreign lands, personal dignity must be preserved. If the dignity of our homeland is lost, life itself loses its worth.',
    philosophy: 'Prinsip Siriq na Pacce / Siriq na Lokoq: harga diri, integritas moral, dan kesetiaan mutlak kepada kehormatan keluarga dan negeri.',
    authorOrOrigin: 'Amanat Tomakaka Balanipa'
  }
];

/**
 * Menghitung perkiraan suku kata kata bahasa Mandar/Indonesia
 */
function countSyllablesInWord(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z']/g, '');
  if (!clean) return 0;
  
  // Hitung jumlah kelompok vokal
  const matches = clean.match(/[aiueo]/g);
  let count = matches ? matches.length : 1;

  // Koreksi diftong atau pengulangan mikro vokal jika bersambung rapat
  // Dalam bahasa Mandar, vokal ganda biasanya dibaca 2 suku kata (misal: 'pau' = pa-u [2], 'boyang' = bo-yang [2])
  return Math.max(1, count);
}

function countLineSyllables(line: string): number {
  const words = line.trim().split(/\s+/).filter(Boolean);
  return words.reduce((acc, w) => acc + countSyllablesInWord(w), 0);
}

export const KalindaqdaqStudio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVerse, setActiveVerse] = useState<KalindaqdaqVerse>(SAMPLE_KALINDAQDAQ[0]);
  const [copied, setCopied] = useState(false);

  // Custom Kalindaqdaq Creator State
  const [customLines, setCustomLines] = useState<[string, string, string, string]>([
    'Mellamun bomboq di litaq',
    'Mappasombo adaq lolo',
    'Inggai siwata-watang',
    'Mappatindo kerdhaan'
  ]);
  const [customMeaning, setCustomMeaning] = useState('Gubahan bait kalindaqdaq pribadi...');

  // Syllable counts of custom input
  const syllableCounts = useMemo(() => {
    return [
      countLineSyllables(customLines[0]),
      countLineSyllables(customLines[1]),
      countLineSyllables(customLines[2]),
      countLineSyllables(customLines[3])
    ] as [number, number, number, number];
  }, [customLines]);

  const targetSyllables = [8, 7, 8, 7];
  const isMeterValid = syllableCounts.every((c, idx) => Math.abs(c - targetSyllables[idx]) <= 1);

  const filteredVerses = useMemo(() => {
    if (selectedCategory === 'all') return SAMPLE_KALINDAQDAQ;
    return SAMPLE_KALINDAQDAQ.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  const handlePlayAudio = (lines: string[]) => {
    const poemText = lines.join(', ');
    speakText(poemText, { 
      lang: 'mandar', 
      rate: 0.82, 
      pitch: 1.15, 
      gender: 'female', 
      voiceProfile: 'indoq' 
    });
  };

  const handleCopyPoem = (verse: KalindaqdaqVerse) => {
    const textToCopy = `📜 KALINDAQDAQ MANDAR (8-7-8-7)\n\n${verse.linesMandar.join('\n')}\n\nArtinya:\n"${verse.meaningId}"\n\nFilosofi: ${verse.philosophy}\nSumber: ${verse.authorOrOrigin}\n\n— Dikutip dari KADIMA-ID (Kamus Digital Mandar-Indonesia)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨀᨒᨗᨉᨉ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Feather className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #1 • Sastra Lisan Tradisional Mandar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Studio Kalindaqdaq Interaktif
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Eksplorasi dan analisis sastra puisi luhur suku Mandar dengan kaidah metrum suku kata ketat <strong className="text-mandar-gold-300">8 - 7 - 8 - 7</strong>. Uji metrum bait puisimu sendiri, dengarkan lantunan irama lisan, dan selami kearifan luhur para leluhur.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Creator + Curated Anthology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Meter Analyzer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-mandar-maroon-700 dark:text-mandar-gold-400" />
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                  Kalkulator Metrum & Uji Rima (8-7-8-7)
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isMeterValid 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300' 
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
              }`}>
                {isMeterValid ? '✓ Metrum Valid (8-7-8-7)' : 'Perlu Penyesuaian Suku Kata'}
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-slate-400">
              Ketik atau ubah bait puisi di bawah ini. Sistem secara otomatis menghitung jumlah suku kata tiap baris sesuai aturan prosodi puisi Mandar:
            </p>

            {/* 4 Line Inputs with live syllable counters */}
            <div className="space-y-3.5">
              {[0, 1, 2, 3].map((idx) => {
                const target = targetSyllables[idx];
                const count = syllableCounts[idx];
                const isExact = count === target;
                const isClose = Math.abs(count - target) <= 1;

                return (
                  <div key={idx} className="relative">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-semibold text-stone-700 dark:text-slate-300">
                        Baris {idx + 1} (Target: {target} Suku Kata)
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        isExact 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : isClose
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {count} / {target} suku kata
                      </span>
                    </div>

                    <input
                      type="text"
                      value={customLines[idx]}
                      onChange={(e) => {
                        const newLines = [...customLines] as [string, string, string, string];
                        newLines[idx] = e.target.value;
                        setCustomLines(newLines);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50/70 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-stone-900 dark:text-white font-medium text-sm focus:border-mandar-maroon-700 focus:outline-none transition-colors"
                      placeholder={`Ketik baris ${idx + 1}...`}
                    />

                    {/* Transliterasi Lontara Otomatis */}
                    <div className="text-[13px] font-lontara text-mandar-gold-700 dark:text-mandar-gold-400 mt-1 pl-1">
                      {transliterateLatinToLontara(customLines[idx]).lontara}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Meaning Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Makna & Terjemahan Gubahan:
              </label>
              <textarea
                rows={2}
                value={customMeaning}
                onChange={(e) => setCustomMeaning(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-mandar-sand-50/70 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs text-stone-800 dark:text-slate-200 focus:outline-none"
                placeholder="Tuliskan terjemahan atau pesan yang terkandung..."
              />
            </div>

            {/* Action Buttons for Custom Poem */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handlePlayAudio(customLines)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengarkan Pelafalan</span>
              </button>

              <button
                onClick={() => {
                  const sample = SAMPLE_KALINDAQDAQ[Math.floor(Math.random() * SAMPLE_KALINDAQDAQ.length)];
                  setCustomLines([...sample.linesMandar]);
                  setCustomMeaning(sample.meaningId);
                }}
                className="flex items-center space-x-1 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Contoh Lain</span>
              </button>

              <button
                onClick={() => {
                  const text = `📜 KALINDAQDAQ MANDAR (Gubahan Pengguna)\n\n${customLines.join('\n')}\n\nMakna:\n"${customMeaning}"\n\n— Dibuat dengan Studio Kalindaqdaq KADIMA-ID`;
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center space-x-1 px-3.5 py-2.5 rounded-xl border border-mandar-sand-300 dark:border-slate-700 hover:bg-mandar-sand-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Bait'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Curated Classic Anthology & Card Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Aesthetic Card Preview */}
          <div className="relative rounded-3xl bg-gradient-to-br from-amber-900 via-mandar-maroon-900 to-mandar-navy-950 p-6 sm:p-7 text-white shadow-xl border border-mandar-gold-500/30 overflow-hidden">
            {/* Traditional Background Motif */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mandar-gold-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-xs text-mandar-gold-300 font-bold border-b border-white/10 pb-3">
                <span className="flex items-center space-x-1">
                  <Scroll className="w-3.5 h-3.5" />
                  <span>KARTU KUTIPAN SASTRA MANDAR</span>
                </span>
                <span className="bg-mandar-gold-500/20 px-2 py-0.5 rounded text-[10px]">8-7-8-7 Metrum</span>
              </div>

              {/* 4 Lines Styled Display */}
              <div className="space-y-1.5 py-2">
                {activeVerse.linesMandar.map((line, idx) => (
                  <div key={idx} className="flex items-baseline space-x-2">
                    <span className="text-[11px] font-mono text-mandar-gold-400 opacity-60">
                      0{idx + 1}
                    </span>
                    <div>
                      <p className="text-base sm:text-lg font-serif italic font-medium text-amber-50">
                        &ldquo;{line}&rdquo;
                      </p>
                      <p className="text-xs font-lontara text-mandar-gold-300/80">
                        {transliterateLatinToLontara(line).lontara}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Translation & Philosophy */}
              <div className="bg-black/30 rounded-2xl p-3.5 text-xs text-mandar-sand-100 space-y-1.5 border border-white/5">
                <p className="font-semibold text-mandar-gold-200">
                  Arti Harfiah:
                </p>
                <p className="text-stone-300 italic">
                  {activeVerse.meaningId}
                </p>
                <p className="text-[11px] text-stone-400 pt-1">
                  💡 <strong>Filosofi:</strong> {activeVerse.philosophy}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handlePlayAudio([...activeVerse.linesMandar])}
                  className="flex items-center space-x-1 text-xs font-bold text-mandar-gold-300 hover:text-white transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Lantunkan Audio</span>
                </button>

                <button
                  onClick={() => handleCopyPoem(activeVerse)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin' : 'Bagikan Kartu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Curated List Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Pilih Antologi Kalindaqdaq Terpilih:
            </h4>
            <div className="space-y-2">
              {SAMPLE_KALINDAQDAQ.map((verse) => (
                <button
                  key={verse.id}
                  onClick={() => setActiveVerse(verse)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border ${
                    activeVerse.id === verse.id
                      ? 'bg-mandar-maroon-50 dark:bg-mandar-maroon-950/40 border-mandar-maroon-600 dark:border-mandar-gold-500'
                      : 'bg-mandar-sand-50/50 dark:bg-slate-800/60 border-transparent hover:border-mandar-sand-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-mandar-maroon-800 dark:text-mandar-gold-400">
                      {verse.categoryLabel}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {verse.authorOrOrigin}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-slate-300 font-serif italic line-clamp-1">
                    &ldquo;{verse.linesMandar[0]}...&rdquo;
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
