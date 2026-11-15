"use client";

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Volume2, 
  Info, 
  Eye, 
  Layers, 
  Check, 
  Palette 
} from 'lucide-react';
import { speakMandar, speakText } from '@/lib/audio';

interface CulturalIllustrationsProps {
  soundEnabled: boolean;
}

export const CulturalIllustrations: React.FC<CulturalIllustrationsProps> = ({ soundEnabled }) => {
  const [selectedSandeqPart, setSelectedSandeqPart] = useState<string>('sombal');
  const [selectedMotif, setSelectedMotif] = useState<string>('salaka');

  const SANDEQ_PARTS: Record<string, { name: string; title: string; desc: string; mdr: string }> = {
    'sombal': {
      name: 'Sombal Tanjaq',
      title: 'Layar Segitiga Gunting Utama',
      desc: 'Layar segitiga khas perahu Sandeq yang dipasang miring menangkap tiupan angin laut barat dan timur. Menghasilkan gaya dorong hidrodinamis yang menjadikan Sandeq perahu tercepat tanpa mesin di Austronesia.',
      mdr: 'sombal tanjaq napake passombal'
    },
    'pallayarang': {
      name: 'Pallayarang',
      title: 'Tiang Layar Utama',
      desc: 'Tiang pancang utama penyangga layar yang dibuat dari bambu petung tua pilihan atau kayu ulin yang sangat lentur namun tahan terhadap terpaan angin badai samudra.',
      mdr: 'pallayarang masseq anna malolo'
    },
    'baratan': {
      name: 'Baratan (Cadik Ganda)',
      title: 'Lengan Penyeimbang Cadik',
      desc: 'Dua pasang lengan bambu melintang di sisi kiri dan kanan badan perahu. Berfungsi menopang keseimbangan perahu saat melaju kencang membelah ombak besar Selat Makassar.',
      mdr: 'baratan ayu bambu dio sesena sandeq'
    },
    'tada': {
      name: 'Tada (Katir Pelampung)',
      title: 'Bilah Pelampung Penyeimbang',
      desc: 'Bilah bambu panjang di ujung baratan yang mengapung di permukaan air laut. Menjaga perahu agar tidak terbalik saat miring diterpa angin kencang.',
      mdr: 'tada mappasimbang ombaq'
    },
    'guling': {
      name: 'Guling (Kemudi Tradisional)',
      title: 'Kemudi Dayung Samping',
      desc: 'Kemudi kayu khusus di buritan belakang yang dioperasikan dengan kemahiran insting navigator passombal untuk mengarahkan haluan perahu melewati karang dan palung laut.',
      mdr: 'guling pandoq napake passombal'
    },
    'pacceko': {
      name: 'Pacceko / Baqba',
      title: 'Ruang Lambung & Dapur Bekal',
      desc: 'Ruang sempit di dalam lambung kayu Sandeq yang digunakan oleh awak (pappalari) untuk menyimpan air tawar, bekal Jepa, sambal, serta perlengkapan memancing.',
      mdr: 'pacceko paqandeang dio lalang kappala'
    }
  };

  const MOTIFS = [
    {
      id: 'salaka',
      name: 'Sureq Salaka',
      meaning: 'Garis Perak Kemurnian',
      desc: 'Motif kotak bergaris putih perak yang melambangkan kemurnian budi pekerti, kejujuran luhur, dan keluhuran kaum bangsawan Mandar.',
      colors: ['#7c1d2d', '#f5f5f4', '#f59e0b', '#7c1d2d'],
      patternType: 'grid-silver'
    },
    {
      id: 'padhadhang',
      name: 'Sureq Padhadhang',
      meaning: 'Bilah Pedang Keberanian',
      desc: 'Motif garis tegas memanjang seperti bilah pedang ksatria Mandar. Melambangkan ketegasan memegang prinsip kebenaran dan pantang menyerah.',
      colors: ['#891b33', '#d97706', '#1e293b', '#b45309'],
      patternType: 'stripes-sword'
    },
    {
      id: 'tappang',
      name: 'Sureq Balo Tappang',
      meaning: 'Kotak Besar Kehormatan Adat',
      desc: 'Motif kotak geometris ukuran besar dengan warna merah tua dan marun. Dikhususkan bagi para tetua adat (Tomakaka) dan pemangku hukum adat.',
      colors: ['#4c0519', '#991b1b', '#f59e0b', '#450a0a'],
      patternType: 'grid-large'
    },
    {
      id: 'marasa',
      name: 'Sureq Marasa',
      meaning: 'Keanggunan Pesta Perkawinan',
      desc: 'Motif kaya warna dengan gradasi benang emas dan ungu yang melambangkan kebahagiaan, kemakmuran, dan keagungan sepasang pengantin.',
      colors: ['#831843', '#f59e0b', '#0284c7', '#701a75'],
      patternType: 'vibrant-wedding'
    }
  ];

  const handlePlayVoice = (text: string) => {
    if (!soundEnabled) return;
    speakText(text, { lang: 'mandar' });
  };

  const activePart = SANDEQ_PARTS[selectedSandeqPart] || SANDEQ_PARTS['sombal'];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* SECTION 1: ILUSTRASI ANATOMI INTERAKTIF PERAHU SANDEQ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-mandar-sand-200 dark:border-slate-800 shadow-xl">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-navy-100 dark:bg-mandar-navy-950 text-mandar-navy-800 dark:text-sky-300 border border-mandar-navy-200 dark:border-mandar-navy-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Diagram Vektor Ilustrasi Interaktif</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Anatomi Visual Perahu Layar Sandeq
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 mt-1 leading-relaxed">
            Klik pada bagian-bagian perahu layar Sandeq di bawah ini untuk melihat penjelasan leksikografis, 
            arti fungsinya, serta mendengarkan pelafalan bahasa Mandar aslinya.
          </p>
        </div>

        {/* Visual Schematic Diagram (SVG) */}
        <div className="relative w-full bg-gradient-to-b from-sky-950 via-mandar-navy-900 to-slate-950 rounded-3xl p-4 sm:p-8 border border-mandar-navy-800 overflow-hidden shadow-2xl mb-8">
          
          {/* Sea Wave Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="wave-pattern" width="100" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="#38bdf8" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#wave-pattern)" />
            </svg>
          </div>

          {/* SVG Illustration of Sandeq Boat */}
          <div className="relative z-10 max-w-2xl mx-auto py-6">
            <svg viewBox="0 0 800 450" className="w-full h-auto drop-shadow-2xl">
              
              {/* Sky and Sun Background */}
              <circle cx="680" cy="90" r="45" fill="#f59e0b" opacity="0.4" filter="blur(8px)" />
              <circle cx="680" cy="90" r="30" fill="#fbbf24" opacity="0.8" />

              {/* Water Line */}
              <path d="M 50 380 Q 200 370 400 380 T 750 380 L 750 430 L 50 430 Z" fill="#0284c7" opacity="0.6" />
              <path d="M 30 390 Q 250 400 500 388 T 770 395" stroke="#7dd3fc" strokeWidth="3" fill="none" opacity="0.8" />

              {/* Outrigger tada (Cadik Pelampung Bawah) */}
              <g 
                onClick={() => setSelectedSandeqPart('tada')}
                className="cursor-pointer group"
              >
                <path 
                  d="M 120 400 Q 380 415 640 395 Q 650 392 630 388 Q 380 400 130 392 Z" 
                  fill={selectedSandeqPart === 'tada' ? '#fbbf24' : '#d4af37'} 
                  stroke="#ffffff" 
                  strokeWidth={selectedSandeqPart === 'tada' ? '3' : '1'}
                />
                <text x="380" y="425" fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">
                  ▶ Tada (Katir Cadik)
                </text>
              </g>

              {/* Outrigger Arms (Baratan) */}
              <g 
                onClick={() => setSelectedSandeqPart('baratan')}
                className="cursor-pointer"
              >
                {/* Front Baratan */}
                <path d="M 320 330 L 220 395" stroke={selectedSandeqPart === 'baratan' ? '#fbbf24' : '#e2e8f0'} strokeWidth="7" strokeLinecap="round" />
                {/* Rear Baratan */}
                <path d="M 520 330 L 570 390" stroke={selectedSandeqPart === 'baratan' ? '#fbbf24' : '#e2e8f0'} strokeWidth="7" strokeLinecap="round" />
                <text x="210" y="360" fill="#cbd5e1" fontSize="12" fontWeight="bold">
                  ▶ Baratan (Lengan)
                </text>
              </g>

              {/* Main Hull (Lambung Kayu Sandeq / Batu Sandeq) */}
              <g 
                onClick={() => setSelectedSandeqPart('pacceko')}
                className="cursor-pointer"
              >
                {/* Sleek narrow hull shape */}
                <path 
                  d="M 160 365 Q 400 380 660 320 Q 640 350 400 365 Q 240 365 160 365 Z" 
                  fill={selectedSandeqPart === 'pacceko' ? '#991b1b' : '#7c1d2d'} 
                  stroke="#fbbf24" 
                  strokeWidth="2" 
                />
                <circle cx="200" cy="365" r="5" fill="#f59e0b" />
                <circle cx="620" cy="330" r="5" fill="#f59e0b" />
                <text x="440" y="355" fill="#fecdd3" fontSize="11" fontWeight="bold">
                  Lambung Sandeq (Pacceko)
                </text>
              </g>

              {/* Rudder (Guling) at Stern */}
              <g 
                onClick={() => setSelectedSandeqPart('guling')}
                className="cursor-pointer"
              >
                <path d="M 180 360 L 140 405" stroke={selectedSandeqPart === 'guling' ? '#fbbf24' : '#f97316'} strokeWidth="5" strokeLinecap="round" />
                <path d="M 135 395 L 125 415 L 145 410 Z" fill="#ea580c" />
                <text x="90" y="385" fill="#fdba74" fontSize="12" fontWeight="bold">
                  ▶ Guling
                </text>
              </g>

              {/* Mast (Pallayarang) */}
              <g 
                onClick={() => setSelectedSandeqPart('pallayarang')}
                className="cursor-pointer"
              >
                <line x1="420" y1="340" x2="400" y2="70" stroke={selectedSandeqPart === 'pallayarang' ? '#fbbf24' : '#f8fafc'} strokeWidth="6" strokeLinecap="round" />
                <text x="310" y="110" fill="#f8fafc" fontSize="12" fontWeight="bold">
                  ▶ Pallayarang (Tiang)
                </text>
              </g>

              {/* Triangular Sail (Sombal Tanjaq) */}
              <g 
                onClick={() => setSelectedSandeqPart('sombal')}
                className="cursor-pointer group"
              >
                <path 
                  d="M 400 70 L 650 280 L 320 280 Z" 
                  fill={selectedSandeqPart === 'sombal' ? '#ffffff' : '#f8fafc'} 
                  fillOpacity={selectedSandeqPart === 'sombal' ? '0.95' : '0.85'} 
                  stroke="#fbbf24" 
                  strokeWidth={selectedSandeqPart === 'sombal' ? '4' : '2'}
                />
                {/* Traditional Decorative Sail Stripes */}
                <path d="M 420 130 L 610 280" stroke="#891b33" strokeWidth="6" />
                <path d="M 445 170 L 575 280" stroke="#f59e0b" strokeWidth="5" />
                <path d="M 470 210 L 545 280" stroke="#0284c7" strokeWidth="5" />
                
                <text x="460" y="240" fill="#78350f" fontSize="14" fontWeight="extrabold">
                  SOMBAL TANJAQ
                </text>
              </g>

              {/* Wind Lines */}
              <path d="M 240 140 Q 280 135 320 145" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.8" />
              <path d="M 260 180 Q 300 175 350 185" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.8" />
            </svg>
          </div>

          {/* Interactive Component Detail Drawer */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-mandar-gold-400">
                  Komponen Terpilih:
                </span>
                <span className="text-xl font-extrabold text-white">
                  {activePart.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-mandar-maroon-600/80 text-white">
                  {activePart.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-mandar-sand-200 leading-relaxed max-w-2xl">
                {activePart.desc}
              </p>
            </div>

            <button
              onClick={() => handlePlayVoice(activePart.name + ". " + activePart.mdr)}
              className="px-4 py-2.5 rounded-xl bg-mandar-gold-500 hover:bg-mandar-gold-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shrink-0 transition-all shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Pengucapan</span>
            </button>
          </div>
        </div>

        {/* Quick Part Navigation Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 dark:text-slate-400 mr-2">Pilih Bagian:</span>
          {Object.entries(SANDEQ_PARTS).map(([key, part]) => (
            <button
              key={key}
              onClick={() => setSelectedSandeqPart(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedSandeqPart === key
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-700 shadow-sm'
                  : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: GALERI VISUAL MOTIF TENUN SUTRA LIPAQ SAQBE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-mandar-sand-200 dark:border-slate-800 shadow-xl">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-100 dark:bg-mandar-gold-950 text-mandar-gold-800 dark:text-mandar-gold-300 border border-mandar-gold-200 dark:border-mandar-gold-800 text-xs font-semibold mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Kriya Tekstil Sutra Tradisional Mandar</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Galeri Pola Visual Motif Lipaq Saqbe (Sureq)
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 mt-1 leading-relaxed">
            Setiap garis kotak dan kombinasi warna pada sarung tenun sutra Mandar memiliki 
            makna filosofis dan stratifikasi sosial yang dijunjung tinggi oleh masyarakat Balanipa dan Pitu Ulunna Salu.
          </p>
        </div>

        {/* Motif Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {MOTIFS.map((motif) => (
            <div
              key={motif.id}
              onClick={() => setSelectedMotif(motif.id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedMotif === motif.id
                  ? 'border-mandar-maroon-600 dark:border-mandar-gold-400 bg-mandar-sand-50/80 dark:bg-slate-800 shadow-lg scale-[1.02]'
                  : 'border-mandar-sand-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-mandar-maroon-400'
              }`}
            >
              <div>
                {/* Visual Geometric Weaving Pattern Box */}
                <div 
                  className="w-full h-36 rounded-2xl mb-4 overflow-hidden shadow-inner border border-stone-200 dark:border-slate-700 relative"
                  style={{
                    backgroundColor: motif.colors[0],
                    backgroundImage: `
                      linear-gradient(90deg, ${motif.colors[1]} 2px, transparent 2px),
                      linear-gradient(${motif.colors[2]} 2px, transparent 2px),
                      linear-gradient(90deg, ${motif.colors[3]} 8px, transparent 8px),
                      linear-gradient(${motif.colors[0]} 8px, transparent 8px)
                    `,
                    backgroundSize: '24px 24px, 24px 24px, 48px 48px, 48px 48px'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 backdrop-contrast-125" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white uppercase tracking-wider">
                    {motif.name}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-mandar-maroon-900 dark:text-mandar-gold-300 mb-1">
                  {motif.name}
                </h4>
                <span className="text-xs font-semibold text-mandar-navy-700 dark:text-sky-400 block mb-2">
                  {motif.meaning}
                </span>
                <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                  {motif.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-mandar-sand-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">Tenun Gedongan</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(motif.name + ". " + motif.meaning);
                  }}
                  className="p-1.5 rounded-lg text-mandar-maroon-700 dark:text-mandar-gold-400 hover:bg-stone-100 dark:hover:bg-slate-700"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
