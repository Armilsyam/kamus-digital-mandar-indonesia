"use client";

import React, { useState, useEffect } from 'react';
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
  Languages
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

  const navItems = [
    { id: 'kamus', label: 'Kamus (3 Bahasa)', icon: BookOpen },
    { id: 'kaka', label: 'Kaka-AI', icon: Bot, highlight: true },
    { id: 'tts', label: 'Studio Suara', icon: Volume2 },
    { id: 'fonologi', label: 'Lab Fonologi', icon: Sparkles },
    { id: 'lontara', label: 'Aksara Lontara', icon: Scroll },
    { id: 'morfologi', label: 'Morfologi', icon: Binary },
    { id: 'budaya', label: 'Budaya Maritim', icon: Compass },
    { id: 'kuis', label: 'Kuis & Belajar', icon: Gamepad2 },
    { id: 'admin', label: 'Admin & Dukungan', icon: ShieldCheck, badge: 'DANA/WA' },
    { id: 'inovasi', label: 'BudayaGo', icon: Award },
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
                  Mandar • Indonesia • English
                </span>
              </div>
              <p className="text-xs text-mandar-maroon-900/70 dark:text-slate-400 hidden sm:block">
                Kamus Digital Interaktif & Pelestarian Bahasa Mandar
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-mandar-maroon-700 text-white shadow-md shadow-mandar-maroon-800/25 dark:bg-mandar-maroon-600'
                      : item.highlight
                      ? 'bg-mandar-gold-50 dark:bg-mandar-gold-950/50 text-mandar-maroon-900 dark:text-mandar-gold-300 hover:bg-mandar-gold-100'
                      : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-maroon-50 dark:hover:bg-slate-800/60 hover:text-mandar-maroon-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mandar-gold-300' : 'text-stone-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
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
              className="xl:hidden p-2 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-mandar-sand-200 dark:border-slate-800 grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-mandar-maroon-700 text-white dark:bg-mandar-maroon-600'
                      : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-maroon-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-mandar-gold-300' : 'text-stone-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
