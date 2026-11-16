"use client";

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  HeartHandshake, 
  Search,
  Quote,
  Star
} from 'lucide-react';
import { speakText } from '@/lib/audio';

export interface ProverbEntry {
  id: string;
  theme: 'siriq' | 'bahari' | 'integritas' | 'solidaritas';
  themeLabel: string;
  mandar: string;
  lontara: string;
  literalId: string;
  philosophyId: string;
  english: string;
  historicalContext: string;
}

export const PROVERBS_DATA: ProverbEntry[] = [
  {
    id: 'pr-1',
    theme: 'bahari',
    themeLabel: 'Kearifan Maritim & Bahari',
    mandar: 'Mellamun bomboq, mappasombo litaq.',
    lontara: 'ᨆᨛᨒᨆᨘ ᨅᨚᨅᨚ ᨆᨄᨔᨚᨅᨚ ᨒᨗᨈ',
    literalId: 'Menenggelamkan keangkuhan ombak, menjunjung keluhuran tanah pusaka.',
    philosophyId: 'Meskipun pelaut Mandar mampu menaklukkan badai ombak terganas di lautan luas, mereka tetap rendah hati dan tidak melupakan tanah leluhur serta persaudaraan di daratan.',
    english: 'Submerging the pride of waves, exalting the sacred land of ancestors.',
    historicalContext: 'Motto legendaris para passombal perahu Sandeq dan Kerajaan Balanipa.'
  },
  {
    id: 'pr-2',
    theme: 'siriq',
    themeLabel: 'Siriq & Kehormatan Luhur',
    mandar: 'Mate di litaq mamboyang, siriq diolo dipau.',
    lontara: 'ᨆᨈᨙ ᨉᨗ ᨒᨗᨈ ᨆᨅᨚᨐ ᨔᨗᨑᨗ ᨉᨗᨕᨚᨒᨚ ᨉᨗᨄᨕᨘ',
    literalId: 'Biar mati di tanah rantau, kehormatan diri tetap yang paling dijunjung.',
    philosophyId: 'Menegaskan harga diri (siriq) sebagai mahkota tertinggi manusia Mandar. Di manapun merantau, pantang mencoreng nama baik keluarga, suku, dan negeri.',
    english: 'Even if perishing in distant lands, personal dignity must always be prioritized.',
    historicalContext: 'Falsafah perantau Mandar di pesisir Kalimantan, Jawa, dan Maluku.'
  },
  {
    id: 'pr-3',
    theme: 'solidaritas',
    themeLabel: 'Gotong Royong & Persaudaraan',
    mandar: 'Inggai siwata-watang mappatindo kerdhaan.',
    lontara: 'ᨕᨗᨁᨕᨗ ᨔᨗᨓᨈ ᨓᨈ ᨆᨄᨈᨗᨉᨚ ᨀᨛᨑᨛᨉᨕ',
    literalId: 'Marilah kita saling bertopang bahu-membahu menegakkan kesejahteraan bersama.',
    philosophyId: 'Semangat kolektivitas masyarakat Mandar (siwata-watang) dalam menghadapi kesulitan, membangun perahu sandeq, memanen di sawah, maupun menjaga kedaulatan.',
    english: 'Let us support one another shoulder-to-shoulder to establish shared prosperity.',
    historicalContext: 'Wasiat luhur perserikatan persekutuan Pitu Babana Binanga & Pitu Ulunna Salu.'
  },
  {
    id: 'pr-4',
    theme: 'integritas',
    themeLabel: 'Kejujuran & Integritas (Amana)',
    mandar: 'Da muande doiq silaloi, apa madosa di puang anna dipatua adaq.',
    lontara: 'ᨉ ᨆᨘᨕᨉᨙ ᨉᨚᨕᨗ ᨔᨗᨒᨒᨚᨕᨗ ᨕᨄ ᨆᨉᨚᨔ ᨉᨗ ᨄᨘᨕ ᨕᨊ ᨉᨗᨄᨈᨘᨕ ᨕᨉ',
    literalId: 'Jangan mengambil harta yang bukan hakmu, karena itu dosa kepada Tuhan dan melanggar hukum adat.',
    philosophyId: 'Integritas moral dan larangan keras korupsi, penipuan, atau perampasan hak orang lain. Adat Mandar mengutuk perbuatan mencuri kepercayaan sesama.',
    english: 'Never consume unlawful wealth, for it constitutes sin before God and violates customary law.',
    historicalContext: 'Pappasang Daeng Riosoq untuk para pemangku adat dan pemimpin negeri.'
  },
  {
    id: 'pr-5',
    theme: 'bahari',
    themeLabel: 'Kearifan Maritim & Bahari',
    mandar: 'Manna maombaq tangngali, taqeai sombal tanjaq.',
    lontara: 'ᨆᨊ ᨆᨕᨚᨅ ᨈᨂᨒᨗ ᨈᨀᨙᨕᨕᨗ ᨔᨚᨅᨒ ᨈᨍ',
    literalId: 'Meskipun ombak setinggi tebing, tetap bentangkan layar gunting.',
    philosophyId: 'Ketegaran dan keberanian pantang surut seorang pelaut dan manusia pejuang dalam menempuh ujian hidup yang berat.',
    english: 'Even if the waves tower like cliffs, unfurl the triangular scissors sail.',
    historicalContext: 'Pepatah pelaut saat mengarungi perairan Selat Makassar di musim barat.'
  },
  {
    id: 'pr-6',
    theme: 'siriq',
    themeLabel: 'Siriq & Kehormatan Luhur',
    mandar: 'Andianna siriqna tau, pura mai tarrang nyawana.',
    lontara: 'ᨕᨉᨗᨕᨊ ᨔᨗᨑᨗᨊ ᨈᨕᨘ ᨄᨘᨑ ᨆᨕᨗ ᨈᨑ ᨎᨓᨊ',
    literalId: 'Jika seseorang telah kehilangan rasa malunya (siriq), sesungguhnya ia laksana orang yang telah mati jiwanya.',
    philosophyId: 'Rasa malu bermoral (siriq) adalah substansi pembeda antara manusia beradab dengan makhluk lainnya. Kehilangan kehormatan sama dengan kematian moral.',
    english: 'If a person loses their dignity and moral shame, their soul has effectively perished.',
    historicalContext: 'Nasihat orang tua kepada anak cucu saat hendak beranjak dewasa.'
  }
];

export const ProverbsWisdom: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Daily featured proverb
  const dailyProverb = PROVERBS_DATA[0];

  const filteredProverbs = useMemo(() => {
    return PROVERBS_DATA.filter(p => {
      if (selectedTheme !== 'all' && p.theme !== selectedTheme) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.mandar.toLowerCase().includes(q) ||
          p.literalId.toLowerCase().includes(q) ||
          p.philosophyId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedTheme, searchQuery]);

  const handlePlay = (mandarText: string) => {
    speakText(mandarText, { lang: 'mandar', rate: 0.85 });
  };

  const handleCopy = (proverb: ProverbEntry) => {
    const text = `📜 PAPPASANG MANDAR:\n"${proverb.mandar}"\nLontara: ${proverb.lontara}\n\nArti Harfiah:\n${proverb.literalId}\n\nMakna Filosofis:\n${proverb.philosophyId}\n\nEnglish: ${proverb.english}\n— Dari KADIMA-ID (Kamus Digital Mandar)`;
    navigator.clipboard.writeText(text);
    setCopiedId(proverb.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨄᨄᨔ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Quote className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #6 • Ensiklopedia Pappasang & Falsafah</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Peribahasa & Pappasang Luhur Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Menghayati wasiat suci leluhur (*Pappasang Todilaling, Maraqdia Balanipa*) dan ungkapan peribahasa maritim sarat nilai kehormatan diri (*siriq*), kejujuran (*amana*), resiliensi bahari, dan gotong royong (*siwata-watang*).
          </p>
        </div>
      </div>

      {/* Featured "Pappasang of the Day" Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-mandar-gold-500/20 via-mandar-maroon-900/60 to-slate-900 p-8 sm:p-10 border-2 border-mandar-gold-400/40 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-mandar-gold-400 uppercase tracking-widest">
            <Star className="w-4 h-4 fill-mandar-gold-400" />
            <span>Pappasang Pilihan Hari Ini (Lema Mutiara)</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-mandar-maroon-700/80 text-white text-[11px] font-bold">
            Falsafah Maritim Luhur
          </span>
        </div>

        <div className="space-y-4">
          <div className="text-2xl sm:text-3xl font-lontara text-mandar-gold-300 tracking-wider">
            {dailyProverb.lontara}
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif italic font-extrabold text-white leading-tight">
            &ldquo;{dailyProverb.mandar}&rdquo;
          </h3>

          <div className="bg-black/30 rounded-2xl p-5 border border-white/10 space-y-2 text-xs sm:text-sm text-stone-200">
            <p className="font-semibold text-mandar-gold-300">
              🇮🇩 Arti Harfiah: &ldquo;{dailyProverb.literalId}&rdquo;
            </p>
            <p className="text-stone-300 leading-relaxed">
              💡 <strong>Tafsir Filosofis:</strong> {dailyProverb.philosophyId}
            </p>
            <p className="text-[11px] text-stone-400 pt-1">
              🏛️ <em>Konteks Historis: {dailyProverb.historicalContext}</em>
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => handlePlay(dailyProverb.mandar)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Pelafalan</span>
            </button>

            <button
              onClick={() => handleCopy(dailyProverb)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              {copiedId === dailyProverb.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedId === dailyProverb.id ? 'Kutipan Tersalin!' : 'Bagikan Kutipan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Theme Filters & Search Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-mandar-sand-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Semua Tema Nilai' },
            { id: 'bahari', label: '🌊 Maritim & Bahari' },
            { id: 'siriq', label: '🛡️ Siriq & Kehormatan' },
            { id: 'integritas', label: '⚖️ Kejujuran & Amanah' },
            { id: 'solidaritas', label: '🤝 Gotong Royong' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedTheme === theme.id
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-800 shadow-md'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari peribahasa / makna..."
            className="w-full sm:w-60 px-3.5 py-2 pl-9 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs outline-none focus:border-mandar-maroon-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Proverbs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProverbs.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-mandar-sand-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-mandar-sand-100 dark:bg-slate-800 text-mandar-maroon-800 dark:text-mandar-gold-300">
                  {item.themeLabel}
                </span>
                <button
                  onClick={() => handleCopy(item)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 rounded-lg"
                  title="Salin Peribahasa"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Lontara */}
              <div className="text-xl font-lontara text-mandar-gold-700 dark:text-mandar-gold-400">
                {item.lontara}
              </div>

              {/* Mandar Quote */}
              <h4 className="text-lg font-serif italic font-bold text-mandar-maroon-900 dark:text-white leading-snug">
                &ldquo;{item.mandar}&rdquo;
              </h4>

              {/* Breakdown */}
              <div className="pt-2 border-t border-mandar-sand-100 dark:border-slate-800 space-y-1.5 text-xs">
                <p className="text-stone-700 dark:text-slate-300">
                  <span className="font-semibold text-stone-900 dark:text-white">Arti Harfiah:</span> &ldquo;{item.literalId}&rdquo;
                </p>
                <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-mandar-maroon-700 dark:text-mandar-gold-400">Tafsir Filosofis:</span> {item.philosophyId}
                </p>
                <p className="text-stone-400 italic text-[11px]">
                  🇬🇧 {item.english}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-mandar-sand-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handlePlay(item.mandar)}
                className="flex items-center space-x-1.5 text-xs font-bold text-mandar-maroon-700 dark:text-mandar-gold-400 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar Tuturan</span>
              </button>

              <span className="text-[10px] text-stone-400">
                {item.historicalContext}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
