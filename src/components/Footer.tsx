"use client";

import React from 'react';
import { Compass, BookOpen, Heart, Sparkles, ExternalLink, ShieldCheck, MessageCircle, Wallet, Bot } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full bg-mandar-navy-950 text-white pt-16 pb-12 border-t-4 border-mandar-maroon-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Cultural Quote */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                <span className="font-lontara text-xl text-mandar-gold-200">ᨆ</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                KADIMA<span className="text-sky-400">.ID</span>
              </span>
            </div>

            <p className="text-mandar-sand-300 text-sm leading-relaxed max-w-lg">
              Platform Leksikografi Digital & Pelestarian Bahasa Mandar 3 Bahasa (Mandar • Indonesia • English), Asisten AI <strong>Kaka-AI</strong>, Laboratorium Fonologi Interaktif & Ensiklopedia Budaya Maritim Sulawesi Barat. Dipersembahkan untuk kompetisi inovasi digital nasional <strong>BUDAYAGO!</strong> (budayago.id) Kementerian Kebudayaan Republik Indonesia.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-mandar-sand-200 font-serif italic max-w-md">
              &ldquo;Mellamun Bomboq, Mappasombo Litaq&rdquo; — Menenggelamkan ego ombak kesombongan, menjunjung tinggi kehormatan tanah pusaka.
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

          {/* Navigasi Fitur */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-gold-400">
              Fitur & Layanan Platform
            </h4>
            <ul className="space-y-2 text-xs text-mandar-sand-300">
              <li>
                <button onClick={() => setActiveTab('kamus')} className="hover:text-white transition-colors">
                  Kamus 3 Bahasa (4.443 Lema)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('kaka')} className="hover:text-white transition-colors font-semibold text-mandar-gold-300">
                  Asisten AI Kaka-AI
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tts')} className="hover:text-white transition-colors">
                  Studio Suara (Pelafalan Kalimat)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('fonologi')} className="hover:text-white transition-colors">
                  Laboratorium Fonologi & Alofon
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lontara')} className="hover:text-white transition-colors">
                  Transliterasi Aksara Lontara
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('budaya')} className="hover:text-white transition-colors">
                  Ensiklopedia & Ilustrasi Sandeq
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors text-emerald-300 font-semibold">
                  Akun Admin, WhatsApp & DANA
                </button>
              </li>
            </ul>
          </div>

          {/* Rujukan & Kurasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mandar-gold-400">
              Rujukan Ilmiah & Dukungan
            </h4>
            <p className="text-xs text-mandar-sand-300 leading-relaxed">
              Disusun berdasarkan naskah resmi:
              <br />
              <strong className="text-white">Kamus Bahasa Mandar-Indonesia Edisi Revisi (2025)</strong>
              <br />
              Balai Bahasa Provinsi Sulawesi Selatan, Kementerian Pendidikan Dasar dan Menengah.
            </p>
            <div className="pt-2">
              <a
                href="https://budayago.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-mandar-gold-400 hover:text-mandar-gold-300 underline font-medium"
              >
                <span>Portal Resmi BudayaGo (budayago.id)</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-mandar-sand-400 gap-4">
          <p>
            © 2025–2026 <strong>KADIMA-ID</strong>. Hak Cipta Terbuka untuk Pelestarian Bahasa & Budaya Nusantara.
          </p>
          <p className="flex items-center space-x-1">
            <span>Dukungan & Kolaborasi Budaya: <strong>082291544262</strong> (WhatsApp & DANA)</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
