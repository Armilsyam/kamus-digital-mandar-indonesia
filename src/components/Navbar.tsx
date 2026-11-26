"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Binary, 
  Scroll, 
  Compass, 
  Gamepad2, 
  Award, 
  Moon, 
  Sun, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Search,
  Bot,
  ShieldCheck,
  Languages,
  Feather,
  MapPin,
  BookMarked,
  GraduationCap,
  Quote,
  Mic,
  Database,
  Flame,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookmarksCount: number;
  openBookmarks: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  focusSearch: () => void;
}

export interface NavFeature {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'leksikon' | 'linguistik' | 'budaya' | 'edukasi';
  isNew?: boolean;
  badge?: string;
}

export const ALL_FEATURES: NavFeature[] = [
  // 1. LEKSIKON & TERJEMAHAN
  { id: 'kamus', label: 'Kamus Trilingual (MDR • IDN • ENG)', shortLabel: 'Kamus', icon: BookOpen, category: 'leksikon' },
  { id: 'terjemah', label: 'Penerjemah Kalimat Dwiarah', shortLabel: 'Penerjemah', icon: Languages, category: 'leksikon', isNew: true },
  { id: 'frasa', label: 'Buku Frasa & Percakapan Tematis', shortLabel: 'Buku Frasa', icon: BookMarked, category: 'leksikon', isNew: true },
  { id: 'kaka', label: 'Asisten AI & Teman Belajar Adaptif', shortLabel: 'Kaka-AI Tutor', icon: Bot, category: 'leksikon', badge: 'AI Adaptif' },
  { id: 'tts', label: 'Studio Pelafalan Suara TTS', shortLabel: 'Studio Suara', icon: Volume2, category: 'leksikon' },

  // 2. LINGUISTIK & AKSARA
  { id: 'lontara', label: 'Aksara Lontara Mandar (Unicode)', shortLabel: 'Aksara Lontara', icon: Scroll, category: 'linguistik' },
  { id: 'fonologi', label: 'Laboratorium Fonologi & Alofon', shortLabel: 'Lab Fonologi', icon: Sparkles, category: 'linguistik' },
  { id: 'morfologi', label: 'Mesin Bedah Morfologi & Afiks', shortLabel: 'Morfologi', icon: Binary, category: 'linguistik' },
  { id: 'evaluator', label: 'Perekam & Uji Pelafalan Suara', shortLabel: 'Uji Pelafalan', icon: Mic, category: 'linguistik', isNew: true },
  { id: 'dialek', label: 'Peta Dialektologi Sulawesi Barat', shortLabel: 'Peta Dialek', icon: MapPin, category: 'linguistik', isNew: true },

  // 3. SASTRA, BUDAYA & BAHARI
  { id: 'kalindaqdaq', label: 'Studio Kalindaqdaq (Metrum 8-7-8-7)', shortLabel: 'Kalindaqdaq', icon: Feather, category: 'budaya', isNew: true },
  { id: 'pappasang', label: 'Peribahasa & Pappasang Luhur', shortLabel: 'Pappasang', icon: Quote, category: 'budaya', isNew: true },
  { id: 'bintang', label: 'Navigasi Bintang & Kompas Angin', shortLabel: 'Navigasi Bintang', icon: Compass, category: 'budaya', isNew: true },
  { id: 'budaya', label: 'Kamus Bergambar & Ilustrasi Budaya', shortLabel: 'Kamus Bergambar', icon: Compass, category: 'budaya', badge: 'Ilustrasi SVG' },

  // 4. EDUKASI, DATA & DUKUNGAN
  { id: 'guru', label: 'Generator Lembar Kerja Guru (PDF)', shortLabel: 'Lembar Guru', icon: GraduationCap, category: 'edukasi', isNew: true },
  { id: 'belajar', label: 'Pusat Belajar & Kata Hari Ini', shortLabel: 'Pusat Belajar', icon: Flame, category: 'edukasi', isNew: true },
  { id: 'kuis', label: 'Pojok Belajar & Kuis Cerdas', shortLabel: 'Kuis & Game', icon: Gamepad2, category: 'edukasi' },
  { id: 'api-ekspor', label: 'Playground API & Ekspor Data', shortLabel: 'API & Ekspor', icon: Database, category: 'edukasi', isNew: true },
  { id: 'admin', label: 'Admin, Support WA & Donasi DANA', shortLabel: 'Admin & Donasi', icon: ShieldCheck, category: 'edukasi', badge: 'DANA/WA' },
  { id: 'inovasi', label: 'Inovasi Digital BudayaGo 2025', shortLabel: 'BudayaGo', icon: Award, category: 'edukasi' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookmarksCount,
  openBookmarks,
  soundEnabled,
  setSoundEnabled,
  focusSearch,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAllFeaturesOpen, setIsAllFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAllFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Direct access tabs on desktop navbar
  const primaryTabs = [
    { id: 'kamus', label: 'Kamus', icon: BookOpen },
    { id: 'terjemah', label: 'Penerjemah', icon: Languages, isNew: true },
    { id: 'kaka', label: 'Kaka-AI Tutor', icon: Bot, badge: 'Adaptif' },
    { id: 'kalindaqdaq', label: 'Kalindaqdaq', icon: Feather, isNew: true },
    { id: 'dialek', label: 'Peta Dialek', icon: MapPin, isNew: true },
    { id: 'frasa', label: 'Buku Frasa', icon: BookMarked, isNew: true },
    { id: 'guru', label: 'Lembar Guru', icon: GraduationCap, isNew: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-mandar-sand-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('kamus')}>
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-mandar-maroon-800 via-mandar-maroon-700 to-mandar-gold-500 flex items-center justify-center shadow-lg shadow-mandar-maroon-900/20 text-white font-bold text-xl border border-white/20">
              <span className="font-lontara text-2xl text-mandar-gold-200">ᨆ</span>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-mandar-navy-600 rounded-full border-2 border-white flex items-center justify-center text-[10px]">
                ⛵
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-mandar-maroon-800 via-mandar-maroon-700 to-mandar-gold-600 dark:from-mandar-maroon-300 dark:to-mandar-gold-400 bg-clip-text text-transparent">
                  KADIMA<span className="text-mandar-navy-600 dark:text-sky-400 font-semibold">.ID</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mandar-gold-100 text-mandar-gold-800 dark:bg-mandar-gold-950/80 dark:text-mandar-gold-300 border border-mandar-gold-300 dark:border-mandar-gold-700 hidden sm:inline-block">
                  20 Fitur Lengkap • Edisi 2025
                </span>
              </div>
              <p className="text-xs text-mandar-maroon-900/70 dark:text-slate-400 hidden sm:block">
                Kamus Digital Mandar-Indonesia & Eksplorasi Budaya Maritim
              </p>
            </div>
          </div>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-mandar-maroon-700 text-white shadow-md shadow-mandar-maroon-800/25 dark:bg-mandar-maroon-600'
                      : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-maroon-50 dark:hover:bg-slate-800/60 hover:text-mandar-maroon-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mandar-gold-300' : 'text-stone-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.isNew && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                  )}
                  {item.badge && !isActive && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-mandar-gold-100 text-mandar-gold-800 dark:bg-mandar-gold-950 dark:text-mandar-gold-300 font-bold ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* "Semua Fitur (20)" Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAllFeaturesOpen(!isAllFeaturesOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isAllFeaturesOpen
                    ? 'bg-mandar-gold-500 text-slate-950 border-mandar-gold-600 shadow'
                    : 'bg-mandar-gold-50 hover:bg-mandar-gold-100 dark:bg-mandar-gold-950/40 text-mandar-maroon-900 dark:text-mandar-gold-300 border-mandar-gold-300 dark:border-mandar-gold-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Semua Fitur (20)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAllFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu for All 20 Features */}
              {isAllFeaturesOpen && (
                <div className="absolute right-0 mt-2 w-[520px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-mandar-sand-300 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-mandar-sand-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-gold-400">
                        Peta 20 Fitur Lengkap KADIMA-ID
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        +10 Fitur Baru!
                      </span>
                    </div>
                    <button
                      onClick={() => setIsAllFeaturesOpen(false)}
                      className="text-stone-400 hover:text-stone-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 max-h-[460px] overflow-y-auto pr-1">
                    
                    {/* Category 1: Leksikon */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        📖 Leksikon & Terjemahan
                      </span>
                      {ALL_FEATURES.filter(f => f.category === 'leksikon').map(feat => {
                        const Icon = feat.icon;
                        const isSelected = activeTab === feat.id;
                        return (
                          <button
                            key={feat.id}
                            onClick={() => {
                              setActiveTab(feat.id);
                              setIsAllFeaturesOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition-all ${
                              isSelected 
                                ? 'bg-mandar-maroon-700 text-white' 
                                : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-mandar-gold-300' : 'text-mandar-maroon-600 dark:text-mandar-gold-400'}`} />
                            <span className="truncate">{feat.shortLabel || feat.label}</span>
                            {feat.isNew && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold ml-auto shrink-0">
                                Baru
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Category 2: Linguistik */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        🧠 Linguistik & Aksara
                      </span>
                      {ALL_FEATURES.filter(f => f.category === 'linguistik').map(feat => {
                        const Icon = feat.icon;
                        const isSelected = activeTab === feat.id;
                        return (
                          <button
                            key={feat.id}
                            onClick={() => {
                              setActiveTab(feat.id);
                              setIsAllFeaturesOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition-all ${
                              isSelected 
                                ? 'bg-mandar-maroon-700 text-white' 
                                : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-mandar-gold-300' : 'text-sky-600 dark:text-sky-400'}`} />
                            <span className="truncate">{feat.shortLabel || feat.label}</span>
                            {feat.isNew && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold ml-auto shrink-0">
                                Baru
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Category 3: Budaya & Bahari */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        ⛵ Sastra, Budaya & Bahari
                      </span>
                      {ALL_FEATURES.filter(f => f.category === 'budaya').map(feat => {
                        const Icon = feat.icon;
                        const isSelected = activeTab === feat.id;
                        return (
                          <button
                            key={feat.id}
                            onClick={() => {
                              setActiveTab(feat.id);
                              setIsAllFeaturesOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition-all ${
                              isSelected 
                                ? 'bg-mandar-maroon-700 text-white' 
                                : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-mandar-gold-300' : 'text-amber-600 dark:text-amber-400'}`} />
                            <span className="truncate">{feat.shortLabel || feat.label}</span>
                            {feat.isNew && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold ml-auto shrink-0">
                                Baru
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Category 4: Edukasi & Data */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        🎓 Edukasi & Alat Pengembang
                      </span>
                      {ALL_FEATURES.filter(f => f.category === 'edukasi').map(feat => {
                        const Icon = feat.icon;
                        const isSelected = activeTab === feat.id;
                        return (
                          <button
                            key={feat.id}
                            onClick={() => {
                              setActiveTab(feat.id);
                              setIsAllFeaturesOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition-all ${
                              isSelected 
                                ? 'bg-mandar-maroon-700 text-white' 
                                : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-mandar-gold-300' : 'text-indigo-600 dark:text-indigo-400'}`} />
                            <span className="truncate">{feat.shortLabel || feat.label}</span>
                            {feat.isNew && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold ml-auto shrink-0">
                                Baru
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Quick Utility Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Search Shortcut Trigger */}
            <button
              onClick={focusSearch}
              className="p-2 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1"
              title="Cari Kosakata (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline text-xs bg-stone-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-slate-700 text-stone-500">
                ⌘K
              </span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={soundEnabled ? "Nonaktifkan Efek Suara" : "Aktifkan Efek Suara"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-mandar-maroon-600 dark:text-mandar-maroon-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-stone-400" />
              )}
            </button>

            {/* Bookmarks Counter */}
            <button
              onClick={openBookmarks}
              className="relative p-2 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Kata Tersimpan (Favorit)"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-mandar-gold-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isDark ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
            >
              {isDark ? <Sun className="w-5 h-5 text-mandar-gold-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Lists all 20 features) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-mandar-sand-200 dark:border-slate-800 space-y-3 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 uppercase">
                Semua 20 Fitur Platform
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                10 Baru
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ALL_FEATURES.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-mandar-maroon-700 text-white'
                        : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-mandar-gold-300' : 'text-stone-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.isNew && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0 ml-1">
                        Baru
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
