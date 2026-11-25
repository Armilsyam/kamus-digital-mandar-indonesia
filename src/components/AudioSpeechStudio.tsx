"use client";

import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sparkles, 
  Languages, 
  Sliders, 
  Activity, 
  RefreshCw,
  UserCheck,
  BookOpen,
  Info
} from 'lucide-react';
import { 
  speakText, 
  stopSpeaking, 
  isSpeaking, 
  preprocessMandarForTTS,
  getMandarPhoneticRulesExplanation 
} from '@/lib/audio';

export const AudioSpeechStudio: React.FC = () => {
  const [inputText, setInputText] = useState(
    "Pitu buttu malindui, pitu ponnana ayu, purai accur nilanda paqmai sau di sasiq malambiq."
  );
  const [selectedLang, setSelectedLang] = useState<'mandar' | 'indonesia' | 'english'>('mandar');
  const [voiceProfile, setVoiceProfile] = useState<'indoq' | 'kaka' | 'amboq'>('indoq');
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const [speechPitch, setSpeechPitch] = useState<number>(1.16);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showRulesExplanation, setShowRulesExplanation] = useState<boolean>(false);

  const phoneticRules = getMandarPhoneticRulesExplanation();

  const PRESETS = [
    {
      label: "Mandar: Kerinduan & Laut",
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
      label: "Mandar: Kalindaqdaq Cinta",
      lang: 'mandar' as const,
      text: "Mellongeq mepasorongan, pindang pura tinindo, taqe-taqe na balimbing, lappaq tinindo tulu."
    },
    {
      label: "Indonesia: Narasi Perahu Sandeq",
      lang: 'indonesia' as const,
      text: "Perahu Sandeq merupakan mahakarya maritim suku Mandar dengan layar segitiga gunting yang mampu melaju kencang membelah ombak Selat Makassar."
    },
    {
      label: "English: Cultural Narrative",
      lang: 'english' as const,
      text: "The Sandeq is a traditional double-outrigger sailboat from West Sulawesi, celebrated as the fastest non-motorized vessel across the Indonesian archipelago."
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
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speakText(inputText, {
      lang: selectedLang,
      gender: voiceProfile === 'amboq' ? 'male' : 'female',
      voiceProfile: voiceProfile,
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
  };

  const preprocessedMandar = selectedLang === 'mandar' ? preprocessMandarForTTS(inputText) : inputText;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-mandar-sand-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-maroon-100 dark:bg-mandar-maroon-950 text-mandar-maroon-800 dark:text-mandar-gold-300 text-xs font-semibold mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Studio Pelafalan TTS Penutur Asli Mandar (Kemendikbud 2025)</span>
          </div>
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span>Sintesis Suara AI Penutur Asli Mandar</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
              Suara Perempuan Asli
            </span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Dilengkapi aturan alofon intervokalik (/b/→[w], /d/→[dz], /g/→[gh], /j/→[y]), sentak glotal koda [ʔ], dan pemenggalan geminasi silabis penutur asli wanita.
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-mandar-sand-100 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700">
          {[
            { id: 'mandar', label: 'Bahasa Mandar' },
            { id: 'indonesia', label: 'Bahasa Indonesia' },
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

      {/* Voice Character Profile Selection */}
      <div className="bg-mandar-sand-50/70 dark:bg-slate-850 p-4 rounded-2xl border border-mandar-sand-200 dark:border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
              Pilihan Karakter Suara AI Penutur:
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
              gender: 'female',
              title: "Indoq Mandar (Perempuan)",
              badge: "Rekomendasi Utama",
              desc: "Suara ibu Mandar yang hangat, bijak, santun, dan sangat berwibawa.",
              pitch: 1.15,
              rate: 0.86
            },
            {
              id: 'kaka' as const,
              gender: 'female',
              title: "Kaka Mandar (Perempuan)",
              badge: "Teman Belajar",
              desc: "Suara kakak pengajar yang ramah, artikulatif, ceria, dan jelas.",
              pitch: 1.22,
              rate: 0.90
            },
            {
              id: 'amboq' as const,
              gender: 'male',
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

      {/* Phonetic Rules Dropdown Explanation */}
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
        <span className="text-xs text-stone-400 mr-1">Contoh Kalimat Sesuai Aturan:</span>
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

      {/* Textarea Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
          Ketik atau Tempel Kalimat Mandar yang Ingin Dilafalkan Penutur Asli:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik kalimat panjang di sini..."
          className="w-full p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-sand-200 dark:border-slate-700 focus:border-mandar-maroon-600 outline-none text-base text-stone-800 dark:text-white resize-none"
        />
      </div>

      {/* Mandar Phonetic Transformation Preview */}
      {selectedLang === 'mandar' && (
        <div className="p-3.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-xs text-stone-600 dark:text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-mandar-gold-600" />
              <span>Transkripsi Fonetik Penutur Asli (Alofon, Glotal & Geminasi):</span>
            </span>
            <span className="text-[10px] text-stone-400">Aturan Balai Bahasa Aktif</span>
          </div>
          <p className="font-mono text-stone-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded-lg border border-mandar-sand-200 dark:border-slate-700 text-xs">
            {preprocessedMandar}
          </p>
        </div>
      )}

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
              {isPlaying ? 'Hentikan Suara' : `Lafalkan dengan Suara ${voiceProfile === 'amboq' ? 'Amboq' : voiceProfile === 'kaka' ? 'Kaka (Perempuan)' : 'Indoq (Perempuan)'}`}
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

        {/* Sliders for Pitch and Rate */}
        <div className="flex flex-wrap items-center gap-4 text-xs w-full md:w-auto justify-end">
          
          {/* Pitch Slider */}
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

          {/* Speed / Rate Slider */}
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
