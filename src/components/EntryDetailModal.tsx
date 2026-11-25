"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  Bot,
  Brain,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  Lightbulb,
  Zap
} from 'lucide-react';
import { DictionaryEntry } from './DictionaryCard';
import { speakText, stopSpeaking } from '@/lib/audio';
import { analyzePhonetics } from '@/lib/phonetics';
import { dissectMorphology } from '@/lib/morphology';
import { 
  recordWordInteraction, 
  getWordMastery, 
  WordMasteryRecord, 
  evaluateFreeTextComprehension, 
  FreeTextEvaluationResult 
} from '@/lib/learningTracker';

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

  // Cognitive Interactive States
  const [wordMastery, setWordMastery] = useState<WordMasteryRecord | null>(null);
  const [activeTestMode, setActiveTestMode] = useState<'quiz' | 'explain'>('quiz');
  
  // Quick Micro-Quiz State
  const [quizAnswerState, setQuizAnswerState] = useState<{
    selectedIndex: number | null;
    isSubmitted: boolean;
    isCorrect: boolean;
  }>({ selectedIndex: null, isSubmitted: false, isCorrect: false });

  // Free-Text Explanation State
  const [userExplanation, setUserExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<FreeTextEvaluationResult | null>(null);

  useEffect(() => {
    if (entry) {
      // Record view in learning tracker
      const updated = recordWordInteraction(entry.cleanLemma, 'view', entry.category, entry.definition);
      setWordMastery(updated);
      setQuizAnswerState({ selectedIndex: null, isSubmitted: false, isCorrect: false });
      setUserExplanation('');
      setEvalResult(null);
    }
  }, [entry]);

  // Generate 3 plausible options for quick micro-quiz
  const microQuizOptions = useMemo(() => {
    if (!entry) return [];
    const correct = entry.definition;
    const plausible = [
      correct,
      `Bentuk ungkapan kesantunan masyarakat pesisir Mandar yang berkaitan dengan ${entry.category.toLowerCase()}`,
      `Nama perlengkapan atau perkakas bahari tradisional yang digunakan dalam kehidupan sehari-hari`
    ];
    // Deterministic shuffle based on word length
    return entry.lemma.length % 2 === 0 ? plausible : [plausible[1], correct, plausible[2]];
  }, [entry]);

  const correctOptionIndex = useMemo(() => {
    if (!entry) return 0;
    return microQuizOptions.indexOf(entry.definition);
  }, [entry, microQuizOptions]);

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
    if (lang === 'mandar') {
      const rec = recordWordInteraction(entry.cleanLemma, 'listen', entry.category, entry.definition);
      setWordMastery(rec);
    }

    speakText(text, {
      lang: lang,
      onEnd: () => setPlayingLang(null),
      onError: () => setPlayingLang(null)
    });
  };

  const handleQuizAnswer = (index: number) => {
    if (quizAnswerState.isSubmitted) return;
    const isCorrect = index === correctOptionIndex;
    setQuizAnswerState({
      selectedIndex: index,
      isSubmitted: true,
      isCorrect
    });

    const updated = recordWordInteraction(
      entry.cleanLemma,
      isCorrect ? 'quiz_correct' : 'quiz_wrong',
      entry.category,
      entry.definition
    );
    setWordMastery(updated);

    if (soundEnabled) {
      speakText(isCorrect ? "Kurru Sumangaq! Jawabanmu tepat sekali." : "Jawabanmu belum tepat, perhatikan kembali definisinya.", {
        lang: 'indonesia',
        gender: 'female',
        voiceProfile: 'kaka'
      });
    }
  };

  const handleEvaluateFreeText = () => {
    if (!userExplanation.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      const res = evaluateFreeTextComprehension(entry.lemma, userExplanation);
      setEvalResult(res);
      setIsEvaluating(false);

      const action = res.score >= 60 ? 'quiz_correct' : 'quiz_wrong';
      const updated = recordWordInteraction(entry.cleanLemma, action, entry.category, entry.definition);
      setWordMastery(updated);

      if (soundEnabled) {
        speakText(res.kakaReactionMandar + " " + res.feedback, {
          lang: 'indonesia',
          gender: 'female',
          voiceProfile: 'kaka'
        });
      }
    }, 500);
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

          {/* ======================================================== */}
          {/* NEW SECTION: AI TEMAN BELAJAR MANDIRI - UJI PEMAHAMAN    */}
          {/* ======================================================== */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-mandar-sand-50 via-white to-mandar-gold-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-800 border-2 border-mandar-gold-300 dark:border-mandar-gold-800 shadow-md space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-mandar-sand-200 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500 flex items-center justify-center text-white">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center space-x-2">
                    <span>Teman Belajar Mandiri: Uji Pemahaman Anda</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Kaka-AI Live
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400">
                    AI mendiagnosis apakah Anda sudah paham makna dan penggunaan lema ini
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                  (wordMastery?.comprehensionScore || 0) >= 80
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-400'
                    : (wordMastery?.comprehensionScore || 0) >= 45
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-400'
                    : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border-rose-400'
                }`}>
                  Tingkat Pemahaman: {wordMastery?.comprehensionScore || 20}% ({wordMastery?.status ? wordMastery.status.replace('_', ' ').toUpperCase() : 'BELUM DIUJI'})
                </span>
              </div>
            </div>

            {/* Test Mode Selector */}
            <div className="flex items-center space-x-2 border-b border-mandar-sand-200 dark:border-slate-800 pb-2 text-xs font-bold">
              <button
                onClick={() => setActiveTestMode('quiz')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTestMode === 'quiz'
                    ? 'bg-mandar-maroon-700 text-white shadow-sm'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                1. Kuis Kilat 1-Soal
              </button>
              <button
                onClick={() => setActiveTestMode('explain')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTestMode === 'explain'
                    ? 'bg-mandar-maroon-700 text-white shadow-sm'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                2. Jelaskan dengan Bahasamu Sendiri (AI Evaluator)
              </button>
            </div>

            {/* Mode 1: Quick Quiz */}
            {activeTestMode === 'quiz' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-stone-700 dark:text-slate-300">
                  🎯 Pertanyaan Kaka-AI: Berdasarkan leksikon Balai Bahasa 2025, manakah definisi yang paling tepat untuk lema <strong>&quot;{entry.lemma}&quot;</strong>?
                </p>
                <div className="space-y-2">
                  {microQuizOptions.map((opt, idx) => {
                    const isSelected = quizAnswerState.selectedIndex === idx;
                    const isSubmitted = quizAnswerState.isSubmitted;
                    const isCorrectChoice = idx === correctOptionIndex;

                    let btnStyle = 'bg-white dark:bg-slate-800 border-mandar-sand-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 hover:border-mandar-maroon-600';
                    if (isSubmitted) {
                      if (isCorrectChoice) {
                        btnStyle = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !quizAnswerState.isCorrect) {
                        btnStyle = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizAnswerState.isSubmitted}
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="line-clamp-2">{opt}</span>
                        </div>
                        {isSubmitted && isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                        {isSubmitted && isSelected && !quizAnswerState.isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {quizAnswerState.isSubmitted && (
                  <div className={`p-3 rounded-xl text-xs space-y-1 ${
                    quizAnswerState.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                  }`}>
                    <span className="font-bold block">
                      {quizAnswerState.isCorrect ? '🎉 Masannang atinku! Jawaban Anda Tepat!' : '⚠️ Jawaban belum tepat, silakan baca ulang definisinya.'}
                    </span>
                    <p className="text-[11px] opacity-90">
                      Tingkat pemahaman kata ini telah diperbarui menjadi <strong>{wordMastery?.comprehensionScore}%</strong> di riwayat profil Anda.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Free Text Explanation Evaluator */}
            {activeTestMode === 'explain' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 dark:text-slate-300">
                  ✍️ Tuliskan penjelasan Anda dengan kata-kata sendiri mengenai apa itu <strong>&quot;{entry.lemma}&quot;</strong>. AI Kaka akan membaca penjelasanmu dan mendiagnosis apakah Anda sudah benar-benar paham:
                </p>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={userExplanation}
                    onChange={(e) => setUserExplanation(e.target.value)}
                    placeholder={`Contoh: Menurut saya, ${entry.lemma} adalah...`}
                    className="w-full p-3 rounded-2xl bg-white dark:bg-slate-800 border border-mandar-sand-300 dark:border-slate-700 text-xs text-stone-900 dark:text-white outline-none focus:border-mandar-maroon-700 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      Minimal 4-6 kata untuk penilaian komprehensif
                    </span>
                    <button
                      onClick={handleEvaluateFreeText}
                      disabled={isEvaluating || !userExplanation.trim()}
                      className="px-4 py-2 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isEvaluating ? 'Menganalisis...' : 'Minta Kaka-AI Menilai'}</span>
                    </button>
                  </div>
                </div>

                {evalResult && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                    evalResult.isUnderstood ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-900 dark:text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-mandar-gold-600" />
                        <span>Skor Pemahaman AI: {evalResult.score}% ({evalResult.level.toUpperCase()})</span>
                      </span>
                      <span className="text-[11px] italic">{evalResult.kakaReactionMandar}</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {evalResult.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

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
                Ingin konsultasi percakapan lengkap tentang kata ini?
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onGoToTab('kaka', `Tolong uji pemahamanku tentang kata Mandar '${entry.lemma}'`);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-mandar-maroon-700 text-white font-bold text-xs shadow-sm hover:bg-mandar-maroon-800 flex items-center space-x-1"
            >
              <span>Uji di Kaka-AI</span>
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
