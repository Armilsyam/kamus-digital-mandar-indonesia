"use client";

import React, { useState } from 'react';
import { 
  Scroll, 
  Copy, 
  Check, 
  ArrowLeftRight, 
  Sparkles, 
  Keyboard, 
  Download,
  Info
} from 'lucide-react';
import { 
  transliterateLatinToLontara, 
  transliterateLontaraToLatin, 
  LONTARA_CONSONANTS, 
  VOWEL_DIACRITICS 
} from '@/lib/lontara';

export const LontaraConverter: React.FC = () => {
  const [inputText, setInputText] = useState('Perahu Sandeq Mandar');
  const [mode, setMode] = useState<'latinToLontara' | 'lontaraToLatin'>('latinToLontara');
  const [isCopied, setIsCopied] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

  const { lontara, tokens } = transliterateLatinToLontara(mode === 'latinToLontara' ? inputText : '');
  const reverseLatin = mode === 'lontaraToLatin' ? transliterateLontaraToLatin(inputText) : '';

  const displayOutput = mode === 'latinToLontara' ? lontara : reverseLatin;

  const PRESETS = [
    'Perahu Sandeq Mandar',
    'Lipaq Saqbe Balanipa',
    'Kalindaqdaq Masiriq',
    'Mellamun Bomboq Mappasombo Litaq',
    'Passombal Sasiq Mandar',
    'Sayyang Pattudu'
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(displayOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const insertChar = (char: string) => {
    setInputText(prev => prev + char);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <Scroll className="w-3.5 h-3.5" />
            <span>Digitalisasi Aksara Daerah Nusantara</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Transliterasi Digital Aksara Lontara Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Mesin konversi dua arah berbasis standar Unicode U+1A00–U+1A1F. Mendukung penguraian 
            <em>ina surat</em> (induk huruf) dan <em>anaq surat</em> (sandhangan vokal diakritik) 
            sesuai naskah leksikografi resmi Balai Bahasa Sulawesi Selatan.
          </p>
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-lg">
        
        {/* Direction Switch & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setMode(mode === 'latinToLontara' ? 'lontaraToLatin' : 'latinToLontara');
                setInputText(displayOutput || 'mandar');
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-mandar-maroon-50 text-mandar-maroon-800 dark:bg-slate-800 dark:text-mandar-maroon-300 hover:bg-mandar-maroon-100 transition-all font-semibold text-xs border border-mandar-maroon-200 dark:border-slate-700"
            >
              <ArrowLeftRight className="w-4 h-4 text-mandar-maroon-600 dark:text-mandar-maroon-400" />
              <span>
                {mode === 'latinToLontara' ? 'Latin → Aksara Lontara' : 'Aksara Lontara → Latin'}
              </span>
            </button>

            <button
              onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                showVirtualKeyboard
                  ? 'bg-mandar-gold-500 text-slate-900 border-mandar-gold-600'
                  : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Keyboard Lontara</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-stone-400 mr-1">Frasa Populer:</span>
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setMode('latinToLontara');
                  setInputText(p);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-mandar-sand-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400 truncate max-w-[140px]"
                title={p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Output Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Input Area */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                {mode === 'latinToLontara' ? 'Teks Latin (Bahasa Mandar)' : 'Teks Aksara Lontara'}
              </label>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Bersihkan
                </button>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'latinToLontara' ? 'Ketik teks bahasa Mandar di sini...' : 'Tempel atau ketik aksara Lontara di sini...'}
              rows={4}
              className={`w-full p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-sand-200 dark:border-slate-700 focus:border-mandar-maroon-600 outline-none text-lg resize-none text-stone-800 dark:text-white ${
                mode === 'lontaraToLatin' ? 'font-lontara text-2xl' : ''
              }`}
            />
          </div>

          {/* Output Area */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-mandar-gold-500" />
                <span>Hasil Transliterasi Otomatis</span>
              </label>
              <button
                onClick={handleCopy}
                disabled={!displayOutput}
                className="flex items-center space-x-1 text-xs font-semibold text-mandar-navy-600 dark:text-sky-400 hover:underline disabled:opacity-50"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Tersalin!' : 'Salin Hasil'}</span>
              </button>
            </div>
            <div className="relative flex-1 p-5 rounded-2xl bg-gradient-to-br from-mandar-sand-50 to-white dark:from-slate-800/80 dark:to-slate-900 border-2 border-mandar-gold-300/80 dark:border-mandar-gold-700/50 flex flex-col justify-between min-h-[120px]">
              <div className={`${mode === 'latinToLontara' ? 'font-lontara text-3xl sm:text-4xl text-mandar-maroon-900 dark:text-mandar-gold-300 leading-relaxed' : 'text-xl font-bold text-stone-800 dark:text-white'}`}>
                {displayOutput || (
                  <span className="text-stone-400 dark:text-slate-600 text-sm font-sans font-normal italic">
                    Hasil transliterasi akan muncul di sini secara instan...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Keyboard (If toggled) */}
        {showVirtualKeyboard && (
          <div className="p-5 rounded-2xl bg-mandar-sand-100/70 dark:bg-slate-800/80 border border-mandar-sand-200 dark:border-slate-700 mb-8 animate-in fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
              <Keyboard className="w-4 h-4 text-mandar-gold-500" />
              <span>Papan Ketik Aksara Lontara Interaktif</span>
            </h4>

            {/* Consonants */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-slate-400 block mb-2">
                Ina Surat (Konsonan Dasar / Induk Huruf):
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                {Object.entries(LONTARA_CONSONANTS).map(([key, obj]) => (
                  <button
                    key={key}
                    onClick={() => insertChar(obj.lontara)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-mandar-gold-100 dark:hover:bg-mandar-maroon-900 text-stone-900 dark:text-white font-lontara text-2xl flex flex-col items-center justify-center shadow-sm border border-stone-200 dark:border-slate-600 transition-all hover:scale-105"
                  >
                    <span>{obj.lontara}</span>
                    <span className="text-[9px] font-sans text-stone-400 mt-0.5">{obj.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vowel Diacritics */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 dark:text-slate-400 block mb-2">
                Anaq Surat (Diakritik / Sandhangan Vokal):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(VOWEL_DIACRITICS).map(([key, obj]) => (
                  <button
                    key={key}
                    onClick={() => insertChar(obj.code)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-mandar-gold-100 dark:hover:bg-mandar-maroon-900 text-left border border-stone-200 dark:border-slate-600 text-xs transition-all"
                  >
                    <span className="font-lontara text-xl text-mandar-maroon-700 dark:text-mandar-maroon-300 font-bold block">
                      ᨀ{obj.code} <span className="font-sans text-xs text-stone-500">(/k{key}/)</span>
                    </span>
                    <span className="text-[10px] text-stone-500 block truncate">{obj.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Anatomical Syllable Breakdown (When in Latin -> Lontara mode) */}
        {mode === 'latinToLontara' && tokens.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 mb-3 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-mandar-maroon-600 dark:text-mandar-maroon-400" />
              <span>Bedah Morfografis Suku Kata per Suku Kata</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {tokens.map((token, i) => (
                <div key={i} className="p-3 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-center">
                  <div className="font-lontara text-3xl text-mandar-gold-600 dark:text-mandar-gold-400 mb-1">
                    {token.lontara}
                  </div>
                  <div className="font-mono font-bold text-sm text-mandar-maroon-800 dark:text-mandar-maroon-300">
                    &ldquo;{token.syllable}&rdquo;
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {token.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
