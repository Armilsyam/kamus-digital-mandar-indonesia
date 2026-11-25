"use client";

import React, { useState } from 'react';
import { 
  Gamepad2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  Volume2, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import cultureData from '@/data/mandar_culture.json';
import { speakMandar } from '@/lib/audio';
import { recordLearningActivity } from '@/lib/learningTracker';

interface QuizGameProps {
  soundEnabled: boolean;
}

export const QuizGame: React.FC<QuizGameProps> = ({ soundEnabled }) => {
  const [mode, setMode] = useState<'quiz' | 'flashcard'>('quiz');

  // Quiz state
  const questions = cultureData.quizBank;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Flashcards state
  const FLASHCARD_ITEMS = [
    { mandar: 'boyang', lontara: 'ᨅᨚᨐᨂ', pos: 'Nomina', meaning: 'Rumah tradisional panggung khas Mandar', example: 'boyangna kamaq (rumah ayah)' },
    { mandar: 'sandeq', lontara: 'ᨔᨊᨉᨙ', pos: 'Nomina', meaning: 'Perahu layar bercadik ganda khas Mandar yang sangat cepat', example: 'passombal sandeq (pelaut sandeq)' },
    { mandar: 'saqbe', lontara: 'ᨔᨅᨙ', pos: 'Nomina', meaning: 'Sutra tenun tradisional Mandar', example: 'lipaq saqbe (sarung sutra)' },
    { mandar: 'jepa', lontara: 'ᨍᨙᨄ', pos: 'Nomina', meaning: 'Makanan pokok tradisional dari parutan singkong/sagu yang dibakar', example: 'mande jepa (makan jepa)' },
    { mandar: 'tabe', lontara: 'ᨈᨅᨙ', pos: 'Partikel', meaning: 'Permisi / maaf / kata kesantunan (diucapkan [tawe])', example: 'tabe puang (permisi tuan)' },
    { mandar: 'madondong', lontara: 'ᨆᨉᨚᨊᨉᨚ', pos: 'Adverbia', meaning: 'Besok / waktu pagi (diucapkan [madzondzong])', example: 'madondong pole (besok datang)' },
    { mandar: 'sombal', lontara: 'ᨔᨚᨆᨅᨒ', pos: 'Nomina', meaning: 'Layar perahu penangkap angin laut', example: 'sombal tanjaq (layar gunting)' },
    { mandar: 'siriq', lontara: 'ᨔᨗᨑᨗ', pos: 'Nomina', meaning: 'Harga diri / kehormatan / martabat dalam kebudayaan Mandar', example: 'daqa muleppas siriqmu (jangan lepas harga dirimu)' },
  ];

  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  const curQ = questions[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === curQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const totalScorePct = Math.round((score / questions.length) * 100);
      recordLearningActivity({
        type: 'quiz',
        title: `Kuis Gamifikasi (${totalScorePct}%)`,
        detail: `Menuntaskan ${questions.length} soal kuis budaya & leksikon`,
        score: totalScorePct,
        masteryImpact: 'high',
        category: 'budaya'
      });
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const getRank = (finalScore: number) => {
    const pct = (finalScore / questions.length) * 100;
    if (pct === 100) return { title: '👑 Maraqdia Basa Mandar', desc: 'Sempurna! Anda memiliki pemahaman tingkat tinggi mengenai bahasa, fonologi, dan kebudayaan Mandar.' };
    if (pct >= 80) return { title: '⛵ Passombal Tangguh Mandar', desc: 'Hebat! Anda menguasai leksikografi dan kearifan lokal maritim Mandar dengan sangat baik.' };
    if (pct >= 60) return { title: '🗣️ Pabbicara Mandar', desc: 'Bagus! Anda memahami dasar-dasar kosakata dan tata bahasa Mandar dengan benar.' };
    return { title: '🌱 Passombal Pemula', desc: 'Awal yang baik! Terus eksplorasi kamus dan lab fonologi untuk memperdalam kosakata Anda.' };
  };

  const curCard = FLASHCARD_ITEMS[cardIdx];

  const handlePlayCard = (word: string) => {
    if (!soundEnabled) return;
    speakMandar(word);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Pojok Belajar Interaktif & Gamifikasi Bahasa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Kuis Cerdas & Flashcards Kosakata Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Tingkatkan penguasaan bahasa Mandar, kaidah fonologi, dan wawasan budaya melalui 
            tantangan kuis interaktif berhadiah gelar kehormatan tradisional atau kartu memori repetisi berjarak.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => setMode('quiz')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            mode === 'quiz'
              ? 'bg-mandar-maroon-700 text-white shadow-lg shadow-mandar-maroon-900/25'
              : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700'
          }`}
        >
          <Brain className="w-4 h-4 text-mandar-gold-400" />
          <span>Tantangan Kuis Cerdas (10 Soal)</span>
        </button>

        <button
          onClick={() => setMode('flashcard')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            mode === 'flashcard'
              ? 'bg-mandar-maroon-700 text-white shadow-lg shadow-mandar-maroon-900/25'
              : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 text-mandar-gold-400" />
          <span>Flashcard Menghafal (Spaced Repetition)</span>
        </button>
      </div>

      {/* MODE 1: QUIZ */}
      {mode === 'quiz' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-mandar-sand-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto">
          {!isFinished ? (
            <div>
              {/* Progress & Score Bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-slate-400 mb-3">
                <span>Soal {currentIdx + 1} dari {questions.length}</span>
                <span className="text-mandar-maroon-700 dark:text-mandar-gold-400 font-bold">
                  Skor: {score} Poin
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2 rounded-full bg-mandar-sand-200 dark:bg-slate-800 mb-8 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-mandar-maroon-600 to-mandar-gold-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white mb-6 leading-relaxed">
                {curQ.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3 mb-6">
                {curQ.options.map((opt, idx) => {
                  let optStyle = 'bg-mandar-sand-50 dark:bg-slate-800 border-mandar-sand-200 dark:border-slate-700 text-stone-800 dark:text-slate-200 hover:border-mandar-maroon-500';
                  
                  if (isAnswered) {
                    if (idx === curQ.correctIndex) {
                      optStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (idx === selectedOption) {
                      optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                    } else {
                      optStyle = 'opacity-50 border-stone-200 dark:border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 border border-stone-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold font-mono">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && idx === curQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== curQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {isAnswered && (
                <div className="p-5 rounded-2xl bg-mandar-sand-100/80 dark:bg-slate-800/80 border border-mandar-sand-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-gold-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Penjelasan Ilmiah Kamus Mandar 2025:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                    {curQ.explanation}
                  </p>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
                    >
                      <span>{currentIdx < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 animate-in zoom-in-95 duration-300 space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-mandar-maroon-700 via-mandar-gold-500 to-mandar-navy-600 text-white mx-auto flex items-center justify-center shadow-2xl">
                <Award className="w-12 h-12 text-white" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-mandar-maroon-700 dark:text-mandar-maroon-300">
                  Hasil Evaluasi Pembelajaran
                </span>
                <h3 className="text-3xl font-extrabold text-stone-900 dark:text-white mt-1">
                  Skor Anda: {score} / {questions.length}
                </h3>
              </div>

              {/* Rank Badge Card */}
              <div className="p-6 rounded-3xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-gold-400/80 max-w-md mx-auto text-center shadow-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-mandar-gold-700 dark:text-mandar-gold-400 block mb-1">
                  Gelar Kehormatan Budaya Mandar:
                </span>
                <h4 className="text-2xl font-extrabold text-mandar-maroon-900 dark:text-mandar-gold-300 mb-2">
                  {getRank(score).title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                  {getRank(score).desc}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-4">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-3 rounded-2xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-sm shadow-md flex items-center space-x-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: FLASHCARDS */}
      {mode === 'flashcard' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-slate-400">
            <span>Kartu {cardIdx + 1} dari {FLASHCARD_ITEMS.length}</span>
            <span className="text-mandar-gold-600 dark:text-mandar-gold-400 font-bold">
              Hafal: {learnedCount} Kata
            </span>
          </div>

          {/* 3D Flip Card */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-mandar-sand-300 dark:border-slate-800 shadow-xl cursor-pointer hover:border-mandar-maroon-500 transition-all flex flex-col justify-between text-center select-none"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
                {isFlipped ? 'Sisi Belakang (Arti & Terjemahan)' : 'Sisi Depan (Klik untuk Membalik)'}
              </span>

              {!isFlipped ? (
                /* Front Side: Mandar & Lontara */
                <div className="py-6 space-y-3">
                  <h3 className="text-4xl font-extrabold text-mandar-maroon-900 dark:text-mandar-maroon-200">
                    {curCard.mandar}
                  </h3>
                  <div className="font-lontara text-3xl text-mandar-gold-600 dark:text-mandar-gold-400">
                    {curCard.lontara}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                    {curCard.pos}
                  </span>
                </div>
              ) : (
                /* Back Side: Indonesian Definition & Example */
                <div className="py-4 space-y-3">
                  <h4 className="text-xl font-bold text-stone-900 dark:text-white font-serif">
                    {curCard.meaning}
                  </h4>
                  <div className="p-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 text-xs font-medium text-mandar-maroon-800 dark:text-mandar-maroon-300 italic">
                    Contoh: &ldquo;{curCard.example}&rdquo;
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2 pt-4 border-t border-mandar-sand-100 dark:border-slate-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayCard(curCard.mandar);
                }}
                className="px-3 py-1.5 rounded-lg bg-mandar-sand-100 text-mandar-maroon-900 dark:bg-slate-800 dark:text-mandar-maroon-300 text-xs font-semibold flex items-center space-x-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Pengucapan</span>
              </button>
            </div>
          </div>

          {/* Flashcard Nav Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIdx((cardIdx - 1 + FLASHCARD_ITEMS.length) % FLASHCARD_ITEMS.length);
              }}
              className="flex-1 py-3 rounded-2xl bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 font-semibold text-xs border border-stone-200 dark:border-slate-700 hover:bg-stone-50"
            >
              Sebelumnya
            </button>

            <button
              onClick={() => {
                setLearnedCount(prev => prev + 1);
                setIsFlipped(false);
                setCardIdx((cardIdx + 1) % FLASHCARD_ITEMS.length);
              }}
              className="flex-1 py-3 rounded-2xl bg-mandar-maroon-700 text-white font-bold text-xs shadow-md hover:bg-mandar-maroon-800"
            >
              Sudah Hafal ✓
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCardIdx((cardIdx + 1) % FLASHCARD_ITEMS.length);
              }}
              className="flex-1 py-3 rounded-2xl bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 font-semibold text-xs border border-stone-200 dark:border-slate-700 hover:bg-stone-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
