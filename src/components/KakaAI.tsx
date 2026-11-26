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
  GraduationCap,
  Printer,
  Download,
  FileCheck,
  BookMarked,
  Mic,
  MicOff,
  Split,
  Bookmark
} from 'lucide-react';
import { 
  speakText, 
  stopSpeaking,
  startSpeechListening,
  stopSpeechListening,
  isSpeechRecognitionSupported
} from '@/lib/audio';
import { 
  detectLanguageAndAnalyze, 
  LanguageAnalysisResult 
} from '@/lib/languageDetector';
import { DictionaryEntry } from './DictionaryCard';
import dictionaryEntries from '@/data/mandar_dictionary.json';
import cultureData from '@/data/mandar_culture.json';
import grammarData from '@/data/mandar_grammar.json';
import { 
  getUserLearningProfile, 
  recordLearningActivity, 
  updateMasteryFromQuiz, 
  UserLearningProfile, 
  ConceptMastery,
  getAllWordMasteries,
  getRecentLearnedWords,
  recordWordInteraction,
  evaluateFreeTextComprehension,
  FreeTextEvaluationResult,
  WordMasteryRecord
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
  evalResult?: FreeTextEvaluationResult;
  languageAnalysis?: LanguageAnalysisResult;
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
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'diagnosis' | 'evaluator' | 'mastery' | 'study_plan' | 'references'>('chat');
  
  // Learning Profile State (Real-time Adaptive)
  const [learningProfile, setLearningProfile] = useState<UserLearningProfile>(getUserLearningProfile);
  const [wordMasteries, setWordMasteries] = useState<Record<string, WordMasteryRecord>>(getAllWordMasteries);
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'mahir' | 'sedang_belajar' | 'belum_paham'>('all');

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionSupported = isSpeechRecognitionSupported();

  // Certificate student name
  const [studentName, setStudentName] = useState('Pelajar Budaya Mandar');
  const [isCertificateView, setIsCertificateView] = useState(false);

  // Chat Messages State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-tutor',
      sender: 'kaka',
      text: "Tabe! Salam budaya. Kaka senang sekali mendampingi belajarmu! ⛵\n\nKaka adalah Teman Belajar Mandiri AI yang dibekali wawasan leksikografis Balai Bahasa 2025, manuskrip sejarah Pitu Baqbana Binanga & Pitu Ulunna Salu, serta kebudayaan maritim Mandar.\n\nKamu bisa berbicara langsung lewat mikrofon (Voice In 2-Arah), meminta diagnosis pemahaman, belajar kalimat campuran Mandar-Indonesia, atau menanyakan sejarah dan peribahasa leluhur!",
      lang: 'indonesia',
      timestamp: 'Baru saja'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Toggle Perekaman Suara 2-Arah
  const toggleListening = () => {
    if (isListening) {
      stopSpeechListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      startSpeechListening({
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSendMessage(transcript);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      });
    }
  };

  // Free-Text Evaluator Sub-Tab State
  const [evaluatorTopic, setEvaluatorTopic] = useState('sandeq');
  const [evaluatorUserText, setEvaluatorUserText] = useState('');
  const [evaluatorResult, setEvaluatorResult] = useState<FreeTextEvaluationResult | null>(null);
  const [evaluatorLoading, setEvaluatorLoading] = useState(false);

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
    setWordMasteries(getAllWordMasteries());
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
    const recentWords = getRecentLearnedWords(3).map(w => w.lemma);
    const wordPrompt = recentWords.length > 0 ? `Uji pemahamanku tentang '${recentWords[0]}'` : 'Coba uji pemahamanku tentang Fonologi!';
    return [
      `Kaka, bagaimana evaluasi pemahamanku sejauh ini?`,
      wordPrompt,
      `Coba nilai penjelasan saya: Sandeq adalah perahu layar bercadik ganda khas Mandar yang memakai layar sombal tanjaq`,
      `Ajak aku simulasi percakapan belanja di pasar (Pasaq)`,
      `Rekomendasikan materi belajar untuk hari ke-${streak} ku`
    ];
  }, [learningProfile]);

  // Trigger Socratic Diagnostic Check
  const triggerDiagnosticCheck = (targetConceptId?: string, customLemma?: string) => {
    setActiveSubTab('chat');
    
    let q: DiagnosticQuestion;

    if (customLemma) {
      const found = ALL_ENTRIES.find(e => e.cleanLemma.toLowerCase() === customLemma.toLowerCase());
      if (found) {
        q = {
          conceptId: 'c-kosakata',
          conceptName: `Lema Khusus: ${found.lemma}`,
          question: `Berdasarkan leksikon resmi Balai Bahasa 2025, apakah makna yang paling tepat untuk lema Mandar "${found.lemma}"?`,
          options: [
            found.definition,
            `Bentuk sapaan kekerabatan atau kehormatan bagi tokoh masyarakat Mandar`,
            `Istilah upacara adat maritim yang diadakan saat musim angin barat`,
            `Peralatan tenun tradisional Lipaq Saqbe khas pedalaman Balanipa`
          ].sort(() => Math.random() - 0.5),
          correctIndex: 0,
          explanation: `Tepat sekali! Menurut Kamus Mandar-Indonesia 2025 (Halaman ${found.page}), "${found.lemma}" (${found.posLabel}) bermakna: ${found.definition}.`
        };
        q.correctIndex = q.options.indexOf(found.definition);
      } else {
        q = DIAGNOSTIC_QUESTION_BANK[0];
      }
    } else if (targetConceptId) {
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
      text: `🔍 [UJI PEMAHAMAN MANDIRI BERBASIS RIWAYAT]\nKaka melihat catatan belajarmu dan ingin menguji apakah kamu sudah benar-benar paham materi "${q.conceptName}":\n\n"${q.question}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDiagnosticCheck: true,
      diagnosticQuestion: q
    };

    setMessages(prev => [...prev, diagnosticMsg]);

    if (soundEnabled) {
      speakText(`Mari kita uji pemahamanmu tentang ${q.conceptName}. ${q.question}`, { 
        lang: 'indonesia',
        gender: 'female',
        voiceProfile: 'kaka'
      });
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
        speakText(isCorrect ? "Kurru Sumangaq! Jawabanmu tepat sekali." : "Jawabanmu belum tepat, ayo pelajari pembahasannya.", { 
          lang: 'indonesia',
          gender: 'female',
          voiceProfile: 'kaka'
        });
      }
    }, 500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const analysis = detectLanguageAndAnalyze(text);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      languageAnalysis: analysis
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
      gender: 'female',
      voiceProfile: 'kaka',
      onEnd: () => setPlayingMessageId(null),
      onError: () => setPlayingMessageId(null)
    });
  };

  // Free-Text Evaluator Submit
  const handleRunEvaluator = () => {
    if (!evaluatorUserText.trim()) return;
    setEvaluatorLoading(true);

    setTimeout(() => {
      const res = evaluateFreeTextComprehension(evaluatorTopic, evaluatorUserText);
      setEvaluatorResult(res);
      setEvaluatorLoading(false);
      refreshProfile();

      if (soundEnabled) {
        speakText(res.kakaReactionMandar + " " + res.feedback, {
          lang: 'indonesia',
          gender: 'female',
          voiceProfile: 'kaka'
        });
      }
    }, 500);
  };

  // Intelligent Context-Aware Response Engine
  const generateIntelligentTutorResponse = (query: string): Message => {
    const qLower = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const profile = getUserLearningProfile();

    // 1. Deteksi Permintaan Uji Lema Khusus (misal: "Uji pemahamanku tentang lema 'sandeq'")
    const matchUjiLema = query.match(/(?:uji|tes|evaluasi)\s+(?:pemahamanku\s+)?(?:tentang\s+)?(?:lema|kata)?\s*['"]?([a-zA-Z\s]+)['"]?/i);
    if (matchUjiLema && matchUjiLema[1]) {
      const candidate = matchUjiLema[1].trim();
      const found = ALL_ENTRIES.find(e => e.cleanLemma.toLowerCase() === candidate.toLowerCase() || e.lemma.toLowerCase() === candidate.toLowerCase());
      if (found) {
        triggerDiagnosticCheck(undefined, found.cleanLemma);
        return {
          id: `kaka-${Date.now()}`,
          sender: 'kaka',
          text: `Siap! Kaka telah menyiapkan pertanyaan uji pemahaman khusus untuk lema "${found.lemma}". Perhatikan pertanyaan di bawah ini! 🎯`,
          timestamp
        };
      }
    }

    // 2. Deteksi Penjelasan Bebas Pengguna ("coba nilai", "menurut saya", "penjelasan saya", "artinya adalah")
    if (
      qLower.includes('nilai penjelasan') || 
      qLower.includes('apakah pemahamanku') || 
      qLower.includes('menurut saya') || 
      qLower.includes('saya rasa') || 
      qLower.includes('penjelasan saya') ||
      (qLower.includes('artinya') && qLower.length > 30)
    ) {
      // Tentukan topik yang sedang dibahas
      let detectedTopic = 'sandeq';
      if (qLower.includes('tabe')) detectedTopic = 'tabe';
      else if (qLower.includes('saqbe') || qLower.includes('sarung')) detectedTopic = 'saqbe';
      else if (qLower.includes('kalindaqdaq') || qLower.includes('puisi')) detectedTopic = 'kalindaqdaq';
      else if (qLower.includes('sandeq') || qLower.includes('perahu')) detectedTopic = 'sandeq';

      const evalRes = evaluateFreeTextComprehension(detectedTopic, query);
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `📊 [HASIL EVALUASI PEMAHAMAN MANDIRI AI]\n\n${evalRes.kakaReactionMandar}\n\n🏆 Skor Akurasi Pemahaman: ${evalRes.score}% (${evalRes.level.toUpperCase()})\n\n💡 Catatan Analisis AI:\n${evalRes.feedback}\n\n${evalRes.keyPointsCovered.length > 0 ? `✅ Konsep yang Kamu Kuasai: ${evalRes.keyPointsCovered.join(', ')}\n` : ''}${evalRes.missingPoints.length > 0 ? `⚠️ Poin yang Perlu Diperdalam: ${evalRes.missingPoints.join(', ')}\n` : ''}\n📈 Kaka telah mencatat evaluasi ini ke riwayat belajarmu untuk memperbarui tingkat penguasaanmu!`,
        evalResult: evalRes,
        timestamp
      };
    }

    // 3. Diagnosis Pemahaman & Evaluasi Riwayat
    if (qLower.includes('evaluasi') || qLower.includes('pemahamanku') || qLower.includes('paham') || qLower.includes('riwayat')) {
      const weakest = profile.weakestConcepts.map(c => `• ${c.name} (${c.masteryPercentage}%)`).join('\n');
      const strongest = profile.strongestConcepts.map(c => `• ${c.name} (${c.masteryPercentage}%)`).join('\n');
      const recentLearned = getRecentLearnedWords(4).map(w => `${w.lemma} (${w.comprehensionScore}%)`).join(', ');

      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `📊 LAPORAN DIAGNOSTIK PEMAHAMAN BELAJARMU:\n\nSaat ini tingkat pemahamanmu berada di ${profile.overallMasteryPercentage}% dengan gelar: "${profile.levelTitle}".\nKamu sudah mempertahankan streak belajar ${profile.learningStreakDays} hari berturut-turut! 🔥\n\n📚 Kosakata Aktif yang Baru Kamu Pelajari:\n${recentLearned || 'Belum ada kosakata yang tercatat'}\n\n✅ Materi yang Sudah Sangat Kamu Pahami:\n${strongest}\n\n⚠️ Materi yang Perlu Kita Perkuat Lagi:\n${weakest}\n\n${profile.aiTutorAdvice}\n\nMau Kaka uji dengan 1 pertanyaan sekarang untuk menguji pemahamanmu?`,
        timestamp
      };
    }

    // 4. Permintaan Kuis Uji Pemahaman Umum
    if (qLower.includes('uji') || qLower.includes('tes') || qLower.includes('soal')) {
      triggerDiagnosticCheck();
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Siap! Kaka telah menyiapkan pertanyaan uji pemahaman berdasarkan titik materi yang paling perlu kamu perkuat. Perhatikan pertanyaan di bawah ini ya! 🎯`,
        timestamp
      };
    }

    // 5. Simulasi Percakapan / Roleplay
    if (qLower.includes('percakapan') || qLower.includes('simulasi') || qLower.includes('pasar') || qLower.includes('belanja')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Asyik! Ayo kita simulasi percakapan belanja sarung tenun sutra di pasar tradisional (Pasaq Tinambung)!\n\nKaka berperan sebagai penjual sarung (Papalimbang Lipaq Saqbe), dan kamu adalah pembelinya:\n\n🗣️ Kaka: "Tabe amboq / indoq, meloq melli sureq apa? Di iya diolo Sureq Salaka anna Sureq Padhadhang mamesa toddong."\n\nCoba kamu balas dengan menanyakan harga sarung tersebut dalam bahasa Mandar! (Petunjuk: gunakan kata 'Pira allinna...').`,
        lang: 'indonesia',
        timestamp
      };
    }

    // 6. Rekomendasi Belajar
    if (qLower.includes('rekomendasi') || qLower.includes('rencana') || qLower.includes('hari ini')) {
      const weak = profile.weakestConcepts[0];
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `🎯 REKOMENDASI BELAJAR MANDIRI HARI INI:\n\n1. 📖 Buka tab "${weak.name}" untuk membaca kembali kaidah dasar.\n2. 🎙️ Coba latih artikulasi di tab "Uji Pelafalan Suara" untuk mengasah ketepatan alofon.\n3. ✍️ Ambil 1 latihan di "Lembar Kerja Guru" atau buat bait Kalindaqdaq 8-7-8-7.\n4. 💡 Tanyakan leksikon yang belum kamu mengerti langsung pada Kaka kapan saja!\n\nKonsistensi kecil setiap hari akan membuatmu menjadi penutur Mandar yang fasih dan berwawasan luhur!`,
        timestamp
      };
    }

    // 7. Wawasan Khusus: Sejarah Kerajaan Mandar (Pitu Baqbana Binanga & Pitu Ulunna Salu)
    if (qLower.includes('kerajaan') || qLower.includes('pitu baqbana binanga') || qLower.includes('pitu ulunna salu') || qLower.includes('sejarah') || qLower.includes('maraqdia')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `🏛️ KHAZANAH SEJARAH & KERAJAAN MANDAR (SIPAMANDAR):\n\nSecara historis, persekutuan adat Mandar terbagi menjadi dua konfederasi agung yang bersaudara erat:\n\n1. ⛵ Pitu Baqbana Binanga (Tujuh Muara Sungai di Pesisir):\n• Balanipa (Bapak/Pemimpin Pertahanan)\n• Sendana (Ibu/Penasehat Luhur)\n• Banggae (Hakim Perdagangan)\n• Pamboang (Gerbang Laut)\n• Cenrana (Penjaga Batas)\n• Tappalang (Pertanian & Pasokan)\n• Mamuju (Ujung Utara Persekutuan)\n\n2. 🏔️ Pitu Ulunna Salu (Tujuh Hulu Sungai di Pegunungan):\nRante Bulahan, Aralle, Mambi, Bambang, Matangnga, Tabang, dan Tabulahan.\n\nKedua konfederasi diikat oleh sumpah suci "Allamungan Batu di Luyo": saling membela, saling membesarkan, dan tak terpisahkan selamanya! (Sumber rujukan: Naskah Kuno Lontar Pattodioloang Balanipa & Kajian Museum Mandar Majene).`,
        timestamp
      };
    }

    // 8. Wawasan Khusus: Tradisi Kuda Menari (Sayyang Pattuqduq)
    if (qLower.includes('kuda') || qLower.includes('sayyang') || qLower.includes('pattuqduq') || qLower.includes('khatam')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `🐎 TRADISI AGUNG SAYYANG PATTUQDUD (KUDA MENARI MANDAR):\n\nSayyang Pattuqduq adalah tradisi warisan leluhur Mandar untuk mensyukuri dan memuliakan anak yang telah menuntaskan bacaan 30 Juz Al-Qur'an (Marrattas Al-Qur'an).\n\n✨ Karakteristik Unik:\n• Kuda terlatih yang menari berirama (mattuqduq) dengan langkah teratur dan menggelengkan kepala mengikuti ketukan rebana parrawana.\n• Dihiasi pelana sulaman khas, payung ulu-ulu adat, dan kalung genta perak.\n• Sepanjang arak-arakan, para tetua melantunkan syair Kalindaqdaq berisi petuah budi pekerti dan doa keselamatan.\n\nTradisi ini telah diakui secara resmi sebagai Warisan Budaya Takbenda Indonesia (BPNB Kemendikbud). Mau Kaka buatkan bait Kalindaqdaq untuk mengarak Sayyang Pattuqduq?`,
        timestamp
      };
    }

    // 9. Wawasan Khusus: Maritim, Perahu Sandeq & Falsafah Passombal
    if (qLower.includes('sandeq') || qLower.includes('passombal') || qLower.includes('sombal') || qLower.includes('maritim') || qLower.includes('bintang')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `⛵ ANATOMI & FILOSOFI MABAHARI PERAHU SANDEQ:\n\nPerahu Sandeq adalah mahakarya maritim suku Mandar, diakui sebagai perahu layar tanpa mesin tercepat di kawasan Austronesia.\n\n🔍 Anatomi Leksikografis:\n• Sombal Tanjaq: Layar segitiga gunting miring penangkap angin laut.\n• Pallayarang: Tiang utama bambu petung / kayu ulin yang sangat lentur.\n• Baratan & Tada: Cadik ganda bambu penyeimbang hantaman ombak Selat Makassar.\n• Guling: Kemudi dayung samping di buritan.\n• Navigasi Bintang: Passombal berpatokan pada Bintang Pari (Salib Selatan) & Bintang Kala (Scorpio).\n\n🌊 Falsafah Luhur: "Mellamun bomboq, mappasombo litaq" (Menenggelamkan keangkuhan ombak, memuliakan daratan tercinta). Laut bukanlah pemisah, melainkan jalan persaudaraan dan kehormatan hidup!`,
        timestamp
      };
    }

    // 10. Wawasan Khusus: Tenun Sutra Mandar (Lipaq Saqbe)
    if (qLower.includes('tenun') || qLower.includes('saqbe') || qLower.includes('sureq') || qLower.includes('sarung')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `🧵 SUTRA TENUN LIDAQ SAQBE & MAKNA SIMBOLIK MOTIF (SUREQ):\n\nSarung sutra Mandar (Lipaq Saqbe) ditenun secara tradisional oleh para perempuan Mandar menggunakan alat gedongan (panetteq).\n\n🎨 4 Motif Utama & Makna Filosofisnya:\n1. Sureq Salaka: Garis putih perak yang melambangkan kemurnian hati dan keluhuran bangsawan Maraqdia.\n2. Sureq Padhadhang: Garis bilah pedang ksatria, simbol keberanian dan teguh memegang prinsip siriq.\n3. Sureq Balo Tappang: Kotak geometris besar marun tua, dikenakan para tetua adat (Tomakaka).\n4. Sureq Marasa: Warna cerah berseri dengan benang emas, melambangkan kebahagiaan pesta perkawinan.\n\nKamu bisa melihat visual corak dan mendengarkan lafalnya di tab "Ilustrasi Budaya"!`,
        timestamp
      };
    }

    // 11. Wawasan Khusus: Kuliner Khas (Jepa, Bau Peapi, Golla Kambu)
    if (qLower.includes('kuliner') || qLower.includes('jepa') || qLower.includes('bau peapi') || qLower.includes('golla kambu') || qLower.includes('makanan')) {
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `🍲 GASTRONOMI BAHARI TRADISIONAL MANDAR:\n\nKuliner Mandar memiliki cita rasa gurih, segar, dan tahan lama yang disesuaikan dengan kehidupan melaut:\n\n• Jepa Panettean: Makanan pokok berbahan singkong parut yang dipipihkan dan dipanggang di atas wajan tanah liat. Menjadi bekal utama pelaut karena awet berbulan-bulan di laut lepas!\n• Bau Peapi: Olahan ikan cakalang/tuna segar yang dimasak kuah kuning kental berbumbu kunyit, minyak kelapa Mandar, dan asam mangga muda (pao leqle).\n• Golla Kambu: Penganan manis khas Tinambung berbahan ketan, gula merah aren asli Balanipa, dan kelapa sangrai bertabur kacang tanah.\n\nKombinasi Jepa hangat dicelup kuah Bau Peapi adalah kenikmatan kuliner tiada tara masyarakat pesisir Mandar!`,
        timestamp
      };
    }

    // 12. Pencarian Kamus Spesifik
    const foundEntry = ALL_ENTRIES.find(e => qLower.includes(e.cleanLemma.toLowerCase()));
    if (foundEntry) {
      recordWordInteraction(foundEntry.cleanLemma, 'view', foundEntry.category, foundEntry.definition);
      return {
        id: `kaka-${Date.now()}`,
        sender: 'kaka',
        text: `Lema "${foundEntry.lemma}" (${foundEntry.posLabel}):\n\n🇮🇩 Arti: ${foundEntry.definition}\n🇬🇧 English: ${foundEntry.definitionEn || '-'}\n🗣️ Pelafalan Fonetik: ${foundEntry.phonetic}\n📜 Aksara Lontara: ${foundEntry.lontara}\n${foundEntry.exampleMandar ? `💬 Contoh Tuturan: "${foundEntry.exampleMandar}"\n` : ''}\nKaka telah mencatat kata ini ke riwayat belajarmu! Ingin Kaka uji pemahamanmu tentang kata ini? Ketik saja: "Uji kata ${foundEntry.lemma}"!`,
        matchedEntry: foundEntry,
        timestamp
      };
    }

    // Default Tutor Reply
    return {
      id: `kaka-${Date.now()}`,
      sender: 'kaka',
      text: `Pertanyaan yang sangat menarik! Terkait bahasa dan kebudayaan Mandar, Kaka selalu siap mendampingi belajarmu secara mandiri.\n\nKamu bisa meminta Kaka untuk:\n• Mendiagnosis apakah pemahamanmu sudah tuntas ("Cek pemahamanku")\n• Menguji kata tertentu ("Uji pemahamanku tentang lema sandeq")\n• Menilai penjelasan bebasmu ("Coba nilai penjelasan saya: ...")\n• Latihan simulasi percakapan nyata Mandar\n• Membedah makna peribahasa Pappasang dan anatomi perahu Sandeq.\n\nApa yang ingin kamu eksplorasi selanjutnya?`,
      timestamp
    };
  };

  const filteredMasteryWords = useMemo(() => {
    const list = Object.values(wordMasteries);
    if (masteryFilter === 'all') return list;
    return list.filter(w => w.status === masteryFilter);
  }, [wordMasteries, masteryFilter]);

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
            AI cerdas yang mengenali apakah Anda sudah paham materi dengan menganalisis rekam jejak belajar, mengevaluasi penjelasan bebas Anda, dan menguji pemahaman kosakata secara adaptif.
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

            <div className="flex items-center space-x-2 bg-rose-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-rose-400/30 text-rose-100">
              <Volume2 className="w-4 h-4 text-rose-300" />
              <span>Suara AI: <strong>Kaka Mandar (Perempuan Asli)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs Mode */}
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
          onClick={() => setActiveSubTab('evaluator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'evaluator'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-mandar-gold-500" />
          <span>Evaluator Pemahaman Bebas (AI)</span>
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
          <span>Dasbor Riwayat & Penguasaan Kata</span>
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
          <span>Kurikulum & Sertifikat Belajar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('references')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'references'
              ? 'bg-mandar-maroon-700 text-white shadow-md'
              : 'text-stone-700 dark:text-slate-300 hover:bg-mandar-sand-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-mandar-gold-500" />
          <span>Pustaka Referensi Ilmiah</span>
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
                    Mengenali tingkat pemahaman Anda melalui riwayat pembelajaran
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

                        {/* User Language Detection & Literal Analysis Tag */}
                        {!isKaka && msg.languageAnalysis && (
                          <div className="mt-2 pt-2 border-t border-white/20 text-[11px] space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className="px-2 py-0.5 rounded-md font-bold bg-white/20 text-white text-[10px]">
                                🔍 {msg.languageAnalysis.detectedSummary}
                              </span>
                            </div>
                            {msg.languageAnalysis.primaryLang !== 'indonesia' && msg.languageAnalysis.literalSentenceTranslation && (
                              <p className="text-[10px] text-mandar-sand-200 italic">
                                Arti Harfiah: {msg.languageAnalysis.literalSentenceTranslation}
                              </p>
                            )}
                          </div>
                        )}

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
                  <span>Kaka sedang menganalisis & menilai pemahaman Anda...</span>
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
                placeholder={isListening ? "🎙️ Sedang mendengarkan suara Anda..." : "Tanyakan lema, minta kuis adaptif, atau bicara lewat mic..."}
                className="flex-1 px-4 py-2.5 rounded-xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none focus:border-mandar-maroon-700"
              />

              {recognitionSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                      : 'bg-mandar-sand-100 dark:bg-slate-800 text-mandar-maroon-800 dark:text-mandar-gold-300 hover:bg-mandar-sand-200 dark:hover:bg-slate-700 border border-mandar-sand-200 dark:border-slate-700'
                  }`}
                  title={isListening ? 'Hentikan Mendengarkan' : 'Bicara Langsung (Voice In 2-Arah)'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 disabled:opacity-40 text-white transition-colors shrink-0"
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
                <div className="flex justify-between text-[11px] text-stone-500 dark:text-slate-400">
                  <span>Tingkat: <strong className="text-stone-800 dark:text-white">{learningProfile.levelTitle}</strong></span>
                  <span>{learningProfile.learnedWordsCount} Kata Terpantau</span>
                </div>
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
                <span>Catatan Diagnosis Kaka:</span>
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
      {/* MODE 3: EVALUATOR PEMAHAMAN BEBAS (AI FREE-TEXT)         */}
      {/* ======================================================== */}
      {activeSubTab === 'evaluator' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-mandar-gold-100 text-mandar-gold-900 dark:bg-mandar-gold-950 dark:text-mandar-gold-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-mandar-gold-500" />
              <span>Inovasi Utama: AI Cognitive Comprehension Recognizer</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              Evaluator Pemahaman Bebas Berbasis Bahasa Alami
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Jelaskan konsep atau kosakata Mandar dengan kalimat Anda sendiri. AI Kaka akan membaca penjelasan Anda, menilai apakah Anda sudah benar-benar paham, dan memberikan bimbingan pedagogis secara instan.
            </p>
          </div>

          {/* Input Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block">
                Pilih Konsep / Lema yang Ingin Anda Jelaskan:
              </label>
              <select
                value={evaluatorTopic}
                onChange={(e) => setEvaluatorTopic(e.target.value)}
                className="w-full p-3 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-300 dark:border-slate-700 text-xs font-semibold text-stone-900 dark:text-white outline-none focus:border-mandar-maroon-700"
              >
                <option value="sandeq">Perahu Sandeq (Maritim & Navigasi)</option>
                <option value="tabe">Sapaan Tabe & Kaidah Alofon [tawe]</option>
                <option value="saqbe">Lipaq Saqbe (Sutra Tenun & Ragam Motif)</option>
                <option value="kalindaqdaq">Sastra Kalindaqdaq (Metrum 8-7-8-7)</option>
                <option value="jepa">Kuliner Jepa & Panau</option>
              </select>

              <div className="p-4 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-xs text-stone-600 dark:text-slate-300 space-y-1.5">
                <span className="font-bold text-mandar-maroon-800 dark:text-mandar-gold-400 block">
                  💡 Tips Menjelaskan:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Sebutkan arti, fungsi, komponen utama, atau aturan penggunaannya. Semakin lengkap rincian yang Anda ketik, semakin akurat penilaian pemahaman AI.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold text-stone-700 dark:text-slate-300 block">
                Ketikkan Pemahaman Anda Sendiri di Sini:
              </label>
              <textarea
                rows={5}
                value={evaluatorUserText}
                onChange={(e) => setEvaluatorUserText(e.target.value)}
                placeholder="Contoh: Menurut pemahaman saya, perahu Sandeq adalah perahu layar tradisional Mandar yang tercepat di Austronesia, memiliki cadik ganda (baratan dan tada), dan menggunakan layar segitiga sombal tanjaq..."
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-mandar-sand-300 dark:border-slate-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none focus:border-mandar-maroon-700 resize-none shadow-inner"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {evaluatorUserText.split(/\s+/).filter(Boolean).length} kata terketik
                </span>
                <button
                  onClick={handleRunEvaluator}
                  disabled={evaluatorLoading || !evaluatorUserText.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-mandar-maroon-700 to-mandar-maroon-800 hover:from-mandar-maroon-800 hover:to-mandar-maroon-900 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-40"
                >
                  <Zap className="w-4 h-4 text-mandar-gold-400" />
                  <span>{evaluatorLoading ? 'AI Sedang Menganalisis Pemahaman...' : 'Evaluasi Pemahamanku'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Evaluation Result Display */}
          {evaluatorResult && (
            <div className={`p-6 rounded-3xl border-2 space-y-4 animate-in fade-in ${
              evaluatorResult.isUnderstood 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-400' 
                : 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-400'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                    evaluatorResult.isUnderstood ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                      Skor Pemahaman AI: {evaluatorResult.score}% ({evaluatorResult.level.toUpperCase()})
                    </h4>
                    <span className="text-xs font-semibold text-mandar-maroon-800 dark:text-mandar-gold-400">
                      {evaluatorResult.kakaReactionMandar}
                    </span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  evaluatorResult.isUnderstood ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  {evaluatorResult.isUnderstood ? '✓ PEMAHAMAN TERVERIFIKASI' : '⚠️ PERLU PENGUATAN'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-800 dark:text-slate-200 leading-relaxed font-medium">
                {evaluatorResult.feedback}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    ✓ Poin Pemahaman yang Berhasil Anda Kuasai:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-slate-300 text-[11px]">
                    {evaluatorResult.keyPointsCovered.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                    ⚠️ Poin yang Belum Tercover / Perlu Pengulangan:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-slate-300 text-[11px]">
                    {evaluatorResult.missingPoints.length > 0 ? (
                      evaluatorResult.missingPoints.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))
                    ) : (
                      <li>Seluruh aspek penting berhasil Anda jelaskan secara sempurna!</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: DASBOR DIAGNOSIS RIWAYAT & PENGUASAAN KATA       */}
      {/* ======================================================== */}
      {activeSubTab === 'mastery' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                  Dasbor Diagnostik Riwayat & Penguasaan Kosakata
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  AI memantau dan menyimpan rekam jejak setiap lema yang Anda buka, dengarkan, dan uji secara mandiri
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 bg-mandar-sand-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setMasteryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    masteryFilter === 'all' ? 'bg-white dark:bg-slate-900 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'
                  }`}
                >
                  Semua ({Object.keys(wordMasteries).length})
                </button>
                <button
                  onClick={() => setMasteryFilter('mahir')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    masteryFilter === 'mahir' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-500'
                  }`}
                >
                  Mahir
                </button>
                <button
                  onClick={() => setMasteryFilter('sedang_belajar')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    masteryFilter === 'sedang_belajar' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-500'
                  }`}
                >
                  Belajar
                </button>
                <button
                  onClick={() => setMasteryFilter('belum_paham')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    masteryFilter === 'belum_paham' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-500'
                  }`}
                >
                  Perlu Ulang
                </button>
              </div>
            </div>

            {/* Individual Word Mastery Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMasteryWords.map((word) => (
                <div
                  key={word.cleanLemma}
                  className="p-4 rounded-2xl bg-mandar-sand-50/60 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 space-y-2 hover:border-mandar-maroon-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                      {word.lemma}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      word.status === 'mahir' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      word.status === 'paham' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                      word.status === 'sedang_belajar' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {word.comprehensionScore}% ({word.status.toUpperCase()})
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-2">
                    {word.definition || 'Kosakata Mandar aktif dalam kamus'}
                  </p>

                  <div className="w-full h-1.5 bg-mandar-sand-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        word.comprehensionScore >= 80 ? 'bg-emerald-500' : word.comprehensionScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${word.comprehensionScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400">
                    <span>Dilihat {word.viewCount}x • Didengar {word.listenCount}x</span>
                    <button
                      onClick={() => triggerDiagnosticCheck(undefined, word.cleanLemma)}
                      className="text-mandar-maroon-700 dark:text-mandar-gold-400 font-bold hover:underline"
                    >
                      Uji Lema Ini →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Log List */}
            <div className="space-y-3 pt-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Log Aktivitas Pembelajaran Terakhir Anda:
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
      {/* MODE 5: RENCANA BELAJAR MANDIRI & SERTIFIKAT             */}
      {/* ======================================================== */}
      {activeSubTab === 'study_plan' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mandar-sand-200 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                  Kurikulum Mandiri & Sertifikat Pemahaman
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Disusun khusus untuk Anda berdasarkan materi yang teridentifikasi belum tuntas pada riwayat belajar
                </p>
              </div>

              <button
                onClick={() => setIsCertificateView(!isCertificateView)}
                className="px-4 py-2 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-colors self-start"
              >
                <Award className="w-4 h-4 text-mandar-gold-400" />
                <span>{isCertificateView ? 'Tutup Sertifikat' : 'Lihat Sertifikat Pemahaman Mandiri'}</span>
              </button>
            </div>

            {/* Certificate View */}
            {isCertificateView && (
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-100/60 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-4 border-mandar-gold-500 shadow-2xl relative overflow-hidden space-y-6 text-center">
                <div className="absolute top-4 left-4 font-lontara text-6xl text-mandar-gold-400/20 pointer-events-none">
                  ᨀᨉᨗᨆ
                </div>
                <div className="absolute bottom-4 right-4 font-lontara text-6xl text-mandar-gold-400/20 pointer-events-none">
                  ᨆᨊᨉ
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-maroon-800 text-mandar-gold-300 text-xs font-bold uppercase tracking-widest">
                    <span>Kementerian Kebudayaan RI • BudayaGo 2025</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-mandar-maroon-900 dark:text-mandar-gold-400 tracking-tight font-serif">
                    SERTIFIKAT PEMAHAMAN MANDIRI BAHASA MANDAR
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-slate-300 font-sans">
                    Diberikan atas dedikasi dan penguasaan leksikografi, fonologi, dan sastra maritim Mandar
                  </p>
                </div>

                <div className="py-4 border-y border-mandar-gold-300 dark:border-mandar-gold-800/60 max-w-lg mx-auto space-y-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="text-center font-bold text-xl sm:text-2xl text-stone-900 dark:text-white bg-transparent border-b border-dashed border-mandar-maroon-400 outline-none w-full pb-1"
                    title="Klik untuk mengubah nama di sertifikat"
                  />
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    Gelar Capaian Budaya: <strong className="text-mandar-maroon-800 dark:text-mandar-gold-400">{learningProfile.levelTitle}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800 border border-mandar-gold-200">
                    <span className="text-[10px] text-stone-400 block">Indeks Pemahaman</span>
                    <strong className="text-lg text-emerald-600">{learningProfile.overallMasteryPercentage}%</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800 border border-mandar-gold-200">
                    <span className="text-[10px] text-stone-400 block">Kosakata Dikuasai</span>
                    <strong className="text-lg text-mandar-maroon-700 dark:text-mandar-gold-400">{learningProfile.learnedWordsCount} Kata</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800 border border-mandar-gold-200">
                    <span className="text-[10px] text-stone-400 block">Streak Belajar</span>
                    <strong className="text-lg text-amber-600">{learningProfile.learningStreakDays} Hari</strong>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-center space-x-3 text-xs">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold flex items-center space-x-1.5 shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / Simpan PDF</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3 Steps Curriculum */}
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
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 6: PUSTAKA REFERENSI & SUMBER ILMIAH KAKA-AI        */}
      {/* ======================================================== */}
      {activeSubTab === 'references' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mandar-sand-200 dark:border-slate-800 shadow-xl space-y-6">
            
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pustaka Rujukan Leksikografi & Kebudayaan Mandar</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                Basis Data Rujukan & Literatur Ilmiah Kaka-AI
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 mt-1 leading-relaxed">
                Seluruh wawasan, kaidah alofon, analisis morfologis, dan interpretasi kebudayaan yang dimiliki Kaka-AI disusun berlandaskan publikasi ilmiah resmi Balai Bahasa Kemendikdasmen, akademisi linguistik terkemuka, dan manuskrip kuno Lontar Pattodioloang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Kamus Bahasa Mandar - Indonesia (Edisi Mutakhir 2025)",
                  institution: "Balai Bahasa Provinsi Sulawesi Selatan, Kemendikdasmen RI",
                  author: "Tim Leksikografi Balai Bahasa Sulsel",
                  year: "2025",
                  desc: "Rujukan leksikografis baku terkini yang memuat lebih dari 7.000 lema bahasa Mandar, kaidah ortografi huruf Latin Mandar, sentakan glotal /q/ [ʔ], dan pemenggalan konsonan geminat.",
                  actionLabel: "Eksplorasi di Kamus",
                  tabTarget: "dictionary"
                },
                {
                  title: "Struktur Bahasa Mandar & Morfosintaksis",
                  institution: "Pusat Pembinaan dan Pengembangan Bahasa, Depdikbud",
                  author: "Abdul Muthalib, Johannes F. Pattiasina, dkk.",
                  year: "1974 / 1985",
                  desc: "Penelitian ilmiah komprehensif mengenai tata bahasa, sistem pronomina persona Seri I, Seri II, Seri III (klitika), reduplikasi, dan afiksasi bahasa Mandar.",
                  actionLabel: "Uji Morfologi Mandar",
                  tabTarget: "morphology"
                },
                {
                  title: "Tata Bunyi & Fonotaktik Alofonik Bahasa Mandar",
                  institution: "Lembaga Penelitian Universitas Negeri Makassar",
                  author: "Prof. Dr. H. Suradi Yasil",
                  year: "2007",
                  desc: "Kajian mendalam mengenai alofon intervokalik /b/ -> [w], /d/ -> [dz], /g/ -> [gh], /j/ -> [y], serta realisasi akustik geminasi kembar dalam dialek Balanipa dan Sendana.",
                  actionLabel: "Laboratorium Fonologi",
                  tabTarget: "fonologi"
                },
                {
                  title: "Sastra Lisan Kalindaqdaq & Pappasang Leluhur",
                  institution: "Dewan Kesenian Mandar & Dinas Kebudayaan Sulbar",
                  author: "Drs. Idham Khalid Bodi & Prof. Suradi Yasil",
                  year: "2016",
                  desc: "Dokumentasi ratusan bait pantun klasik Kalindaqdaq 8-7-8-7 suku kata, peribahasa Pappasang to-Matoang, dan falsafah hidup kemaritiman Passombal.",
                  actionLabel: "Studio Kalindaqdaq",
                  tabTarget: "kalindaqdaq"
                },
                {
                  title: "Perahu Sandeq & Etnonavigasi Bahari Mandar",
                  institution: "Lembaga Kajian Budaya Bahari & Yayasan Sandeq",
                  author: "Horst H. Liebner & Muhammad Ridwan Alimuddin",
                  year: "2010",
                  desc: "Studi terlengkap tentang rancang bangun, hidrodinamika layar gunting sombal tanjaq, cadik baratan, serta kompas navigasi bintang tradisional (Bintang Pari & Kala).",
                  actionLabel: "Navigasi Bintang Mandar",
                  tabTarget: "celestial"
                },
                {
                  title: "Lontar Pattodioloang Balanipa & Pitu Baqbana Binanga",
                  institution: "Museum Mandar Majene & Yayasan Kebudayaan Mandar",
                  author: "Naskah Kuno Transliterasi Daeng Rioso",
                  year: "Abad ke-16 (Transkripsi 1992)",
                  desc: "Naskah lontar silsilah para Maraqdia (Raja) Balanipa, pembentukan persekutuan Pitu Baqbana Binanga (Tujuh Muara Pesisir) dan Pitu Ulunna Salu (Tujuh Hulu Sungai).",
                  actionLabel: "Ensiklopedia Budaya",
                  tabTarget: "encyclopedia"
                }
              ].map((ref, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-mandar-sand-50/70 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-slate-400">
                      <span className="font-bold text-mandar-maroon-700 dark:text-mandar-gold-400">
                        {ref.institution}
                      </span>
                      <span>Tahun: {ref.year}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                      {ref.title}
                    </h4>
                    <p className="text-xs font-semibold text-stone-700 dark:text-slate-300">
                      Penulis: {ref.author}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                      {ref.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onGoToTab(ref.tabTarget)}
                    className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 border border-mandar-sand-300 dark:border-slate-700 hover:border-mandar-maroon-600 text-mandar-maroon-800 dark:text-mandar-gold-300 text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <span>{ref.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
