"use client";

import React from 'react';
import { Compass, BookOpen, Heart, Sparkles, ExternalLink, ShieldCheck, MessageCircle, Wallet, Bot, Feather, MapPin, Languages, BookMarked, GraduationCap, Quote, Database, Flame, Mic } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full bg-mandar-navy-950 text-white pt-16 pb-12 border-t-4 border-mandar-maroon-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Cultural Quote (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('kamus')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                <span className="font-lontara text-xl text-mandar-gold-200">ᨆ</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                KADIMA<span className="text-sky-400">.ID</span>
              </span>
            </div>

            <p className="text-mandar-sand-300 text-sm leading-relaxed max-w-lg">
              Platform Leksikografi Digital & Pelestarian Kebudayaan Mandar Trilingual (Mandar • Indonesia • English) dengan <strong>20 Fitur Terpadu</strong>, Asisten AI <strong>Kaka-AI</strong>, Studio Kalindaqdaq, Peta Dialektologi, dan Ensiklopedia Maritim Sulawesi Barat.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-mandar-sand-200 font-serif italic max-w-md">
              &ldquo;Mellamun Bomboq, Mappasombo Litaq&rdquo; — Menenggelamkan ego ombak kesombongan, menjunjung tinggi keluhuran tanah pusaka.
            </div>

            {/* Quick Admin & DANA / WhatsApp badge */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: 082291544262</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-xs font-semibold transition-colors"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>DANA: 082291544262</span>
              </button>
            </div>
          </div>

          {/* Kolom 1: Leksikon & Terjemahan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-gold-400">
              Leksikon & Terjemahan
            </h4>
            <ul className="space-y-2 text-xs text-mandar-sand-300">
              <li>
                <button onClick={() => setActiveTab('kamus')} className="hover:text-white transition-colors">
                  Kamus 3 Bahasa (4.443 Lema)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terjemah')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Penerjemah Dwiarah (Baru)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('frasa')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Buku Frasa Tematis (Baru)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('kaka')} className="hover:text-white transition-colors font-semibold text-mandar-gold-300">
                  Asisten AI Kaka-AI
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tts')} className="hover:text-white transition-colors">
                  Studio Suara Kalimat Panjang
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lontara')} className="hover:text-white transition-colors">
                  Transliterasi Aksara Lontara
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Budaya & Sastra */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-gold-400">
              Sastra & Budaya Maritim
            </h4>
            <ul className="space-y-2 text-xs text-mandar-sand-300">
              <li>
                <button onClick={() => setActiveTab('kalindaqdaq')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Studio Kalindaqdaq 8-7-8-7
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dialek')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Peta Dialektologi Sulbar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pappasang')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Peribahasa & Pappasang
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bintang')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Navigasi Bintang Passombal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('budaya')} className="hover:text-white transition-colors">
                  Ensiklopedia & Anatomi Sandeq
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('fonologi')} className="hover:text-white transition-colors">
                  Laboratorium Fonologi & Alofon
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Edukasi & Rujukan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-gold-400">
              Edukasi, Data & Donasi
            </h4>
            <ul className="space-y-2 text-xs text-mandar-sand-300">
              <li>
                <button onClick={() => setActiveTab('guru')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Lembar Kerja Guru (PDF)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('evaluator')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Uji Pelafalan Mikrofon
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('belajar')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ Pusat Belajar & Kata Hari Ini
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('api-ekspor')} className="hover:text-white transition-colors font-medium text-emerald-300">
                  ✨ API & Ekspor Data (JSON/CSV)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors text-emerald-300 font-semibold">
                  Admin, Dukungan WA & Donasi DANA
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('inovasi')} className="hover:text-white transition-colors">
                  BudayaGo Kemendikbud 2025
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-mandar-sand-400 gap-4">
          <p>
            © {new Date().getFullYear()} KADIMA-ID • Dikembangkan dengan segenap dedikasi untuk pelestarian bahasa dan kebudayaan maritim Mandar.
          </p>

          <div className="flex items-center space-x-6 text-mandar-sand-300">
            <button onClick={() => setActiveTab('admin')} className="hover:text-white">
              WhatsApp 082291544262
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-white">
              Donasi DANA
            </button>
            <a
              href="https://budayago.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white inline-flex items-center space-x-1 text-mandar-gold-400"
            >
              <span>BudayaGo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
