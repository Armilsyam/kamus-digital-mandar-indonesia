"use client";

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Volume2, 
  Feather,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import cultureData from '@/data/mandar_culture.json';
import { splitMandarSyllables } from '@/lib/phonetics';
import { speakMandar } from '@/lib/audio';

interface CultureEncyclopediaProps {
  soundEnabled: boolean;
}

export const CultureEncyclopedia: React.FC<CultureEncyclopediaProps> = ({ soundEnabled }) => {
  const [activeSection, setActiveSection] = useState<'sandeq' | 'saqbe' | 'kalindaqdaq' | 'sayyang' | 'culinary'>('sandeq');

  // Kalindaqdaq meter checker state
  const [line1, setLine1] = useState('Mellongeq mepasorongan');
  const [line2, setLine2] = useState('Pindang pura tinindo');
  const [line3, setLine3] = useState('Taqe-taqe na balimbing');
  const [line4, setLine4] = useState('Lappaq tinindo tulu');

  const countSyl = (text: string) => splitMandarSyllables(text).length;

  const syl1 = countSyl(line1);
  const syl2 = countSyl(line2);
  const syl3 = countSyl(line3);
  const syl4 = countSyl(line4);

  const isMeterValid = syl1 === 8 && syl2 === 7 && syl3 === 8 && syl4 === 7;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-navy-950 via-mandar-navy-900 to-mandar-maroon-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Warisan Budaya Takbenda (WBTb) Sulawesi Barat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ensiklopedia Budaya & Kosmologi Maritim Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Menghubungkan istilah leksikografis dengan realitas kebudayaan adiluhung suku Mandar: 
            ketangguhan perahu layar Sandeq, keagungan tenun sutra Lipaq Saqbe, kearifan puisi lisan Kalindaqdaq, 
            ritual Sayyang Pattudu, hingga warisan kuliner pesisir Teluk Mandar.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-mandar-sand-100 dark:bg-slate-800/80 border border-mandar-sand-200 dark:border-slate-700">
        {[
          { id: 'sandeq', label: '⛵ Perahu Layar Sandeq', title: 'Mahakarya Maritim' },
          { id: 'saqbe', label: '🧶 Tenun Lipaq Saqbe', title: 'Sutra Tradisional' },
          { id: 'kalindaqdaq', label: '📜 Sastra Kalindaqdaq', title: 'Puisi 8-7-8-7' },
          { id: 'sayyang', label: '🐴 Sayyang Pattudu', title: 'Kuda Menari' },
          { id: 'culinary', label: '🍲 Kuliner Warisan', title: 'Jepa & Bau Peapi' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeSection === tab.id
                ? 'bg-mandar-maroon-700 text-white shadow-md'
                : 'text-stone-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: PERAHU SANDEQ */}
      {activeSection === 'sandeq' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300">
                Mahakarya Austronesia
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1 mb-3">
                {cultureData.sandeq.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                {cultureData.sandeq.description}
              </p>
            </div>

            {/* Philosophy Highlight Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-mandar-navy-950 to-mandar-navy-900 text-white mb-8 border border-mandar-navy-800">
              <span className="text-xs font-bold text-mandar-gold-400 uppercase tracking-wider block mb-1">
                Falsafah Hidup Passombal Mandar
              </span>
              <p className="text-base sm:text-lg font-serif italic text-mandar-sand-200">
                &ldquo;{cultureData.sandeq.philosophy}&rdquo;
              </p>
            </div>

            {/* Anatomy Dictionary Grid */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-mandar-navy-800 dark:text-sky-300 mb-4 flex items-center space-x-2">
                <Compass className="w-4 h-4" />
                <span>Glosarium Istilah Anatomi & Komponen Sandeq:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cultureData.sandeq.anatomy.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-800 hover:border-mandar-maroon-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-base text-mandar-maroon-800 dark:text-mandar-maroon-300">
                        {item.part}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-mandar-sand-200 dark:bg-slate-700 font-mono text-stone-700 dark:text-slate-300">
                        Bagian #{idx + 1}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LIPAQ SAQBE MANDAR */}
      {activeSection === 'saqbe' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-mandar-gold-800 dark:text-mandar-gold-400">
                Seni Kriya Tekstil Adat
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1 mb-3">
                {cultureData.saqbe.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                {cultureData.saqbe.description}
              </p>
            </div>

            {/* Motifs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cultureData.saqbe.motifs.map((motif, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border-2 border-mandar-sand-200 dark:border-slate-800 hover:border-mandar-gold-400 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500" />
                    <h4 className="font-extrabold text-base text-mandar-maroon-900 dark:text-mandar-gold-300">
                      {motif.name}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                    {motif.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SASTRA KALINDAQDAQ */}
      {activeSection === 'kalindaqdaq' && (
        <div className="space-y-6">
          
          {/* Classical Kalindaqdaq Collection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300">
                Sastra Lisan Adiluhung
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1 mb-2">
                {cultureData.kalindaqdaq.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                {cultureData.kalindaqdaq.description}
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-mandar-maroon-50 dark:bg-slate-800 text-mandar-maroon-800 dark:text-mandar-maroon-300 text-xs font-bold font-mono">
                Pola Irama: {cultureData.kalindaqdaq.meterPattern}
              </div>
            </div>

            {/* Poems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {cultureData.kalindaqdaq.poems.map((poem) => (
                <div key={poem.id} className="p-6 rounded-3xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-700 dark:text-mandar-gold-400 block mb-3">
                      {poem.category}
                    </span>

                    {/* Mandar Lines with Syllable Badges */}
                    <div className="space-y-2 mb-4 font-serif text-base text-mandar-maroon-900 dark:text-mandar-maroon-200">
                      {poem.linesMandar.map((line, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="font-semibold italic">&ldquo;{line}&rdquo;</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-mandar-gold-100 dark:bg-slate-700 text-mandar-gold-800 dark:text-mandar-gold-300 ml-2">
                            {poem.syllables[i]}s
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Indonesian Translation */}
                    <div className="pt-3 border-t border-mandar-sand-200 dark:border-slate-700 text-xs text-stone-600 dark:text-slate-400 space-y-1">
                      {poem.linesIndonesian.map((trans, i) => (
                        <p key={i}>{trans}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-mandar-sand-200 dark:border-slate-700 text-[11px] text-stone-500 italic">
                    {poem.meaning}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive 8-7-8-7 Syllable Meter Checker */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-mandar-sand-50 to-white dark:from-slate-800/80 dark:to-slate-900 border-2 border-mandar-maroon-200 dark:border-mandar-maroon-800/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-mandar-maroon-900 dark:text-white flex items-center space-x-2">
                    <Feather className="w-5 h-5 text-mandar-maroon-600 dark:text-mandar-maroon-400" />
                    <span>Uji Meter Kalindaqdaq Interaktif (Cek 8 - 7 - 8 - 7 Suku Kata)</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    Tuliskan bait puisi Mandar Anda sendiri dan periksa secara real-time apakah memenuhi konvensi ritme metrum tradisional.
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isMeterValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {isMeterValid ? '✓ Metrum Baku 8-7-8-7 Terpenuhi!' : 'Periksa Jumlah Suku Kata'}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Baris 1 (Harus 8 Suku Kata)', val: line1, setVal: setLine1, cur: syl1, target: 8 },
                  { label: 'Baris 2 (Harus 7 Suku Kata)', val: line2, setVal: setLine2, cur: syl2, target: 7 },
                  { label: 'Baris 3 (Harus 8 Suku Kata)', val: line3, setVal: setLine3, cur: syl3, target: 8 },
                  { label: 'Baris 4 (Harus 7 Suku Kata)', val: line4, setVal: setLine4, cur: syl4, target: 7 },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={row.val}
                      onChange={(e) => row.setVal(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-300 dark:border-slate-700 text-sm font-serif text-stone-800 dark:text-white outline-none focus:border-mandar-maroon-600"
                      placeholder={`Ketik baris ke-${i + 1}...`}
                    />
                    <div className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1 border ${
                      row.cur === row.target
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      <span>{row.cur} / {row.target} suku kata</span>
                      {row.cur === row.target && <Check className="w-3.5 h-3.5 text-emerald-600 ml-1" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 4: SAYYANG PATTUDU */}
      {activeSection === 'sayyang' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300">
                Warisan Budaya Takbenda Nasional
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1 mb-3">
                {cultureData.sayyangPattudu.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                {cultureData.sayyangPattudu.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cultureData.sayyangPattudu.elements.map((elem, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-800">
                  <h4 className="font-extrabold text-base text-mandar-maroon-800 dark:text-mandar-maroon-300 mb-2">
                    {elem.name}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                    {elem.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: KULINER TRADISIONAL */}
      {activeSection === 'culinary' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
            <div className="max-w-3xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-mandar-gold-800 dark:text-mandar-gold-400">
                Gastronomi Warisan Pesisir
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-1 mb-3">
                Warisan Kuliner Khas Suku Mandar
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                Kekayaan kuliner Mandar sangat dipengaruhi oleh tradisi maritim dan pertanian kelapa: 
                mulai dari Jepa sebagai pengganti nasi, sup ikan kuah kuning Bau Peapi, kudapan manis Golla Kambu, 
                hingga kue lembut perahu Tetu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cultureData.culinary.map((c, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-800 hover:border-mandar-gold-400 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-extrabold text-lg text-mandar-maroon-900 dark:text-mandar-maroon-200">
                      {c.name}
                    </h4>
                    <span className="text-xl">🍲</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
