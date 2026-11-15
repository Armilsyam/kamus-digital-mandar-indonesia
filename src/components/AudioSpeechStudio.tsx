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
  RefreshCw 
} from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking, preprocessMandarForTTS } from '@/lib/audio';

export const AudioSpeechStudio: React.FC = () => {
  const [inputText, setInputText] = useState(
    "Pitu buttu malindui, pitu ponnana ayu, purai accur nilanda paqmai sau di sasiq malambiq."
  );
  const [selectedLang, setSelectedLang] = useState<'mandar' | 'indonesia' | 'english'>('mandar');
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const PRESETS = [
    {
      label: "Mandar: Kerinduan & Laut",
      lang: 'mandar' as const,
      text: "Pitu buttu malindui, pitu ponnana ayu, purai accur nilanda paqmai sau di sasiq malambiq."
    },
    {
      label: "Mandar: Kalindaqdaq Cinta",
      lang: 'mandar' as const,
      text: "Mellongeq mepasorongan, pindang pura tinindo, taqe-taqe na balimbing, lappaq tinindo tulu."
    },
    {
      label: "Mandar: Falsafah Passombal",
      lang: 'mandar' as const,
      text: "Mellamun bomboq mappasombo litaq, daqa muleppas siriqmu tandanau di aheraq."
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
      rate: speechRate,
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
            <span>Studio Pelafalan Kalimat Panjang (Multi-Fungsi TTS)</span>
          </div>
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">
            Sintesis Suara Mandar, Indonesia & English
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Mampu melafalkan teks pendek maupun paragraf kalimat panjang lengkap dengan jeda koma, tanda titik, dan alofon alami.
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

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-stone-400 mr-1">Contoh Kalimat Panjang:</span>
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
          Ketik atau Tempel Kalimat Panjang yang Ingin Dilafalkan:
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
        <div className="p-3 rounded-xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-xs text-stone-600 dark:text-slate-400">
          <span className="font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300">
            Penyesuaian Fonetik Alofonik:{" "}
          </span>
          <span className="font-mono italic">{preprocessedMandar}</span>
        </div>
      )}

      {/* Audio Controls Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-mandar-sand-100 to-white dark:from-slate-800 dark:to-slate-850 border border-mandar-sand-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Play / Stop Button */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handlePlay}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              isPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white'
            }`}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Hentikan Suara' : 'Lafalkan Kalimat Penuh'}</span>
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

        {/* Speed Slider */}
        <div className="flex items-center space-x-3 text-xs w-full sm:w-auto justify-end">
          <Sliders className="w-4 h-4 text-stone-400" />
          <span className="font-semibold text-stone-600 dark:text-slate-300">Kecepatan:</span>
          {[
            { label: '0.75x', val: 0.75 },
            { label: '0.9x', val: 0.9 },
            { label: '1.0x', val: 1.0 },
            { label: '1.2x', val: 1.2 },
          ].map(s => (
            <button
              key={s.label}
              onClick={() => setSpeechRate(s.val)}
              className={`px-2.5 py-1 rounded-lg border font-mono font-bold transition-all ${
                speechRate === s.val
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-700'
                  : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
