"use client";

import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Volume2, 
  Copy, 
  Check, 
  RotateCcw, 
  Languages, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { speakText } from '@/lib/audio';
import { transliterateLatinToLontara } from '@/lib/lontara';
import { stripAffixes } from '@/lib/morphology';
import rawDictionary from '@/data/mandar_dictionary.json';
import { DictionaryEntry } from './DictionaryCard';

const ALL_ENTRIES = rawDictionary as DictionaryEntry[];

// Create lookup maps for ultra-fast translation
const MANDAR_TO_ENTRY = new Map<string, DictionaryEntry>();
const INDO_TO_ENTRY = new Map<string, DictionaryEntry>();
const ENGLISH_TO_ENTRY = new Map<string, DictionaryEntry>();

ALL_ENTRIES.forEach((e) => {
  const m = e.cleanLemma.toLowerCase();
  if (!MANDAR_TO_ENTRY.has(m)) MANDAR_TO_ENTRY.set(m, e);

  // Index simple Indonesian definition tokens
  const indTerms = e.definition.toLowerCase().split(/[,;()/\n]/);
  indTerms.forEach(term => {
    const cleanT = term.trim().replace(/^kata\s+|^artinya\s+/, '');
    if (cleanT && cleanT.length > 2 && !INDO_TO_ENTRY.has(cleanT)) {
      INDO_TO_ENTRY.set(cleanT, e);
    }
  });

  // Index English gloss tokens
  if (e.definitionEn) {
    const enTerms = e.definitionEn.toLowerCase().split(/[,;()/\n]/);
    enTerms.forEach(term => {
      const cleanE = term.trim();
      if (cleanE && cleanE.length > 2 && !ENGLISH_TO_ENTRY.has(cleanE)) {
        ENGLISH_TO_ENTRY.set(cleanE, e);
      }
    });
  }
});

// Common multi-word phrases & idioms dictionary
const COMMON_PHRASES: Record<string, { id: string; en: string; mdr: string }> = {
  'apa kareba': { mdr: 'apa kareba', id: 'apa kabar', en: 'how are you' },
  'kareba marasa': { mdr: 'kareba marasa', id: 'kabar baik', en: 'good news / fine' },
  'tabe amboq': { mdr: 'tabe amboq', id: 'permisi bapak / ayah', en: 'excuse me father / sir' },
  'tabe indoq': { mdr: 'tabe indoq', id: 'permisi ibu', en: 'excuse me mother / ma’am' },
  'salamaq allo': { mdr: 'salamaq allo', id: 'selamat siang', en: 'good day' },
  'salamaq bengi': { mdr: 'salamaq bengi', id: 'selamat malam', en: 'good evening / night' },
  'salamaq subu': { mdr: 'salamaq subu', id: 'selamat pagi', en: 'good morning' },
  'tarima kasi': { mdr: 'tarima kasi / kurru sumangaq', id: 'terima kasih', en: 'thank you' },
  'kurru sumangaq': { mdr: 'kurru sumangaq', id: 'terima kasih banyak (berkah jiwa)', en: 'thank you deeply / bless you' },
  'inna muola': { mdr: 'inna muola', id: 'kamu hendak ke mana?', en: 'where are you going?' },
  'meloqnaq lamba': { mdr: 'meloqnaq lamba', id: 'saya mau pergi', en: 'I want to go' },
  'manganre di boyang': { mdr: 'manganre di boyang', id: 'makan di rumah', en: 'eating at home' },
  'sombal tanjaq': { mdr: 'sombal tanjaq', id: 'layar gunting perahu', en: 'triangular scissors sail' },
  'perahu sandeq': { mdr: 'lopi sandeq', id: 'perahu sandeq', en: 'sandeq outrigger canoe' },
  'sayyang pattudu': { mdr: 'sayyang pattudu', id: 'kuda menari tradisional', en: 'traditional dancing horse' },
  'lipaq saqbe': { mdr: 'lipaq saqbe', id: 'sarung sutra Mandar', en: 'Mandar silk sarong' },
  'siola-ola': { mdr: 'siola-ola', id: 'bersama-sama', en: 'together' },
};

type LanguageMode = 'mdr-id' | 'id-mdr' | 'mdr-en' | 'en-mdr';

export const SentenceTranslator: React.FC<{ onSelectEntry?: (entry: DictionaryEntry) => void }> = ({ onSelectEntry }) => {
  const [mode, setMode] = useState<LanguageMode>('id-mdr');
  const [inputText, setInputText] = useState('Selamat datang di tanah Mandar Sulawesi Barat');
  const [copied, setCopied] = useState(false);

  // Translation calculation
  const translationResult = useMemo(() => {
    if (!inputText.trim()) {
      return { translatedText: '', lontaraText: '', detectedWords: [] as { orig: string; match?: DictionaryEntry; gloss: string }[] };
    }

    const inputLower = inputText.toLowerCase().trim();
    
    // Check direct phrase lookup first
    for (const [key, phrase] of Object.entries(COMMON_PHRASES)) {
      if (mode === 'id-mdr' && phrase.id.toLowerCase() === inputLower) {
        return {
          translatedText: phrase.mdr,
          lontaraText: transliterateLatinToLontara(phrase.mdr).lontara,
          detectedWords: [{ orig: inputText, gloss: phrase.mdr }]
        };
      }
      if (mode === 'mdr-id' && phrase.mdr.toLowerCase() === inputLower) {
        return {
          translatedText: phrase.id,
          lontaraText: '',
          detectedWords: [{ orig: inputText, gloss: phrase.id }]
        };
      }
      if (mode === 'en-mdr' && phrase.en.toLowerCase() === inputLower) {
        return {
          translatedText: phrase.mdr,
          lontaraText: transliterateLatinToLontara(phrase.mdr).lontara,
          detectedWords: [{ orig: inputText, gloss: phrase.mdr }]
        };
      }
      if (mode === 'mdr-en' && phrase.mdr.toLowerCase() === inputLower) {
        return {
          translatedText: phrase.en,
          lontaraText: '',
          detectedWords: [{ orig: inputText, gloss: phrase.en }]
        };
      }
    }

    // Tokenize into words while keeping punctuation
    const tokens = inputText.split(/(\s+|[,.!?;:—–])/);
    const wordsWithGloss: { orig: string; match?: DictionaryEntry; gloss: string }[] = [];
    const translatedTokens: string[] = [];

    for (const token of tokens) {
      if (!token || /^\s+$/.test(token) || /^[,.!?;:—–]$/.test(token)) {
        translatedTokens.push(token);
        continue;
      }

      const cleanW = token.toLowerCase().replace(/[^a-z'q]/g, '');

      if (mode === 'mdr-id') {
        // Mandar -> Indonesia
        let entry = MANDAR_TO_ENTRY.get(cleanW);
        let gloss = '';

        if (!entry) {
          // Try morphology strip
          const stripped = stripAffixes(cleanW);
          if (stripped.root && MANDAR_TO_ENTRY.has(stripped.root)) {
            entry = MANDAR_TO_ENTRY.get(stripped.root);
            gloss = `[${stripped.root}] ` + (entry?.definition.split(/[,;]/)[0] || cleanW);
          }
        }

        if (entry) {
          gloss = gloss || entry.definition.split(/[,;]/)[0].trim();
          translatedTokens.push(gloss);
          wordsWithGloss.push({ orig: token, match: entry, gloss });
        } else {
          translatedTokens.push(token);
          wordsWithGloss.push({ orig: token, gloss: '(tidak ditemukan)' });
        }
      } else if (mode === 'id-mdr') {
        // Indonesia -> Mandar
        const entry = INDO_TO_ENTRY.get(cleanW);
        if (entry) {
          const mdr = entry.lemma;
          translatedTokens.push(mdr);
          wordsWithGloss.push({ orig: token, match: entry, gloss: mdr });
        } else {
          // Check common grammatical particles
          if (cleanW === 'di') translatedTokens.push('di');
          else if (cleanW === 'ke') translatedTokens.push('di');
          else if (cleanW === 'dan') translatedTokens.push('anna');
          else if (cleanW === 'atau') translatedTokens.push('iyareq');
          else if (cleanW === 'ini') translatedTokens.push('iya');
          else if (cleanW === 'itu') translatedTokens.push('itu');
          else if (cleanW === 'saya' || cleanW === 'aku') translatedTokens.push('iyyaq');
          else if (cleanW === 'kamu' || cleanW === 'engkau') translatedTokens.push('iko');
          else if (cleanW === 'dia') translatedTokens.push('ia');
          else if (cleanW === 'kami' || cleanW === 'kita') translatedTokens.push('kami');
          else if (cleanW === 'mereka') translatedTokens.push('ia disang');
          else if (cleanW === 'tidak') translatedTokens.push('iqdai');
          else if (cleanW === 'sudah') translatedTokens.push('pura');
          else if (cleanW === 'belum') translatedTokens.push('tarrai');
          else if (cleanW === 'sangat' || cleanW === 'sekali') translatedTokens.push('toddong');
          else {
            translatedTokens.push(token);
            wordsWithGloss.push({ orig: token, gloss: '(asli)' });
          }
        }
      } else if (mode === 'mdr-en') {
        // Mandar -> English
        const entry = MANDAR_TO_ENTRY.get(cleanW);
        if (entry) {
          const en = entry.definitionEn?.split(/[,;]/)[0].trim() || entry.definition.split(/[,;]/)[0].trim();
          translatedTokens.push(en);
          wordsWithGloss.push({ orig: token, match: entry, gloss: en });
        } else {
          translatedTokens.push(token);
          wordsWithGloss.push({ orig: token, gloss: '-' });
        }
      } else if (mode === 'en-mdr') {
        // English -> Mandar
        const entry = ENGLISH_TO_ENTRY.get(cleanW);
        if (entry) {
          const mdr = entry.lemma;
          translatedTokens.push(mdr);
          wordsWithGloss.push({ orig: token, match: entry, gloss: mdr });
        } else {
          if (cleanW === 'and') translatedTokens.push('anna');
          else if (cleanW === 'in' || cleanW === 'at' || cleanW === 'to') translatedTokens.push('di');
          else if (cleanW === 'i' || cleanW === 'me') translatedTokens.push('iyyaq');
          else if (cleanW === 'you') translatedTokens.push('iko');
          else if (cleanW === 'we') translatedTokens.push('kami');
          else if (cleanW === 'not' || cleanW === 'no') translatedTokens.push('iqdai');
          else {
            translatedTokens.push(token);
            wordsWithGloss.push({ orig: token, gloss: '-' });
          }
        }
      }
    }

    const translatedText = translatedTokens.join('');
    const lontaraText = (mode === 'id-mdr' || mode === 'en-mdr') 
      ? transliterateLatinToLontara(translatedText).lontara 
      : '';

    return { translatedText, lontaraText, detectedWords: wordsWithGloss };
  }, [inputText, mode]);

  const handleSwapMode = () => {
    if (mode === 'id-mdr') setMode('mdr-id');
    else if (mode === 'mdr-id') setMode('id-mdr');
    else if (mode === 'mdr-en') setMode('en-mdr');
    else if (mode === 'en-mdr') setMode('mdr-en');
    setInputText(translationResult.translatedText || '');
  };

  const handlePlaySource = () => {
    const lang = mode.startsWith('mdr') ? 'mandar' : mode.startsWith('id') ? 'indonesia' : 'english';
    speakText(inputText, { lang });
  };

  const handlePlayTranslated = () => {
    const lang = mode.endsWith('mdr') ? 'mandar' : mode.endsWith('id') ? 'indonesia' : 'english';
    speakText(translationResult.translatedText, { lang });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translationResult.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PRESETS = [
    { label: 'Sapaan Pagi', text: 'Selamat pagi bapak dan ibu guru di sekolah', m: 'id-mdr' },
    { label: 'Keluarga & Rumah', text: 'Saya mau pergi makan bersama keluarga di rumah', m: 'id-mdr' },
    { label: 'Tradisi Pelaut', text: 'Passombal lamba sombal di laut maombaq', m: 'mdr-id' },
    { label: 'Perahu Sandeq', text: 'Lopi sandeq lari kencang dibawa angin timur', m: 'id-mdr' },
    { label: 'English to Mandar', text: 'welcome to the beautiful land of mandar', m: 'en-mdr' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨈᨑᨍᨆ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Languages className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #3 • Penerjemah Dwiarah & Multibahasa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Penerjemah Kalimat Dwiarah Otomatis
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Terjemahkan kalimat utuh antara <strong className="text-mandar-gold-300">Bahasa Mandar ⇄ Bahasa Indonesia ⇄ English</strong> dengan integrasi dekomposisi morfologi, transliterasi Aksara Lontara instan, dan pelafalan audio TTS.
          </p>
        </div>
      </div>

      {/* Mode Switcher Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-mandar-sand-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode('id-mdr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'id-mdr' ? 'bg-mandar-maroon-700 text-white shadow-sm' : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100'
            }`}
          >
            Indonesia ➔ Mandar
          </button>
          <button
            onClick={() => setMode('mdr-id')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'mdr-id' ? 'bg-mandar-maroon-700 text-white shadow-sm' : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100'
            }`}
          >
            Mandar ➔ Indonesia
          </button>
          <button
            onClick={() => setMode('en-mdr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'en-mdr' ? 'bg-mandar-navy-800 text-white shadow-sm' : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100'
            }`}
          >
            English ➔ Mandar
          </button>
          <button
            onClick={() => setMode('mdr-en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'mdr-en' ? 'bg-mandar-navy-800 text-white shadow-sm' : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100'
            }`}
          >
            Mandar ➔ English
          </button>
        </div>

        <button
          onClick={handleSwapMode}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-mandar-gold-100 hover:bg-mandar-gold-200 dark:bg-mandar-gold-950 dark:hover:bg-mandar-gold-900 text-mandar-maroon-900 dark:text-mandar-gold-300 text-xs font-bold transition-colors"
          title="Tukar Arah Bahasa"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Tukar Arah</span>
        </button>
      </div>

      {/* Preset Phrases */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-400 font-bold shrink-0">Contoh Cepat:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMode(p.m as LanguageMode);
              setInputText(p.text);
            }}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 whitespace-nowrap hover:border-mandar-maroon-500 font-medium transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Dual Column Translation Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Box: Input Text */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-mandar-sand-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-mandar-sand-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 uppercase tracking-wider">
                {mode.startsWith('mdr') ? 'Bahasa Mandar' : mode.startsWith('id') ? 'Bahasa Indonesia' : 'English'}
              </span>
              <button
                onClick={() => setInputText('')}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Bersihkan</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik kalimat yang ingin diterjemahkan di sini..."
              className="w-full mt-3 bg-transparent text-base sm:text-lg text-stone-900 dark:text-white outline-none resize-none placeholder-stone-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePlaySource}
              disabled={!inputText.trim()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-mandar-sand-100 dark:bg-slate-800 hover:bg-mandar-sand-200 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengarkan Sumber</span>
            </button>
            <span className="text-[11px] text-stone-400">
              {inputText.length} karakter
            </span>
          </div>
        </div>

        {/* Right Box: Translated Output */}
        <div className="bg-gradient-to-br from-mandar-sand-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-3xl p-6 border border-mandar-maroon-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-mandar-sand-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-mandar-navy-800 dark:text-sky-400 uppercase tracking-wider">
                {mode.endsWith('mdr') ? 'Terjemahan Mandar' : mode.endsWith('id') ? 'Terjemahan Indonesia' : 'English Translation'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Otomatis
              </span>
            </div>

            <div className="mt-3 min-h-[140px] space-y-3">
              <p className="text-base sm:text-lg font-bold text-mandar-maroon-900 dark:text-mandar-gold-300 leading-relaxed">
                {translationResult.translatedText || <span className="text-stone-400 font-normal italic">Hasil terjemahan akan tampil di sini...</span>}
              </p>

              {/* Lontara Script Display if target is Mandar */}
              {translationResult.lontaraText && (
                <div className="p-3 rounded-2xl bg-mandar-gold-50 dark:bg-mandar-gold-950/40 border border-mandar-gold-300/50">
                  <span className="text-[10px] font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 block mb-1">
                    Aksara Lontara:
                  </span>
                  <p className="text-lg sm:text-xl font-lontara text-mandar-gold-800 dark:text-mandar-gold-300 tracking-wider">
                    {translationResult.lontaraText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-mandar-sand-200 dark:border-slate-800">
            <button
              onClick={handlePlayTranslated}
              disabled={!translationResult.translatedText}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white text-xs font-semibold disabled:opacity-40 shadow-sm transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengarkan Hasil</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={!translationResult.translatedText}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-mandar-sand-300 dark:border-slate-700 hover:bg-mandar-sand-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Word-by-Word Gloss Breakdown Table */}
      {translationResult.detectedWords.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600 dark:text-slate-300">
              Dekomposisi Kata & Glos Leksikon:
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {translationResult.detectedWords.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => item.match && onSelectEntry && onSelectEntry(item.match)}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  item.match 
                    ? 'bg-mandar-gold-50/60 dark:bg-slate-800 border-mandar-gold-300 dark:border-slate-700 cursor-pointer hover:border-mandar-maroon-600'
                    : 'bg-mandar-sand-50 dark:bg-slate-800/40 border-mandar-sand-200 dark:border-slate-800'
                }`}
              >
                <div className="font-bold text-stone-800 dark:text-white flex items-center space-x-1">
                  <span>{item.orig}</span>
                  {item.match && <ExternalLink className="w-3 h-3 text-mandar-maroon-600 dark:text-mandar-gold-400" />}
                </div>
                <div className="text-[11px] text-mandar-maroon-800 dark:text-mandar-gold-300 truncate max-w-[140px]">
                  {item.gloss}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
