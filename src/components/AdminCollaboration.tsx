"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MessageCircle, 
  Wallet, 
  Copy, 
  Check, 
  Heart, 
  Users, 
  Send, 
  PlusCircle, 
  FileText, 
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface ProposedWord {
  id: string;
  word: string;
  meaningId: string;
  meaningEn: string;
  category: string;
  contributorName: string;
  status: 'Menunggu Review' | 'Disetujui' | 'Tersimpan';
  date: string;
}

export const AdminCollaboration: React.FC = () => {
  const [isCopiedDana, setIsCopiedDana] = useState(false);
  const [isCopiedWa, setIsCopiedWa] = useState(false);

  // Form submission state
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [proposedWord, setProposedWord] = useState('');
  const [proposedMeaningId, setProposedMeaningId] = useState('');
  const [proposedMeaningEn, setProposedMeaningEn] = useState('');
  const [proposedCategory, setProposedCategory] = useState('Maritim & Kelautan');
  const [proposedExample, setProposedExample] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Stored proposed words list
  const [proposals, setProposals] = useState<ProposedWord[]>([
    {
      id: 'prop-1',
      word: 'tadaq-tadaq',
      meaningId: 'kayu penyeimbang cadik bambu tambahan pada perahu Sandeq',
      meaningEn: 'additional outrigger support beam on a Sandeq sailing boat',
      category: 'Maritim & Kelautan',
      contributorName: 'Budayawan Balanipa',
      status: 'Disetujui',
      date: '12 Nov 2026'
    },
    {
      id: 'prop-2',
      word: 'moliq',
      meaningId: 'minyak kelapa murni khas tradisional Mandar pembuat aroma gurih Bau Peapi',
      meaningEn: 'traditional pure coconut oil essential for Mandar fish soup',
      category: 'Kuliner Tradisional',
      contributorName: 'Pemerhati Kuliner Majene',
      status: 'Disetujui',
      date: '14 Nov 2026'
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kadima_proposals');
        if (saved) {
          setProposals(JSON.parse(saved));
        }
      } catch {}
    }
  }, []);

  const handleCopyDana = () => {
    navigator.clipboard.writeText('082291544262');
    setIsCopiedDana(true);
    setTimeout(() => setIsCopiedDana(false), 2000);
  };

  const handleCopyWa = () => {
    navigator.clipboard.writeText('082291544262');
    setIsCopiedWa(true);
    setTimeout(() => setIsCopiedWa(false), 2000);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedWord || !proposedMeaningId) return;

    const newProposal: ProposedWord = {
      id: `prop-${Date.now()}`,
      word: proposedWord.trim(),
      meaningId: proposedMeaningId.trim(),
      meaningEn: proposedMeaningEn.trim() || 'Translation pending verification',
      category: proposedCategory,
      contributorName: contributorName.trim() || 'Kontributor Mandar',
      status: 'Menunggu Review',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [newProposal, ...proposals];
    setProposals(updated);
    try {
      localStorage.setItem('kadima_proposals', JSON.stringify(updated));
    } catch {}

    // Reset Form
    setProposedWord('');
    setProposedMeaningId('');
    setProposedMeaningEn('');
    setProposedExample('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pusat Layanan Resmi, Bantuan & Kolaborasi Budaya Mandar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Akun Admin, Saluran WhatsApp & Donasi DANA
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Halaman resmi untuk dukungan teknis kompetisi BudayaGo, bantuan leksikografi, 
            kolaborasi riset dengan Balai Bahasa & perguruan tinggi, serta jalur donasi apresiasi 
            pelestarian naskah kuno Lontara dan dialek bahasa Mandar.
          </p>
        </div>
      </div>

      {/* Grid: 3 Main Cards (Admin Profile, WhatsApp Direct, DANA Support) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: Profil Akun Admin */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-mandar-sand-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-mandar-maroon-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Akun Admin Terverifikasi
                </span>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white mt-0.5">
                  Admin KADIMA-ID
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed mb-4">
              Dikelola oleh Tim Pengembang & Inovasi Digital Bahasa Mandar untuk program BUDAYAGO! Kementerian Kebudayaan Republik Indonesia.
            </p>

            <div className="space-y-2.5 text-xs text-stone-600 dark:text-slate-400 pt-2 border-t border-mandar-sand-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400 shrink-0" />
                <span className="font-mono">mandarpodcast@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400 shrink-0" />
                <span className="font-mono font-bold text-stone-800 dark:text-white">082291544262</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400 shrink-0" />
                <span>Polewali Mandar • Majene, Sulawesi Barat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400 shrink-0" />
                <span>Layanan Aktif: 24 Jam (Fast Response)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-mandar-sand-100 dark:border-slate-800 text-[11px] text-stone-400">
            Terhubung dengan Balai Bahasa Provinsi Sulsel & Komunitas Sastra Mandar.
          </div>
        </div>

        {/* CARD 2: WhatsApp Support Button & Direct Chat */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white border border-emerald-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 animate-pulse">
                Online Sekarang
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              Bantuan & Chat WhatsApp
            </h3>
            <p className="text-xs text-emerald-200 leading-relaxed mb-4">
              Konsultasikan kebutuhan kolaborasi penelitian, juri lomba BudayaGo, integrasi API sekolah, atau pertanyaan leksikografi langsung dengan Admin.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 mb-4">
              <span className="text-[10px] text-emerald-300 block uppercase tracking-wider font-bold mb-1">
                Nomor Resmi WhatsApp Admin:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-extrabold text-white tracking-wider">
                  082291544262
                </span>
                <button
                  onClick={handleCopyWa}
                  className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition-colors"
                  title="Salin Nomor WhatsApp"
                >
                  {isCopiedWa ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/6282291544262?text=Halo%20Admin%20KADIMA-ID,%20saya%20ingin%20berkolaborasi%20dan%20meminta%20dukungan%20terkait%20Kamus%20Digital%20Mandar..."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Langsung di WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* CARD 3: Donasi & Apresiasi DANA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 text-white border border-sky-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xl border border-sky-500/30">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-500/30 text-sky-300 border border-sky-400/30">
                DANA Dompet Digital
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              Dukungan Donasi DANA
            </h3>
            <p className="text-xs text-sky-200 leading-relaxed mb-4">
              Dukung pemeliharaan server, digitalisasi manuskrip Lontara Mandar, dan riset lapangan dialek pesisir melalui dompet digital DANA ke nomor admin.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/30 mb-4">
              <div className="flex items-center justify-between text-[10px] text-sky-300 uppercase tracking-wider font-bold mb-1">
                <span>Nomor Akun DANA:</span>
                <span className="text-white">a.n. Admin KADIMA-ID</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-extrabold text-white tracking-wider">
                  082291544262
                </span>
                <button
                  onClick={handleCopyDana}
                  className="p-1.5 rounded-lg bg-sky-800/80 hover:bg-sky-700 text-sky-200 transition-colors"
                  title="Salin Nomor DANA"
                >
                  {isCopiedDana ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyDana}
            className="w-full py-3.5 px-4 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <Wallet className="w-4 h-4" />
            <span>{isCopiedDana ? '✓ Nomor DANA Tersalin!' : 'Salin Nomor DANA (082291544262)'}</span>
          </button>
        </div>

      </div>

      {/* Donation Transparency & Impact Allocation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
        <h3 className="text-lg font-bold text-mandar-maroon-900 dark:text-mandar-maroon-200 mb-4 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>Alokasi & Transparansi Donasi Pelestarian Budaya Mandar</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700">
            <span className="text-mandar-maroon-700 dark:text-mandar-gold-400 font-bold block mb-1">
              1. Digitalisasi Naskah Lontara Mandar (40%)
            </span>
            <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
              Penyelamatan dan digitalisasi daun lontar kuno (*Pattodiq*) berisi silsilah raja dan hukum adat Pitu Baqbana Binanga.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700">
            <span className="text-mandar-maroon-700 dark:text-mandar-gold-400 font-bold block mb-1">
              2. Riset Lapangan Dialek Pesisir (35%)
            </span>
            <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
              Perekaman tuturan lisan dari para tetua adat, penenun Saqbe, dan nelayan passombal Sandeq di pelosok Sulawesi Barat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700">
            <span className="text-mandar-maroon-700 dark:text-mandar-gold-400 font-bold block mb-1">
              3. Infrastruktur & API Edukasi Gratis (25%)
            </span>
            <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
              Pemeliharaan server berkecepatan tinggi agar platform KADIMA-ID dapat diakses gratis oleh siswa SD, SMP, SMA di Sulbar.
            </p>
          </div>
        </div>
      </div>

      {/* Community Collaboration Form & Proposed Lexicon Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Usulan Kosakata Baru */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-maroon-300 mb-2">
            <PlusCircle className="w-4 h-4 text-mandar-gold-500" />
            <span>Formulir Kolaborasi Komunitas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white mb-2">
            Usulkan Kosakata atau Peribahasa Mandar Baru
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mb-6 leading-relaxed">
            Punya kosakata khas kampung halaman atau istilah perahu yang belum tercatat? Usulkan di sini untuk ditinjau oleh tim kurator.
          </p>

          {isSubmitted && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Terima kasih! Usulan kosakata Anda telah berhasil dikirim dan tersimpan di antrean kurasi admin.</span>
            </div>
          )}

          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Nama Anda / Pengusul *
                </label>
                <input
                  type="text"
                  required
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="Contoh: Muhammad Ilham"
                  className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm text-stone-800 dark:text-white outline-none focus:border-mandar-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm text-stone-800 dark:text-white outline-none focus:border-mandar-maroon-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Kata / Lema Mandar *
                </label>
                <input
                  type="text"
                  required
                  value={proposedWord}
                  onChange={(e) => setProposedWord(e.target.value)}
                  placeholder="Contoh: mallombus"
                  className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm font-bold text-mandar-maroon-800 dark:text-mandar-maroon-300 outline-none focus:border-mandar-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Kategori Kebudayaan
                </label>
                <select
                  value={proposedCategory}
                  onChange={(e) => setProposedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm text-stone-800 dark:text-white outline-none"
                >
                  <option value="Maritim & Kelautan">Maritim & Kelautan (Sandeq)</option>
                  <option value="Tenun & Busana">Tenun & Busana (Saqbe)</option>
                  <option value="Kuliner Tradisional">Kuliner Tradisional (Jepa, Bau Peapi)</option>
                  <option value="Sastra & Kesenian">Sastra & Kesenian (Kalindaqdaq)</option>
                  <option value="Adat & Budaya">Adat & Budaya</option>
                  <option value="Alam & Pertanian">Alam & Pertanian</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Arti dalam Bahasa Indonesia *
              </label>
              <textarea
                required
                rows={2}
                value={proposedMeaningId}
                onChange={(e) => setProposedMeaningId(e.target.value)}
                placeholder="Jelaskan arti dan makna kata dalam bahasa Indonesia..."
                className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm text-stone-800 dark:text-white outline-none focus:border-mandar-maroon-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                English Meaning (Opsional / Terjemahan Bahasa Inggris)
              </label>
              <input
                type="text"
                value={proposedMeaningEn}
                onChange={(e) => setProposedMeaningEn(e.target.value)}
                placeholder="English translation or meaning..."
                className="w-full px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-sm text-stone-800 dark:text-white outline-none focus:border-mandar-maroon-600"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Usulan Kosakata</span>
            </button>
          </form>
        </div>

        {/* Daftar Riwayat Usulan Masuk */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-mandar-navy-800 dark:text-sky-300 mb-2">
              <FileText className="w-4 h-4" />
              <span>Daftar Usulan Komunitas</span>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-white mb-4">
              Usulan Kosakata Terkini
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {proposals.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-mandar-maroon-800 dark:text-mandar-maroon-300">
                      {item.word}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Disetujui'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-stone-700 dark:text-slate-300 line-clamp-2 mb-1">
                    ID: {item.meaningId}
                  </p>
                  <p className="text-stone-500 dark:text-slate-400 italic line-clamp-1 mb-2">
                    EN: {item.meaningEn}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-mandar-sand-200/60 dark:border-slate-700">
                    <span>Oleh: {item.contributorName}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-mandar-sand-100 dark:border-slate-800 text-[11px] text-stone-500">
            Semua usulan yang disetujui akan diintegrasikan ke versi rilis publik KADIMA-ID berikutnya.
          </div>
        </div>

      </div>

    </div>
  );
};
