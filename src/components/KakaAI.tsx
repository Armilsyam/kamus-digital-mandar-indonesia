"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  User, 
  RotateCcw, 
  BookOpen, 
  Compass, 
  Scroll, 
  Languages, 
  ExternalLink,
  Check,
  Copy
} from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/audio';
import { DictionaryEntry } from './DictionaryCard';
import dictionaryEntries from '@/data/mandar_dictionary.json';
import cultureData from '@/data/mandar_culture.json';
import grammarData from '@/data/mandar_grammar.json';

interface Message {
  id: string;
  sender: 'user' | 'kaka';
  text: string;
  lang?: 'mandar' | 'indonesia' | 'english';
  matchedEntry?: DictionaryEntry;
  timestamp: string;
}

interface KakaAIProps {
  soundEnabled: boolean;
  onSelectEntry: (entry: DictionaryEntry) => void;
  onGoToTab: (tab: string, param?: string) => void;
}

const ALL_ENTRIES = dictionaryEntries as DictionaryEntry[];

export const KakaAI: React.FC<KakaAIProps> = ({
  soundEnabled,
  onSelectEntry,
  onGoToTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'kaka',
      text: "Tabe! Salam budaya. Iyau Kaka-AI, asisten cerdas bahasa dan kebudayaan Mandar Anda. Ada yang bisa Kaka bantu terkait leksikografi 4.443 kosakata Mandar, aturan fonologi alofon, perahu Sandeq, tenun Saqbe, atau sastra Kalindaqdaq hari ini?",
      lang: 'indonesia',
      timestamp: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const QUICK_QUESTIONS = [
    "Apa makna ungkapan 'Mellamun Bomboq, Mappasombo Litaq'?",
    "Jelaskan bagian dan anatomi perahu layar Sandeq",
    "Bagaimana aturan alofon konsonan /b/ dan /d/ dalam bahasa Mandar?",
    "Tuliskan satu bait puisi Kalindaqdaq dan hitung suku katanya",
    "Apa arti dan terjemahan kata 'boyang' dalam 3 bahasa?",
    "Apa filosofi motif tenun Lipaq Saqbe 'Sureq Salaka'?"
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateKakaResponse(text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);

      if (soundEnabled) {
        handlePlaySpeech(response.id, response.text, response.lang || 'indonesia');
      }
    }, 600);
  };

  const handlePlaySpeech = (msgId: string, text: string, lang: 'mandar' | 'indonesia' | 'english' = 'indonesia') => {
    if (playingMessageId === msgId) {
      stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msgId);
    speakText(text, {
      lang: lang,
      onEnd: () => setPlayingMessageId(null),
      onError: () => setPlayingMessageId(null)
    });
  };

  const generateKakaResponse = (query: string): Message => {
    const qLower = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Check for specific cultural keywords
    if (qLower.includes('mellamun bomboq') || qLower.includes('filosofi') || qLower.includes('falsafah')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Falsafah luhur passombal (pelaut Mandar) berbunyi: "Mellamun Bomboq, Mappasombo Litaq".\n\nArtinya secara harfiah: "Menenggelamkan keangkuhan ombak, menjunjung tinggi keluhuran tanah daratan". Makna filosofisnya adalah seorang pelaut Mandar tidak boleh sombong di hadapan samudra, melainkan senantiasa rendah hati, menjaga harga diri (siriq), dan mendedikasikan perjuangan mengarungi lautan untuk kemakmuran keluarga dan tanah kelahirannya di daratan.`,
        lang: 'indonesia',
        timestamp
      };
    }

    if (qLower.includes('sandeq') || qLower.includes('perahu') || qLower.includes('cadik')) {
      const sandeqEntry = ALL_ENTRIES.find(e => e.lemma.toLowerCase() === 'sandeq');
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Perahu Sandeq adalah mahakarya perahu layar bercadik ganda khas suku Mandar, diakui sebagai perahu layar tercepat tanpa mesin di Austronesia.\n\nKomponen utamanya meliputi:\n• Sombal: Layar segitiga (sombal tanjaq) penangkap angin.\n• Pallayarang: Tiang layar utama kayu/bambu.\n• Baratan: Lengan penyeimbang di kiri dan kanan.\n• Tada (Cadik): Bilah bambu pelampung peredam ombak.\n• Guling: Kemudi samping tradisional yang presisi.\n• Pacceko: Ruang penyimpanan bekal di lambung perahu.`,
        matchedEntry: sandeqEntry,
        lang: 'indonesia',
        timestamp
      };
    }

    if (qLower.includes('kalindaqdaq') || qLower.includes('puisi') || qLower.includes('pantun')) {
      const sample = cultureData.kalindaqdaq.poems[0];
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Kalindaqdaq adalah sastra lisan puisi tradisional Mandar berstruktur 4 baris dengan pola irama ketat 8 - 7 - 8 - 7 suku kata.\n\nContoh bait Kalindaqdaq Masiriq (Percintaan):\n1. "${sample.linesMandar[0]}" (8 suku kata)\n2. "${sample.linesMandar[1]}" (7 suku kata)\n3. "${sample.linesMandar[2]}" (8 suku kata)\n4. "${sample.linesMandar[3]}" (7 suku kata)\n\nTerjemahan: "Melongok sembari menyodorkan piring yang telah retak, ranting belimbing runtuh terkulai selalu." Menggambarkan kerinduan mendalam menanti kekasih dari seberang lautan.`,
        lang: 'indonesia',
        timestamp
      };
    }

    if (qLower.includes('alofon') || qLower.includes('fonologi') || qLower.includes('/b/') || qLower.includes('/d/')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Bahasa Mandar memiliki sistem alofon unik di mana konsonan berubah realisasi bunyi saat diapit oleh dua vokal (intervokalik):\n\n1. Fonem /b/ → [w]: Kata "tabe" diucapkan [tawe], "kaboro" diucapkan [kaworo].\n2. Fonem /d/ → [dz] / [ð]: Kata "madondong" diucapkan [madzondzong], "tada" diucapkan [tadza].\n3. Fonem /g/ → [gh] / [ɣ]: Kata "pago" diucapkan [pagho].\n4. Fonem /j/ → [y]: Kata "kaja" diucapkan [kaya].\n5. Fonem /q/ adalah letup glotal (hamzah [ʔ]), seperti pada kata "anaq" dan "saqbe".`,
        lang: 'indonesia',
        timestamp
      };
    }

    if (qLower.includes('saqbe') || qLower.includes('sureq') || qLower.includes('tenun') || qLower.includes('sarung')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Lipaq Saqbe adalah kain tenun sutra tradisional Mandar. Motifnya disebut 'Sureq':\n\n• Sureq Salaka: Garis perak melambangkan kemurnian hati, kejujuran, dan kebangsawanan.\n• Sureq Padhadhang: Garis bilah pedang melambangkan keberanian ksatria Mandar.\n• Sureq Balo Tappang: Kotak-kotak tegas kehormatan para tetua Tomakaka.\n• Sureq Marasa: Corak mewah untuk mempelai dalam upacara adat perkawinan.`,
        lang: 'indonesia',
        timestamp
      };
    }

    // 2. Direct Lemma Lookup in Dictionary
    // Try to find matching word
    const matched = ALL_ENTRIES.find(e => {
      const l = e.lemma.toLowerCase();
      return qLower === l || qLower.includes(` ${l} `) || qLower.endsWith(` ${l}`) || qLower.startsWith(`${l} `) || qLower.includes(`'${l}'`) || qLower.includes(`"${l}"`);
    });

    if (matched) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Kaka menemukan lema "${matched.lemma}" (${matched.lontara}) [${matched.phonetic}] dalam Kamus Mandar 2025!\n\n• Kelas Kata: ${matched.posLabel} (${matched.posEn})\n• Arti Bahasa Indonesia: ${matched.definition}\n• English Meaning: ${matched.definitionEn}\n• Kategori: ${matched.category}\n${matched.exampleMandar ? `• Contoh Tuturan: "${matched.exampleMandar}"` : ''}`,
        matchedEntry: matched,
        lang: 'indonesia',
        timestamp
      };
    }

    // 3. Fallback General Assistance
    return {
      id: `kaka-${Date.now()}`,
      sender: 'kaka',
      text: `Pertanyaan yang bagus! Dalam khazanah bahasa dan budaya Mandar, konsep tersebut berkaitan erat dengan nilai kemaritiman dan kearifan lokal Sulawesi Barat. Anda dapat mengecek 4.443 lema leksikon pada tab Kamus, mencoba laboratorium fonologi interaktif, atau membuka ensiklopedia budaya maritim untuk penjelasan lengkap. Silakan tanyakan kata Mandar lainnya yang ingin Anda ketahui artinya!`,
      lang: 'indonesia',
      timestamp
    };
  };

  const handleResetChat = () => {
    stopSpeaking();
    setPlayingMessageId(null);
    setMessages([
      {
        id: 'welcome-1',
        sender: 'kaka',
        text: "Tabe! Salam budaya. Percakapan telah diatur ulang. Apa yang ingin Anda tanyakan seputar bahasa, fonologi, atau kebudayaan Mandar hari ini?",
        lang: 'indonesia',
        timestamp: 'Baru saja'
      }
    ]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-semibold mb-4">
            <Bot className="w-3.5 h-3.5" />
            <span>Asisten Kecerdasan Artifisial Kebudayaan Mandar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Kaka-AI: Sahabat Konsultasi Bahasa & Budaya Mandar
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Didukung basis pengetahuan leksikografi 4.443 entri resmi Kemendikdasmen 2025. 
            Tanyakan arti kosakata, aturan fonologi alofon, dekomposisi morfologi, perahu Sandeq, 
            tenun Lipaq Saqbe, hingga gubahan puisi Kalindaqdaq. Lengkap dengan audio suara Kaka-AI!
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-mandar-sand-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
        
        {/* Chat Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-mandar-maroon-50 to-mandar-sand-100 dark:from-slate-800 dark:to-slate-850 border-b border-mandar-sand-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-mandar-maroon-800 to-mandar-gold-500 text-white flex items-center justify-center font-bold shadow-md">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                  Kaka-AI
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mandar-gold-100 text-mandar-gold-800 dark:bg-mandar-gold-950 dark:text-mandar-gold-300">
                  Online
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Pakar Leksikografi & Tradisi Maritim Sulawesi Barat
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetChat}
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-stone-200/60 dark:hover:bg-slate-700 transition-colors text-xs flex items-center space-x-1"
              title="Atur Ulang Obrolan"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isKaka = msg.sender === 'kaka';
            const isPlaying = playingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isKaka ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isKaka
                    ? 'bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500 text-white'
                    : 'bg-mandar-navy-800 text-white'
                }`}>
                  {isKaka ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-2xl rounded-3xl p-4 sm:p-5 shadow-sm text-sm sm:text-base leading-relaxed ${
                  isKaka
                    ? 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-800 dark:text-slate-100 border border-mandar-sand-200 dark:border-slate-700'
                    : 'bg-mandar-maroon-700 text-white rounded-tr-none'
                }`}>
                  <div className="whitespace-pre-line font-normal">
                    {msg.text}
                  </div>

                  {/* Matched Dictionary Entry Card (If any) */}
                  {msg.matchedEntry && (
                    <div 
                      onClick={() => onSelectEntry(msg.matchedEntry!)}
                      className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-mandar-gold-300 dark:border-mandar-gold-700 hover:border-mandar-maroon-500 cursor-pointer shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-bold text-mandar-maroon-900 dark:text-mandar-maroon-200">
                            {msg.matchedEntry.lemma}
                          </span>
                          <span className="font-lontara text-xl text-mandar-gold-600 dark:text-mandar-gold-400">
                            {msg.matchedEntry.lontara}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
                          {msg.matchedEntry.posLabel}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-slate-300 line-clamp-2">
                        {msg.matchedEntry.definition}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-mandar-navy-600 dark:text-sky-400 font-medium">
                        <span>Klik untuk melihat rincian kamus lengkap</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  )}

                  {/* Bubble Footer & Audio Pronunciation */}
                  <div className={`mt-3 pt-2 border-t flex items-center justify-between text-xs ${
                    isKaka
                      ? 'border-mandar-sand-200/80 dark:border-slate-700 text-stone-400'
                      : 'border-white/20 text-white/70'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isKaka && (
                      <button
                        onClick={() => handlePlaySpeech(msg.id, msg.text, msg.lang)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors font-medium text-xs ${
                          isPlaying
                            ? 'bg-mandar-maroon-700 text-white animate-pulse'
                            : 'hover:bg-mandar-sand-200 dark:hover:bg-slate-700 text-mandar-maroon-800 dark:text-mandar-gold-300'
                        }`}
                        title="Dengarkan Suara Kaka-AI"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlaying ? 'Berhenti' : 'Dengarkan Suara'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-3 text-stone-400 text-xs pl-12 animate-pulse">
              <Sparkles className="w-4 h-4 text-mandar-gold-500 animate-spin" />
              <span>Kaka-AI sedang menelaah leksikon Mandar...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-mandar-sand-50/70 dark:bg-slate-850 border-t border-mandar-sand-200 dark:border-slate-800 overflow-x-auto flex items-center space-x-2">
          <span className="text-[11px] font-bold text-stone-400 shrink-0 uppercase tracking-wider">
            Saran Cepat:
          </span>
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-mandar-gold-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 border border-mandar-sand-200 dark:border-slate-700 whitespace-nowrap shadow-sm transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-mandar-sand-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan kata Mandar, aturan fonologi, atau filosofi Sandeq kepada Kaka-AI..."
              className="flex-1 py-3 px-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border-2 border-mandar-sand-200 dark:border-slate-700 focus:border-mandar-maroon-600 outline-none text-sm sm:text-base text-stone-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-5 py-3 rounded-2xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
