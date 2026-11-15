"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Play, 
  Layers, 
  ArrowRight, 
  BookOpen, 
  HelpCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { analyzePhonetics, simulateNasalCompounding } from '@/lib/phonetics';
import { speakMandar } from '@/lib/audio';
import grammarData from '@/data/mandar_grammar.json';

interface PhonologyLabProps {
  initialWord?: string;
  soundEnabled: boolean;
}

export const PhonologyLab: React.FC<PhonologyLabProps> = ({
  initialWord = 'madondong',
  soundEnabled,
}) => {
  const [testWord, setTestWord] = useState(initialWord);
  const [isPlaying, setIsPlaying] = useState(false);

  // Nasal simulator state
  const [selectedPrefix, setSelectedPrefix] = useState('mang-');
  const [rootInput, setRootInput] = useState('pau');

  const phoneticAnalysis = analyzePhonetics(testWord);
  const nasalResult = simulateNasalCompounding(selectedPrefix, rootInput);

  const PRESET_ALLOPHONES = [
    { word: 'tabe', label: 'tabe → [tawe]', rule: 'Alofon /b/' },
    { word: 'madondong', label: 'madondong → [madzondzong]', rule: 'Alofon /d/' },
    { word: 'pago', label: 'pago → [pagho]', rule: 'Alofon /g/' },
    { word: 'kaja', label: 'kaja → [kaya]', rule: 'Alofon /j/' },
    { word: 'anaq', label: 'anaq → [anaʔ]', rule: 'Glotal /q/' },
    { word: 'saqbe', label: 'saqbe → [saʔbe]', rule: 'Glotal Tengah' },
    { word: 'pappasang', label: 'pappasang → [papːasaŋ]', rule: 'Geminat pp' },
    { word: 'maccawa', label: 'maccawa → [macːawa]', rule: 'Geminat cc' },
  ];

  const PRESET_NASAL_ROOTS = [
    { root: 'pau', meaning: 'kata / bicara', expected: 'mappau' },
    { root: 'tunu', meaning: 'bakar', expected: 'mattunu' },
    { root: 'cawa', meaning: 'tertawa', expected: 'maccawa' },
    { root: 'kande', meaning: 'makan', expected: 'makkande' },
    { root: 'sambayang', meaning: 'sembahyang', expected: 'massambayang' },
    { root: 'boyang', meaning: 'rumah', expected: 'mamboyang' },
    { root: 'dundu', meaning: 'minum', expected: 'mandundu' },
    { root: 'jama', meaning: 'kerja', expected: 'manjama' },
    { root: 'giling', meaning: 'giling', expected: 'manggiling' },
    { root: 'loppa', meaning: 'lompat', expected: 'malloppa' },
    { root: 'rammang', meaning: 'teduh', expected: 'marrammang' },
    { root: 'wawa', meaning: 'bawa', expected: 'mawwawa' },
    { root: 'yau', meaning: 'saya', expected: 'mayyau' },
  ];

  const handlePlayWord = (word: string) => {
    if (!soundEnabled) return;
    setIsPlaying(true);
    speakMandar(word, () => setIsPlaying(false));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laboratorium Linguistik Digital Mandar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Eksplorasi Fonologi, Alofon & Asimilasi Morfofonemik
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Bahasa Mandar memiliki sistem fonologi yang sangat unik: 24 fonem (5 vokal, 19 konsonan), 
            perubahan bunyi alofonik (/b/ → [w], /d/ → [dz], /g/ → [gh], /j/ → [y]) saat diapit vokal, 
            konsonan letup glotal /q/ (hamzah), serta asimilasi nasal total pada gugus konsonan kembar (geminat).
          </p>
        </div>
      </div>

      {/* Simulator 1: Live Allophone & Stress Tester */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-mandar-maroon-900 dark:text-mandar-maroon-200 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-mandar-gold-500" />
              <span>Simulator Alofon & Analisis Fonetik Otomatis</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Ketikkan kata Mandar apapun untuk menguji transformasi fonem ke realisasi bunyi alofon aslinya.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-stone-400 mr-1">Contoh Cepat:</span>
            {PRESET_ALLOPHONES.map((preset) => (
              <button
                key={preset.word}
                onClick={() => setTestWord(preset.word)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  testWord === preset.word
                    ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-700'
                    : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-mandar-maroon-400'
                }`}
              >
                {preset.word}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={testWord}
              onChange={(e) => setTestWord(e.target.value)}
              placeholder="Ketik kata Mandar (misal: tabe, madondong, pago, anaq, saqbe)..."
              className="w-full px-5 py-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-sand-200 dark:border-slate-700 focus:border-mandar-maroon-600 dark:focus:border-mandar-maroon-500 outline-none text-lg font-medium text-stone-800 dark:text-white"
            />
          </div>
          <button
            onClick={() => handlePlayWord(testWord)}
            className={`px-5 py-4 rounded-2xl text-white font-semibold flex items-center space-x-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-mandar-gold-500 text-slate-900 animate-pulse'
                : 'bg-mandar-maroon-700 hover:bg-mandar-maroon-800'
            }`}
            title="Dengarkan Pengucapan"
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">Dengarkan</span>
          </button>
        </div>

        {/* Output Diagnostic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-stone-500 dark:text-slate-400 tracking-wider">
              Transkripsi Fonetik (IPA)
            </span>
            <div className="my-2">
              <span className="text-3xl font-mono font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300">
                {phoneticAnalysis.ipa}
              </span>
            </div>
            <span className="text-xs text-stone-500">
              Ortografi asli: <span className="font-semibold text-stone-800 dark:text-slate-200">{testWord}</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-stone-500 dark:text-slate-400 tracking-wider">
              Segmentasi Suku Kata
            </span>
            <div className="my-2 flex flex-wrap gap-1.5 items-center">
              {phoneticAnalysis.syllables.map((syl, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 font-mono font-bold text-lg text-mandar-navy-800 dark:text-sky-300 shadow-sm border border-stone-200 dark:border-slate-600">
                  {syl}
                </span>
              ))}
            </div>
            <span className="text-xs text-stone-500">
              Total: {phoneticAnalysis.syllableCount} suku kata
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-stone-500 dark:text-slate-400 tracking-wider">
              Pola Jatuhnya Tekanan (Stres)
            </span>
            <div className="my-2">
              <span className="text-sm font-semibold text-stone-800 dark:text-slate-200 line-clamp-2">
                {phoneticAnalysis.stressPattern}
              </span>
            </div>
            <span className="text-xs text-stone-400">
              Kaidah Bab I.5 (Halaman 20-22)
            </span>
          </div>
        </div>

        {/* Allophone Details Feed */}
        {phoneticAnalysis.shifts.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kaidah Alofonik Yang Terdeteksi Aktif:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {phoneticAnalysis.shifts.map((shift, i) => (
                <div key={i} className="p-4 rounded-2xl bg-mandar-gold-50 dark:bg-mandar-gold-950/40 border border-mandar-gold-200 dark:border-mandar-gold-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-mandar-gold-950 dark:text-mandar-gold-200 text-sm">
                      {shift.ruleName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-mandar-gold-200 dark:bg-mandar-gold-900 font-mono font-bold text-mandar-gold-900 dark:text-mandar-gold-200">
                      {shift.realizedChar}
                    </span>
                  </div>
                  <p className="text-mandar-gold-900/80 dark:text-mandar-gold-300/80 leading-relaxed">
                    {shift.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800 text-xs text-stone-500">
            Kata ini tidak memiliki fonem /b/, /d/, /g/, /j/ di posisi intervokalik maupun letup glotal /q/. Diucapkan secara reguler tanpa alofon.
          </div>
        )}
      </div>

      {/* Simulator 2: Nasal Compounding & Morphophonemics (Tabel III) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-navy-100 dark:bg-mandar-navy-950 text-mandar-navy-800 dark:text-sky-300 border border-mandar-navy-200 dark:border-mandar-navy-800 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Kaidah Tabel III: Morfofonemik Gugus Nasal</span>
          </div>
          <h3 className="text-xl font-bold text-mandar-navy-900 dark:text-slate-100">
            Kalkulator Asimilasi Morfofonemik Mandar
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Lihat bagaimana awalan berakhiran nasal (seperti <em>mang-</em>) melebur dengan fonem awal kata dasar. 
            Contoh: <em>mang-</em> + <em>pau</em> bukan &quot;*mangpau&quot;, melainkan terjadi asimilasi total menjadi <strong>mappau</strong>!
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Pilih Prefiks Nasal
            </label>
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm font-semibold text-stone-800 dark:text-white"
            >
              <option value="mang-">mang- (aktif intransitif/transitif)</option>
              <option value="pang-">pang- (pembentuk nomina)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Kata Dasar (Root Word)
            </label>
            <input
              type="text"
              value={rootInput}
              onChange={(e) => setRootInput(e.target.value)}
              placeholder="Contoh: pau, tunu, cawa, boyang..."
              className="w-full px-4 py-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm font-semibold text-stone-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Pilih Preset Kata Dasar
            </label>
            <div className="flex flex-wrap gap-1">
              {PRESET_NASAL_ROOTS.slice(0, 6).map((item) => (
                <button
                  key={item.root}
                  onClick={() => setRootInput(item.root)}
                  className="px-2 py-1 rounded bg-stone-100 dark:bg-slate-800 text-[11px] font-medium text-stone-700 dark:text-slate-300 hover:bg-mandar-maroon-100 dark:hover:bg-slate-700"
                >
                  {item.root}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Morphophonemic Equation Display */}
        <div className="bg-gradient-to-r from-mandar-navy-900 via-mandar-navy-800 to-mandar-maroon-900 text-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xl sm:text-2xl font-bold">
              <span className="text-mandar-sand-300">{selectedPrefix}</span>
              <span className="text-mandar-gold-400">+</span>
              <span className="text-white">{rootInput || '...'}</span>
              <ArrowRight className="w-5 h-5 text-mandar-gold-400" />
              <span className="text-2xl sm:text-3xl text-mandar-gold-300 font-extrabold underline decoration-mandar-gold-500/50">
                {nasalResult.combinedWord}
              </span>
            </div>

            <button
              onClick={() => handlePlayWord(nasalResult.combinedWord)}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Hasil</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-mandar-sand-200">
            <div>
              <span className="font-bold text-mandar-gold-300">Hukum Kaidah: </span>
              {nasalResult.ruleApplied} (Gugus hasil: <strong>/{nasalResult.cluster}/</strong>)
            </div>
            <div className="text-mandar-sand-300/80 mt-1 sm:mt-0">
              Sumber: Kamus Mandar 2025 Halaman 19
            </div>
          </div>
        </div>

        {/* Complete Table III Matrix */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-mandar-maroon-600 dark:text-mandar-maroon-400" />
            <span>Matriks Lengkap Gugus Asimilasi Nasal (Tabel III Kemendikdasmen 2025)</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {grammarData.phonology.morphophonemics.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  const root = item.example.split('+')[1].split('=')[0].trim();
                  setRootInput(root);
                }}
                className="p-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800/50 border border-mandar-sand-200 dark:border-slate-800 hover:border-mandar-maroon-400 dark:hover:border-mandar-maroon-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300">
                    -ng + /{item.rootInitial}/
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-mandar-gold-100 dark:bg-mandar-gold-950 text-mandar-gold-800 dark:text-mandar-gold-300 font-bold">
                    -{item.resultCluster}-
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-slate-400 truncate">
                  {item.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 24 Phonemes Master Reference Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
        <h3 className="text-xl font-bold text-mandar-maroon-900 dark:text-mandar-maroon-200 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-mandar-gold-500" />
          <span>Inventaris 24 Fonem Bahasa Mandar</span>
        </h3>
        
        {/* Vowels */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-700 dark:text-mandar-maroon-400 mb-3">
            5 Fonem Vokal (/a/, /i/, /u/, /e/, /o/)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {grammarData.phonology.vowels.map((v) => (
              <div key={v.char} className="p-4 rounded-2xl bg-mandar-maroon-50 dark:bg-slate-800/60 border border-mandar-maroon-100 dark:border-slate-700 text-center">
                <span className="text-3xl font-extrabold text-mandar-maroon-900 dark:text-mandar-maroon-300 block mb-1">
                  /{v.char}/
                </span>
                <span className="text-xs font-mono text-stone-500 dark:text-slate-400 block mb-1">
                  IPA: {v.ipa}
                </span>
                <span className="text-[11px] text-stone-600 dark:text-slate-400 block">
                  {v.name}
                </span>
                <span className="text-[10px] text-mandar-maroon-800 dark:text-mandar-maroon-400 italic block mt-1">
                  {v.example}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Consonants */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-navy-700 dark:text-sky-400 mb-3">
            19 Fonem Konsonan
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {grammarData.phonology.consonants.map((c) => (
              <div key={c.char} className="p-3.5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/40 border border-mandar-sand-200 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-bold text-stone-800 dark:text-white">
                    /{c.char}/
                  </span>
                  <span className="font-mono text-stone-500 dark:text-slate-400">
                    {c.ipa}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-slate-400 line-clamp-2 mb-1">
                  {c.type}
                </p>
                <span className="text-[11px] font-medium text-mandar-maroon-800 dark:text-mandar-maroon-300 italic block">
                  {c.example}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
