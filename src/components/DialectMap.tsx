"use client";

import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Volume2, 
  Compass, 
  Layers, 
  Sparkles, 
  Info, 
  Check, 
  Search,
  BookOpen
} from 'lucide-react';
import { speakText } from '@/lib/audio';

export interface DialectInfo {
  id: string;
  name: string;
  region: string;
  regency: string;
  speakerCount: string;
  characteristics: string;
  phoneticNotes: string;
  samplePhrase: {
    mandar: string;
    indonesia: string;
    phonetic: string;
  };
  sampleWords: Record<string, string>;
  mapCoords: { x: number; y: number };
}

export const DIALECTS_DATA: DialectInfo[] = [
  {
    id: 'balanipa',
    name: 'Dialek Balanipa (Standar Baku)',
    region: 'Tinambung, Balanipa, Limboro, Alu',
    regency: 'Polewali Mandar',
    speakerCount: '~180.000 penutur',
    characteristics: 'Dialek acuan baku leksikografi Mandar (Kamus Balai Bahasa 2025). Menggunakan konsonan letup glotal teratur /q/, retensi alofon intervokalik sempurna, dan patokan sastra lisan Kalindaqdaq.',
    phoneticNotes: 'Alofon intervokalik /b/ -> [w] (tabe -> tawe), /d/ -> [dz] (madondong -> madzondzong), /g/ -> [gh].',
    samplePhrase: {
      mandar: 'Pura mai iko manganre di boyangna amboqmu?',
      indonesia: 'Apakah kamu sudah selesai makan di rumah ayahmu?',
      phonetic: '[pura mai iko mangandre di woyangna ambokmu]'
    },
    sampleWords: {
      'rumah': 'boyang',
      'makan': 'manganre / maande',
      'air': 'wae',
      'perahu': 'sandeq / lopi',
      'tidak': 'iqdai',
      'ayah': 'amboq / abi',
      'ibu': 'indoq / ina',
      'pergi': 'lamba / lari'
    },
    mapCoords: { x: 55, y: 72 }
  },
  {
    id: 'banggae',
    name: 'Dialek Banggae (Pesisir Majene)',
    region: 'Banggae, Banggae Timur, Rangas',
    regency: 'Majene',
    speakerCount: '~90.000 penutur',
    characteristics: 'Dialek pesisir perkotaan Majene. Sangat kaya akan kosakata navigasi maritim perahu sandeq, penangkapan ikan tongkol/terbang, dan perdagangan antar-pulau.',
    phoneticNotes: 'Ritme bicara lebih lugas dan cepat. Letup glotal pada posisi koda sangat jelas terdengar.',
    samplePhrase: {
      mandar: 'Mettappiq di baratan lamba sombal di lau.',
      indonesia: 'Bertahan di cadik saat layar berhembus melaju ke arah laut lepas.',
      phonetic: '[mettappik di waratan lamba sombal di lau]'
    },
    sampleWords: {
      'rumah': 'boyang',
      'makan': 'mande',
      'air': 'ue / wae',
      'perahu': 'sandeq',
      'tidak': 'andai / iqdai',
      'ayah': 'amboq',
      'ibu': 'indoq',
      'pergi': 'lamba'
    },
    mapCoords: { x: 42, y: 64 }
  },
  {
    id: 'pamboang',
    name: 'Dialek Pamboang',
    region: 'Pamboang, Tinambung Pesisir, Balabalakang',
    regency: 'Majene',
    speakerCount: '~45.000 penutur',
    characteristics: 'Pusat tradisi pembuatan lambung perahu Sandeq dan pelaut ulung. Kosakata maritim paling presisi dan mendalam di Mandar.',
    phoneticNotes: 'Intonasi bergelombang seperti ritme ombak, vokal tengah cenderung memanjang.',
    samplePhrase: {
      mandar: 'Taqeai sombalna lopi apa maombaq bombang.',
      indonesia: 'Bentangkan layar perahu karena ombak laut sedang menggunung.',
      phonetic: '[takeai sombalna lopi apa maombak wombang]'
    },
    sampleWords: {
      'rumah': 'boyang',
      'makan': 'maande',
      'air': 'wae',
      'perahu': 'lopi sandeq',
      'tidak': 'iqda / iqdai',
      'ayah': 'amboq',
      'ibu': 'indoq',
      'pergi': 'lele / lamba'
    },
    mapCoords: { x: 38, y: 55 }
  },
  {
    id: 'sendana',
    name: 'Dialek Sendana (Sendana & Tammerodo)',
    region: 'Sendana, Tammerodo, Tubo Sendana',
    regency: 'Majene (Utara)',
    speakerCount: '~60.000 penutur',
    characteristics: 'Ciri vokal lebih terbuka dan intonasi tinggi melodius. Memiliki leksikon lokal terkait pertanian kelapa, kopra, dan tenun sutra tradisional.',
    phoneticNotes: 'Vokal /a/ di posisi akhir cenderung lebih terbuka lebar dibanding Balanipa.',
    samplePhrase: {
      mandar: 'Inna muola lamba maande di galung?',
      indonesia: 'Lewat mana kamu hendak pergi makan di sawah ladang?',
      phonetic: '[inna muola lamba maande di ghalung]'
    },
    sampleWords: {
      'rumah': 'boyang / bola',
      'makan': 'maande',
      'air': 'wae',
      'perahu': 'baqgo / lopi',
      'tidak': 'tadai / iqdai',
      'ayah': 'amboq',
      'ibu': 'indoq',
      'pergi': 'lamba'
    },
    mapCoords: { x: 45, y: 44 }
  },
  {
    id: 'campalagian',
    name: 'Dialek Campalagian (Mandar-Bugis Akulturasi)',
    region: 'Campalagian, Katumbangan, Lapeo',
    regency: 'Polewali Mandar',
    speakerCount: '~70.000 penutur',
    characteristics: 'Wilayah historis akulturasi Mandar dengan penutur Bugis Wajo/Bone. Memperlihatkan leksikon hibrida yang unik namun tetap berakar kuat pada tata bahasa Mandar.',
    phoneticNotes: 'Adanya pengaruh intonasi Bugis pesisir dan kosakata serapan khas perdagangan sarung sutra Lapeo.',
    samplePhrase: {
      mandar: 'Tabe amboq, meloqnaq massuro litaq di Campalagian.',
      indonesia: 'Permisi ayah, saya hendak menziarahi tanah leluhur di Campalagian.',
      phonetic: '[tawe ambok, meloknak massuro litak di campalaghian]'
    },
    sampleWords: {
      'rumah': 'boyang / bola',
      'makan': 'manre / maande',
      'air': 'wae / jeqne',
      'perahu': 'lopi',
      'tidak': 'deqgaga / iqdai',
      'ayah': 'amboq / abi',
      'ibu': 'indoq / emaq',
      'pergi': 'lokka / lamba'
    },
    mapCoords: { x: 68, y: 74 }
  },
  {
    id: 'malunda',
    name: 'Dialek Malunda & Ulumanda',
    region: 'Malunda, Ulumanda, Perbatasan Tapalang',
    regency: 'Majene / Mamuju',
    speakerCount: '~35.000 penutur',
    characteristics: 'Peralihan linguistik antara bahasa Mandar pesisir dan wilayah Mamuju. Memiliki kosakata pegunungan, getah damar, rotan, dan leksikon agraris hulu sungai.',
    phoneticNotes: 'Konsonan koda glotal sering melemah menjadi hembusan napas aspirasi.',
    samplePhrase: {
      mandar: 'Daiq di buluq maala wae mamesa.',
      indonesia: 'Naik ke bukit pegunungan mengambil air jernih segar.',
      phonetic: '[daik di wuluk maala wae mamesa]'
    },
    sampleWords: {
      'rumah': 'boyang',
      'makan': 'kande / maande',
      'air': 'wae / uai',
      'perahu': 'lopi',
      'tidak': 'iqda',
      'ayah': 'ama / amboq',
      'ibu': 'ina / indoq',
      'pergi': 'lamba'
    },
    mapCoords: { x: 50, y: 30 }
  },
  {
    id: 'awok',
    name: 'Dialek Awok & Tande (Hulu Pegunungan)',
    region: 'Tande, Awok, Perbukitan Balanipa Pegunungan',
    regency: 'Polewali Mandar / Majene',
    speakerCount: '~20.000 penutur',
    characteristics: 'Salah satu dialek paling konservatif dan mempertahankan kata-kata arkais proto-Mandar yang jarang dipakai lagi di kota pesisir.',
    phoneticNotes: 'Mempertahankan vokal panjang kuno dan gugus konsonan internal.',
    samplePhrase: {
      mandar: 'Mamboyang di tande anna siadaq adaq tokayang.',
      indonesia: 'Bermukim di pegunungan Tande dan tetap menjunjung adat para tetua agung.',
      phonetic: '[mambwoyang di tande anna siadak adak tokayang]'
    },
    sampleWords: {
      'rumah': 'boyang',
      'makan': 'maande',
      'air': 'wae',
      'perahu': 'lopi',
      'tidak': 'iqdai',
      'ayah': 'amboq',
      'ibu': 'indoq',
      'pergi': 'lamba'
    },
    mapCoords: { x: 62, y: 58 }
  }
];

const COMPARISON_KEYS = [
  { key: 'rumah', label: 'Rumah (House)' },
  { key: 'makan', label: 'Makan (Eat)' },
  { key: 'air', label: 'Air (Water)' },
  { key: 'perahu', label: 'Perahu (Boat)' },
  { key: 'tidak', label: 'Tidak (No/Not)' },
  { key: 'ayah', label: 'Ayah (Father)' },
  { key: 'ibu', label: 'Ibu (Mother)' },
  { key: 'pergi', label: 'Pergi (Go)' },
];

export const DialectMap: React.FC = () => {
  const [activeDialect, setActiveDialect] = useState<DialectInfo>(DIALECTS_DATA[0]);
  const [filterWord, setFilterWord] = useState('');

  const filteredComparisonKeys = COMPARISON_KEYS.filter(c => 
    c.label.toLowerCase().includes(filterWord.toLowerCase()) ||
    c.key.toLowerCase().includes(filterWord.toLowerCase())
  );

  const handlePlayAudio = (text: string) => {
    speakText(text, { lang: 'mandar', rate: 0.88 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨈᨊ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #2 • Geografi Bahasa Sulawesi Barat</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Peta Dialektologi & Persebaran Bahasa Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Menelusuri kekayaan 7 dialek geografis Bahasa Mandar dari pesisir Teluk Mandar hingga pegunungan Ulumanda. Pelajari variasi fonologi, perbandingan kata (isoglos), dan dengarkan sampel tutur masing-masing daerah.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Geographic Map & Dialect Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Map & Dialect Buttons (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
                <span>Peta Titik Dialek Sulawesi Barat</span>
              </h3>
              <span className="text-[11px] text-stone-400">7 Zona Wilayah</span>
            </div>

            {/* Stylized SVG Map of West Sulawesi Coastline */}
            <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-sky-50 to-mandar-sand-100 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-4 border border-mandar-sand-300 dark:border-slate-800 overflow-hidden flex items-center justify-center">
              
              {/* Sea Waves / Selat Makassar label */}
              <div className="absolute left-3 top-4 text-[11px] font-bold tracking-widest text-sky-600/40 dark:text-sky-400/30 uppercase select-none">
                🌊 Selat Makassar
              </div>

              {/* Coastal Land Silhouette SVG */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 20,0 Q 30,25 35,45 Q 40,65 55,80 Q 75,90 95,95 L 100,100 L 100,0 Z"
                  className="fill-amber-100/70 dark:fill-stone-800/60 stroke-amber-300 dark:stroke-slate-700 stroke-1"
                />
              </svg>

              {/* Dialect Markers */}
              {DIALECTS_DATA.map((d) => {
                const isSelected = activeDialect.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDialect(d)}
                    style={{ left: `${d.mapCoords.x}%`, top: `${d.mapCoords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                    title={`${d.name} (${d.regency})`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                        isSelected 
                          ? 'bg-mandar-maroon-700 text-white ring-4 ring-mandar-gold-400 animate-pulse'
                          : 'bg-mandar-navy-700 text-white hover:bg-mandar-maroon-600 ring-2 ring-white dark:ring-slate-900'
                      }`}>
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      </span>
                      <span className={`absolute top-5 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded shadow transition-all ${
                        isSelected
                          ? 'bg-mandar-maroon-800 text-white ring-1 ring-mandar-gold-400'
                          : 'bg-white/90 dark:bg-slate-900/90 text-stone-700 dark:text-slate-200 group-hover:block'
                      }`}>
                        {d.name.split(' ')[1]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dialect List Selector */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider block">
                Pilih Dialek untuk Detail:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DIALECTS_DATA.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDialect(d)}
                    className={`text-left p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      activeDialect.id === d.id
                        ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-800 shadow-md'
                        : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400'
                    }`}
                  >
                    <div className="truncate font-bold">{d.name.split(' (')[0]}</div>
                    <div className={`text-[10px] truncate ${activeDialect.id === d.id ? 'text-mandar-gold-200' : 'text-stone-400'}`}>
                      {d.regency}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Dialect Profile & Linguistic Notes (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-mandar-gold-100 text-mandar-gold-800 dark:bg-mandar-gold-950 dark:text-mandar-gold-300 text-[10px] font-bold">
                    {activeDialect.regency}
                  </span>
                  <span className="text-xs text-stone-400">
                    {activeDialect.speakerCount}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white mt-1">
                  {activeDialect.name}
                </h3>
                <p className="text-xs text-mandar-maroon-700 dark:text-mandar-gold-400 font-semibold mt-0.5">
                  📍 Cakupan Wilayah: {activeDialect.region}
                </p>
              </div>

              <button
                onClick={() => handlePlayAudio(activeDialect.samplePhrase.mandar)}
                className="self-start sm:self-center flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-semibold text-xs shadow-md transition-colors shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengar Tutur Dialek</span>
              </button>
            </div>

            {/* Characteristic & Phonetics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Karakteristik Linguistik:</span>
                </span>
                <p className="text-stone-700 dark:text-slate-300 leading-relaxed">
                  {activeDialect.characteristics}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-mandar-navy-700 dark:text-sky-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ciri Fonetik & Alofon:</span>
                </span>
                <p className="text-stone-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                  {activeDialect.phoneticNotes}
                </p>
              </div>
            </div>

            {/* Sample Utterance Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-mandar-sand-100 to-mandar-sand-50 dark:from-slate-800 dark:to-slate-800/60 border border-mandar-sand-300 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Contoh Kalimat Tutur Dialek:
              </span>
              <p className="text-base sm:text-lg font-bold text-mandar-maroon-900 dark:text-mandar-gold-200">
                &ldquo;{activeDialect.samplePhrase.mandar}&rdquo;
              </p>
              <p className="text-xs text-stone-600 dark:text-slate-300 italic">
                Artinya: &ldquo;{activeDialect.samplePhrase.indonesia}&rdquo;
              </p>
              <p className="text-[11px] font-mono text-stone-500">
                Transkripsi IPA: {activeDialect.samplePhrase.phonetic}
              </p>
            </div>

            {/* Quick Word Comparison for this dialect */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 dark:text-slate-300 block">
                Kosakata Khas dalam Dialek Ini:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(activeDialect.sampleWords).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs">
                    <span className="text-stone-400 block text-[10px] capitalize">{key}</span>
                    <span className="font-bold text-mandar-maroon-800 dark:text-mandar-gold-300">{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Comparative Dialectology Matrix (Isogloss Table) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-mandar-maroon-700 dark:text-mandar-gold-400" />
              <span>Matriks Perbandingan Kosakata Antar-Dialek (Isoglos)</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Bandingkan variasi leksikal kata yang sama di seluruh wilayah dialek Sulawesi Barat
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={filterWord}
              onChange={(e) => setFilterWord(e.target.value)}
              placeholder="Cari kata perbandingan..."
              className="px-3.5 py-1.5 pl-8 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs outline-none focus:border-mandar-maroon-700"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-mandar-sand-200 dark:border-slate-700 bg-mandar-sand-50 dark:bg-slate-800/80">
                <th className="py-3 px-3 font-bold text-stone-700 dark:text-slate-300">Arti (Gloss)</th>
                <th className="py-3 px-3 font-bold text-mandar-maroon-800 dark:text-mandar-gold-300">Balanipa (Baku)</th>
                <th className="py-3 px-3 font-bold text-stone-700 dark:text-slate-300">Banggae</th>
                <th className="py-3 px-3 font-bold text-stone-700 dark:text-slate-300">Pamboang</th>
                <th className="py-3 px-3 font-bold text-stone-700 dark:text-slate-300">Sendana</th>
                <th className="py-3 px-3 font-bold text-stone-700 dark:text-slate-300">Campalagian</th>
                <th className="py-3 px-3 font-bold text-stone-700 dark:text-slate-300">Malunda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mandar-sand-100 dark:divide-slate-800">
              {filteredComparisonKeys.map((item) => (
                <tr key={item.key} className="hover:bg-mandar-sand-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-stone-800 dark:text-white">
                    {item.label}
                  </td>
                  <td className="py-3 px-3 font-bold text-mandar-maroon-700 dark:text-mandar-gold-400 bg-mandar-gold-50/30 dark:bg-mandar-gold-950/20">
                    {DIALECTS_DATA[0].sampleWords[item.key] || '-'}
                  </td>
                  <td className="py-3 px-3 text-stone-700 dark:text-slate-300">
                    {DIALECTS_DATA[1].sampleWords[item.key] || '-'}
                  </td>
                  <td className="py-3 px-3 text-stone-700 dark:text-slate-300">
                    {DIALECTS_DATA[2].sampleWords[item.key] || '-'}
                  </td>
                  <td className="py-3 px-3 text-stone-700 dark:text-slate-300">
                    {DIALECTS_DATA[3].sampleWords[item.key] || '-'}
                  </td>
                  <td className="py-3 px-3 text-stone-700 dark:text-slate-300">
                    {DIALECTS_DATA[4].sampleWords[item.key] || '-'}
                  </td>
                  <td className="py-3 px-3 text-stone-700 dark:text-slate-300">
                    {DIALECTS_DATA[5].sampleWords[item.key] || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
