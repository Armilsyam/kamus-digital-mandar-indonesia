"use client";

import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  Volume2, 
  Info, 
  Eye, 
  Layers, 
  Check, 
  Palette,
  Home,
  Music,
  Utensils,
  Fish,
  Search,
  BookOpen,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { speakText } from '@/lib/audio';

interface CulturalIllustrationsProps {
  soundEnabled: boolean;
}

export interface IllustratedItem {
  id: string;
  category: 'maritim' | 'tenun' | 'arsitektur' | 'seni' | 'kuliner' | 'alam';
  nameMandar: string;
  lontara: string;
  nameId: string;
  literalMeaning: string;
  nameEn: string;
  description: string;
  culturalReference: string;
  academicSource: string;
  exampleSentenceMdr: string;
  exampleSentenceId: string;
  tags: string[];
  svgType: string;
}

export const CulturalIllustrations: React.FC<CulturalIllustrationsProps> = ({ soundEnabled }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'maritim' | 'tenun' | 'arsitektur' | 'seni' | 'kuliner' | 'alam'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('sandeq-sombal');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const ILLUSTRATED_DATABASE: IllustratedItem[] = [
    // 1. MARITIM & PERAHU SANDEQ
    {
      id: 'sandeq-sombal',
      category: 'maritim',
      nameMandar: 'Sombal Tanjaq',
      lontara: 'ᨔᨚᨅ ᨈᨍ',
      nameId: 'Layar Segitiga Gunting Sandeq',
      literalMeaning: 'Sombal (layar) + tanjaq (lancip / guntingan condong)',
      nameEn: 'Traditional Triangular Scissors Sail',
      description: 'Layar segitiga condong khas perahu Sandeq yang dirancang aerodinamis untuk menangkap angin laut dari berbagai penjuru, menjadikannya perahu layar tercepat tanpa mesin di Austronesia.',
      culturalReference: 'Melambangkan kecepatan berpikir dan ketajaman naluri bahari para passombal (pelaut Mandar) yang pantang mundur di tengah badai.',
      academicSource: 'Horst H. Liebner & Ridwan Alimuddin (2010), "Perahu Sandeq dan Kebudayaan Bahari Mandar".',
      exampleSentenceMdr: 'Nalanda sombal tanjaq anging baraq sau di sasiq malambiq.',
      exampleSentenceId: 'Layar gunting diterpa angin barat jauh di atas laut yang tenang.',
      tags: ['Sandeq', 'Layar', 'Maritim', 'Kecepatan'],
      svgType: 'sombal'
    },
    {
      id: 'sandeq-pallayarang',
      category: 'maritim',
      nameMandar: 'Pallayarang',
      lontara: 'ᨄᨒᨐᨑ',
      nameId: 'Tiang Layar Utama',
      literalMeaning: 'Pal-layarang (tempat bertumpunya pelayaran)',
      nameEn: 'Main Mast',
      description: 'Tiang utama penyangga layar yang dibuat dari bambu petung tua pilihan atau kayu ulin yang sangat lentur namun kuat menahan terpaan badai Selat Makassar.',
      culturalReference: 'Menjadi simbol keteguhan prinsip hidup suku Mandar: kokoh menopang beban tanpa patah.',
      academicSource: 'Balai Bahasa Sulawesi Selatan (2025), Kamus Bahasa Mandar-Indonesia, hlm. 248.',
      exampleSentenceMdr: 'Masseq pallayarang napake passombal mesombay.',
      exampleSentenceId: 'Kokoh tiang layar yang dipakai para pelaut berlayar.',
      tags: ['Tiang', 'Bambu', 'Konstruksi'],
      svgType: 'pallayarang'
    },
    {
      id: 'sandeq-baratan',
      category: 'maritim',
      nameMandar: 'Baratan & Tada',
      lontara: 'ᨅᨑᨈ ᨕᨊ ᨈᨉ',
      nameId: 'Cadik Ganda & Katir Pelampung',
      literalMeaning: 'Baratan (lengan penyeimbang) + Tada (katir pelampung cadik)',
      nameEn: 'Outrigger Arms and Floats',
      description: 'Dua pasang lengan bambu melintang di sisi kiri dan kanan badan perahu dengan katir tada di ujungnya, berfungsi menyeimbangkan perahu saat miring membelah ombak besar.',
      culturalReference: 'Mengajarkan filosofi keseimbangan hidup (mappasimbang) antara ikhtiar manusia dan ketetapan alam semesta.',
      academicSource: 'Dinas Kebudayaan Sulawesi Barat (2021), Inventarisasi Warisan Budaya Takbenda Mandar.',
      exampleSentenceMdr: 'Baratan ayu bambu mappasimbang ombaq sasiq.',
      exampleSentenceId: 'Lengan cadik bambu menyeimbangkan ombak lautan.',
      tags: ['Cadik', 'Penyeimbang', 'Ombak'],
      svgType: 'baratan'
    },
    {
      id: 'sandeq-guling',
      category: 'maritim',
      nameMandar: 'Guling',
      lontara: 'ᨁᨘᨒᨗ',
      nameId: 'Kemudi Dayung Samping',
      literalMeaning: 'Guling (kemudi dayung tradisional buritan)',
      nameEn: 'Traditional Side Rudder',
      description: 'Kemudi kayu berbentuk bilah dayung panjang di buritan yang dikendalikan oleh juru mudi (pappalari) untuk mengarahkan haluan perahu melewati karang terjal.',
      culturalReference: 'Melambangkan kepemimpinan yang arif dan kepiawaian membaca tanda-tanda zaman.',
      academicSource: 'Prof. Dr. H. Suradi Yasil (2018), Leksikon Bahari Mandar.',
      exampleSentenceMdr: 'Guling pandoq napake passombal mengolo lopi.',
      exampleSentenceId: 'Kemudi panjang dipakai pelaut mengarahkan perahu.',
      tags: ['Kemudi', 'Arah', 'Kepemimpinan'],
      svgType: 'guling'
    },

    // 2. KRIYA TENUN SUTRA LIPAQ SAQBE
    {
      id: 'tenun-salaka',
      category: 'tenun',
      nameMandar: 'Sureq Salaka',
      lontara: 'ᨔᨘᨑᨙ ᨔᨒᨀ',
      nameId: 'Motif Garis Perak Kemurnian',
      literalMeaning: 'Sureq (corak / garis) + Salaka (perak murni)',
      nameEn: 'Silver Line Silk Pattern',
      description: 'Motif kain tenun sutra Mandar dengan dominasi garis putih keperakan dan marun yang ditenun dengan alat tenun gedongan tradisional.',
      culturalReference: 'Melambangkan kesucian hati, kejujuran luhur, dan keluhuran kaum bangsawan (Maraqdia) Mandar.',
      academicSource: 'Yayasan Tenun Sutra Mandar (2019), Ragam Motif Tenun Tradisional Lipaq Saqbe.',
      exampleSentenceMdr: 'Napakemi indoq sureq salaka dio acara adat.',
      exampleSentenceId: 'Ibu mengenakan sarung sureq salaka di upacara adat.',
      tags: ['Lipaq Saqbe', 'Perak', 'Kemurnian', 'Bangsawan'],
      svgType: 'salaka'
    },
    {
      id: 'tenun-padhadhang',
      category: 'tenun',
      nameMandar: 'Sureq Padhadhang',
      lontara: 'ᨔᨘᨑᨙ ᨄᨉᨉ',
      nameId: 'Motif Bilah Pedang Keberanian',
      literalMeaning: 'Padhadhang (bilah pedang / keperkasaan)',
      nameEn: 'Sword Blade Motif',
      description: 'Motif garis memanjang tegas tegak lurus menyerupai bilah pedang ksatria Mandar dengan perpaduan warna merah darah dan jingga keemasan.',
      culturalReference: 'Melambangkan prinsip siriq (harga diri), ketegasan memegang sumpah, dan keberanian para prajurit pembela litaq Mandar.',
      academicSource: 'Balai Pelestarian Nilai Budaya Sulawesi Selatan (2020), Simbolisme Budaya Lipaq Saqbe.',
      exampleSentenceMdr: 'Sureq padhadhang tanda kaboranianna to-Mandar.',
      exampleSentenceId: 'Sureq padhadhang tanda keberanian orang Mandar.',
      tags: ['Pedang', 'Keberanian', 'Siriq'],
      svgType: 'padhadhang'
    },
    {
      id: 'tenun-tappang',
      category: 'tenun',
      nameMandar: 'Sureq Balo Tappang',
      lontara: 'ᨔᨘᨑᨙ ᨅᨒᨚ ᨈᨄ',
      nameId: 'Motif Kotak Besar Kehormatan Adat',
      literalMeaning: 'Balo (kotak besar) + Tappang (pembesar adat / Tomakaka)',
      nameEn: 'Large Checkered Traditional Pattern',
      description: 'Motif kotak-kotak berukuran besar berwibawa dengan warna gelap merah marun pekat yang menjadi pakaian kebesaran para tetua pemangku adat.',
      culturalReference: 'Melambangkan kelapangan dada pemimpin dalam mengayomi seluruh lapisan masyarakat adat.',
      academicSource: 'Prof. Dr. H. Suradi Yasil (2007), Adat dan Tradisi Masyarakat Balanipa.',
      exampleSentenceMdr: 'Tomakaka mappake sureq balo tappang mappalolang hukum adat.',
      exampleSentenceId: 'Tetua adat mengenakan sureq balo tappang menjalankan hukum adat.',
      tags: ['Tetua Adat', 'Kotak Besar', 'Kebijaksanaan'],
      svgType: 'tappang'
    },

    // 3. ARSITEKTUR RUMAH TRADISIONAL MANDAR (BOYANG)
    {
      id: 'boyang-adaq',
      category: 'arsitektur',
      nameMandar: 'Boyang Adaq',
      lontara: 'ᨅᨚᨐ ᨕᨉ',
      nameId: 'Rumah Adat Istana Panggung Mandar',
      literalMeaning: 'Boyang (rumah) + Adaq (adat / bangsawan)',
      nameEn: 'Traditional Mandar Stilt Palace',
      description: 'Rumah panggung kayu khas Mandar dengan bumbungan bersusun tiga hingga lima (tumbaq layar) yang mencerminkan derajat kebangsawanan para Maraqdia.',
      culturalReference: 'Menghadap ke arah laut dan membelakangi gunung, mencerminkan falsafah orientasi ruang bahari dan daratan.',
      academicSource: 'Muthalib dkk. (1974), Arsitektur Tradisional Daerah Mandar Sulawesi Selatan.',
      exampleSentenceMdr: 'Boyang adaq marasa dipandangi di Tinambung.',
      exampleSentenceId: 'Rumah adat megah dipandang di Tinambung.',
      tags: ['Boyang', 'Istana', 'Arsitektur', 'Kayu'],
      svgType: 'boyang'
    },
    {
      id: 'boyang-lego',
      category: 'arsitektur',
      nameMandar: 'Lego-Lego',
      lontara: 'ᨒᨙᨁᨚ ᨒᨙᨁᨚ',
      nameId: 'Beranda / Balkon Rumah Panggung',
      literalMeaning: 'Lego-lego (teras depan bertirai kayu)',
      nameEn: 'Front Veranda Terrace',
      description: 'Ruang terbuka beratap di bagian depan tangga rumah Boyang, tempat menerima tamu, berbincang santai, dan bermusyawarah keluarga.',
      culturalReference: 'Simbol keterbukaan dan keramahtamahan (paqmai malambiq) masyarakat Mandar menyambut setiap kerabat yang berkunjung.',
      academicSource: 'Dinas Pekerjaan Umum & Kebudayaan Polman (2019), Tipologi Rumah Tradisional Boyang.',
      exampleSentenceMdr: 'Masannang paqmai tudang di lego-lego madondong subu.',
      exampleSentenceId: 'Senang perasaan duduk di beranda lego-lego pada subuh pagi.',
      tags: ['Beranda', 'Musyawarah', 'Keramahan'],
      svgType: 'lego'
    },

    // 4. SENI PERTUNJUKAN, MUSIK & TRADISI ADAT
    {
      id: 'seni-sayyang',
      category: 'seni',
      nameMandar: 'Sayyang Pattuqduq',
      lontara: 'ᨔᨐ ᨄᨈᨘᨉᨘ',
      nameId: 'Kuda Menari Tradisional Mandar',
      literalMeaning: 'Sayyang (kuda) + Pattuqduq (yang menari mengikuti irama)',
      nameEn: 'Traditional Dancing Horse Ceremony',
      description: 'Kuda terlatih berhiaskan pelana manik-manik dan kalung genta perak yang menari mengikuti tabuhan rebana (parrawana) untuk mengarak anak yang telah khatam Al-Qur’an.',
      culturalReference: 'Perpaduan harmonis antara syiar Islam, apresiasi pendidikan anak, dan kebanggaan budaya berkuda masyarakat Mandar.',
      academicSource: 'BPNB Sulsel (2018), "Sayyang Pattuqduq: Warisan Budaya Takbenda Mandar".',
      exampleSentenceMdr: 'Mattuqduq sayyang diiringi tabuhan parrawana.',
      exampleSentenceId: 'Menari kuda diiringi tabuhan rebana.',
      tags: ['Kuda Menari', 'Khatam Quran', 'Tradisi'],
      svgType: 'sayyang'
    },
    {
      id: 'seni-calong',
      category: 'seni',
      nameMandar: 'Calong',
      lontara: 'ᨌᨒᨚ',
      nameId: 'Alat Musik Perkusi Bilah Bambu',
      literalMeaning: 'Calong (gambang bilah bambu di atas tabung kelapa)',
      nameEn: 'Bamboo Xylophone Coconut Resonator',
      description: 'Alat musik tradisional Mandar yang terbuat dari empat bilah bambu pilihan yang diletakkan di atas buah kelapa kering sebagai resonator resonansi suara.',
      culturalReference: 'Dahulu dimainkan oleh para petani dan nelayan di gubuk sawah atau tepi pantai untuk menghibur diri melepas lelah.',
      academicSource: 'Suradi Yasil (2001), Ensiklopedia Musik dan Seni Mandar, hlm. 72.',
      exampleSentenceMdr: 'Manyamang saqrana calong di bongi malambiq.',
      exampleSentenceId: 'Merdu suaranya calong di malam yang tenang.',
      tags: ['Calong', 'Musik', 'Bambu', 'Kelapa'],
      svgType: 'calong'
    },

    // 5. KULINER TRADISIONAL & PANGAN PESISIR
    {
      id: 'kuliner-jepa',
      category: 'kuliner',
      nameMandar: 'Jepa Panettean',
      lontara: 'ᨍᨙᨄ ᨄᨊᨙᨈᨕ',
      nameId: 'Lempeng Singkong Bakar Panettean',
      literalMeaning: 'Jepa (lempengan singkong) + Panettean (wajan tanah liat bakar)',
      nameEn: 'Traditional Roasted Cassava Flatbread',
      description: 'Makanan pokok tradisional suku Mandar berbahan singkong parut yang diperas airnya, dipipihkan di atas wajan tanah liat panettean di atas bara api kayu.',
      culturalReference: 'Makanan andalan para passombal karena tahan disimpan berbulan-bulan di tengah laut tanpa basi.',
      academicSource: 'Idham Khalid Bodi (2016), Gastronomi Bahari Mandar: Ketahanan Pangan Laut.',
      exampleSentenceMdr: 'Mande jepa siola bau peapi manyamang toddong.',
      exampleSentenceId: 'Makan jepa bersama ikan masak bau peapi sangat enak sekali.',
      tags: ['Jepa', 'Singkong', 'Kuliner', 'Bekal Laut'],
      svgType: 'jepa'
    },
    {
      id: 'kuliner-baupeapi',
      category: 'kuliner',
      nameMandar: 'Bau Peapi',
      lontara: 'ᨅᨕᨘ ᨄᨙᨕᨄᨗ',
      nameId: 'Ikan Masak Kuah Kuning Khas Mandar',
      literalMeaning: 'Bau (ikan) + Peapi (dimasak kuah)',
      nameEn: 'Mandar Yellow Fish Stew with Mangifera',
      description: 'Hidangan ikan laut segar (tuna, cakalang, atau kembung) yang dimasak dengan kunyit, minyak kelapa murni mandar, cabai rawit, dan asam mangga kering (pao leqle).',
      culturalReference: 'Mencerminkan kekayaan rempah pesisir dan kearifan pengolahan hasil tangkapan laut segar para nelayan Mandar.',
      academicSource: 'Dinas Pariwisata Sulawesi Barat (2022), Kuliner Warisan Leluhur Mandar.',
      exampleSentenceMdr: 'Bau peapi mapedas anna manyamang nasurung jepa.',
      exampleSentenceId: 'Ikan masak pedas dan sedap dinikmati bersama jepa.',
      tags: ['Ikan', 'Bau Peapi', 'Kunyit', 'Mangga'],
      svgType: 'baupeapi'
    },

    // 6. FLORA, FAUNA & EKOSISTEM BAHARI
    {
      id: 'alam-tuing',
      category: 'alam',
      nameMandar: 'Bau Tuing-Tuing',
      lontara: 'ᨅᨕᨘ ᨈᨘᨕᨗ ᨈᨘᨕᨗ',
      nameId: 'Ikan Terbang (Flying Fish)',
      literalMeaning: 'Tuing-tuing (ikan bersayap yang melayang di atas ombak)',
      nameEn: 'Flying Fish (Exocoetidae)',
      description: 'Ikan laut pelagis yang mampu meluncur terbang melompati permukaan ombak. Telurnya (taro tuing-tuing) menjadi komoditas ekspor berharga tinggi di Majene dan Polewali.',
      culturalReference: 'Menjadi penggerak ekonomi nelayan Mandar dan lambang kegesitan mengarungi samudra lepas.',
      academicSource: 'Fakultas Ilmu Kelautan & Perikanan Unhas (2019), Potensi Perikanan Ikan Terbang Teluk Mandar.',
      exampleSentenceMdr: 'Meboroq nelayan manala taro bau tuing-tuing.',
      exampleSentenceId: 'Berangkat nelayan memanen telur ikan terbang.',
      tags: ['Ikan Terbang', 'Telur Ikan', 'Komoditas', 'Laut'],
      svgType: 'tuing'
    }
  ];

  // Filtering and Searching
  const filteredItems = useMemo(() => {
    return ILLUSTRATED_DATABASE.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = searchQuery.trim() === '' || 
        item.nameMandar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const activeItem = useMemo(() => {
    return ILLUSTRATED_DATABASE.find(item => item.id === selectedItemId) || ILLUSTRATED_DATABASE[0];
  }, [selectedItemId]);

  const handlePlayVoice = (text: string) => {
    if (!soundEnabled) return;
    speakText(text, { 
      lang: 'mandar',
      gender: 'female',
      voiceProfile: 'indoq'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-navy-950 via-mandar-maroon-900 to-slate-950 text-white p-7 sm:p-9 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Kamus Bergambar Ilustratif & Ensiklopedia Budaya Mandar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Ilustrasi Visual & Terjemahan Budaya Mandar
          </h2>
          <p className="text-mandar-sand-200 text-xs sm:text-sm leading-relaxed">
            Eksplorasi visual artefak maritim, kriya tenun sutra, arsitektur Boyang, tradisi adat, pangan bahari, hingga flora-fauna khas Mandar lengkap dengan terjemahan harfiah, aksara Lontara, dan rujukan ilmiah.
          </p>

          {/* Quick Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <Layers className="w-4 h-4 text-mandar-gold-400" />
              <span>Kategori: <strong>6 Bidang Budaya</strong></span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Rujukan Ilmiah: <strong>Balai Bahasa & BPNB</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-mandar-sand-200 dark:border-slate-800 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Koleksi' },
            { id: 'maritim', label: 'Perahu Sandeq' },
            { id: 'tenun', label: 'Tenun Lipaq Saqbe' },
            { id: 'arsitektur', label: 'Rumah Boyang' },
            { id: 'seni', label: 'Seni & Tradisi' },
            { id: 'kuliner', label: 'Pangan & Kuliner' },
            { id: 'alam', label: 'Fauna & Bahari' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-mandar-maroon-700 text-white shadow-md'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lema, arti, atau istilah..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs outline-none focus:border-mandar-maroon-700 text-stone-900 dark:text-white"
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT ACTIVE ITEM DETAIL, RIGHT GRID BROWSER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE VISUAL SCHEMATIC & COMPREHENSIVE CITATION (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-xl space-y-6">
            
            {/* Visual Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-mandar-maroon-700 dark:text-mandar-gold-400 bg-mandar-maroon-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-mandar-maroon-200 dark:border-slate-700">
                  {activeItem.category.toUpperCase()} • {activeItem.nameEn}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mt-2">
                  {activeItem.nameMandar}
                </h3>
                <p className="font-lontara text-xl text-mandar-maroon-700 dark:text-mandar-gold-300 mt-0.5">
                  {activeItem.lontara}
                </p>
                <p className="text-sm font-semibold text-stone-600 dark:text-slate-300">
                  {activeItem.nameId}
                </p>
              </div>

              {/* Pronunciation Audio Button */}
              <button
                onClick={() => handlePlayVoice(activeItem.nameMandar + ". " + activeItem.nameId + ". " + activeItem.exampleSentenceMdr)}
                className="px-4 py-2.5 rounded-2xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs flex items-center space-x-2 shrink-0 shadow-md transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengarkan Suara Asli</span>
              </button>
            </div>

            {/* INTERACTIVE SVG VISUAL DISPLAY */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-900 to-mandar-navy-950 border border-mandar-navy-800 p-4 flex items-center justify-center overflow-hidden shadow-inner">
              
              {/* Sombal Tanjaq Sail Drawing */}
              {activeItem.svgType === 'sombal' && (
                <svg viewBox="0 0 500 280" className="w-full h-full max-h-64 drop-shadow-2xl">
                  <path d="M 50 250 Q 250 240 450 250" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.6" />
                  <path d="M 240 40 L 410 210 L 170 210 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="4" />
                  <path d="M 260 80 L 375 210" stroke="#891b33" strokeWidth="6" />
                  <path d="M 285 120 L 345 210" stroke="#f59e0b" strokeWidth="5" />
                  <line x1="240" y1="230" x2="240" y2="35" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 120 225 Q 250 235 380 210" stroke="#991b1b" strokeWidth="8" strokeLinecap="round" />
                  <text x="250" y="270" fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ▶ Sombal Tanjaq (Layar Segitiga Gunting Sandeq)
                  </text>
                </svg>
              )}

              {/* Pallayarang Mast Drawing */}
              {activeItem.svgType === 'pallayarang' && (
                <svg viewBox="0 0 500 280" className="w-full h-full max-h-64 drop-shadow-2xl">
                  <path d="M 40 250 Q 250 240 460 250" stroke="#38bdf8" strokeWidth="2" fill="none" />
                  <line x1="250" y1="240" x2="250" y2="30" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
                  <line x1="250" y1="40" x2="160" y2="230" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="250" y1="40" x2="340" y2="230" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                  <path d="M 170 235 L 330 235" stroke="#7c1d2d" strokeWidth="10" strokeLinecap="round" />
                  <text x="250" y="270" fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ▶ Pallayarang (Tiang Utama Bambu Petung / Ulin)
                  </text>
                </svg>
              )}

              {/* Baratan Outrigger Drawing */}
              {activeItem.svgType === 'baratan' && (
                <svg viewBox="0 0 500 280" className="w-full h-full max-h-64 drop-shadow-2xl">
                  <path d="M 60 210 Q 250 225 440 210 Q 450 205 430 200 Q 250 215 70 205 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                  <path d="M 200 130 L 140 205" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 300 130 L 360 205" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 180 130 L 320 130" stroke="#7c1d2d" strokeWidth="12" strokeLinecap="round" />
                  <text x="250" y="260" fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ▶ Baratan (Lengan Cadik) & Tada (Katir Bambu Pelampung)
                  </text>
                </svg>
              )}

              {/* Weaving Patterns */}
              {(activeItem.svgType === 'salaka' || activeItem.svgType === 'padhadhang' || activeItem.svgType === 'tappang') && (
                <div 
                  className="w-full h-full rounded-xl overflow-hidden border border-white/20 shadow-inner relative flex items-center justify-center"
                  style={{
                    backgroundColor: activeItem.svgType === 'salaka' ? '#7c1d2d' : activeItem.svgType === 'padhadhang' ? '#891b33' : '#4c0519',
                    backgroundImage: activeItem.svgType === 'salaka'
                      ? 'linear-gradient(90deg, #f5f5f4 2px, transparent 2px), linear-gradient(#f59e0b 2px, transparent 2px)'
                      : activeItem.svgType === 'padhadhang'
                        ? 'linear-gradient(90deg, #d97706 6px, transparent 6px), linear-gradient(#1e293b 2px, transparent 2px)'
                        : 'linear-gradient(90deg, #991b1b 16px, transparent 16px), linear-gradient(#f59e0b 4px, transparent 4px)',
                    backgroundSize: activeItem.svgType === 'tappang' ? '64px 64px' : '28px 28px'
                  }}
                >
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/20">
                    <p className="font-extrabold text-sm text-mandar-gold-300">{activeItem.nameMandar}</p>
                    <p className="text-xs text-white/80">{activeItem.nameId}</p>
                  </div>
                </div>
              )}

              {/* Boyang Stilt Palace Drawing */}
              {activeItem.svgType === 'boyang' && (
                <svg viewBox="0 0 500 280" className="w-full h-full max-h-64 drop-shadow-2xl">
                  {/* Roof Tumbaq Layar */}
                  <polygon points="250,30 110,120 390,120" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                  <polygon points="250,55 140,120 360,120" fill="#92400e" opacity="0.6" />
                  {/* House Body */}
                  <rect x="140" y="120" width="220" height="70" fill="#b45309" stroke="#fde68a" strokeWidth="2" />
                  <rect x="220" y="135" width="40" height="55" fill="#451a03" />
                  {/* Stilts (Alliri) */}
                  {[150, 190, 230, 270, 310, 350].map((x, i) => (
                    <line key={i} x1={x} y1="190" x2={x} y2="260" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" />
                  ))}
                  <text x="250" y="275" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle">
                    ▶ Boyang Adaq (Rumah Panggung Berbumbungan Tiga)
                  </text>
                </svg>
              )}

              {/* Sayyang Pattuqduq Drawing */}
              {activeItem.svgType === 'sayyang' && (
                <svg viewBox="0 0 500 280" className="w-full h-full max-h-64 drop-shadow-2xl">
                  <circle cx="250" cy="120" r="45" fill="#f59e0b" opacity="0.2" />
                  <path d="M 180 180 Q 220 120 280 110 Q 320 100 350 70 Q 360 85 340 120 Q 350 150 320 190 Z" fill="#ffffff" stroke="#fbbf24" strokeWidth="3" />
                  <path d="M 260 110 Q 290 140 270 180" fill="#991b1b" />
                  <line x1="200" y1="180" x2="190" y2="245" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                  <line x1="230" y1="180" x2="240" y2="225" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="310" y2="245" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                  <text x="250" y="270" fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ▶ Sayyang Pattuqduq (Kuda Menari Mandar)
                  </text>
                </svg>
              )}

              {/* Jepa / Kuliner / Fauna Fallback Graphics */}
              {(activeItem.svgType === 'jepa' || activeItem.svgType === 'baupeapi' || activeItem.svgType === 'tuing' || activeItem.svgType === 'calong' || activeItem.svgType === 'guling' || activeItem.svgType === 'lego') && (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="p-4 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/40 mb-2">
                    {activeItem.category === 'kuliner' ? <Utensils className="w-10 h-10" /> : activeItem.category === 'alam' ? <Fish className="w-10 h-10" /> : activeItem.category === 'seni' ? <Music className="w-10 h-10" /> : <Home className="w-10 h-10" />}
                  </div>
                  <h4 className="font-extrabold text-lg text-white">{activeItem.nameMandar}</h4>
                  <p className="text-xs text-mandar-sand-200 mt-1 max-w-md">{activeItem.literalMeaning}</p>
                </div>
              )}

            </div>

            {/* Description & Cultural Lore */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 block mb-1">
                  Uraian & Fungsi Leksikografis:
                </span>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-slate-200 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
                  💡 Nilai Filosofis & Kearifan Lokal:
                </span>
                <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed italic">
                  &quot;{activeItem.culturalReference}&quot;
                </p>
              </div>

              {/* Sample Sentence */}
              <div className="p-3.5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-mandar-maroon-700 dark:text-mandar-gold-400 block">
                  Contoh Tuturan Bahasa Mandar:
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-white">
                  &quot;{activeItem.exampleSentenceMdr}&quot;
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 italic">
                  Artinya: &quot;{activeItem.exampleSentenceId}&quot;
                </p>
              </div>

              {/* Academic Source Citation */}
              <div className="flex items-center space-x-2 text-[11px] text-stone-500 dark:text-slate-400 pt-2 border-t border-mandar-sand-200 dark:border-slate-800">
                <Bookmark className="w-3.5 h-3.5 text-mandar-maroon-600 dark:text-mandar-gold-400 shrink-0" />
                <span>Rujukan Ilmiah: <strong>{activeItem.academicSource}</strong></span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL GALLERY GRID (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Daftar Koleksi Ilustrasi ({filteredItems.length} Entri):
            </h4>
            <span className="text-xs text-mandar-maroon-700 dark:text-mandar-gold-400 font-semibold">
              Klik kartu untuk membedah
            </span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedItemId === item.id
                    ? 'border-mandar-maroon-600 bg-white dark:bg-slate-850 shadow-md ring-2 ring-mandar-maroon-500/20 scale-[1.01]'
                    : 'border-mandar-sand-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-mandar-maroon-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase bg-mandar-sand-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                      {item.category}
                    </span>
                    <span className="font-lontara text-xs text-mandar-maroon-700 dark:text-mandar-gold-300">
                      {item.lontara}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-sm text-stone-900 dark:text-white">
                    {item.nameMandar}
                  </h5>
                  <p className="text-xs font-semibold text-mandar-maroon-800 dark:text-mandar-gold-400">
                    {item.nameId}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(item.nameMandar);
                  }}
                  className="p-2 rounded-xl text-mandar-maroon-700 dark:text-mandar-gold-400 hover:bg-mandar-sand-100 dark:hover:bg-slate-800 shrink-0"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
