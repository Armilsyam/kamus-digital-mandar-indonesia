"use client";

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  Grid, 
  RefreshCw, 
  BookOpen,
  School,
  GraduationCap
} from 'lucide-react';
import { transliterateLatinToLontara } from '@/lib/lontara';

export type WorksheetType = 'lontara-trace' | 'matching' | 'multiple-choice' | 'flashcards';

interface PracticeWord {
  mandar: string;
  lontara: string;
  indonesia: string;
  category: string;
}

const WORKSHEET_WORDS: PracticeWord[] = [
  { mandar: 'sandeq', lontara: 'ᨔᨉᨙ', indonesia: 'perahu layar bercadik khas Mandar', category: 'Maritim' },
  { mandar: 'saqbe', lontara: 'ᨔᨀᨙ', indonesia: 'kain tenun sutra tradisional', category: 'Tenun' },
  { mandar: 'boyang', lontara: 'ᨅᨚᨐ', indonesia: 'rumah panggung kayu tradisional', category: 'Arsitektur' },
  { mandar: 'jepa', lontara: 'ᨍᨙᨄ', indonesia: 'makanan lempeng berbahan singkong', category: 'Kuliner' },
  { mandar: 'tabe', lontara: 'ᨈᨅᨙ', indonesia: 'ungkapan permisi / kesantunan', category: 'Adat' },
  { mandar: 'wae', lontara: 'ᨓᨕᨙ', indonesia: 'air minum atau air jernih', category: 'Alam' },
  { mandar: 'amboq', lontara: 'ᨕᨅᨚ', indonesia: 'bapak / ayah tercinta', category: 'Keluarga' },
  { mandar: 'indoq', lontara: 'ᨕᨗᨉᨚ', indonesia: 'ibu / mama tercinta', category: 'Keluarga' },
];

export const TeacherWorksheetGenerator: React.FC = () => {
  const [worksheetType, setWorksheetType] = useState<WorksheetType>('lontara-trace');
  const [schoolName, setSchoolName] = useState('SD / SMP Negeri di Sulawesi Barat');
  const [subjectTitle, setSubjectTitle] = useState('Muatan Lokal (Mulok) Bahasa Mandar');
  const [gradeClass, setGradeClass] = useState('Kelas IV - Semester Ganjil');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner (Screen Only) */}
      <div className="print:hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨁᨘᨑᨘ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #5 • Generator Lembar Kerja Guru & Siswa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Generator Lembar Kerja Edukasi & Cetak PDF
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Membantu bapak/ibu guru pengampu Muatan Lokal (Mulok) Bahasa & Budaya Mandar di SD/SMP/SMA se-Sulawesi Barat membuat lembar latihan menulis Aksara Lontara, kuis menjodohkan kata, dan kartu belajar cetak A4 berstandar kurikulum.
          </p>
        </div>
      </div>

      {/* Control Panel (Screen Only) */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Worksheet Type Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => setWorksheetType('lontara-trace')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                worksheetType === 'lontara-trace'
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-800 shadow-md'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              ✍️ Latihan Menulis Lontara
            </button>

            <button
              onClick={() => setWorksheetType('matching')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                worksheetType === 'matching'
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-800 shadow-md'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              🧩 Menjodohkan Kata
            </button>

            <button
              onClick={() => setWorksheetType('flashcards')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                worksheetType === 'flashcards'
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-800 shadow-md'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              🃏 Kartu Belajar Siap Gunting
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-mandar-maroon-700 to-mandar-maroon-800 hover:from-mandar-maroon-800 hover:to-mandar-maroon-900 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF (A4)</span>
          </button>
        </div>

        {/* Custom Metadata Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-mandar-sand-100 dark:border-slate-800">
          <div>
            <label className="block text-stone-500 dark:text-slate-400 mb-1 font-semibold">Nama Sekolah:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-stone-800 dark:text-slate-200 font-medium"
            />
          </div>
          <div>
            <label className="block text-stone-500 dark:text-slate-400 mb-1 font-semibold">Mata Pelajaran:</label>
            <input
              type="text"
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-stone-800 dark:text-slate-200 font-medium"
            />
          </div>
          <div>
            <label className="block text-stone-500 dark:text-slate-400 mb-1 font-semibold">Kelas / Semester:</label>
            <input
              type="text"
              value={gradeClass}
              onChange={(e) => setGradeClass(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-stone-800 dark:text-slate-200 font-medium"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PRINTABLE A4 WORKSHEET CONTAINER                         */}
      {/* ======================================================== */}
      <div className="bg-white text-stone-900 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-mandar-sand-300 dark:border-slate-700 shadow-xl max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Formal Kop Surat Lembar Kerja */}
        <div className="border-b-2 border-stone-800 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-mandar-maroon-800 text-white flex items-center justify-center font-bold text-xl border border-stone-400">
                <span className="font-lontara">ᨆ</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-900">
                  {schoolName}
                </h3>
                <h4 className="font-bold text-base text-mandar-maroon-800">
                  LEMBAR KERJA PESERTA DIDIK (LKPD) BAHASA MANDAR
                </h4>
                <p className="text-[11px] text-stone-600">
                  {subjectTitle} • {gradeClass} • Berdasarkan Kamus Mandar Balai Bahasa Sulsel 2025
                </p>
              </div>
            </div>

            {/* Score Box */}
            <div className="border-2 border-stone-700 rounded-xl p-2 text-center w-24 shrink-0">
              <span className="text-[10px] font-bold uppercase block text-stone-600">Nilai</span>
              <div className="h-8 flex items-center justify-center font-bold text-lg text-stone-400">
                ... / 100
              </div>
            </div>
          </div>

          {/* Student Identitas Bar */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-stone-200 text-xs">
            <div>
              <span className="font-semibold text-stone-600">Nama Siswa:</span>
              <span className="block border-b border-stone-400 mt-1 pb-0.5 font-bold">...................................................</span>
            </div>
            <div>
              <span className="font-semibold text-stone-600">Nomor Absen / NIS:</span>
              <span className="block border-b border-stone-400 mt-1 pb-0.5">...................................................</span>
            </div>
            <div>
              <span className="font-semibold text-stone-600">Hari / Tanggal:</span>
              <span className="block border-b border-stone-400 mt-1 pb-0.5">...................................................</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VARIANT 1: LATIHAN MENULIS AKSARA LONTARA            */}
        {/* ---------------------------------------------------- */}
        {worksheetType === 'lontara-trace' && (
          <div className="space-y-6">
            <div className="p-3 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 border border-stone-300">
              📌 <strong>Petunjuk:</strong> Tebalkan dan tulislah kembali huruf Aksara Lontara Mandar dan kata di bawah ini pada kotak-kotak bergaris yang disediakan dengan rapi!
            </div>

            <table className="w-full border-collapse border border-stone-400 text-xs">
              <thead>
                <tr className="bg-stone-200 text-stone-800 border-b border-stone-400">
                  <th className="p-2 border-r border-stone-400 w-12 text-center">No</th>
                  <th className="p-2 border-r border-stone-400 w-32 text-left">Kata Latin</th>
                  <th className="p-2 border-r border-stone-400 w-32 text-center">Aksara Lontara</th>
                  <th className="p-2 border-r border-stone-400 text-left">Arti Kata</th>
                  <th className="p-2 text-center">Tulis Ulang Aksara Lontara (3x)</th>
                </tr>
              </thead>
              <tbody>
                {WORKSHEET_WORDS.map((item, idx) => (
                  <tr key={idx} className="border-b border-stone-300">
                    <td className="p-2.5 border-r border-stone-400 text-center font-bold">{idx + 1}</td>
                    <td className="p-2.5 border-r border-stone-400 font-bold text-stone-900">{item.mandar}</td>
                    <td className="p-2.5 border-r border-stone-400 text-center font-lontara text-2xl text-mandar-maroon-800">
                      {item.lontara}
                    </td>
                    <td className="p-2.5 border-r border-stone-400 text-stone-700">{item.indonesia}</td>
                    <td className="p-1.5">
                      <div className="grid grid-cols-3 gap-2 h-10">
                        <div className="border border-dashed border-stone-400 rounded flex items-center justify-center font-lontara text-stone-300 text-xl">
                          {item.lontara}
                        </div>
                        <div className="border border-stone-400 rounded"></div>
                        <div className="border border-stone-400 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VARIANT 2: MENJODOHKAN KATA MANDAR - INDONESIA       */}
        {/* ---------------------------------------------------- */}
        {worksheetType === 'matching' && (
          <div className="space-y-6">
            <div className="p-3 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 border border-stone-300">
              📌 <strong>Petunjuk:</strong> Tariklah garis lurus yang menghubungkan kosakata Bahasa Mandar di sebelah kiri dengan arti Bahasa Indonesia yang tepat di sebelah kanan!
            </div>

            <div className="grid grid-cols-2 gap-12 py-4">
              {/* Left Column: Mandar Words */}
              <div className="space-y-4">
                <span className="font-bold text-xs uppercase text-stone-600 tracking-wider block mb-2">
                  Kolom A: Kosakata Mandar
                </span>
                {WORKSHEET_WORDS.map((item, idx) => (
                  <div key={idx} className="p-3 border-2 border-stone-800 rounded-xl flex items-center justify-between bg-stone-50">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-bold text-stone-600">{idx + 1}.</span>
                      <span className="font-extrabold text-base text-stone-900">{item.mandar}</span>
                      <span className="font-lontara text-sm text-stone-500">({item.lontara})</span>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-800 bg-white"></span>
                  </div>
                ))}
              </div>

              {/* Right Column: Shuffled Meanings */}
              <div className="space-y-4">
                <span className="font-bold text-xs uppercase text-stone-600 tracking-wider block mb-2">
                  Kolom B: Arti Bahasa Indonesia
                </span>
                {[
                  { letter: 'A', text: 'kain tenun sutra tradisional' },
                  { letter: 'B', text: 'perahu layar bercadik khas Mandar' },
                  { letter: 'C', text: 'ibu / mama tercinta' },
                  { letter: 'D', text: 'rumah panggung kayu tradisional' },
                  { letter: 'E', text: 'air minum atau air jernih' },
                  { letter: 'F', text: 'ungkapan permisi / kesantunan' },
                  { letter: 'G', text: 'bapak / ayah tercinta' },
                  { letter: 'H', text: 'makanan lempeng berbahan singkong' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 border-2 border-stone-800 rounded-xl flex items-center justify-between bg-stone-50">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-800 bg-white"></span>
                    <div className="flex items-center space-x-2 pl-3">
                      <span className="font-bold text-stone-600">{item.letter}.</span>
                      <span className="text-xs font-medium text-stone-800">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VARIANT 3: FLASHCARDS SIAP GUNTING                   */}
        {/* ---------------------------------------------------- */}
        {worksheetType === 'flashcards' && (
          <div className="space-y-6">
            <div className="p-3 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 border border-stone-300">
              📌 <strong>Petunjuk:</strong> Guntinglah kartu-kartu di bawah ini mengikuti garis putus-putus. Gunakan sebagai kartu pintar (flashcard) untuk belajar kosakata Mandar secara mandiri atau berpasangan!
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              {WORKSHEET_WORDS.map((item, idx) => (
                <div key={idx} className="border-2 border-dashed border-stone-400 rounded-2xl p-4 text-center space-y-2 bg-stone-50">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">
                    KADIMA-ID FLASHCARD
                  </span>
                  <div className="text-3xl font-lontara text-mandar-maroon-800 py-1">
                    {item.lontara}
                  </div>
                  <div className="font-extrabold text-base text-stone-900">
                    {item.mandar}
                  </div>
                  <div className="text-[11px] text-stone-600 border-t border-stone-200 pt-1.5 leading-tight">
                    {item.indonesia}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature & Evaluation Footer */}
        <div className="mt-8 pt-4 border-t border-stone-300 flex items-center justify-between text-xs text-stone-600">
          <div>
            <p>Catatan Guru:</p>
            <div className="w-64 border-b border-stone-300 h-6 mt-1"></div>
          </div>
          <div className="text-center">
            <p>Tanda Tangan Guru Pengampu,</p>
            <div className="h-12"></div>
            <p className="font-bold text-stone-900">( .................................................... )</p>
          </div>
        </div>

      </div>

    </div>
  );
};
