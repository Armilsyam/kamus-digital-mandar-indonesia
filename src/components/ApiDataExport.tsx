"use client";

import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Code, 
  Copy, 
  Check, 
  FileText, 
  Terminal, 
  Sparkles, 
  BookOpen,
  Send,
  ExternalLink
} from 'lucide-react';
import rawDictionary from '@/data/mandar_dictionary.json';
import { DictionaryEntry } from './DictionaryCard';

const ALL_ENTRIES = rawDictionary as DictionaryEntry[];

export const ApiDataExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'api' | 'citation'>('export');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // API Playground State
  const [apiEndpoint, setApiEndpoint] = useState('/api/kamus?search=sandeq');
  const [apiResponse, setApiResponse] = useState<string>(() => {
    const sample = ALL_ENTRIES.filter(e => e.lemma.toLowerCase().includes('sandeq')).slice(0, 3);
    return JSON.stringify({ status: 200, count: sample.length, data: sample }, null, 2);
  });

  const handleTestApi = () => {
    let results: DictionaryEntry[] = [];
    if (apiEndpoint.includes('random')) {
      const randIdx = Math.floor(Math.random() * ALL_ENTRIES.length);
      results = [ALL_ENTRIES[randIdx]];
    } else if (apiEndpoint.includes('search=')) {
      const q = apiEndpoint.split('search=')[1].split('&')[0].toLowerCase();
      results = ALL_ENTRIES.filter(e => 
        e.lemma.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)
      ).slice(0, 5);
    } else {
      results = ALL_ENTRIES.slice(0, 3);
    }

    setApiResponse(JSON.stringify({
      status: 200,
      timestamp: new Date().toISOString(),
      query: apiEndpoint,
      totalMatches: results.length,
      data: results
    }, null, 2));
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ALL_ENTRIES, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "kadima_mandar_dictionary_4443.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Lema", "Aksara Lontara", "Fonetik", "Kelas Kata", "Definisi Indonesia", "English Gloss", "Contoh Tuturan"];
    const rows = ALL_ENTRIES.map(e => [
      `"${e.id}"`,
      `"${e.lemma.replace(/"/g, '""')}"`,
      `"${e.lontara || ''}"`,
      `"${e.phonetic || ''}"`,
      `"${e.pos || ''}"`,
      `"${e.definition.replace(/"/g, '""')}"`,
      `"${(e.definitionEn || '').replace(/"/g, '""')}"`,
      `"${(e.exampleMandar || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kadima_kamus_mandar_4443.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const APA_CITATION = `Hanan, S. S., Muthalib, A., Idham, Nurhayati, Haeruddin, Jerniati, Charmilasari, & Pertiwi, L. (2025). Kamus Bahasa Mandar-Indonesia Edisi Revisi (Digitalisasi Interaktif KADIMA-ID). Balai Bahasa Provinsi Sulawesi Selatan, Kementerian Pendidikan Dasar dan Menengah. https://kadima.id`;

  const BIBTEX_CITATION = `@book{kamusmandar2025,
  title     = {Kamus Bahasa Mandar-Indonesia (Edisi Revisi)},
  author    = {Hanan, Sandra Safitri and Muthalib, Abdul and Idham and Nurhayati and Haeruddin and Jerniati and Charmilasari and Pertiwi, Lia},
  year      = {2025},
  publisher = {Balai Bahasa Provinsi Sulawesi Selatan, Kementerian Pendidikan Dasar dan Menengah},
  address   = {Makassar, Indonesia},
  note      = {Digital Platform KADIMA-ID, 4.443 Entri Lema}
}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨉᨈ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Database className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #9 • Data Terbuka & Integrasi Peneliti</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Playground API & Ekspor Data Akademik
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Menyediakan akses terbuka leksikografi Mandar bagi akademisi, mahasiswa linguistik, dan pengembang perangkat lunak. Unduh basis data penuh 4.443 lema (JSON/CSV), kutipan BibTeX, dan uji coba antarmuka API interaktif.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-mandar-sand-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'export'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Unduh Basis Data (JSON & CSV)</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'api'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>API Playground Interaktif</span>
        </button>

        <button
          onClick={() => setActiveTab('citation')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'citation'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sitasi Akademik (APA / BibTeX)</span>
        </button>
      </div>

      {/* TAB 1: EXPORT DATA */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* JSON Export Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold">
                {`{ }`}
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Basis Data JSON Lengkap (4.443 Entri)
              </h3>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                Format objek terstruktur lengkap mencakup lema, ortografi aksara Lontara Unicode, representasi fonetik IPA, kelas kata (POS), definisi bahasa Indonesia, glos bahasa Inggris, dan contoh tuturan.
              </p>
              <div className="text-[11px] font-mono text-stone-400 bg-mandar-sand-50 dark:bg-slate-800 p-3 rounded-xl">
                Ukuran Berkas: ~2.6 MB • Format: UTF-8 JSON • 4.443 Objek
              </div>
            </div>

            <button
              onClick={handleExportJson}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas JSON (.json)</span>
            </button>
          </div>

          {/* CSV Export Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Lembar Sebar CSV (Excel / Spreadsheet)
              </h3>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                Tabel berformat CSV dengan pembatas koma dan UTF-8 BOM, siap dibuka langsung di Microsoft Excel, Google Sheets, SPSS, atau perangkat analisis korpus linguistik (AntConc/SketchEngine).
              </p>
              <div className="text-[11px] font-mono text-stone-400 bg-mandar-sand-50 dark:bg-slate-800 p-3 rounded-xl">
                Ukuran Berkas: ~1.2 MB • 8 Kolom Metadata • UTF-8 Encoding
              </div>
            </div>

            <button
              onClick={handleExportCsv}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Lembar Kerja CSV (.csv)</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: API PLAYGROUND */}
      {activeTab === 'api' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-stone-900 dark:text-white flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-mandar-maroon-700 dark:text-mandar-gold-400" />
              <span>REST API Playground Leksikon Mandar</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Uji coba kueri langsung terhadap API kamus digital dengan parameter pencarian dan kata acak
            </p>
          </div>

          {/* Request Input Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="px-3 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold text-xs rounded-xl self-start sm:self-center">
              GET
            </span>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 font-mono text-xs text-stone-900 dark:text-white outline-none"
            />
            <button
              onClick={handleTestApi}
              className="flex items-center justify-center space-x-1.5 px-5 py-2 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Permintaan</span>
            </button>
          </div>

          {/* Quick Endpoint Presets */}
          <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
            <span className="text-stone-400 font-bold shrink-0">Pilihan Rute:</span>
            {[
              '/api/kamus?search=sandeq',
              '/api/kamus?search=boyang',
              '/api/kamus?search=sutera',
              '/api/kamus/random',
            ].map((route) => (
              <button
                key={route}
                onClick={() => setApiEndpoint(route)}
                className="px-2.5 py-1 rounded-lg bg-mandar-sand-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 font-mono text-[11px] hover:border-mandar-maroon-400 border border-transparent whitespace-nowrap"
              >
                {route}
              </button>
            ))}
          </div>

          {/* JSON Response Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Respons API (JSON Response):</span>
              <button
                onClick={() => handleCopy(apiResponse, 'api')}
                className="flex items-center space-x-1 text-mandar-maroon-700 dark:text-mandar-gold-400 font-bold hover:underline"
              >
                {copiedType === 'api' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'api' ? 'Tersalin' : 'Salin JSON'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs max-h-72 overflow-y-auto border border-stone-800">
              {apiResponse}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC CITATION */}
      {activeTab === 'citation' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-stone-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-mandar-maroon-700 dark:text-mandar-gold-400" />
              <span>Sitasi Akademik & Bibliografi Resmi</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Gunakan format sitasi baku di bawah ini untuk penulisan skripsi, tesis, jurnal ilmiah, dan publikasi penelitian kebudayaan
            </p>
          </div>

          {/* APA Format */}
          <div className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-gold-400">
                Format Standar APA (American Psychological Association 7th Ed.)
              </span>
              <button
                onClick={() => handleCopy(APA_CITATION, 'apa')}
                className="flex items-center space-x-1 text-xs font-bold text-stone-600 dark:text-slate-300 hover:text-stone-900"
              >
                {copiedType === 'apa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'apa' ? 'Tersalin' : 'Salin APA'}</span>
              </button>
            </div>
            <p className="text-xs text-stone-800 dark:text-slate-200 font-serif leading-relaxed">
              {APA_CITATION}
            </p>
          </div>

          {/* BibTeX Format */}
          <div className="p-5 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-mandar-maroon-800 dark:text-mandar-gold-400">
                Format BibTeX (Untuk LaTeX / Overleaf)
              </span>
              <button
                onClick={() => handleCopy(BIBTEX_CITATION, 'bibtex')}
                className="flex items-center space-x-1 text-xs font-bold text-stone-600 dark:text-slate-300 hover:text-stone-900"
              >
                {copiedType === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'bibtex' ? 'Tersalin' : 'Salin BibTeX'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-stone-300 font-mono text-[11px] overflow-x-auto">
              {BIBTEX_CITATION}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
