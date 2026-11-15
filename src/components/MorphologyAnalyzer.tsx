"use client";

import React, { useState } from 'react';
import { 
  Binary, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { dissectMorphology } from '@/lib/morphology';
import grammarData from '@/data/mandar_grammar.json';

interface MorphologyAnalyzerProps {
  initialWord?: string;
}

export const MorphologyAnalyzer: React.FC<MorphologyAnalyzerProps> = ({
  initialWord = 'napeqamala-malai',
}) => {
  const [inputWord, setInputWord] = useState(initialWord);

  const analysis = dissectMorphology(inputWord);

  const PRESETS = [
    { word: 'napeqamala-malai', label: 'napeqamala-malai (ia mengusahakannya)' },
    { word: 'siasangiq', label: 'siasangiq (bertangis-tangisan)' },
    { word: 'kaala-ala', label: 'kaala-ala (panjang tangan)' },
    { word: 'katimbe-timbe', label: 'katimbe-timbe (suka melempar)' },
    { word: 'ameloang', label: 'ameloang (kemauan)' },
    { word: 'amongeang', label: 'amongeang (penyakit)' },
    { word: 'titedo', label: 'titedo (tersandung)' },
    { word: 'tibangngang', label: 'tibangngang (terheran-heran)' },
    { word: 'sitimbe', label: 'sitimbe (saling lempar)' },
    { word: 'ummorong', label: 'ummorong (berenang)' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <Binary className="w-3.5 h-3.5" />
            <span>Rekayasa Komputasi Linguistik Morfologi Mandar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Mesin Bedah Morfologi & Struktur Afiksasi Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Menganalisis dekomposisi kata kompleks ke dalam lema kanonik (kata dasar), 
            prefiks (awalan), infiks (sisipan -um-, -al-, -ar-), sufiks (-ang, -i), serta klitik pronomina 
            berdasarkan kaidah tata bahasa resmi Kamus Mandar-Indonesia Balai Bahasa Sulawesi Selatan.
          </p>
        </div>
      </div>

      {/* Main Analyzer Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-lg">
        
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-xs text-stone-400 mr-2">Contoh Kata Kompleks:</span>
          {PRESETS.map((p) => (
            <button
              key={p.word}
              onClick={() => setInputWord(p.word)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                inputWord === p.word
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-700 font-semibold'
                  : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              {p.word}
            </button>
          ))}
        </div>

        {/* Word Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
            Ketik Kata Kompleks yang Ingin Dibedah:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Ketik kata bentukan Mandar..."
              className="flex-1 px-5 py-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-sand-200 dark:border-slate-700 focus:border-mandar-maroon-600 outline-none text-xl font-bold text-mandar-maroon-900 dark:text-white"
            />
          </div>
        </div>

        {/* Visual Morphemic Diagram Display */}
        <div className="bg-gradient-to-r from-mandar-sand-50 to-white dark:from-slate-800/80 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-mandar-maroon-200/60 dark:border-mandar-maroon-800/50 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-mandar-gold-500" />
            <span>Diagram Alir Dekomposisi Morfem</span>
          </h4>

          {/* Morpheme Blocks Container */}
          <div className="flex flex-wrap items-center gap-3 my-4">
            {analysis.components.map((comp, idx) => {
              const isRoot = comp.type === 'root';
              return (
                <React.Fragment key={idx}>
                  <div className={`p-4 rounded-2xl border transition-all text-center min-w-[130px] flex-1 ${
                    isRoot
                      ? 'bg-gradient-to-br from-mandar-maroon-800 to-mandar-maroon-900 text-white border-mandar-maroon-900 shadow-lg shadow-mandar-maroon-900/20'
                      : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 border-mandar-sand-300 dark:border-slate-700 shadow-sm'
                  }`}>
                    <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                      isRoot ? 'text-mandar-gold-300' : 'text-stone-400 dark:text-slate-400'
                    }`}>
                      {comp.type}
                    </span>
                    <span className="text-2xl font-mono font-extrabold block my-0.5">
                      {comp.morpheme}
                    </span>
                    <span className={`text-[11px] block mt-1 line-clamp-1 ${
                      isRoot ? 'text-mandar-sand-200' : 'text-stone-500 dark:text-slate-400'
                    }`}>
                      {comp.name}
                    </span>
                  </div>
                  {idx < analysis.components.length - 1 && (
                    <span className="text-xl font-bold text-mandar-gold-500 select-none">
                      +
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-mandar-sand-200 dark:border-slate-800 text-sm text-stone-700 dark:text-slate-300">
            <p className="font-medium">
              <span className="font-bold text-mandar-maroon-800 dark:text-mandar-maroon-400">Deskripsi Linguistik: </span>
              {analysis.description}
            </p>
          </div>
        </div>

        {/* Detailed Morpheme Breakdown List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400 mb-2">
            Rincian Fungsi Semantis Unsur Morfem:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.components.map((comp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-mandar-sand-50/60 dark:bg-slate-800/40 border border-mandar-sand-200 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300 text-sm">
                    {comp.morpheme}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-mandar-gold-100 dark:bg-mandar-gold-950 text-mandar-gold-800 dark:text-mandar-gold-300 font-semibold text-[10px]">
                    {comp.type}
                  </span>
                </div>
                <div className="font-semibold text-stone-800 dark:text-slate-200 mb-1">
                  {comp.name}
                </div>
                <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
                  {comp.functionDesc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Pronomina Persona Seri I, II, III (Tabel IV) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-lg">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-navy-100 dark:bg-mandar-navy-950 text-mandar-navy-800 dark:text-sky-300 border border-mandar-navy-200 dark:border-mandar-navy-800 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kaidah Tabel IV: Sistem Pronomina Tiga Seri</span>
          </div>
          <h3 className="text-xl font-bold text-mandar-navy-900 dark:text-slate-100">
            Sistem Kata Ganti Orang (Pronomina Persona)
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Bahasa Mandar membedakan tiga seri pronomina persona: <strong>Seri I</strong> (bentuk bebas untuk fokus subjek), 
            <strong>Seri II</strong> (proklitik & genitif pemilik), dan <strong>Seri III</strong> (enklitik objek penderita atau inversi pasif).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-mandar-maroon-700 bg-mandar-maroon-50/50 dark:bg-slate-800">
                <th className="p-3 font-bold text-mandar-maroon-900 dark:text-mandar-maroon-300">Persona & Kategori</th>
                <th className="p-3 font-bold text-mandar-maroon-900 dark:text-mandar-maroon-300">Seri I (Bentuk Bebas)</th>
                <th className="p-3 font-bold text-mandar-maroon-900 dark:text-mandar-maroon-300">Seri II (Pelaku & Pemilik)</th>
                <th className="p-3 font-bold text-mandar-maroon-900 dark:text-mandar-maroon-300">Seri III (Objek / Inversi)</th>
                <th className="p-3 font-bold text-mandar-maroon-900 dark:text-mandar-maroon-300">Contoh Penggunaan Nyata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mandar-sand-200 dark:divide-slate-800">
              {grammarData.pronouns.map((p, idx) => (
                <tr key={idx} className="hover:bg-mandar-sand-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-stone-800 dark:text-slate-200">{p.person}</td>
                  <td className="p-3 font-mono font-bold text-mandar-maroon-700 dark:text-mandar-maroon-300">{p.seri1}</td>
                  <td className="p-3 font-mono font-bold text-mandar-gold-600 dark:text-mandar-gold-400">{p.seri2}</td>
                  <td className="p-3 font-mono font-bold text-sky-700 dark:text-sky-300">{p.seri3}</td>
                  <td className="p-3 text-stone-600 dark:text-slate-400 italic">{p.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
