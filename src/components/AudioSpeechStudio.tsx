"use client";

import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sparkles, 
  Languages, 
  Sliders, 
  Activity, 
  UserCheck,
  BookOpen,
  Info,
  Mic,
  MicOff,
  Split,
  SpellCheck,
  AlignLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { 
  speakText, 
  speakWordByWord,
  speakSyllables,
  stopSpeaking, 
  preprocessMandarForTTS,
  preprocessMixedForTTS,
  getMandarPhoneticRulesExplanation,
  startSpeechListening,
  stopSpeechListening,
  isSpeechRecognitionSupported 
} from '@/lib/audio';
import { 
  detectLanguageAndAnalyze, 
  segmentMixedSentence, 
  hyphenateMandarSyllables 
} from '@/lib/languageDetector';

export const AudioSpeechStudio: React.FC = () => {
  const [inputText, setInputText] = useState(
    "Tabe itaq, saya mau belajar bahasa Mandar hari ini sau di sasiq malambiq."
  );
  const [selectedLang, setSelectedLang] = useState<'mandar' | 'indonesia' | 'mixed' | 'english'>('mixed');
  const [voiceProfile, setVoiceProfile] = useState<'indoq' | 'kaka' | 'amboq'>('indoq');
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const [speechPitch, setSpeechPitch] = useState<number>(1.16);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playMode, setPlayMode] = useState<'full' | 'word' | 'syllable'>('full');
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);
  const [activeSylIdx, setActiveSylIdx] = useState<number>(-1);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showRulesExplanation, setShowRulesExplanation] = useState<boolean>(false);

  const phoneticRules = getMandarPhoneticRulesExplanation();
  const recognitionSupported = isSpeechRecognitionSupported();

  // Analisis Bahasa Real-Time (Mandar vs Indonesia vs Campuran & Harfiah)
  const languageAnalysis = useMemo(() => {
    return detectLanguageAndAnalyze(inputText);
  }, [inputText]);

  const PRESETS = [
    {
      label: "Campuran (Code-Switching): Mandar + Indonesia",
      lang: 'mixed' as const,
      text: "Tabe itaq, saya mau belajar bahasa Mandar hari ini sau di sasiq malambiq."
    },
    {
      label: "Mandar Otentik: Kerinduan & Laut",
      lang: 'mandar' as const,
      text: "Pitu buttu malindui, pitu ponnana ayu, purai accur nilanda paqmai sau di sasiq malambiq."
    },
    {
      label: "Mandar: Sentak Glotal (itaq & andiq)",
      lang: 'mandar' as const,
      text: "Tabe itaq andiq, apa kareba di litaq Mandar sau di sasiq malambiq?"
    },
    {
      label: "Mandar: Alofon (tabe & madondong)",
      lang: 'mandar' as const,
      text: "Madondong subu pura tinindo, tabe tawe sipasilolongang di siwaliparriq."
    },
    {
      label: "Mandar: Geminasi (pappasang & matte)",
      lang: 'mandar' as const,
      text: "Mellamun bomboq mappasombo litaq, daqa muleppas siriqmu tandanau di aheraq."
    },
    {
      label: "Indonesia: Narasi Perahu Sandeq",
      lang: 'indonesia' as const,
      text: "Perahu Sandeq merupakan mahakarya maritim suku Mandar dengan layar segitiga gunting yang mampu melaju kencang membelah ombak Selat Makassar."
    }
  ];

  const handleProfileChange = (profile: 'indoq' | 'kaka' | 'amboq') => {
    setVoiceProfile(profile);
    if (profile === 'indoq') {
      setSpeechPitch(1.15);
      setSpeechRate(0.86);
    } else if (profile === 'kaka') {
      setSpeechPitch(1.22);
      setSpeechRate(0.90);
    } else {
      setSpeechPitch(0.92);
      setSpeechRate(0.88);
    }
  };

  const handlePlay = () => {
    if (!inputText.trim()) return;

    if (isPlaying) {
      handleStop();
      return;
    }

    setIsPlaying(true);
    setActiveWordIdx(-1);
    setActiveSylIdx(-1);

    const commonOptions = {
      gender: voiceProfile === 'amboq' ? ('male' as const) : ('female' as const),
      voiceProfile: voiceProfile,
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setActiveWordIdx(-1);
        setActiveSylIdx(-1);
      },
      onError: () => {
        setIsPlaying(false);
        setActiveWordIdx(-1);
        setActiveSylIdx(-1);
      }
    };

    if (playMode === 'word') {
      // Pelafalan Kata per Kata
      speakWordByWord(inputText, {
        ...commonOptions,
        lang: selectedLang
      }, (idx) => setActiveWordIdx(idx));
    } else if (playMode === 'syllable') {
      // Pengejaan Suku Kata (untuk kata pertama atau kata terpilih)
      const firstWord = inputText.trim().split(/\s+/)[0] || 'sibaliparriq';
      speakSyllables(firstWord, {
        ...commonOptions,
        lang: 'mandar'
      }, (sylIdx) => setActiveSylIdx(sylIdx));
    } else {
      // Kalimat Penuh Mengalir Alami
      speakText(inputText, {
        ...commonOptions,
        lang: selectedLang
      });
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
    setActiveWordIdx(-1);
    setActiveSylIdx(-1);
  };

  // Toggle Perekaman Suara (Speech-to-Text)
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      startSpeechListening({
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  const wordsList = useMemo(() => {
    return inputText.trim().split(/\s+/).filter(Boolean);
  }, [inputText]);

  const activeFirstWordSyllables = useMemo(() => {
    const firstWord = wordsList[0] || 'sibaliparriq';
    return hyphenateMandarSyllables(firstWord);
  }, [wordsList]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-mandar-sand-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-maroon-100 dark:bg-mandar-maroon-950 text-mandar-maroon-800 dark:text-mandar-gold-300 text-xs font-semibold mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Studio Pelafalan TTS & Pengenalan Suara Mandar 2-Arah</span>
          </div>
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span>Sintesis & Analisis Harfiah Penutur Asli</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
              Suara Perempuan Asli
            </span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Mampu memisahkan kalimat campuran Mandar-Indonesia, mengeja suku kata, melafalkan per kata, dan mengenali suara mic Anda.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-mandar-sand-100 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700">
          {[
            { id: 'mixed', label: 'Campuran' },
            { id: 'mandar', label: 'Mandar' },
            { id: 'indonesia', label: 'Indonesia' },
            { id: 'english', label: 'English' },
          ].map(l => (
            <button
              key={l.id}
              onClick={() => {
                handleStop();
                setSelectedLang(l.id as typeof selectedLang);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLang === l.id
                  ? 'bg-mandar-maroon-700 text-white shadow-sm'
                  : 'text-stone-600 dark:text-slate-300 hover:text-stone-900'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector: Kalimat Panjang vs Per Kata vs Pengejaan Suku Kata */}
      <div className="bg-gradient-to-r from-mandar-sand-100 to-amber-50 dark:from-slate-800 dark:to-slate-850 p-3 rounded-2xl border border-mandar-sand-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
          <span>Pilihan Mode Pelafalan & Pengejaan:</span>
        </span>

        <div className="flex items-center space-x-1.5">
          {[
            { id: 'full', label: 'Kalimat Panjang Alami', icon: AlignLeft },
            { id: 'word', label: 'Pelafalan Per Kata', icon: FileText },
            { id: 'syllable', label: 'Pengejaan Suku Kata', icon: SpellCheck }
          ].map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  handleStop();
                  setPlayMode(m.id as typeof playMode);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  playMode === m.id
                    ? 'bg-mandar-maroon-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-700 text-stone-700 dark:text-slate-300 border border-mandar-sand-200 dark:border-slate-600 hover:border-mandar-maroon-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Character Profile Selection */}
      <div className="bg-mandar-sand-50/70 dark:bg-slate-850 p-4 rounded-2xl border border-mandar-sand-200 dark:border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
              Pilihan Karakter Suara AI Penutur Asli:
            </span>
          </div>
          <button
            onClick={() => setShowRulesExplanation(!showRulesExplanation)}
            className="text-xs text-mandar-maroon-700 dark:text-mandar-gold-400 font-semibold flex items-center gap-1 hover:underline self-start sm:self-auto"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showRulesExplanation ? 'Tutup Aturan Fonetik' : 'Lihat Pedoman Aturan Pembacaan'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'indoq' as const,
              title: "Indoq Mandar (Perempuan)",
              badge: "Rekomendasi Utama",
              desc: "Suara ibu Mandar yang hangat, bijak, santun, dan sangat berwibawa.",
              pitch: 1.15,
              rate: 0.86
            },
            {
              id: 'kaka' as const,
              title: "Kaka Mandar (Perempuan)",
              badge: "Teman Belajar",
              desc: "Suara kakak pengajar yang ramah, artikulatif, ceria, dan jelas.",
              pitch: 1.22,
              rate: 0.90
            },
            {
              id: 'amboq' as const,
              title: "Amboq Mandar (Laki-laki)",
              badge: "Tetua Mandar",
              desc: "Suara pria Mandar berkarakter kokoh dan berwibawa layaknya pelaut.",
              pitch: 0.92,
              rate: 0.88
            }
          ].map(p => (
            <div
              key={p.id}
              onClick={() => handleProfileChange(p.id)}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                voiceProfile === p.id
                  ? 'border-mandar-maroon-600 bg-white dark:bg-slate-800 shadow-md ring-2 ring-mandar-maroon-500/20'
                  : 'border-mandar-sand-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/40 hover:border-mandar-maroon-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-stone-900 dark:text-white">
                  {p.title}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  p.id === 'indoq'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300'
                }`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-2">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Phonetic Rules Dropdown */}
      {showRulesExplanation && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
            <BookOpen className="w-4 h-4" />
            <span>Pedoman Fonotaktik & Tata Bunyi Penutur Asli Mandar (Balai Bahasa Sulsel):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {phoneticRules.map((rule, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-850 border border-amber-200/60 dark:border-amber-800/40 text-xs">
                <p className="font-bold text-amber-950 dark:text-amber-200 mb-0.5">{rule.title}</p>
                <p className="text-[11px] text-stone-600 dark:text-slate-300 mb-1">{rule.description}</p>
                <p className="text-[10px] font-mono text-mandar-maroon-700 dark:text-mandar-gold-300 bg-amber-100/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {rule.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-stone-400 mr-1">Contoh Sesuai Kaidah:</span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              handleStop();
              setSelectedLang(p.lang);
              setInputText(p.text);
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Textarea Input with Voice Recognition Mic Button */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Ketik Teks atau Gunakan Suara Anda (Voice In):
          </label>
          {recognitionSupported && (
            <button
              onClick={toggleSpeechRecognition}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                  : 'bg-mandar-sand-100 dark:bg-slate-800 text-mandar-maroon-800 dark:text-mandar-gold-300 border border-mandar-sand-200 dark:border-slate-700 hover:bg-mandar-sand-200'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Mendengarkan... (Klik untuk stop)' : 'Bicara Lewat Mikrofon'}</span>
            </button>
          )}
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik kalimat Mandar, Indonesia, atau campuran di sini..."
          className="w-full p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-sand-200 dark:border-slate-700 focus:border-mandar-maroon-600 outline-none text-base text-stone-800 dark:text-white resize-none"
        />
      </div>

      {/* Visual Word-by-Word Live Pronunciation Tracker */}
      {playMode === 'word' && isPlaying && (
        <div className="p-4 rounded-2xl bg-mandar-navy-900 text-white space-y-2 border border-mandar-navy-700 animate-in fade-in">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
            Pelafalan Per Kata Sedang Berlangsung:
          </span>
          <div className="flex flex-wrap gap-2 text-base font-semibold">
            {wordsList.map((word, wIdx) => (
              <span
                key={wIdx}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeWordIdx === wIdx
                    ? 'bg-mandar-gold-500 text-stone-950 scale-110 font-bold shadow-lg ring-2 ring-white'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visual Syllable-by-Syllable Spelling Tracker */}
      {playMode === 'syllable' && (
        <div className="p-4 rounded-2xl bg-mandar-maroon-950 text-white space-y-2 border border-mandar-maroon-800 animate-in fade-in">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mandar-gold-400">
            Pengejaan Suku Kata (Kata: &quot;{wordsList[0] || 'sibaliparriq'}&quot;):
          </span>
          <div className="flex items-center gap-2 text-lg font-bold">
            {activeFirstWordSyllables.map((syl, sIdx) => (
              <span
                key={sIdx}
                className={`px-3 py-1.5 rounded-xl border font-mono transition-all ${
                  activeSylIdx === sIdx
                    ? 'bg-mandar-gold-500 text-stone-950 border-white scale-110 shadow-lg'
                    : 'bg-white/10 text-mandar-sand-200 border-white/20'
                }`}
              >
                [{syl}]
              </span>
            ))}
          </div>
        </div>
      )}

      {/* DETEKSI BAHASA & PEMISAHAN KALIMAT CAMPURAN */}
      <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/80 border border-mandar-sand-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-mandar-sand-200 dark:border-slate-700 pb-2">
          <div className="flex items-center space-x-2">
            <Split className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
            <span className="text-xs font-bold text-stone-900 dark:text-white">
              Pemisahan Kalimat Campuran (Code-Switching) & Deteksi Bahasa:
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            {languageAnalysis.detectedSummary}
          </span>
        </div>

        {/* Segments Visualization */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-stone-500 dark:text-slate-400 font-semibold block">
            Segmen Terpilah untuk Pelafalan Akurat:
          </span>
          <div className="flex flex-wrap gap-2">
            {languageAnalysis.segments.map((seg, idx) => (
              <div 
                key={idx}
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center space-x-1.5 ${
                  seg.isMandar
                    ? 'bg-mandar-maroon-50 dark:bg-mandar-maroon-950/60 border-mandar-maroon-300 dark:border-mandar-maroon-800 text-mandar-maroon-900 dark:text-mandar-gold-300'
                    : 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${seg.isMandar ? 'bg-mandar-maroon-600' : 'bg-sky-500'}`} />
                <span className="font-bold uppercase text-[10px] mr-1">
                  {seg.isMandar ? '[Mandar]' : '[Indonesia]'}
                </span>
                <span>{seg.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Literal Translation Gloss */}
        {languageAnalysis.literalSentenceTranslation && (
          <div className="pt-2 border-t border-mandar-sand-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-stone-600 dark:text-slate-300 block mb-1">
              Arti Harfiah Kata-per-Kata:
            </span>
            <p className="text-xs text-stone-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-mandar-sand-200 dark:border-slate-700">
              {languageAnalysis.literalSentenceTranslation}
            </p>
          </div>
        )}
      </div>

      {/* Audio Controls Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-mandar-sand-100 to-white dark:from-slate-800 dark:to-slate-850 border border-mandar-sand-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Play / Stop Button */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={handlePlay}
            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              isPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white'
            }`}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>
              {isPlaying 
                ? 'Hentikan Suara' 
                : playMode === 'word'
                  ? 'Lafalkan Per Kata'
                  : playMode === 'syllable'
                    ? 'Eja Suku Kata'
                    : `Lafalkan (${voiceProfile === 'amboq' ? 'Amboq' : 'Perempuan ' + voiceProfile})`
              }
            </span>
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-3 rounded-2xl bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-white"
              title="Stop"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pitch & Rate Sliders */}
        <div className="flex flex-wrap items-center gap-4 text-xs w-full md:w-auto justify-end">
          
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700">
            <span className="font-semibold text-stone-600 dark:text-slate-300">Nada (Pitch):</span>
            <span className="font-mono font-bold text-mandar-maroon-700 dark:text-mandar-gold-300">{speechPitch.toFixed(2)}x</span>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.02"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-20 accent-mandar-maroon-700 cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700">
            <span className="font-semibold text-stone-600 dark:text-slate-300">Tempo:</span>
            <span className="font-mono font-bold text-mandar-maroon-700 dark:text-mandar-gold-300">{speechRate.toFixed(2)}x</span>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.02"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-20 accent-mandar-maroon-700 cursor-pointer"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
