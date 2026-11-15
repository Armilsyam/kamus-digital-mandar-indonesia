"use client";

import React, { useState } from 'react';
import { 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  Globe2,
  Languages
} from 'lucide-react';
import { speakText } from '@/lib/audio';

export interface DictionaryEntry {
  id: string;
  lemma: string;
  cleanLemma: string;
  pos: string;
  posLabel: string;
  posEn?: string;
  definition: string;
  definitionEn?: string;
  exampleMandar: string | null;
  exampleEn?: string | null;
  phonetic: string;
  lontara: string;
  category: string;
  rootWord: string;
  page: number;
}

interface DictionaryCardProps {
  entry: DictionaryEntry;
  isBookmarked: boolean;
  onToggleBookmark: (entry: DictionaryEntry) => void;
  onSelectEntry: (entry: DictionaryEntry) => void;
  onFilterRoot: (root: string) => void;
  soundEnabled: boolean;
}

const POS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'n': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  'v': { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-800 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
  'a': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  'adv': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  'p': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'num': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-800 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  'pron': { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-800 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  'ukp': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  'pb': { bg: 'bg-yellow-50 dark:bg-yellow-950/40', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
  'ki': { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', text: 'text-fuchsia-800 dark:text-fuchsia-300', border: 'border-fuchsia-200 dark:border-fuchsia-800' },
};

export const DictionaryCard: React.FC<DictionaryCardProps> = ({
  entry,
  isBookmarked,
  onToggleBookmark,
  onSelectEntry,
  onFilterRoot,
  soundEnabled,
}) => {
  const [isPlayingMandar, setIsPlayingMandar] = useState(false);
  const [isPlayingIndo, setIsPlayingIndo] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const posStyle = POS_COLORS[entry.pos] || {
    bg: 'bg-stone-50 dark:bg-stone-800',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-200 dark:border-stone-700'
  };

  const handlePlayMandar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!soundEnabled) return;
    setIsPlayingMandar(true);
    // Lafalkan lema dan jika ada kalimat contoh, lafalkan kalimat panjangnya!
    const textToSpeak = entry.exampleMandar ? `${entry.lemma}. ${entry.exampleMandar}` : entry.lemma;
    speakText(textToSpeak, { 
      lang: 'mandar', 
      onEnd: () => setIsPlayingMandar(false),
      onError: () => setIsPlayingMandar(false)
    });
  };

  const handlePlayIndonesian = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!soundEnabled) return;
    setIsPlayingIndo(true);
    speakText(entry.definition, { 
      lang: 'indonesia', 
      onEnd: () => setIsPlayingIndo(false),
      onError: () => setIsPlayingIndo(false)
    });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `[MDR] ${entry.lemma} (${entry.lontara}) [${entry.phonetic}]\n[IDN] ${entry.posLabel}: ${entry.definition}\n[ENG] ${entry.posEn || entry.pos}: ${entry.definitionEn || '-'}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const hasAllophone = entry.phonetic.includes('ð') || entry.phonetic.includes('ɣ') || entry.phonetic.includes('w') || entry.phonetic.includes('ʔ');

  return (
    <div 
      onClick={() => onSelectEntry(entry)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-mandar-sand-200 dark:border-slate-800 hover:border-mandar-maroon-400 dark:hover:border-mandar-maroon-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
              {entry.posLabel}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400">
              {entry.category}
            </span>
            {hasAllophone && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-mandar-gold-50 dark:bg-mandar-gold-950/60 text-mandar-gold-800 dark:text-mandar-gold-300 border border-mandar-gold-200 dark:border-mandar-gold-800 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-mandar-gold-500" />
                <span>Alofon</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(entry);
              }}
              className="p-1.5 text-stone-400 hover:text-mandar-maroon-600 dark:hover:text-mandar-maroon-400 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors"
              title={isBookmarked ? "Hapus dari Tersimpan" : "Simpan Kata"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-mandar-maroon-600 dark:text-mandar-maroon-400 fill-mandar-maroon-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors"
              title="Salin Entri 3 Bahasa"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 1. BAHASA MANDAR (Lemma, Lontara & Fonetik) */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline space-x-2.5">
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-mandar-maroon-100 text-mandar-maroon-800 dark:bg-mandar-maroon-950 dark:text-mandar-maroon-300 font-mono">
              MDR
            </span>
            <h3 className="text-xl font-bold tracking-tight text-mandar-maroon-900 dark:text-mandar-maroon-200 group-hover:text-mandar-maroon-700 dark:group-hover:text-mandar-maroon-300 transition-colors">
              {entry.lemma}
            </h3>
            <span className="text-xs font-mono text-stone-500 dark:text-slate-400">
              {entry.phonetic}
            </span>
          </div>

          {/* Lontara Script Display */}
          <span className="font-lontara text-lg text-mandar-gold-600 dark:text-mandar-gold-400 select-none">
            {entry.lontara}
          </span>
        </div>

        {/* 2. BAHASA INDONESIA (Definisi Lengkap) */}
        <div className="mb-2.5">
          <div className="flex items-start space-x-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono shrink-0 mt-0.5">
              IDN
            </span>
            <p className="text-sm text-stone-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {entry.definition}
            </p>
          </div>
        </div>

        {/* 3. ENGLISH (Trilingual Gloss / Meaning) */}
        {entry.definitionEn && (
          <div className="mb-3">
            <div className="flex items-start space-x-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-mono shrink-0 mt-0.5">
                ENG
              </span>
              <p className="text-xs text-stone-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                {entry.definitionEn}
              </p>
            </div>
          </div>
        )}

        {/* Example Sentence Preview */}
        {entry.exampleMandar && (
          <div className="bg-mandar-sand-50 dark:bg-slate-800/50 rounded-xl p-3 border border-mandar-sand-200/60 dark:border-slate-800 text-xs space-y-1 mb-3">
            <div className="font-medium text-mandar-maroon-800 dark:text-mandar-maroon-300 italic flex items-center justify-between">
              <span>&ldquo;{entry.exampleMandar}&rdquo;</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Root Word, Page Reference & Multi-Functional Voice Buttons */}
      <div className="pt-3 border-t border-mandar-sand-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          {entry.rootWord && entry.rootWord !== entry.cleanLemma && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterRoot(entry.rootWord);
              }}
              className="text-[11px] font-medium text-mandar-navy-600 dark:text-sky-400 hover:underline"
              title="Cari kata turunan dari kata dasar ini"
            >
              Dasar: <span className="font-semibold">{entry.rootWord}</span>
            </button>
          )}
          <span className="text-[10px] text-stone-400">Hal. {entry.page}</span>
        </div>

        {/* Audio Action Buttons: Mandar & Indonesia */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePlayMandar}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              isPlayingMandar
                ? 'bg-mandar-maroon-700 text-white animate-pulse'
                : 'bg-mandar-sand-100 text-mandar-maroon-900 hover:bg-mandar-sand-200 dark:bg-slate-800 dark:text-mandar-maroon-300'
            }`}
            title="Lafalkan Suara Mandar (Kalimat Penuh)"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Mdr</span>
          </button>

          <button
            onClick={handlePlayIndonesian}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              isPlayingIndo
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-slate-800 dark:text-stone-300'
            }`}
            title="Lafalkan Suara Bahasa Indonesia"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Idn</span>
          </button>

          <span className="text-stone-300 dark:text-slate-600">|</span>

          <span className="text-[11px] text-mandar-maroon-700 dark:text-mandar-maroon-400 flex items-center font-medium group-hover:translate-x-0.5 transition-transform">
            Rincian <ExternalLink className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
