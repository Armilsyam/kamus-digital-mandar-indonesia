"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Compass, 
  ArrowRight,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  BookmarkCheck,
  Trash2,
  Bot,
  ShieldCheck,
  Languages,
  MessageCircle,
  HelpCircle,
  Feather,
  MapPin,
  BookMarked,
  GraduationCap,
  Quote,
  Mic,
  Database,
  Flame
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DictionaryCard, DictionaryEntry } from '@/components/DictionaryCard';
import { EntryDetailModal } from '@/components/EntryDetailModal';
import { PhonologyLab } from '@/components/PhonologyLab';
import { LontaraConverter } from '@/components/LontaraConverter';
import { MorphologyAnalyzer } from '@/components/MorphologyAnalyzer';
import { CultureEncyclopedia } from '@/components/CultureEncyclopedia';
import { QuizGame } from '@/components/QuizGame';
import { BudayaGoInfo } from '@/components/BudayaGoInfo';
import { KakaAI } from '@/components/KakaAI';
import { AdminCollaboration } from '@/components/AdminCollaboration';
import { AudioSpeechStudio } from '@/components/AudioSpeechStudio';

// 10 New Advanced Feature Components
import { KalindaqdaqStudio } from '@/components/KalindaqdaqStudio';
import { DialectMap } from '@/components/DialectMap';
import { SentenceTranslator } from '@/components/SentenceTranslator';
import { ThematicPhrasebook } from '@/components/ThematicPhrasebook';
import { TeacherWorksheetGenerator } from '@/components/TeacherWorksheetGenerator';
import { ProverbsWisdom } from '@/components/ProverbsWisdom';
import { CelestialNavigation } from '@/components/CelestialNavigation';
import { PronunciationEvaluator } from '@/components/PronunciationEvaluator';
import { ApiDataExport } from '@/components/ApiDataExport';
import { LearningHubWidget } from '@/components/LearningHubWidget';
import { recordLearningActivity } from '@/lib/learningTracker';

import rawDictionary from '@/data/mandar_dictionary.json';

const ALL_ENTRIES = rawDictionary as DictionaryEntry[];

const CATEGORIES = [
  'Semua Kategori',
  'Maritim & Kelautan',
  'Tenun & Busana',
  'Kuliner Tradisional',
  'Sastra & Kesenian',
  'Adat & Budaya',
  'Alam & Pertanian',
  'Keluarga & Kekerabatan',
  'Anatomi & Kesehatan',
  'Arsitektur & Rumah',
  'Religi & Spiritualitas',
  'Umum'
];

const POS_FILTERS = [
  { key: 'all', label: 'Semua Kelas Kata' },
  { key: 'n', label: 'Nomina (n)' },
  { key: 'v', label: 'Verba (v)' },
  { key: 'a', label: 'Adjektiva (a)' },
  { key: 'adv', label: 'Adverbia (adv)' },
  { key: 'p', label: 'Partikel (p)' },
  { key: 'num', label: 'Numeralia (num)' },
  { key: 'pron', label: 'Pronomina (pron)' },
  { key: 'ukp', label: 'Ungkapan (ukp)' },
  { key: 'pb', label: 'Peribahasa (pb)' },
  { key: 'ki', label: 'Kiasan (ki)' },
];

const ALPHABETS = ['SEMUA', 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('kamus');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedPos, setSelectedPos] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('SEMUA');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Detail Modal state
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  // Sub-tab navigation parameter (e.g. from modal to lab or Kaka-AI)
  const [labWord, setLabWord] = useState('madondong');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kadima_bookmarks');
        if (saved) {
          setBookmarkedIds(new Set(JSON.parse(saved)));
        }
      } catch {}
    }
  }, []);

  // Save bookmarks to localStorage
  const toggleBookmark = (entry: DictionaryEntry) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(entry.id)) {
        next.delete(entry.id);
      } else {
        next.add(entry.id);
      }
      try {
        localStorage.setItem('kadima_bookmarks', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const focusSearch = () => {
    setActiveTab('kamus');
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // Record Search history helper
  const recordSearchTerm = useCallback((term: string) => {
    if (!term || term.trim().length < 2) return;
    const clean = term.trim().toLowerCase();
    try {
      const saved = localStorage.getItem('kadima_search_history');
      const list = saved ? JSON.parse(saved) as string[] : [];
      const updated = [clean, ...list.filter(item => item !== clean)].slice(0, 20);
      localStorage.setItem('kadima_search_history', JSON.stringify(updated));
      recordLearningActivity({
        type: 'search',
        title: `Pencarian Lema: ${clean}`,
        detail: `Mencari kosakata di kamus trilingual`,
        masteryImpact: 'low',
        category: 'kosakata'
      });
    } catch {}
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search recording
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      const timeout = setTimeout(() => {
        recordSearchTerm(searchQuery);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, recordSearchTerm]);

  // Filtered entries across Mandar, Indonesian, and English!
  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ALL_ENTRIES.filter((entry) => {
      // 1. Text Search Query in 3 languages
      if (query) {
        const matchLemma = entry.lemma.toLowerCase().includes(query);
        const matchDef = entry.definition.toLowerCase().includes(query);
        const matchDefEn = entry.definitionEn?.toLowerCase().includes(query) || false;
        const matchExample = entry.exampleMandar?.toLowerCase().includes(query) || false;
        const matchRoot = entry.rootWord?.toLowerCase().includes(query) || false;
        if (!matchLemma && !matchDef && !matchDefEn && !matchExample && !matchRoot) {
          return false;
        }
      }

      // 2. Letter Filter
      if (selectedLetter !== 'SEMUA') {
        const firstLetter = entry.cleanLemma.charAt(0).toUpperCase();
        if (firstLetter !== selectedLetter) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'Semua Kategori' && entry.category !== selectedCategory) {
        return false;
      }

      // 4. POS Filter
      if (selectedPos !== 'all' && entry.pos !== selectedPos) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedLetter, selectedCategory, selectedPos]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage]);

  const handleFilterRoot = (root: string) => {
    setSearchQuery(root);
    setSelectedLetter('SEMUA');
    setSelectedCategory('Semua Kategori');
    setSelectedPos('all');
    setCurrentPage(1);
    setActiveTab('kamus');
    recordSearchTerm(root);
  };

  const handleGoToTab = (tab: string, param?: string) => {
    if (param) setLabWord(param);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEntry = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
    recordLearningActivity({
      type: 'modal_view',
      title: `Eksplorasi Lema: ${entry.lemma}`,
      detail: `${entry.posLabel} - ${entry.definition.slice(0, 45)}...`,
      masteryImpact: 'medium',
      category: entry.category.includes('Maritim') || entry.category.includes('Budaya') ? 'budaya' : 'kosakata'
    });
  };

  const handleRandomWord = () => {
    const randomIdx = Math.floor(Math.random() * ALL_ENTRIES.length);
    handleSelectEntry(ALL_ENTRIES[randomIdx]);
  };

  const handleSearchFromHub = (word: string) => {
    setSearchQuery(word);
    setCurrentPage(1);
    setActiveTab('kamus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-mandar-sand-50/50 dark:bg-slate-950 bg-saqbe-pattern transition-colors">
      
      {/* Main Navbar with All 20 Features */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarksCount={bookmarkedIds.size}
        openBookmarks={() => setIsBookmarksOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        focusSearch={focusSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* ======================================================== */}
        {/* TAB 1: KAMUS LEKSIKON DIGITAL (TRILINGUAL: MDR - IDN - ENG) */}
        {/* ======================================================== */}
        {activeTab === 'kamus' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Hero Search Section */}
            <div className="relative rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-white/10">
              
              {/* Decorative Traditional Saqbe / Lontara Watermark */}
              <div className="absolute right-4 -bottom-10 select-none pointer-events-none opacity-10 text-[180px] font-lontara text-white leading-none">
                ᨆᨊᨉᨑ
              </div>

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
                  <Languages className="w-3.5 h-3.5 text-mandar-gold-400" />
                  <span>Kamus Multifungsi 3 Bahasa (Mandar • Indonesia • English) • 4.443 Lema</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                  Jelajahi Bahasa & Kebudayaan Suku Mandar
                </h1>
                <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
                  Pencarian trilingual cerdas Mandar ⇄ Indonesia ⇄ English dengan transliterasi Aksara Lontara, 
                  panduan fonetik alofon, dekomposisi morfologi, serta audio pengucapan kata dan kalimat panjang.
                </p>

                {/* Main Search Input */}
                <div className="relative flex items-center shadow-2xl rounded-2xl bg-white dark:bg-slate-900 p-2 border-2 border-white/20 focus-within:border-mandar-gold-400 transition-all">
                  <div className="pl-3 pr-2 text-mandar-maroon-800 dark:text-mandar-gold-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari lema Mandar, arti Indonesia, atau English (misal: sandeq, boyang, tabe, boat, house, sutra)..."
                    className="w-full py-3.5 px-2 bg-transparent text-stone-800 dark:text-white placeholder-stone-400 text-base sm:text-lg outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-2 text-stone-400 hover:text-stone-600 rounded-lg mr-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleRandomWord}
                    className="hidden sm:flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-semibold text-xs whitespace-nowrap shadow-md transition-colors"
                    title="Buka Kata Acak"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Kata Acak</span>
                  </button>
                </div>

                {/* Popular Keywords Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                  <span className="text-mandar-sand-300 font-semibold">Pencarian Populer:</span>
                  {['sandeq', 'saqbe', 'kalindaqdaq', 'jepa', 'tabe', 'boyang', 'madondong', 'siriq'].map((word) => (
                    <button
                      key={word}
                      onClick={() => {
                        setSearchQuery(word);
                        setCurrentPage(1);
                        recordSearchTerm(word);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Feature Switcher Strip (10 New Highlights) */}
            <div className="bg-gradient-to-r from-mandar-gold-500/10 via-mandar-maroon-900/10 to-transparent dark:from-mandar-gold-500/5 p-4 rounded-3xl border border-mandar-gold-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px]">
                  10 FITUR BARU
                </span>
                <span className="text-xs font-bold text-stone-800 dark:text-white">
                  Jelajahi inovasi baru KADIMA-ID:
                </span>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1">
                {[
                  { id: 'terjemah', label: 'Penerjemah Kalimat', icon: Languages },
                  { id: 'kalindaqdaq', label: 'Studio Kalindaqdaq', icon: Feather },
                  { id: 'dialek', label: 'Peta Dialek Sulbar', icon: MapPin },
                  { id: 'frasa', label: 'Buku Frasa Audio', icon: BookMarked },
                  { id: 'guru', label: 'Lembar Guru PDF', icon: GraduationCap },
                  { id: 'bintang', label: 'Navigasi Bintang', icon: Compass },
                  { id: 'pappasang', label: 'Peribahasa Pappasang', icon: Quote },
                  { id: 'evaluator', label: 'Uji Pelafalan Mic', icon: Mic },
                  { id: 'api-ekspor', label: 'Ekspor Data/API', icon: Database },
                  { id: 'belajar', label: 'Kata Hari Ini', icon: Flame },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-mandar-sand-300 dark:border-slate-700 hover:border-mandar-maroon-600 text-stone-800 dark:text-slate-200 text-xs font-semibold whitespace-nowrap shadow-sm transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-mandar-maroon-700 dark:text-mandar-gold-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alphabet Filter Strip (A - W) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-mandar-sand-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <div className="flex items-center space-x-1 min-w-max">
                <span className="text-xs font-bold text-stone-400 px-2 uppercase tracking-wider">
                  Abjad:
                </span>
                {ALPHABETS.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => {
                      setSelectedLetter(letter);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedLetter === letter
                        ? 'bg-mandar-maroon-700 text-white shadow-md'
                        : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls: Categories & POS */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Category Pills (Horizontal scroll) */}
              <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                      selectedCategory === cat
                        ? 'bg-mandar-navy-800 text-white border-mandar-navy-900 shadow-sm dark:bg-sky-600'
                        : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-800 hover:border-mandar-navy-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* POS Selector */}
              <div className="flex items-center space-x-2 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                <select
                  value={selectedPos}
                  onChange={(e) => {
                    setSelectedPos(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-mandar-sand-200 dark:border-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-200 outline-none"
                >
                  {POS_FILTERS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Meta Info */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 px-1">
              <span>
                Menampilkan <strong className="text-stone-800 dark:text-white">{filteredEntries.length}</strong> entri kosakata
                {searchQuery && <> untuk kata kunci &ldquo;<strong className="text-mandar-maroon-700 dark:text-mandar-maroon-300">{searchQuery}</strong>&rdquo;</>}
              </span>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>

            {/* Dictionary Cards Grid */}
            {paginatedEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedEntries.map((entry) => (
                  <DictionaryCard
                    key={entry.id}
                    entry={entry}
                    isBookmarked={bookmarkedIds.has(entry.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelectEntry={(e) => handleSelectEntry(e)}
                    onFilterRoot={handleFilterRoot}
                    soundEnabled={soundEnabled}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-mandar-sand-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-mandar-sand-100 dark:bg-slate-800 text-stone-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-white">
                  Kata Tidak Ditemukan
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
                  Tidak ditemukan lema yang cocok dengan kriteria pencarian Anda. 
                  Coba ubah kata kunci atau tanyakan langsung kepada <strong>Kaka-AI</strong> atau buka <strong>Penerjemah Kalimat</strong>.
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua Kategori');
                      setSelectedPos('all');
                      setSelectedLetter('SEMUA');
                      setCurrentPage(1);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-slate-700 text-stone-800 dark:text-white font-semibold text-xs"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setActiveTab('kaka')}
                    className="px-5 py-2.5 rounded-xl bg-mandar-maroon-700 text-white font-semibold text-xs hover:bg-mandar-maroon-800 flex items-center space-x-1"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Tanya Kaka-AI</span>
                  </button>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(p - 1, 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="hidden sm:flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 7 && currentPage > 4) {
                      pageNum = currentPage - 3 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (6 - i);
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-mandar-maroon-700 text-white shadow-md'
                            : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-mandar-sand-200 dark:border-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 flex items-center space-x-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #1: STUDIO KALINDAQDAQ (8-7-8-7)              */}
        {/* ======================================================== */}
        {activeTab === 'kalindaqdaq' && (
          <KalindaqdaqStudio />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #2: PETA DIALEKTOLOGI SULAWESI BARAT          */}
        {/* ======================================================== */}
        {activeTab === 'dialek' && (
          <DialectMap />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #3: PENERJEMAH KALIMAT DWIARAH                */}
        {/* ======================================================== */}
        {activeTab === 'terjemah' && (
          <SentenceTranslator onSelectEntry={(entry) => setSelectedEntry(entry)} />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #4: BUKU FRASA PERCAKAPAN TEMATIS             */}
        {/* ======================================================== */}
        {activeTab === 'frasa' && (
          <ThematicPhrasebook />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #5: GENERATOR LEMBAR KERJA GURU & PDF (A4)    */}
        {/* ======================================================== */}
        {activeTab === 'guru' && (
          <TeacherWorksheetGenerator />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #6: PERIBAHASA & PAPPASANG LUHUR MANDAR       */}
        {/* ======================================================== */}
        {activeTab === 'pappasang' && (
          <ProverbsWisdom />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #7: NAVIGASI BINTANG PASSOMBAL & KOMPAS ANGIN  */}
        {/* ======================================================== */}
        {activeTab === 'bintang' && (
          <CelestialNavigation />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #8: PEREKAM & UJI PELAFALAN SUARA             */}
        {/* ======================================================== */}
        {activeTab === 'evaluator' && (
          <PronunciationEvaluator />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #9: PLAYGROUND API & EKSPOR DATA AKADEMIK     */}
        {/* ======================================================== */}
        {activeTab === 'api-ekspor' && (
          <ApiDataExport />
        )}

        {/* ======================================================== */}
        {/* FITUR BARU #10: PUSAT BELAJAR PRIBADI & KATA HARI INI    */}
        {/* ======================================================== */}
        {activeTab === 'belajar' && (
          <LearningHubWidget
            onSearchWord={handleSearchFromHub}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            bookmarksCount={bookmarkedIds.size}
            openBookmarks={() => setIsBookmarksOpen(true)}
          />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: ASISTEN AI KAKA-AI                       */}
        {/* ======================================================== */}
        {activeTab === 'kaka' && (
          <KakaAI
            soundEnabled={soundEnabled}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onGoToTab={handleGoToTab}
          />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: STUDIO SUARA / MULTI-FUNGSI TTS          */}
        {/* ======================================================== */}
        {activeTab === 'tts' && (
          <AudioSpeechStudio />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: LAB FONOLOGI & ALOFON                    */}
        {/* ======================================================== */}
        {activeTab === 'fonologi' && (
          <PhonologyLab initialWord={labWord} soundEnabled={soundEnabled} />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: AKSARA LONTARA MANDAR                    */}
        {/* ======================================================== */}
        {activeTab === 'lontara' && (
          <LontaraConverter />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: BEDAH MORFOLOGI                          */}
        {/* ======================================================== */}
        {activeTab === 'morfologi' && (
          <MorphologyAnalyzer initialWord={labWord} />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: ENSIKLOPEDIA BUDAYA MARITIM & ILUSTRASI  */}
        {/* ======================================================== */}
        {activeTab === 'budaya' && (
          <CultureEncyclopedia soundEnabled={soundEnabled} />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: POJOK BELAJAR & KUIS CERDAS              */}
        {/* ======================================================== */}
        {activeTab === 'kuis' && (
          <QuizGame soundEnabled={soundEnabled} />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: ADMIN & DANA DONASI 082291544262         */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <AdminCollaboration />
        )}

        {/* ======================================================== */}
        {/* FITUR EXISTING: INOVASI BUDAYAGO 2025                    */}
        {/* ======================================================== */}
        {activeTab === 'inovasi' && (
          <BudayaGoInfo />
        )}

      </main>

      {/* Detail Modal */}
      <EntryDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        isBookmarked={selectedEntry ? bookmarkedIds.has(selectedEntry.id) : false}
        onToggleBookmark={toggleBookmark}
        soundEnabled={soundEnabled}
        onGoToTab={handleGoToTab}
      />

      {/* Floating Kaka-AI Quick Trigger Button */}
      {activeTab !== 'kaka' && (
        <button
          onClick={() => setActiveTab('kaka')}
          className="print:hidden fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-gradient-to-tr from-mandar-maroon-800 to-mandar-gold-500 text-white shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border-2 border-white/20 group"
          title="Buka Asisten Kaka-AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-extrabold text-sm hidden sm:inline-block pr-1">
            Tanya Kaka-AI
          </span>
        </button>
      )}

      {/* Bookmarks Drawer Modal */}
      {isBookmarksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-mandar-sand-300 dark:border-slate-800 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-mandar-sand-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <BookmarkCheck className="w-5 h-5 text-mandar-gold-500" />
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                  Kata Tersimpan ({bookmarkedIds.size})
                </h3>
              </div>
              <button
                onClick={() => setIsBookmarksOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2">
              {bookmarkedIds.size > 0 ? (
                ALL_ENTRIES.filter(e => bookmarkedIds.has(e.id)).map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setIsBookmarksOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 hover:bg-mandar-sand-100 dark:hover:bg-slate-700 border border-mandar-sand-200 dark:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300">
                          {entry.lemma}
                        </span>
                        <span className="font-lontara text-sm text-mandar-gold-600 dark:text-mandar-gold-400">
                          {entry.lontara}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                        {entry.definition}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(entry);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      title="Hapus Simpanan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-stone-400">
                  Belum ada kata yang disimpan ke daftar favorit Anda.
                </div>
              )}
            </div>

            {bookmarkedIds.size > 0 && (
              <div className="pt-4 border-t border-mandar-sand-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    setBookmarkedIds(new Set());
                    localStorage.removeItem('kadima_bookmarks');
                  }}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Hapus Semua Simpanan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
