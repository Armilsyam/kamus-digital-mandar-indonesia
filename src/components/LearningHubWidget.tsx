"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  History, 
  Trash2, 
  BookMarked, 
  Volume2, 
  ArrowRight, 
  Award, 
  Search, 
  Calendar,
  CheckCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { speakText } from '@/lib/audio';
import rawDictionary from '@/data/mandar_dictionary.json';
import { DictionaryEntry } from './DictionaryCard';

const ALL_ENTRIES = rawDictionary as DictionaryEntry[];

// Culturally iconic words for Word of the Day rotation
const ICONIC_WORD_LEMMAS = [
  'sandeq',
  'saqbe',
  'kalindaqdaq',
  'jepa',
  'boyang',
  'siriq',
  'tabe',
  'sayyang',
  'passombal',
  'tomakaka',
  'pallayarang',
  'sombal',
  'baratan',
  'tetu',
  'golla'
];

interface LearningHubProps {
  onSearchWord: (word: string) => void;
  onSelectEntry: (entry: DictionaryEntry) => void;
  bookmarksCount: number;
  openBookmarks: () => void;
}

export const LearningHubWidget: React.FC<LearningHubProps> = ({
  onSearchWord,
  onSelectEntry,
  bookmarksCount,
  openBookmarks,
}) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [learningStreak, setLearningStreak] = useState<number>(3);
  const [wordsExploredCount, setWordsExploredCount] = useState<number>(18);

  // Load search history and streak from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('kadima_search_history');
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }

        const savedStreak = localStorage.getItem('kadima_streak');
        if (savedStreak) {
          setLearningStreak(parseInt(savedStreak, 10));
        } else {
          localStorage.setItem('kadima_streak', '3');
        }

        const savedExplored = localStorage.getItem('kadima_explored_count');
        if (savedExplored) {
          setWordsExploredCount(parseInt(savedExplored, 10));
        }
      } catch {}
    }
  }, []);

  // Compute Word of the Day
  const wordOfTheDay = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const lemmaTarget = ICONIC_WORD_LEMMAS[dayOfYear % ICONIC_WORD_LEMMAS.length];
    const found = ALL_ENTRIES.find(e => e.cleanLemma.toLowerCase() === lemmaTarget);
    return found || ALL_ENTRIES[42]; // Fallback
  }, []);

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('kadima_search_history');
    } catch {}
  };

  const handleRemoveHistoryItem = (term: string) => {
    const updated = searchHistory.filter(t => t !== term);
    setSearchHistory(updated);
    try {
      localStorage.setItem('kadima_search_history', JSON.stringify(updated));
    } catch {}
  };

  const handlePlayWord = () => {
    speakText(wordOfTheDay.lemma, { lang: 'mandar' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨁᨘᨑᨘ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Fitur Baru #10 • Dasbor Belajar & Riwayat Interaktif</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Pusat Belajar Pribadi & Kata Hari Ini
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Pantau konsistensi belajar bahasa Mandar Anda dengan pelacak streak harian, telaah lema pilihan hari ini (*Lema Allo Iya*), serta kelola riwayat penelusuran kosakata secara cepat dan teratur.
          </p>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Streak Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-mandar-sand-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white flex items-baseline space-x-1">
              <span>{learningStreak}</span>
              <span className="text-xs font-semibold text-stone-400">Hari Beruntun</span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
              🔥 Semangat Passombal Mandar Aktif!
            </p>
          </div>
        </div>

        {/* Explored Words Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-mandar-sand-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white flex items-baseline space-x-1">
              <span>{wordsExploredCount}</span>
              <span className="text-xs font-semibold text-stone-400">/ 4.443 Lema</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-slate-400">
              Tingkat: <strong className="text-mandar-maroon-700 dark:text-mandar-gold-400">Passombal Mula</strong>
            </p>
          </div>
        </div>

        {/* Bookmarked Words Card */}
        <div 
          onClick={openBookmarks}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-mandar-sand-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-mandar-maroon-500 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900 dark:text-white">
                {bookmarksCount}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-slate-400">
                Kosakata Tersimpan
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400" />
        </div>

      </div>

      {/* Main Grid: Word of the Day + Search History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Word of the Day (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-7 sm:p-9 shadow-xl border border-mandar-gold-400/30 overflow-hidden space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-mandar-gold-300 uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-mandar-gold-400" />
                <span>LEMA PILIHAN HARI INI (LEMA ALLO IYA)</span>
              </span>
              <span className="px-3 py-0.5 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 text-[10px] font-bold border border-mandar-gold-400/30">
                {wordOfTheDay.category}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-lontara text-mandar-gold-300 tracking-wider">
                {wordOfTheDay.lontara}
              </div>
              <div className="flex items-baseline space-x-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                  {wordOfTheDay.lemma}
                </h3>
                <span className="text-sm font-mono text-mandar-sand-200">
                  {wordOfTheDay.phonetic}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-mandar-sand-200 font-semibold">
                  {wordOfTheDay.posLabel}
                </span>
              </div>
            </div>

            {/* Definitions in ID & EN */}
            <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-2 text-xs sm:text-sm text-stone-200">
              <p>
                🇮🇩 <strong className="text-white">Arti Indonesia:</strong> {wordOfTheDay.definition}
              </p>
              {wordOfTheDay.definitionEn && (
                <p className="text-stone-300 italic">
                  🇬🇧 <strong>English:</strong> {wordOfTheDay.definitionEn}
                </p>
              )}
              {wordOfTheDay.exampleMandar && (
                <p className="text-[11px] text-mandar-gold-200/90 pt-1 border-t border-white/10">
                  💬 <em>Contoh: {wordOfTheDay.exampleMandar}</em>
                </p>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handlePlayWord}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-mandar-gold-500 hover:bg-mandar-gold-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengar Pelafalan</span>
              </button>

              <button
                onClick={() => onSelectEntry(wordOfTheDay)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Detail Lengkap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Search History (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  Riwayat Pencarian Anda
                </h3>
              </div>

              {searchHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-rose-500 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Bersihkan</span>
                </button>
              )}
            </div>

            {/* History List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {searchHistory.length > 0 ? (
                searchHistory.map((term, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800/70 hover:bg-mandar-sand-100 dark:hover:bg-slate-700/70 transition-colors group"
                  >
                    <button
                      onClick={() => onSearchWord(term)}
                      className="flex items-center space-x-2 text-xs font-semibold text-stone-800 dark:text-white text-left truncate flex-1"
                    >
                      <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-mandar-maroon-600" />
                      <span className="truncate">{term}</span>
                    </button>

                    <button
                      onClick={() => handleRemoveHistoryItem(term)}
                      className="p-1 text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                  <History className="w-8 h-8 text-stone-300 mx-auto" />
                  <p>Belum ada riwayat pencarian lema.</p>
                  <p className="text-[10px] text-stone-400">
                    Coba cari kata seperti &ldquo;sandeq&rdquo;, &ldquo;jepa&rdquo;, atau &ldquo;saqbe&rdquo; di tab Kamus.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Suggestions to explore */}
            <div className="pt-3 border-t border-mandar-sand-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-stone-400 block mb-2 uppercase">
                Jelajahi Cepat:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['sandeq', 'saqbe', 'boyang', 'siriq', 'kalindaqdaq', 'tabe'].map(word => (
                  <button
                    key={word}
                    onClick={() => onSearchWord(word)}
                    className="px-2.5 py-1 rounded-lg bg-mandar-sand-100 dark:bg-slate-800 hover:bg-mandar-maroon-100 dark:hover:bg-mandar-maroon-950 text-stone-700 dark:text-slate-300 text-xs font-medium transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
