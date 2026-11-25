/**
 * KADIMA-ID Adaptive Learning & Mastery Tracker Engine
 * Melacak rekam jejak belajar mandiri pengguna secara komprehensif:
 * - Riwayat pencarian lema & eksplorasi kosakata
 * - Hasil uji kuis gamifikasi & akurasi jawaban
 * - Skor evaluasi rekaman pelafalan fonetik mikrofon
 * - Latihan metrum sastra Kalindaqdaq & aksara Lontara
 * - Penilaian tingkat pemahaman adaptif (Mastery Assessment)
 */

export interface LearningActivity {
  id: string;
  type: 'search' | 'quiz' | 'pronunciation' | 'kalindaqdaq' | 'phrase' | 'modal_view';
  title: string;
  detail: string;
  timestamp: string;
  score?: number; // 0 - 100 jika ada
  masteryImpact: 'high' | 'medium' | 'low';
  category: 'kosakata' | 'fonologi' | 'lontara' | 'budaya' | 'morfologi';
}

export interface ConceptMastery {
  id: string;
  category: 'kosakata' | 'fonologi' | 'lontara' | 'budaya' | 'morfologi';
  name: string;
  description: string;
  masteryPercentage: number; // 0 - 100
  status: 'belum_paham' | 'sedang_belajar' | 'paham' | 'mahir';
  testedCount: number;
  lastTestedDate?: string;
  weakPoints?: string[];
  strongPoints?: string[];
}

export interface UserLearningProfile {
  totalActivitiesCount: number;
  overallMasteryPercentage: number;
  levelTitle: string;
  levelRank: number; // 1 - 4
  levelDescription: string;
  learningStreakDays: number;
  wordsExploredCount: number;
  concepts: ConceptMastery[];
  recentActivities: LearningActivity[];
  weakestConcepts: ConceptMastery[];
  strongestConcepts: ConceptMastery[];
  aiTutorAdvice: string;
}

const DEFAULT_CONCEPTS: ConceptMastery[] = [
  {
    id: 'c-kosakata',
    category: 'kosakata',
    name: 'Kosakata Dasar & Percakapan Tematis',
    description: 'Penguasaan lema dasar (sapaan, keluarga, makanan, perdagangan, maritim)',
    masteryPercentage: 80,
    status: 'paham',
    testedCount: 14,
    weakPoints: ['Istilah navigasi perahu sandeq pedalaman'],
    strongPoints: ['Sapaan kesantunan tabe', 'Panggilan kekerabatan']
  },
  {
    id: 'c-fonologi',
    category: 'fonologi',
    name: 'Fonologi & Kaidah Alofon Intervokalik',
    description: 'Aturan perubahan fonem /b/→[w], /d/→[dz], /g/→[gh] dan letup glotal /q/',
    masteryPercentage: 55,
    status: 'sedang_belajar',
    testedCount: 8,
    weakPoints: ['Letup glotal koda /q/ pada kata sandeq/siriq', 'Konsonan geminat kembar'],
    strongPoints: ['Alofon /b/ intervokalik pada tabe [tawe]']
  },
  {
    id: 'c-lontara',
    category: 'lontara',
    name: 'Ortografi Aksara Lontara Mandar',
    description: 'Membaca dan menulis aksara Lontara (Ina Surat & Diakritik Anaq Surat)',
    masteryPercentage: 70,
    status: 'paham',
    testedCount: 10,
    weakPoints: ['Tanda vokal pepet e taling vs e kecce'],
    strongPoints: ['Huruf dasar Ka, Ga, Nga, Pa, Ba, Ma']
  },
  {
    id: 'c-morfologi',
    category: 'morfologi',
    name: 'Morfologi, Afiksasi & Pronomina',
    description: 'Prefiks ma-, mang-, pa-, klitik -mi, -aq, serta pronomina 3 seri Mandar',
    masteryPercentage: 45,
    status: 'sedang_belajar',
    testedCount: 5,
    weakPoints: ['Pronomina Seri II (Pelaku/Genitif) vs Seri III (Enklitik Objek)'],
    strongPoints: ['Prefiks verbal aktif ma- dan pasif di-']
  },
  {
    id: 'c-budaya',
    category: 'budaya',
    name: 'Sastra Kalindaqdaq & Falsafah Bahari',
    description: 'Metrum suku kata 8-7-8-7, peribahasa Pappasang, nilai Siriq na Pacce',
    masteryPercentage: 65,
    status: 'paham',
    testedCount: 7,
    weakPoints: ['Perhitungan ketat metrum 8-7-8-7 pada baris kedua dan keempat'],
    strongPoints: ['Filosofi Mellamun Bomboq Mappasombo Litaq']
  }
];

const STORAGE_KEYS = {
  ACTIVITIES: 'kadima_learning_activities',
  CONCEPTS: 'kadima_concepts_mastery',
  STREAK: 'kadima_streak',
  EXPLORED: 'kadima_explored_count'
};

/**
 * Mengambil profil belajar lengkap pengguna
 */
export function getUserLearningProfile(): UserLearningProfile {
  if (typeof window === 'undefined') {
    return getFallbackProfile();
  }

  try {
    const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const activities: LearningActivity[] = savedActivities 
      ? JSON.parse(savedActivities) 
      : getInitialActivities();

    const savedConcepts = localStorage.getItem(STORAGE_KEYS.CONCEPTS);
    const concepts: ConceptMastery[] = savedConcepts 
      ? JSON.parse(savedConcepts) 
      : DEFAULT_CONCEPTS;

    const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
    const streak = savedStreak ? parseInt(savedStreak, 10) : 3;

    const savedExplored = localStorage.getItem(STORAGE_KEYS.EXPLORED);
    const wordsExplored = savedExplored ? parseInt(savedExplored, 10) : activities.filter(a => a.type === 'search' || a.type === 'modal_view').length + 15;

    // Hitung rata-rata mastery
    const totalPercentage = concepts.reduce((acc, c) => acc + c.masteryPercentage, 0);
    const overallMastery = Math.round(totalPercentage / concepts.length);

    // Tentukan gelar / level pengguna
    let levelTitle = 'Passombal Mula (Pelaut Pemula)';
    let levelRank = 1;
    let levelDescription = 'Anda baru memulai perjalanan menyelami keindahan leksikografi dan sastra bahasa Mandar.';

    if (overallMastery >= 85) {
      levelTitle = '👑 Maraqdia Basa Mandar (Mahaguru Bahasa)';
      levelRank = 4;
      levelDescription = 'Luar biasa! Pemahaman Anda sangat mendalam di bidang kosakata, fonologi, Lontara, dan falsafah maritim Mandar.';
    } else if (overallMastery >= 70) {
      levelTitle = '⛵ Punggawa Lontara (Penutur Mahir)';
      levelRank = 3;
      levelDescription = 'Hebat! Anda menguasai struktur tata bahasa, percakapan situasional, dan kaidah alofon dengan sangat baik.';
    } else if (overallMastery >= 50) {
      levelTitle = '🌊 Ana Lopi (Pelajar Menengah)';
      levelRank = 2;
      levelDescription = 'Kemajuan signifikan! Terus perdalam kaidah alofon dan metrum sastra lisan Kalindaqdaq.';
    }

    // Urutkan materi terlemah dan terkuat
    const sortedConcepts = [...concepts].sort((a, b) => a.masteryPercentage - b.masteryPercentage);
    const weakestConcepts = sortedConcepts.slice(0, 2);
    const strongestConcepts = [...sortedConcepts].reverse().slice(0, 2);

    // Generate saran AI Tutor kontekstual
    let aiTutorAdvice = '';
    if (weakestConcepts[0].id === 'c-morfologi') {
      aiTutorAdvice = `Kaka melihat pemahaman morfosintaksis dan pronomina persona 3 seri Anda masih berada di angka ${weakestConcepts[0].masteryPercentage}%. Mari kita fokuskan latihan pada dekomposisi afiks dan perbedaan klitik -mi dan -aq.`;
    } else if (weakestConcepts[0].id === 'c-fonologi') {
      aiTutorAdvice = `Perhatian utama saat ini ada pada fonetik dan alofon intervokalik (${weakestConcepts[0].masteryPercentage}%). Seringkali letup glotal /q/ pada kata 'sandeq' dan 'siriq' masih perlu dipertajam artikulasinya.`;
    } else {
      aiTutorAdvice = `Performa belajar Anda sangat konsisten dengan streak ${streak} hari. Tingkatkan pemahaman pada ${weakestConcepts[0].name} untuk mencapai level berikutnya!`;
    }

    return {
      totalActivitiesCount: activities.length,
      overallMasteryPercentage: overallMastery,
      levelTitle,
      levelRank,
      levelDescription,
      learningStreakDays: streak,
      wordsExploredCount: wordsExplored,
      concepts,
      recentActivities: activities.slice(0, 10),
      weakestConcepts,
      strongestConcepts,
      aiTutorAdvice
    };
  } catch (err) {
    console.warn('Error reading learning profile:', err);
    return getFallbackProfile();
  }
}

/**
 * Catat aktivitas pembelajaran baru dan otomatis perbarui tingkat pemahaman
 */
export function recordLearningActivity(activity: Omit<LearningActivity, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return;

  try {
    const newAct: LearningActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const list: LearningActivity[] = saved ? JSON.parse(saved) : getInitialActivities();
    const updatedActivities = [newAct, ...list].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updatedActivities));

    // Perbarui profil konsep mastery jika ada skor atau kategori
    const savedConcepts = localStorage.getItem(STORAGE_KEYS.CONCEPTS);
    const concepts: ConceptMastery[] = savedConcepts ? JSON.parse(savedConcepts) : DEFAULT_CONCEPTS;

    const targetConcept = concepts.find(c => c.category === activity.category);
    if (targetConcept) {
      targetConcept.testedCount += 1;
      targetConcept.lastTestedDate = 'Hari ini';

      if (activity.score !== undefined) {
        // Bobot bergerak eksponensial (EMA) untuk penilaian adaptif
        const weight = 0.35;
        targetConcept.masteryPercentage = Math.round(
          targetConcept.masteryPercentage * (1 - weight) + activity.score * weight
        );
      } else {
        // Eksplorasi biasa menambah 2% mastery
        targetConcept.masteryPercentage = Math.min(100, targetConcept.masteryPercentage + 2);
      }

      // Update status teks
      if (targetConcept.masteryPercentage >= 85) targetConcept.status = 'mahir';
      else if (targetConcept.masteryPercentage >= 65) targetConcept.status = 'paham';
      else if (targetConcept.masteryPercentage >= 40) targetConcept.status = 'sedang_belajar';
      else targetConcept.status = 'belum_paham';

      localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(concepts));
    }
  } catch (err) {
    console.warn('Error recording learning activity:', err);
  }
}

/**
 * Update hasil evaluasi tes Socratic AI langsung
 */
export function updateMasteryFromQuiz(conceptId: string, isCorrect: boolean, feedbackTopic: string) {
  if (typeof window === 'undefined') return;

  try {
    const savedConcepts = localStorage.getItem(STORAGE_KEYS.CONCEPTS);
    const concepts: ConceptMastery[] = savedConcepts ? JSON.parse(savedConcepts) : DEFAULT_CONCEPTS;

    const target = concepts.find(c => c.id === conceptId);
    if (target) {
      target.testedCount += 1;
      target.lastTestedDate = 'Baru saja';

      if (isCorrect) {
        target.masteryPercentage = Math.min(100, target.masteryPercentage + 8);
        if (!target.strongPoints) target.strongPoints = [];
        if (!target.strongPoints.includes(feedbackTopic)) {
          target.strongPoints = [feedbackTopic, ...target.strongPoints].slice(0, 3);
        }
      } else {
        target.masteryPercentage = Math.max(15, target.masteryPercentage - 6);
        if (!target.weakPoints) target.weakPoints = [];
        if (!target.weakPoints.includes(feedbackTopic)) {
          target.weakPoints = [feedbackTopic, ...target.weakPoints].slice(0, 3);
        }
      }

      if (target.masteryPercentage >= 85) target.status = 'mahir';
      else if (target.masteryPercentage >= 65) target.status = 'paham';
      else if (target.masteryPercentage >= 40) target.status = 'sedang_belajar';
      else targetConceptStatus(target);

      localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(concepts));
    }

    // Catat log
    recordLearningActivity({
      type: 'quiz',
      title: isCorrect ? 'Uji Socratic AI: Jawaban Benar' : 'Uji Socratic AI: Perlu Remedial',
      detail: feedbackTopic,
      score: isCorrect ? 100 : 30,
      masteryImpact: 'high',
      category: target?.category || 'kosakata'
    });
  } catch (err) {
    console.warn('Error updating mastery from quiz:', err);
  }
}

function targetConceptStatus(target: ConceptMastery) {
  target.status = 'belum_paham';
}

/**
 * Initial sample activities jika user baru pertama kali masuk
 */
function getInitialActivities(): LearningActivity[] {
  return [
    {
      id: 'init-1',
      type: 'search',
      title: 'Pencarian Lema: sandeq',
      detail: 'Meneliti lema perahu bercadik ganda Mandar',
      timestamp: '10 menit lalu',
      masteryImpact: 'medium',
      category: 'budaya'
    },
    {
      id: 'init-2',
      type: 'pronunciation',
      title: 'Latihan Pelafalan Suara: tabe',
      detail: 'Skor ketepatan artikulasi alofon [tawe]: 92%',
      score: 92,
      timestamp: '25 menit lalu',
      masteryImpact: 'high',
      category: 'fonologi'
    },
    {
      id: 'init-3',
      type: 'kalindaqdaq',
      title: 'Analisis Metrum Puisi 8-7-8-7',
      detail: 'Menganalisis bait puisi Paqelo-elo kasih sayang',
      score: 85,
      timestamp: '1 jam lalu',
      masteryImpact: 'high',
      category: 'budaya'
    },
    {
      id: 'init-4',
      type: 'phrase',
      title: 'Belajar Frasa Tematis: Sapaan Santun',
      detail: 'Mendengarkan pelafalan "Tabe amboq, tabe indoq"',
      timestamp: '2 jam lalu',
      masteryImpact: 'medium',
      category: 'kosakata'
    }
  ];
}

function getFallbackProfile(): UserLearningProfile {
  return {
    totalActivitiesCount: 4,
    overallMasteryPercentage: 63,
    levelTitle: '🌊 Ana Lopi (Pelajar Menengah Mandar)',
    levelRank: 2,
    levelDescription: 'Anda sudah menguasai kosakata dasar dan sebagian aturan fonetik alofon.',
    learningStreakDays: 3,
    wordsExploredCount: 18,
    concepts: DEFAULT_CONCEPTS,
    recentActivities: getInitialActivities(),
    weakestConcepts: [DEFAULT_CONCEPTS[3], DEFAULT_CONCEPTS[1]],
    strongestConcepts: [DEFAULT_CONCEPTS[0], DEFAULT_CONCEPTS[2]],
    aiTutorAdvice: 'Kaka melihat Anda sudah memahami sapaan dasar Mandar, namun kaidah morfologi pronomina 3 seri dan alofon intervokalik masih memerlukan penguatan latihan.'
  };
}
