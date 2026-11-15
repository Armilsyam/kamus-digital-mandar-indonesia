"use client";

import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  BookMarked, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Info,
  Globe2,
  Bot
} from 'lucide-react';
import { DictionaryEntry } from './DictionaryCard';
import { speakText, stopSpeaking } from '@/lib/audio';
import { analyzePhonetics } from '@/lib/phonetics';
import { dissectMorphology } from '@/lib/morphology';

interface EntryDetailModalProps {
  entry: DictionaryEntry | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (entry: DictionaryEntry) => void;
  soundEnabled: boolean;
  onGoToTab: (tab: string, param?: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  onClose,
  isBookmarked,
  onToggleBookmark,
  soundEnabled,
  onGoToTab,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [playingLang, setPlayingLang] = useState<string | null>(null);

  if (!entry) return null;

  const phonetics = analyzePhonetics(entry.lemma);
  const morphology = dissectMorphology(entry.lemma);

  const handlePlayVoice = (text: string, lang: 'mandar' | 'indonesia' | 'english') => {
    if (!soundEnabled) return;
    if (playingLang === lang) {
      stopSpeaking();
      setPlayingLang(null);
      return;
    }

    setPlayingLang(lang);
    speakText(text, {
      lang: lang,
      onEnd: () => setPlayingLang(null),
      onError: () => setPlayingLang(null)
    });
  };

  const handleCopy = () => {
    const text = `[MDR] ${entry.lemma} (${entry.lontara}) [${entry.phonetic}] - ${entry.posLabel}\n[IDN] ${entry.definition}\n[ENG] ${entry.definitionEn || '-'}\nContoh Mandar: ${entry.exampleMandar || '-'}\nSumber: Kamus Bahasa Mandar-Indonesia Edisi Revisi 2025, Balai Bahasa Sulsel (Hal. ${entry.page})`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${entry.lemma} - Kamus Digital Mandar (KADIMA-ID)`,
        text: `[MDR] ${entry.lemma} (${entry.lontara}): ${entry.definition}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-mandar-sand-300 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Strip */}
        <div className="bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-6 sm:p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30">
              {entry.posLabel}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/90">
              Kategori: {entry.category}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/30 text-mandar-sand-300">
              Hal. {entry.page}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline space-x-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {entry.lemma}
                </h2>
                <span className="text-lg font-mono text-mandar-sand-300">
                  {entry.phonetic}
                </span>
              </div>
              <p className="text-mandar-sand-200 text-sm mt-1">
                Aksara Lontara: <span className="font-lontara text-2xl text-mandar-gold-300 font-normal">{entry.lontara}</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleBookmark(entry)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Simpan ke Favorit"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-mandar-gold-400 fill-mandar-gold-400" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Bagikan"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Salin Data Entri 3 Bahasa"
              >
                {isCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* TRILINGUAL CARD 1: BAHASA INDONESIA */}
          <div className="bg-mandar-sand-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-mandar-sand-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 flex items-center space-x-1.5">
                <BookMarked className="w-4 h-4" />
                <span>[IDN] Definisi Bahasa Indonesia</span>
              </h4>
              <button
                onClick={() => handlePlayVoice(entry.definition, 'indonesia')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  playingLang === 'indonesia'
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-white dark:bg-slate-700 text-stone-700 dark:text-slate-200 hover:bg-stone-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Lafalkan Indonesia</span>
              </button>
            </div>
            <p className="text-base sm:text-lg text-stone-800 dark:text-slate-100 leading-relaxed font-serif">
              {entry.definition}
            </p>
          </div>

          {/* TRILINGUAL CARD 2: ENGLISH (BAHASA INGGRIS) */}
          <div className="bg-sky-50/50 dark:bg-sky-950/20 p-5 rounded-2xl border border-sky-200/80 dark:border-sky-800/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center space-x-1.5">
                <Globe2 className="w-4 h-4" />
                <span>[ENG] English Meaning & Gloss</span>
              </h4>
              {entry.definitionEn && (
                <button
                  onClick={() => handlePlayVoice(entry.definitionEn!, 'english')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    playingLang === 'english'
                      ? 'bg-sky-600 text-white animate-pulse'
                      : 'bg-white dark:bg-slate-700 text-stone-700 dark:text-slate-200 hover:bg-stone-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Speak English</span>
                </button>
              )}
            </div>
            <p className="text-sm sm:text-base text-stone-800 dark:text-slate-200 leading-relaxed italic">
              {entry.definitionEn || 'English translation available in next release.'}
            </p>
          </div>

          {/* TRILINGUAL CARD 3: CONTEXTUAL EXAMPLE SENTENCE IN MANDAR */}
          {entry.exampleMandar && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-mandar-sand-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-navy-700 dark:text-sky-300 flex items-center space-x-1.5">
                  <Info className="w-4 h-4" />
                  <span>[MDR] Kalimat Contoh Tuturan Asli</span>
                </h4>
                <button
                  onClick={() => handlePlayVoice(entry.exampleMandar!, 'mandar')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    playingLang === 'mandar'
                      ? 'bg-mandar-maroon-700 text-white animate-pulse'
                      : 'bg-mandar-sand-100 text-mandar-maroon-900 dark:bg-slate-700 dark:text-mandar-maroon-300 hover:bg-mandar-sand-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Lafalkan Kalimat Mandar</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-mandar-sand-50 dark:bg-slate-900 border-l-4 border-mandar-maroon-600 dark:border-mandar-maroon-500">
                <p className="text-base text-mandar-maroon-900 dark:text-mandar-maroon-200 font-medium italic mb-2">
                  &ldquo;{entry.exampleMandar}&rdquo;
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Dikutip dari tuturan otentik Kamus Bahasa Mandar-Indonesia Edisi Revisi (2025).
                </p>
              </div>
            </div>
          )}

          {/* Phonological & Allophonic Breakdown */}
          <div className="border border-mandar-sand-200 dark:border-slate-800 rounded-2xl p-5 bg-gradient-to-br from-white to-mandar-sand-50/50 dark:from-slate-900 dark:to-slate-800/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-mandar-gold-500" />
                <span>Analisis Fonologis & Pola Tekanan (Stres)</span>
              </h4>
              <button 
                onClick={() => {
                  onClose();
                  onGoToTab('fonologi', entry.lemma);
                }}
                className="text-xs font-semibold text-mandar-navy-600 dark:text-sky-400 hover:underline flex items-center"
              >
                Buka di Lab Fonologi <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700">
                <span className="text-stone-500 dark:text-slate-400 block mb-1">Pemisahan Suku Kata:</span>
                <div className="flex items-center space-x-1.5">
                  {phonetics.syllables.map((syl, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-mandar-sand-100 dark:bg-slate-700 font-mono font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300">
                      {syl}
                    </span>
                  ))}
                  <span className="text-stone-400">({phonetics.syllableCount} suku kata)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700">
                <span className="text-stone-500 dark:text-slate-400 block mb-1">Pola Aksentuasi:</span>
                <span className="font-medium text-stone-800 dark:text-slate-200">
                  {phonetics.stressPattern}
                </span>
              </div>
            </div>

            {phonetics.shifts.length > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-xs font-semibold text-mandar-gold-800 dark:text-mandar-gold-400">
                  Fenomena Realisasi Alofonik yang Aktif:
                </span>
                {phonetics.shifts.map((shift, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-mandar-gold-50 dark:bg-mandar-gold-950/40 border border-mandar-gold-200 dark:border-mandar-gold-800 text-xs text-mandar-gold-950 dark:text-mandar-gold-200">
                    <span className="font-bold">{shift.ruleName}:</span> {shift.explanation}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Morphological Anatomy */}
          <div className="border border-mandar-sand-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-mandar-navy-600 dark:text-sky-400" />
                <span>Struktur Morfologi & Bentuk Kanonik</span>
              </h4>
              <button 
                onClick={() => {
                  onClose();
                  onGoToTab('morfologi', entry.lemma);
                }}
                className="text-xs font-semibold text-mandar-navy-600 dark:text-sky-400 hover:underline flex items-center"
              >
                Buka Bedah Morfologi <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-xs mb-3">
              <span className="text-stone-500 dark:text-slate-400">Formula Pembentukan: </span>
              <span className="font-mono font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300">
                {morphology.formula}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {morphology.components.map((comp, i) => (
                <div key={i} className="flex-1 min-w-[140px] p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs">
                  <span className="font-mono font-bold text-mandar-maroon-700 dark:text-mandar-maroon-300 block mb-0.5">
                    {comp.morpheme}
                  </span>
                  <span className="text-[11px] text-stone-600 dark:text-slate-400 block">
                    {comp.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Consultant Link */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-mandar-maroon-50 to-mandar-gold-50 dark:from-slate-800 dark:to-slate-850 border border-mandar-gold-300/60 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Bot className="w-5 h-5 text-mandar-maroon-700 dark:text-mandar-gold-400" />
              <span className="text-xs font-bold text-stone-800 dark:text-white">
                Ingin tahu lebih dalam tentang kata ini?
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onGoToTab('kaka', `Tolong jelaskan secara mendalam tentang kata Mandar '${entry.lemma}'`);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-mandar-maroon-700 text-white font-bold text-xs shadow-sm hover:bg-mandar-maroon-800 flex items-center space-x-1"
            >
              <span>Tanya Kaka-AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Source Attribution Box */}
          <div className="text-[11px] text-stone-500 dark:text-slate-400 p-4 rounded-xl bg-mandar-sand-100/60 dark:bg-slate-800/40 border border-mandar-sand-200 dark:border-slate-800">
            <span className="font-bold text-stone-700 dark:text-slate-300">Rujukan Resmi: </span>
            Kamus Bahasa Mandar-Indonesia Edisi Revisi (2025). Tim Penyusun: Sandra Safitri Hanan, Abdul Muthalib, Idham, Nurhayati, Haeruddin, Jerniati, Charmilasari, Lia Pertiwi. Balai Bahasa Provinsi Sulawesi Selatan, Kementerian Pendidikan Dasar dan Menengah. Halaman {entry.page}.
          </div>

        </div>
      </div>
    </div>
  );
};
