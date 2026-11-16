"use client";

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Wind, 
  Moon, 
  Sun, 
  Volume2, 
  Info, 
  Navigation,
  Eye,
  Anchor
} from 'lucide-react';
import { speakText } from '@/lib/audio';

export interface ConstellationInfo {
  id: string;
  mandarName: string;
  lontara: string;
  astronomyName: string;
  role: string;
  description: string;
  sailingSeason: string;
  starPositions: { x: number; y: number; r: number }[];
}

export const CONSTELLATIONS: ConstellationInfo[] = [
  {
    id: 'balue',
    mandarName: 'Bittoeng Balue',
    lontara: 'ᨅᨗᨈᨚᨕᨙ ᨅᨒᨘᨕᨙ',
    astronomyName: 'Crux / Salib Selatan (Southern Cross)',
    role: 'Penunjuk Arah Selatan Sejati (South Compass)',
    description: 'Empat bintang bersilang tegak yang menjadi mercusuar langit para passombal Mandar saat mengarungi Selat Makassar ke arah selatan menuju Laut Jawa dan Flores.',
    sailingSeason: 'Terlihat jelas dari senja hingga dini hari sepanjang musim Timur (April - Oktober).',
    starPositions: [
      { x: 50, y: 30, r: 4 },
      { x: 50, y: 70, r: 5 },
      { x: 35, y: 50, r: 3.5 },
      { x: 65, y: 48, r: 3.5 },
    ]
  },
  {
    id: 'lambaru',
    mandarName: 'Bittoeng Lambaru',
    lontara: 'ᨅᨗᨈᨚᨕᨙ ᨒᨅᨑᨘ',
    astronomyName: 'Orion / Rasi Bintang Waluku',
    role: 'Penanda Musim Melaut & Pertanian',
    description: 'Tiga bintang sejajar cemerlang (Alnitak, Alnilam, Mintaka) di pinggang Orion. Bila Lambaru mulai condong ke ufuk barat saat senja, tandanya angin barat badai mulai mereda dan musim melaut tiba.',
    sailingSeason: 'Bulan November hingga Maret.',
    starPositions: [
      { x: 35, y: 25, r: 4 },
      { x: 65, y: 25, r: 4 },
      { x: 42, y: 50, r: 3.5 },
      { x: 50, y: 50, r: 3.5 },
      { x: 58, y: 50, r: 3.5 },
      { x: 38, y: 75, r: 4.5 },
      { x: 62, y: 75, r: 4 },
    ]
  },
  {
    id: 'pariama',
    mandarName: 'Bittoeng Pariama',
    lontara: 'ᨅᨗᨈᨚᨕᨙ ᨄᨑᨗᨕᨆ',
    astronomyName: 'Pleiades / Bintang Tujuh (Seven Sisters)',
    role: 'Penanda Datangnya Angin Barat Kencang',
    description: 'Gugus bintang mungil yang berkilau rapat. Kemunculan Pariama di ufuk timur sebelum fajar menyingsing menandakan musim hujan dan angin barat (bareq) sedang memuncak.',
    sailingSeason: 'Musim Angin Barat (Desember - Februari).',
    starPositions: [
      { x: 45, y: 42, r: 3 },
      { x: 52, y: 40, r: 3 },
      { x: 58, y: 46, r: 3.2 },
      { x: 48, y: 50, r: 3 },
      { x: 42, y: 56, r: 2.8 },
      { x: 54, y: 58, r: 3.5 },
      { x: 62, y: 54, r: 2.7 },
    ]
  },
  {
    id: 'timoq',
    mandarName: 'Bittoeng Timoq (Bintoeng Pagi)',
    lontara: 'ᨅᨗᨈᨚᨕᨙ ᨈᨗᨆᨚ',
    astronomyName: 'Planet Venus / Bintang Kejora (Morning Star)',
    role: 'Penunjuk Arah Timur & Waktu Fajar Subuh',
    description: 'Benda langit paling terang setelah bulan. Menjadi penuntun arah perahu Sandeq kembali mendekati daratan Sulawesi Barat setelah semalaman berlayar menangkap ikan.',
    sailingSeason: 'Terbit menjelang fajar di ufuk timur.',
    starPositions: [
      { x: 50, y: 50, r: 7 }
    ]
  }
];

export const WIND_POINTS = [
  { name: 'Uttara', dir: 'Utara (North)', angle: 0, desc: 'Angin dari arah utara Mamuju / Selat Makassar atas' },
  { name: 'Timoq Uttara', dir: 'Timur Laut (NE)', angle: 45, desc: 'Angin dari pegunungan hulu Mandar' },
  { name: 'Timoq', dir: 'Timur (East)', angle: 90, desc: 'Musim Angin Timur (April - Oktober), musim emas berlayar Sandeq Race' },
  { name: 'Timoq Sallatang', dir: 'Tenggara (SE)', angle: 135, desc: 'Angin pesisir Teluk Mandar' },
  { name: 'Sallatang', dir: 'Selatan (South)', angle: 180, desc: 'Angin dari Laut Jawa / Selat Madura' },
  { name: 'Bareq Sallatang', dir: 'Barat Daya (SW)', angle: 225, desc: 'Angin laut lepas Selat Makassar' },
  { name: 'Bareq', dir: 'Barat (West)', angle: 270, desc: 'Musim Angin Barat (Bareq), gelombang besar penguji nyali passombal' },
  { name: 'Bareq Uttara', dir: 'Barat Laut (NW)', angle: 315, desc: 'Angin dari arah Kalimantan Timur' },
];

export const CelestialNavigation: React.FC = () => {
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationInfo>(CONSTELLATIONS[0]);
  const [selectedWind, setSelectedWind] = useState(WIND_POINTS[2]); // Default Timoq

  const handlePlayAudio = (text: string) => {
    speakText(text, { lang: 'mandar', rate: 0.85 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-navy-950 via-slate-900 to-mandar-maroon-950 text-white p-8 sm:p-10 shadow-xl border border-sky-400/20 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨅᨗᨈᨚᨕᨙ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Fitur Baru #7 • Astronomi Bahari Tradisional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Simulator Navigasi Bintang & Kompas Angin Passombal
          </h2>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
            Menyelami keahlian astrolensa leluhur Mandar yang mengarungi ribuan mil samudra tanpa kompas mekanik, murni mengandalkan rasi bintang (*Bittoeng Balue, Bittoeng Lambaru*) serta pola 8 penjuru angin Mandar.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Sky Dome & Constellation Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Night Sky Dome SVG (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-sky-900/60 shadow-2xl relative overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Moon className="w-4 h-4" />
                <span>Kubah Langit Malam Passombal (Sky Dome)</span>
              </div>
              <span className="text-[11px] text-sky-300/60">Klik Rasi Bintang</span>
            </div>

            {/* SVG Constellation Canvas */}
            <div className="relative w-full aspect-square max-h-80 bg-gradient-to-b from-slate-900 via-sky-950/80 to-slate-950 rounded-2xl border border-sky-500/20 flex items-center justify-center overflow-hidden">
              
              {/* Background twinkling stars */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />

              <svg className="w-full h-full p-6" viewBox="0 0 100 100">
                {/* Connecting lines between constellation stars */}
                {selectedConstellation.starPositions.length > 1 && (
                  <polyline
                    points={selectedConstellation.starPositions.map(s => `${s.x},${s.y}`).join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                    className="opacity-70"
                  />
                )}

                {/* Stars */}
                {selectedConstellation.starPositions.map((star, idx) => (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={star.r * 2.2}
                      fill="#38bdf8"
                      className="opacity-25 animate-ping"
                    />
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={star.r}
                      fill="#fef08a"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
              </svg>

              {/* Center constellation title overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-sky-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <span className="font-bold">{selectedConstellation.mandarName}</span>
                <span className="text-[10px] text-sky-400">{selectedConstellation.astronomyName}</span>
              </div>
            </div>

            {/* Constellation Selector Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {CONSTELLATIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConstellation(c)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                    selectedConstellation.id === c.id
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                      : 'bg-slate-900 text-sky-200 border-sky-900/60 hover:border-sky-600'
                  }`}
                >
                  <div className="font-bold truncate">{c.mandarName}</div>
                  <div className="text-[10px] opacity-75 truncate">{c.role.split(' (')[0]}</div>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Constellation Detailed Analysis (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-5">
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl font-lontara text-mandar-gold-600 dark:text-mandar-gold-400">
                  {selectedConstellation.lontara}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px] font-bold">
                  {selectedConstellation.astronomyName}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">
                {selectedConstellation.mandarName}
              </h3>
              <p className="text-xs font-semibold text-mandar-maroon-700 dark:text-mandar-gold-400 mt-0.5">
                🧭 Peran Navigasi: {selectedConstellation.role}
              </p>
            </div>

            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs space-y-2 text-stone-700 dark:text-slate-300">
              <span className="font-bold text-stone-900 dark:text-white block">
                Kearifan Maritim Penutur Mandar:
              </span>
              <p className="leading-relaxed">
                {selectedConstellation.description}
              </p>
              <div className="pt-2 border-t border-mandar-sand-200 dark:border-slate-700 text-[11px] text-mandar-navy-800 dark:text-sky-300">
                <strong>📅 Musim Kemunculan:</strong> {selectedConstellation.sailingSeason}
              </div>
            </div>

            {/* Audio Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handlePlayAudio(selectedConstellation.mandarName + ', ' + selectedConstellation.description)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengar Penjelasan Audio</span>
              </button>

              <span className="text-[11px] text-stone-400">
                Sumber: Leksikon Bahari Mandar
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 8-Point Wind Compass (Kompas Angin Mandar) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center space-x-2">
              <Wind className="w-5 h-5 text-mandar-navy-700 dark:text-sky-400" />
              <span>Kompas 8 Mata Angin Mandar & Musim Berlayar Sandeq</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
              Klik salah satu penjuru mata angin untuk mempelajari karakter angin dan dampaknya bagi perahu Sandeq
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-mandar-gold-100 text-mandar-gold-800 dark:bg-mandar-gold-950 dark:text-mandar-gold-300 text-xs font-bold self-start">
            Dipakai pada Sandeq Race
          </span>
        </div>

        {/* 8 Wind Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {WIND_POINTS.map((wp) => (
            <button
              key={wp.name}
              onClick={() => setSelectedWind(wp)}
              className={`p-3.5 rounded-2xl text-left text-xs transition-all border ${
                selectedWind.name === wp.name
                  ? 'bg-mandar-navy-800 text-white border-mandar-navy-950 shadow-md dark:bg-sky-600'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-navy-400'
              }`}
            >
              <div className="font-extrabold text-sm">{wp.name}</div>
              <div className={`text-[11px] ${selectedWind.name === wp.name ? 'text-sky-200' : 'text-stone-400'}`}>
                {wp.dir}
              </div>
            </button>
          ))}
        </div>

        {/* Active Wind Detail Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-mandar-sand-100 via-white to-mandar-sand-50 dark:from-slate-800 dark:to-slate-800/60 border border-mandar-sand-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mandar-maroon-700 dark:text-mandar-gold-400 uppercase tracking-widest block">
              Mata Angin Terpilih:
            </span>
            <h4 className="text-lg font-bold text-stone-900 dark:text-white">
              {selectedWind.name} ({selectedWind.dir})
            </h4>
            <p className="text-xs text-stone-600 dark:text-slate-300">
              {selectedWind.desc}
            </p>
          </div>

          <button
            onClick={() => handlePlayAudio(selectedWind.name + ', ' + selectedWind.desc)}
            className="self-start sm:self-center flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-semibold text-xs transition-colors shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Dengar Pelafalan</span>
          </button>
        </div>
      </div>

    </div>
  );
};
