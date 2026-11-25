"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Copy,
  Brain,
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Target,
  RefreshCw,
  Lightbulb,
  Zap,
  GraduationCap
} from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/audio';
import { DictionaryEntry } from './DictionaryCard';
import dictionaryEntries from '@/data/mandar_dictionary.json';
import cultureData from '@/data/mandar_culture.json';
import grammarData from '@/data/mandar_grammar.json';
import { 
  getUserLearningProfile, 
  recordLearningActivity, 
  updateMasteryFromQuiz, 
  UserLearningProfile, 
  ConceptMastery 
} from '@/lib/learningTracker';

interface Message {
  id: string;
  sender: 'user' | 'kaka';
  text: string;
  lang?: 'mandar' | 'indonesia' | 'english';
  matchedEntry?: DictionaryEntry;
  timestamp: string;
  isDiagnosticCheck?: boolean;
  diagnosticQuestion?: DiagnosticQuestion;
}

interface DiagnosticQuestion {
  conceptId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptName: string;
}

interface KakaAIProps {
  soundEnabled: boolean;
  onSelectEntry: (entry: DictionaryEntry) => void;
  onGoToTab: (tab: string, param?: string) => void;
}

const ALL_ENTRIES = dictionaryEntries as DictionaryEntry[];

// Bank Pertanyaan Diagnostik Adaptif berbasis Topik Riwayat Belajar
const DIAGNOSTIC_QUESTION_BANK: DiagnosticQuestion[] = [
  {
    conceptId: 'c-fonologi',
    conceptName: 'Fonologi & Alofon Mandar',
    question: "Kaka melihat di riwayatmu kamu telah menelusuri lema 'tabe'. Menurut kaidah fonologi Balai Bahasa 2025, mengapa kata tersebut dilafalkan [tawe] dan bukan [tabe]?",
    options: [
      "Karena huruf /b/ diapit dua vokal (intervokalik) sehingga bibir meluncur menjadi bunyi [w]",
      "Karena dialek pesisir Majene meniadakan semua konsonan letup",
      "Karena mendapat pengaruh serapan bahasa asing modern",
      "Karena kata 'tabe' selalu berpasangan dengan akhiran klitik -mo"
    ],
    correctIndex: 0,
    explanation: "Tepat sekali! Dalam fonologi Mandar (Kaidah Alofon Halaman 16), konsonan hambat bilabial /b/ yang berada di antara dua vokal (intervokalik V+b+V) secara alami direalisasikan sebagai alofon aproksiman bilabial [w]."
  },
  {
    conceptId: 'c-fonologi',
    conceptName: 'Fonologi (Letup Glotal)',
    question: "Berdasarkan riwayat latihan pelafalanmu pada kata 'sandeq' dan 'siriq', apa peran fonologis huruf 'q' di akhir kata?",
    options: [
      "Huruf penghias ortografi tanpa mempengaruhi bunyi ujaran",
      "Letup glotal koda (glottal stop /ʔ/) yang menghentikan hembusan udara secara mendadak",
      "Konsonan getar yang dibaca berdengung nasal",
      "Vokal panjang pengganti huruf 'k' dalam bahasa Indonesia"
    ],
    correctIndex: 1,
    explanation: "Paccing toddong! (Luar biasa tepat!). Huruf 'q' dalam ortografi Mandar melambangkan letup glotis tajam (glottal stop). Melemahkan atau menghilangkan letup ini dapat mengubah makna leksikal kata."
  },
  {
    conceptId: 'c-budaya',
    conceptName: 'Sastra Lisan Kalindaqdaq',
    question: "Kaka mendeteksi aktivitasmu di Studio Kalindaqdaq. Apa aturan metrum suku kata ketat yang menjadi syarat sah pantun/puisi klasik Kalindaqdaq Mandar?",
    options: [
      "Pola 8 - 8 - 8 - 8 suku kata bersajak a-a-a-a",
      "Pola 8 - 7 - 8 - 7 suku kata per baris",
      "Pola bebas tanpa ikatan jumlah suku kata",
      "Pola 12 suku kata seperti gurindam Melayu"
    ],
    correctIndex: 1,
    explanation: "Hebat! Kalindaqdaq Mandar mewajibkan pola metrik prosodi 8 - 7 - 8 - 7 suku kata (total 30 suku kata dalam satu bait empat baris) dengan musikalitas lisan yang khas."
  },
  {
    conceptId: 'c-morfologi',
    conceptName: 'Morfologi & Klitik Mandar',
    question: "Kaka melihat kamu mempelajari struktur kalimat 'Pura manganre-aq'. Menurut Tabel IV Morfologi, apa fungsi gramatikal dari unsur '-aq' di akhir kata?",
    options: [
      "Enklitik Pronomina Persona Seri III (Orang Pertama Tunggal: 'Saya / Daku')",
      "Prefiks pasif penanda waktu lampau",
      "Partikel tanya untuk meminta kepastian",
      "Sufiks pembentuk kata benda tempat"
    ],
    correctIndex: 0,
    explanation: "Sangat benar! '-aq' adalah enklitik persona Seri III Mandar yang berfungsi sebagai objek atau subjek taksa intransitif (misal: manganre-aq = saya sedang/telah makan)."
  },
  {
    conceptId: 'c-kosakata',
    conceptName: 'Kosakata & Kearifan Maritim',
    question: "Dalam riwayat belajarmu tentang perahu Sandeq, komponen bambu panjang di kiri dan kanan perahu penyeimbang amukan ombak disebut...?",
    options: [
      "Sombal Tanjaq (layar gunting)",
      "Baratan & Tada (cadik penyeimbang ganda)",
      "Guling (kemudi samping)",
      "Pallayarang (tiang utama)"
    ],
    correctIndex: 1,
    explanation: "Tepat sekali! 'Baratan' adalah lengan cadik bambu ganda, dan 'Tada' adalah bilah katir pelampung di ujungnya yang menjaga perahu Sandeq melaju kencang tanpa terbalik di laut lepas."
  }
];

export const KakaAI: React.FC<KakaAIProps> = ({
  soundEnabled,
  onSelectEntry,
  onGoToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'diagnosis' | 'mastery' | 'study_plan'>('chat');
  
  // Learning Profile State (Real-time Adaptive)
  const [learningProfile, setLearningProfile] = useState<UserLearningProfile>(getUserLearningProfile);
  
  // Chat Messages State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-tutor',
      sender: 'kaka',
      text: "Tabe! Salam budaya. Kaka senang sekali bertemu denganmu lagi! ⛵\n\nKaka adalah Teman Belajar Mandiri AI pribadimu. Kaka secara otomatis membaca catatan aktivitas dan riwayat belajarmu di platform ini untuk memahami materi mana yang sudah kamu kuasai dan mana yang masih perlu kita latih bersama.\n\nMau menguji pemahamanmu hari ini, berlatih percakapan santai, atau butuh penjelasan leksikon?",
      lang: 'indonesia',
      timestamp: 'Baru saja'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Diagnostic Quiz Interactive State
  const [currentDiagnostic, setCurrentDiagnostic] = useState<DiagnosticQuestion | null>(null);
  const [diagnosticAnswerState, setDiagnosticAnswerState] = useState<{
    selectedIndex: number | null;
    isSubmitted: boolean;
    isCorrect: boolean;
  }>({ selectedIndex: null, isSubmitted: false, isCorrect: false });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refresh profile periodically or on tab switch
  const refreshProfile = () => {
    setLearningProfile(getUserLearningProfile());
  };

  useEffect(() => {
    refreshProfile();
  }, [activeSubTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Quick Chat Prompts based on User History
  const dynamicQuickPrompts = useMemo(() => {
    const weakest = learningProfile.weakestConcepts[0]?.name || 'Fonologi';
    const streak = learningProfile.learningStreakDays;
    return [
      `Kaka, bagaimana evaluasi pemahamanku sejauh ini?`,
      `Coba uji pemahamanku tentang ${weakest}!`,
      `Ajak aku simulasi percakapan belanja di pasar (Pasaq)`,
      `Bantu jelaskan aturan alofon /b/→[w] dan /d/→[dz]`,
      `Rekomendasikan materi belajar untuk hari ke-${streak} ku`
    ];
  }, [learningProfile]);

  // Trigger Socratic Diagnostic Check
  const triggerDiagnosticCheck = (targetConceptId?: string) => {
    setActiveSubTab('chat');
    
    // Cari pertanyaan yang sesuai konsep terlemah atau acak
    let q: DiagnosticQuestion;
    if (targetConceptId) {
      q = DIAGNOSTIC_QUESTION_BANK.find(item => item.conceptId === targetConceptId) || DIAGNOSTIC_QUESTION_BANK[0];
    } else {
      const weakest = learningProfile.weakestConcepts[0]?.id;
      q = DIAGNOSTIC_QUESTION_BANK.find(item => item.conceptId === weakest) || DIAGNOSTIC_QUESTION_BANK[Math.floor(Math.random() * DIAGNOSTIC_QUESTION_BANK.length)];
    }

    setCurrentDiagnostic(q);
    setDiagnosticAnswerState({ selectedIndex: null, isSubmitted: false, isCorrect: false });

    const diagnosticMsg: Message = {
      id: `diag-${Date.now()}`,
      sender: 'kaka',
      text: `🔍 [UJI PEMAHAMAN MANDIRI]\nBerdasarkan riwayat belajarmu, Kaka ingin memverifikasi apakah kamu sudah benar-benar paham materi "${q.conceptName}":\n\n"${q.question}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDiagnosticCheck: true,
      diagnosticQuestion: q
    };

    setMessages(prev => [...prev, diagnosticMsg]);

    if (soundEnabled) {
      speakText(`Mari kita uji pemahamanmu tentang ${q.conceptName}. ${q.question}`, { lang: 'indonesia' });
    }
  };

  const handleDiagnosticAnswer = (index: number) => {
    if (!currentDiagnostic || diagnosticAnswerState.isSubmitted) return;

    const isCorrect = index === currentDiagnostic.correctIndex;
    setDiagnosticAnswerState({
      selectedIndex: index,
      isSubmitted: true,
      isCorrect
    });

    // Update real mastery tracker in localStorage
    updateMasteryFromQuiz(currentDiagnostic.conceptId, isCorrect, currentDiagnostic.conceptName);
    refreshProfile();

    // AI Response Message
    setTimeout(() => {
      const tutorFeedback: Message = {
        id: `tutor-feedback-${Date.now()}`,
        sender: 'kaka',
        text: isCorrect
          ? `🎉 Kurru Sumangaq! (Luar biasa!). Jawabanmu TEPAT!\n\n💡 Penjelasan Edukatif:\n${currentDiagnostic.explanation}\n\n📈 Skor pemahamanmu pada topik "${currentDiagnostic.conceptName}" telah bertambah +8%! Kaka bangga dengan ketelitian belajarmu.`
          : `🌿 Jawabanmu belum tepat, tapi tidak apa-apa! Justru dari sinilah kita belajar mandiri.\n\n💡 Jawaban yang benar adalah:\n"${currentDiagnostic.options[currentDiagnostic.correctIndex]}"\n\nPenjelasan: ${currentDiagnostic.explanation}\n\nKaka telah mencatat ini di daftar materi remedial agar bisa kita ulang kembali!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorFeedback]);

      if (soundEnabled) {
        speakText(isCorrect ? "Kurru Sumangaq! Jawabanmu tepat sekali." : "Jawabanmu belum tepat, ayo pelajari pembahasannya.", { lang: 'indonesia' });
      }
    }, 500);
  };

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

    // Record user activity
    recordLearningActivity({
      type: 'phrase',
      title: 'Tanya Jawab AI Tutor',
      detail: text,
      masteryImpact: 'low',
      category: 'kosakata'
    });

    setTimeout(() => {
      const response = generateIntelligentTutorResponse(text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      refreshProfile();

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

  // Intelligent Context-Aware Response Engine
  const generateIntelligentTutorResponse = (query: string): Message => {
    const qLower = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const profile = getUserLearningProfile();

    // 1. Diagnosis Pemahaman & Evaluasi Riwayat
    if (qLower.includes('evaluasi') || qLower.includes('pemahamanku') || qLower.includes('paham') || qLower.includes('riwayat')) {
      const weakest = profile.weakestConcepts.map(c => `• ${c.name} (${c.masteryPercentage}%)`).join('\n');
      const strongest = profile.strongestConcepts.map(c => `• ${c.name} (${c.masteryPercentage}%)`).join('\n');

      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `📊 LAPORAN DIAGNOSTIK PEMAHAMAN BELAJARMU:\n\nSaat ini tingkat pemahamanmu berada di ${profile.overallMasteryPercentage}% dengan gelar: "${profile.levelTitle}".\nKamu sudah mempertahankan streak belajar ${profile.learningStreakDays} hari berturut-turut! 🔥\n\n✅ Materi yang Sudah Sangat Kamu Pahami:\n${strongest}\n\n⚠️ Materi yang Perlu Kita Perkuat Lagi:\n${weakest}\n\n${profile.aiTutorAdvice}\n\nMau Kaka uji dengan 1 pertanyaan sekarang untuk menguji pemahamanmu?`,
        timestamp
      };
    }

    // 2. Permintaan Kuis Uji Pemahaman
    if (qLower.includes('uji') || qLower.includes('tes') || qLower.includes('soal')) {
      triggerDiagnosticCheck();
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Siap! Kaka telah menyiapkan pertanyaan uji pemahaman berdasarkan titik materi yang paling perlu kamu perkuat. Perhatikan pertanyaan di bawah ini ya! 🎯`,
        timestamp
      };
    }

    // 3. Simulasi Percakapan / Roleplay
    if (qLower.includes('percakapan') || qLower.includes('simulasi') || qLower.includes('pasar') || qLower.includes('belanja')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Asyik! Ayo kita simulasi percakapan belanja sarung tenun sutra di pasar tradisional (Pasaq Tinambung)!\n\nKaka berperan sebagai penjual sarung (Papalimbang Lipaq Saqbe), dan kamu adalah pembelinya:\n\n🗣️ Kaka: "Tabe amboq / indoq, meloq melli sureq apa? Di iya diolo Sureq Salaka anna Sureq Padhadhang mamesa toddong."\n\nCoba kamu balas dengan menanyakan harga sarung tersebut dalam bahasa Mandar! (Petunjuk: gunakan kata 'Pira allinna...').`,
        lang: 'indonesia',
        timestamp
      };
    }

    // 4. Rekomendasi Belajar
    if (qLower.includes('rekomendasi') || qLower.includes('rencana') || qLower.includes('hari ini')) {
      const weak = profile.weakestConcepts[0];
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `🎯 REKOMENDASI BELAJAR MANDIRI HARI INI:\n\n1. 📖 Buka tab "${weak.name}" untuk membaca kembali kaidah dasar.\n2. 🎙️ Coba latih artikulasi di tab "Uji Pelafalan Suara" untuk mengasah ketepatan alofon.\n3. ✍️ Ambil 1 latihan di "Lembar Kerja Guru" atau buat bait Kalindaqdaq 8-7-8-7.\n4. 💡 Tanyakan leksikon yang belum kamu mengerti langsung pada Kaka kapan saja!\n\nKonsistensi kecil setiap hari akan membuatmu menjadi penutur Mandar yang fasih dan berwawasan luhur!`,
        timestamp
      };
    }

    // 5. Pencarian Kamus Spesifik
    const foundEntry = ALL_ENTRIES.find(e => qLower.includes(e.cleanLemma.toLowerCase()));
    if (foundEntry) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Lema "${foundEntry.lemma}" (${foundEntry.posLabel}):\n\n🇮🇩 Arti: ${foundEntry.definition}\n🇬🇧 English: ${foundEntry.definitionEn || '-'}\n🗣️ Pelafalan Fonetik: ${foundEntry.phonetic}\n📜 Aksara Lontara: ${foundEntry.lontara}\n${foundEntry.exampleMandar ? `💬 Contoh Tuturan: "${foundEntry.exampleMandar}"\n` : ''}\nKaka telah mencatat kata ini ke riwayat belajarmu! Ingin Kaka uji dengan contoh kalimat memakai kata ini?`,
        matchedEntry: foundEntry,
        timestamp
      };
    }

    // Default Tutor Reply
    return {
      id: `kaka-${Date.now()}`,
      sender: 'kaka',
      text: `Pertanyaan yang sangat menarik! Terkait bahasa dan kebudayaan Mandar, Kaka selalu siap mendampingi belajarmu.\n\nKamu bisa meminta Kaka untuk:\n• Mendiagnosis apakah pemahamanmu sudah tuntas ("Cek pemahamanku")\n• Menguji materi terlemahmu dengan kuis adaptif ("Uji saya")\n• Latihan simulasi percakapan nyata Mandar\n• Membedah makna peribahasa Pappasang dan anatomi perahu Sandeq.\n\nApa yang ingin kamu eksplorasi selanjutnya?`,
      timestamp
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner - Adaptive AI Tutor */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-7 sm:p-9 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨀᨀᨕᨗ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <Brain className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Asisten AI • Teman Belajar Mandiri & Diagnostik Pemahaman</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Kaka-AI: Teman Belajar Adaptif Mandar
          </h2>
          <p className="text-mandar-sand-200 text-xs sm:text-sm leading-relaxed">
            AI yang mengenali pemahaman Anda secara adaptif lewat analisis riwayat belajar, mendiagnosis titik materi yang belum dipahami, dan menguji pemahaman Anda secara interaktif langkah demi langkah.
          </p>

          {/* Quick Mastery Badge in Header */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <Award className="w-4 h-4 text-mandar-gold-400" />
              <span>Gelar Anda: <strong>{learningProfile.levelTitle}</strong></span>
            </div>

            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Tingkat Pemahaman: <strong>{learningProfile.overallMasteryPercentage}%</strong></span>
            </div>

            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Streak Belajar: <strong>{learningProfile.learningStreakDays} Hari</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Mode: Chat Tutor vs Diagnostic vs Mastery Dashboard vs Study Plan */}
      <div className="flex items-center space-x-2 border-b border-mandar-sand-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'chat'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Percakapan Teman Belajar</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('diagnosis');
            triggerDiagnosticCheck();
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'diagnosis'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-500" />
          <span>Uji Pemahaman Adaptif</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mastery')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'mastery'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <Brain className="w-4 h-4 text-sky-500" />
          <span>Dasbor Diagnosis Riwayat</span>
        </button>

        <button
          onClick={() => setActiveSubTab('study_plan')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'study_plan'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span>Rencana Belajar Mandiri</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: CHAT TUTOR INTERAKTIF                            */}
      {/* ======================================================== */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Box (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col h-[620px] bg-white dark:bg-slate-900 rounded-3xl border border-mandar-sand-200 dark:border-slate-800 shadow-sm overflow-hidden">
            
            {/* Chat Header Bar */}
            <div className="px-6 py-4 bg-mandar-sand-50/80 dark:bg-slate-800/80 border-b border-mandar-sand-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center space-x-1.5">
                    <span>Kaka-AI Tutor</span>
                    <span className="text-[10px] bg-mandar-gold-100 text-mandar-gold-800 dark:bg-mandar-gold-950 dark:text-mandar-gold-300 px-1.5 py-0.2 rounded font-semibold">
                      Online
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400">
                    Memantau riwayat belajar & diagnosis pemahaman mandiri
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => triggerDiagnosticCheck()}
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  title="Uji Pemahaman Sekarang"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Uji Pemahaman</span>
                </button>

                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: 'reset-welcome',
                        sender: 'kaka',
                        text: "Tabe! Sesi percakapan baru dimulai. Kaka siap mendampingi belajarmu kembali!",
                        timestamp: 'Baru saja'
                      }
                    ]);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200 rounded-lg"
                  title="Mulai Ulang Percakapan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isKaka = msg.sender === 'kaka';
                const isPlaying = playingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isKaka ? '' : 'flex-row-reverse space-x-reverse'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isKaka
                          ? 'bg-gradient-to-tr from-mandar-maroon-700 to-mandar-gold-500 text-white'
                          : 'bg-stone-700 text-white'
                      }`}
                    >
                      {isKaka ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                          isKaka
                            ? 'bg-mandar-sand-100 dark:bg-slate-800 text-stone-800 dark:text-slate-100 rounded-tl-none border border-mandar-sand-200 dark:border-slate-700'
                            : 'bg-mandar-maroon-700 text-white rounded-tr-none'
                        }`}
                      >
                        {msg.text}

                        {/* Interactive Diagnostic Quiz Block within Chat */}
                        {msg.isDiagnosticCheck && msg.diagnosticQuestion && (
                          <div className="mt-4 pt-3 border-t border-mandar-sand-300 dark:border-slate-700 space-y-2">
                            <span className="text-[11px] font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 block uppercase tracking-wider">
                              Pilih Jawaban Anda:
                            </span>
                            <div className="space-y-1.5">
                              {msg.diagnosticQuestion.options.map((opt, optIdx) => {
                                const isSelected = diagnosticAnswerState.selectedIndex === optIdx;
                                const isSubmitted = diagnosticAnswerState.isSubmitted;
                                const isCorrectChoice = optIdx === msg.diagnosticQuestion?.correctIndex;

                                let btnClass = 'bg-white dark:bg-slate-900 border-mandar-sand-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 hover:border-mandar-maroon-600';
                                if (isSubmitted) {
                                  if (isCorrectChoice) {
                                    btnClass = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                                  } else if (isSelected && !diagnosticAnswerState.isCorrect) {
                                    btnClass = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={diagnosticAnswerState.isSubmitted}
                                    onClick={() => handleDiagnosticAnswer(optIdx)}
                                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${btnClass}`}
                                  >
                                    <span>{opt}</span>
                                    {isSubmitted && isCorrectChoice && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                                    )}
                                    {isSubmitted && isSelected && !diagnosticAnswerState.isCorrect && (
                                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions under Kaka Message */}
                      {isKaka && (
                        <div className="flex items-center space-x-3 px-1 text-[11px] text-stone-400">
                          <span>{msg.timestamp}</span>

                          <button
                            onClick={() => handlePlaySpeech(msg.id, msg.text, msg.lang)}
                            className="flex items-center space-x-1 hover:text-mandar-maroon-700 dark:hover:text-mandar-gold-400 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isPlaying ? 'Hentikan' : 'Dengarkan Suara Kaka'}</span>
                          </button>

                          {msg.matchedEntry && (
                            <button
                              onClick={() => onSelectEntry(msg.matchedEntry!)}
                              className="flex items-center space-x-1 text-mandar-maroon-700 dark:text-mandar-gold-400 font-semibold hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Lihat di Kamus</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center space-x-2 text-stone-400 text-xs italic px-2">
                  <Bot className="w-4 h-4 animate-spin text-mandar-maroon-700" />
                  <span>Kaka sedang menganalisis & menyusun penjelasan...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Strip */}
            <div className="px-4 py-2 bg-mandar-sand-50/50 dark:bg-slate-800/40 border-t border-mandar-sand-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs">
              <span className="text-stone-400 font-bold shrink-0 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-mandar-gold-500" />
                <span>Pemicu Belajar:</span>
              </span>
              {dynamicQuickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-600 text-stone-700 dark:text-slate-300 whitespace-nowrap text-[11px] font-medium transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-mandar-sand-200 dark:border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan lema, minta kuis adaptif, atau ajak Kaka simulasi percakapan..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none focus:border-mandar-maroon-700"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Sidebar: Real-time Learning Diagnostic Snapshot (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Live Mastery Radar Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-mandar-maroon-700 dark:text-mandar-gold-400" />
                  <span>Diagnosis Pemahaman AI</span>
                </h4>
                <button
                  onClick={refreshProfile}
                  className="text-stone-400 hover:text-stone-600 p-1"
                  title="Segarkan Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Overall Progress Gauge */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-mandar-sand-50 to-mandar-gold-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-mandar-gold-200 dark:border-slate-700 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-stone-600 dark:text-slate-300">
                    Penguasaan Materi Total:
                  </span>
                  <span className="text-xl font-black text-mandar-maroon-800 dark:text-mandar-gold-400">
                    {learningProfile.overallMasteryPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-mandar-sand-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-mandar-maroon-700 to-mandar-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${learningProfile.overallMasteryPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 dark:text-slate-400">
                  Tingkat: <strong className="text-stone-800 dark:text-white">{learningProfile.levelTitle}</strong>
                </p>
              </div>

              {/* Concept Masteries Breakdown */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Status Penguasaan Topik:
                </span>
                {learningProfile.concepts.map((concept) => (
                  <div key={concept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-700 dark:text-slate-300 truncate max-w-[170px]">
                        {concept.name}
                      </span>
                      <span className="font-mono font-bold text-stone-600 dark:text-slate-400">
                        {concept.masteryPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-mandar-sand-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          concept.masteryPercentage >= 75
                            ? 'bg-emerald-500'
                            : concept.masteryPercentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${concept.masteryPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Instant Action Button */}
              <button
                onClick={() => triggerDiagnosticCheck()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Uji Titik Lemah Saya Sekarang</span>
              </button>
            </div>

            {/* AI Tutor Advice Box */}
            <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Catatan Pengamatan Kaka:</span>
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {learningProfile.aiTutorAdvice}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: UJI PEMAHAMAN ADAPTIF (DIAGNOSTIC TEST CENTER)   */}
      {/* ======================================================== */}
      {activeSubTab === 'diagnosis' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold mb-1">
                <span>Evaluasi Socratic Berbasis History</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                Pusat Uji Pemahaman Mandiri AI
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                AI Kaka memilihkan pertanyaan yang ditargetkan pada materi yang paling sering keliru atau belum pernah Anda uji
              </p>
            </div>

            <button
              onClick={() => triggerDiagnosticCheck()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs transition-colors shadow-sm self-start"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ganti Soal Diagnostik</span>
            </button>
          </div>

          {/* Active Question Box */}
          {currentDiagnostic ? (
            <div className="p-6 rounded-3xl bg-mandar-sand-50 dark:bg-slate-800/70 border border-mandar-sand-300 dark:border-slate-700 space-y-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 uppercase tracking-wider">
                  Topik: {currentDiagnostic.conceptName}
                </span>
                <span className="text-stone-400 font-semibold">Tingkat Adaptif: Menengah</span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-relaxed">
                &ldquo;{currentDiagnostic.question}&rdquo;
              </h4>

              <div className="space-y-2.5">
                {currentDiagnostic.options.map((opt, idx) => {
                  const isSelected = diagnosticAnswerState.selectedIndex === idx;
                  const isSubmitted = diagnosticAnswerState.isSubmitted;
                  const isCorrectChoice = idx === currentDiagnostic.correctIndex;

                  let style = 'bg-white dark:bg-slate-900 border-mandar-sand-200 dark:border-slate-700 text-stone-800 dark:text-slate-200 hover:border-mandar-maroon-600';
                  if (isSubmitted) {
                    if (isCorrectChoice) {
                      style = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !diagnosticAnswerState.isCorrect) {
                      style = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={diagnosticAnswerState.isSubmitted}
                      onClick={() => handleDiagnosticAnswer(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-mandar-sand-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSubmitted && isCorrectChoice && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !diagnosticAnswerState.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {diagnosticAnswerState.isSubmitted && (
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 animate-in fade-in ${
                  diagnosticAnswerState.isCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}>
                  <div className="font-bold flex items-center space-x-1.5">
                    {diagnosticAnswerState.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <HelpCircle className="w-4 h-4 text-amber-600" />}
                    <span>{diagnosticAnswerState.isCorrect ? 'Luar Biasa! Pemahaman Anda Terkonfirmasi' : 'Catatan Pembahasan Kaka-AI'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {currentDiagnostic.explanation}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold opacity-80">
                      Mastery terupdate di Dasbor Profil Anda.
                    </span>
                    <button
                      onClick={() => triggerDiagnosticCheck()}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold text-xs shadow"
                    >
                      Lanjut ke Soal Berikutnya →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400">
              <button
                onClick={() => triggerDiagnosticCheck()}
                className="px-5 py-2.5 rounded-xl bg-mandar-maroon-700 text-white font-bold text-xs"
              >
                Mulai Uji Pemahaman Mandiri Sekarang
              </button>
            </div>
          )}

          {/* Quick Concept Pickers for Specific Diagnosis */}
          <div className="space-y-3 pt-3">
            <span className="text-xs font-bold text-stone-700 dark:text-slate-300 block">
              Pilih Topik Tertentu untuk Diuji Kaka-AI:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {learningProfile.concepts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => triggerDiagnosticCheck(c.id)}
                  className="p-3 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-600 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white mb-1">
                    <span className="truncate">{c.name.split(' & ')[0]}</span>
                    <span className="text-mandar-maroon-700 dark:text-mandar-gold-400">{c.masteryPercentage}%</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-1">
                    {c.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: DASBOR DIAGNOSIS RIWAYAT BELAJAR                 */}
      {/* ======================================================== */}
      {activeSubTab === 'mastery' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                  Dasbor Diagnostik Riwayat & Penguasaan Materi
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Rekam jejak otomatis dari pencarian lema, latihan suara, kuis, dan interaksi Anda di KADIMA-ID
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs self-start">
                Tersinkronisasi Otomatis
              </span>
            </div>

            {/* Detailed Concept Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningProfile.concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="p-5 rounded-2xl bg-mandar-sand-50/60 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900 dark:text-white">
                      {concept.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      concept.status === 'mahir' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      concept.status === 'paham' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                      concept.status === 'sedang_belajar' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {concept.status.replace('_', ' ').toUpperCase()} ({concept.masteryPercentage}%)
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-slate-300">
                    {concept.description}
                  </p>

                  <div className="w-full h-2 bg-mandar-sand-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mandar-maroon-700 dark:bg-mandar-gold-500 rounded-full"
                      style={{ width: `${concept.masteryPercentage}%` }}
                    />
                  </div>

                  {/* Weak & Strong points */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-mandar-sand-200 dark:border-slate-700">
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        ✓ Sudah Dikuasai:
                      </span>
                      <p className="text-stone-500 dark:text-slate-400">
                        {concept.strongPoints?.join(', ') || 'Kosakata dasar terverifikasi'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                        ⚠️ Titik Perlu Penguatan:
                      </span>
                      <p className="text-stone-500 dark:text-slate-400">
                        {concept.weakPoints?.join(', ') || 'Perlu latihan lebih banyak'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Log List */}
            <div className="space-y-3 pt-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Log 10 Aktivitas Pembelajaran Terakhir Anda:
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {learningProfile.recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-mandar-sand-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-slate-400">
                        {act.detail}
                      </span>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-[10px] text-stone-400 block">{act.timestamp}</span>
                      {act.score !== undefined && (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          Skor: {act.score}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: RENCANA BELAJAR MANDIRI (PERSONALIZED CURRICULUM) */}
      {/* ======================================================== */}
      {activeSubTab === 'study_plan' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              Kurikulum Mandiri Rekomendasi Kaka-AI
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Disusun khusus untuk Anda berdasarkan materi yang teridentifikasi belum tuntas pada riwayat belajar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Step 1 */}
            <div className="p-5 rounded-3xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 space-y-3">
              <span className="w-7 h-7 rounded-full bg-mandar-maroon-700 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                Fokus Penguatan Titik Lemah: {learningProfile.weakestConcepts[0]?.name.split(' & ')[0]}
              </h4>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                Tingkat pemahaman saat ini {learningProfile.weakestConcepts[0]?.masteryPercentage}%. Pelajari kembali kaidah utama di laboratorium terkait.
              </p>
              <button
                onClick={() => onGoToTab('fonologi', 'tabe')}
                className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 border border-mandar-sand-300 dark:border-slate-700 hover:border-mandar-maroon-600 text-stone-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Buka Lab Fonologi →
              </button>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-3xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 space-y-3">
              <span className="w-7 h-7 rounded-full bg-mandar-maroon-700 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                Latihan Praktik Vokal & Artikulasi Mandar
              </h4>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                Uji rekaman pelafalan kata beralofon seperti [tawe] dan [madzondzong] di fitur Evaluator Suara.
              </p>
              <button
                onClick={() => onGoToTab('evaluator')}
                className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 border border-mandar-sand-300 dark:border-slate-700 hover:border-mandar-maroon-600 text-stone-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Uji Pelafalan Mikrofon →
              </button>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-3xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 space-y-3">
              <span className="w-7 h-7 rounded-full bg-mandar-maroon-700 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                Simulasi Uji Socratic Bersama Kaka-AI
              </h4>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                Jawab 1 tantangan kuis diagnostik yang disesuaikan secara otomatis oleh AI untuk mengecek pemahamanmu.
              </p>
              <button
                onClick={() => triggerDiagnosticCheck()}
                className="w-full py-2 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Mulai Uji Sekarang 🎯
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
