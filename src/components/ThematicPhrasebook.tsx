"use client";

import React, { useState } from 'react';
import { 
  BookMarked, 
  Volume2, 
  Copy, 
  Check, 
  Search, 
  Compass, 
  Utensils, 
  ShoppingBag, 
  Heart, 
  Navigation, 
  ShieldAlert, 
  Sparkles,
  Users
} from 'lucide-react';
import { speakText } from '@/lib/audio';

export interface PhraseItem {
  id: string;
  mandar: string;
  lontara: string;
  phonetic: string;
  indonesia: string;
  english: string;
  culturalNote?: string;
}

export interface PhraseCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  phrases: PhraseItem[];
}

export const PHRASEBOOK_DATA: PhraseCategory[] = [
  {
    id: 'sapaan',
    title: 'Sapaan & Kesopanan',
    iconName: 'Sparkles',
    description: 'Etiket dasar kesantunan suku Mandar dalam menyapa sesama dan tetua.',
    phrases: [
      {
        id: 'sp-1',
        mandar: 'Tabe amboq, tabe indoq.',
        lontara: 'ᨈᨅᨙ ᨕᨅᨚ ᨈᨅᨙ ᨕᨗᨉᨚ',
        phonetic: '[tawe ambok, tawe indok]',
        indonesia: 'Permisi bapak, permisi ibu (ungkapan kesantunan luhur).',
        english: 'Excuse me sir / father, excuse me ma’am / mother.',
        culturalNote: 'Ucapkan sambil sedikit membungkukkan badan dan mengulurkan tangan kanan ke bawah (mappatabe).'
      },
      {
        id: 'sp-2',
        mandar: 'Apa kareba? Kareba marasa.',
        lontara: 'ᨕᨄ ᨀᨑᨙᨅ ᨀᨑᨙᨅ ᨆᨑᨔ',
        phonetic: '[apa karewa? karewa marasa]',
        indonesia: 'Apa kabar? Kabar baik sejahtera.',
        english: 'How are you? Very good / peaceful.',
        culturalNote: 'Sapaan hangat ramah tamah yang lazim digunakan saat bersua di jalan atau bertamu.'
      },
      {
        id: 'sp-3',
        mandar: 'Kurru sumangaq, tarima kasi toddong.',
        lontara: 'ᨀᨘᨑᨘ ᨔᨘᨆᨂ ᨈᨑᨗᨆ ᨀᨔᨗ ᨈᨚᨉᨚ',
        phonetic: '[kurru sumangak, tarima kasi toddong]',
        indonesia: 'Terima kasih banyak (berkah dan teguhlah jiwamu).',
        english: 'Thank you very much (may your spirit be blessed).',
        culturalNote: 'Kurru sumangaq adalah ungkapan terima kasih terdalam yang mendoakan kekuatan jiwa lawan bicara.'
      },
      {
        id: 'sp-4',
        mandar: 'Salamaq allo, salamaq lambang.',
        lontara: 'ᨔᨒᨆ ᨕᨒᨚ ᨔᨒᨆ ᨒᨅ',
        phonetic: '[salamak allo, salamak lambang]',
        indonesia: 'Selamat siang, selamat beraktivitas / selamat datang.',
        english: 'Good day, blessed activities / welcome.',
        culturalNote: 'Doa keselamatan untuk hari yang sedang berjalan.'
      }
    ]
  },
  {
    id: 'maritim',
    title: 'Pelaut & Perahu Sandeq',
    iconName: 'Compass',
    description: 'Tuturan navigasi, arah angin, dan interaksi bahari para passombal Mandar.',
    phrases: [
      {
        id: 'mr-1',
        mandar: 'Taqeai sombalna lopi sandeq, mahembusmi bareq.',
        lontara: 'ᨈᨀᨙᨕᨕᨗ ᨔᨚᨅᨒ ᨒᨚᨄᨗ ᨔᨉᨙ ᨆᨖᨙᨅᨘᨔᨘᨆᨗ ᨅᨑᨙ',
        phonetic: '[takeai sombalna lopi sandek, mahembusmi barek]',
        indonesia: 'Bentangkan layar perahu sandeq, angin barat sudah mulai berhembus kencang.',
        english: 'Unfurl the sail of the sandeq boat, the west wind is blowing strong.',
        culturalNote: 'Perintah kapten perahu (punggawa) saat memulai pelayaran menembus ombak.'
      },
      {
        id: 'mr-2',
        mandar: 'Mettappiq di baratan apa maombaq bombang di tangnga lau.',
        lontara: 'ᨆᨛᨈᨄᨗ ᨉᨗ ᨅᨑᨈ ᨕᨄ ᨆᨕᨚᨅ ᨅᨚᨅ ᨉᨗ ᨈᨂ ᨒᨕᨘ',
        phonetic: '[mettappik di waratan apa maombak wombang di tangnga lau]',
        indonesia: 'Bergelantunganlah di cadik bambu penyeimbang karena ombak besar di tengah laut.',
        english: 'Hold onto the outrigger beam because the waves in mid-ocean are surging high.',
        culturalNote: 'Teknik khas sawah (awak) sandeq mengimbangi terpaan angin kencang agar perahu tidak terbalik.'
      },
      {
        id: 'mr-3',
        mandar: 'Pura mai disang mambawa bau cakalang di pangkalan.',
        lontara: 'ᨄᨘᨑ ᨆᨕᨗ ᨉᨗᨔ ᨆᨅᨓ ᨅᨕᨘ ᨌᨀᨒ ᨉᨗ ᨄᨀᨒ',
        phonetic: '[pura mai disang mawawa bau cakalang di pangkalan]',
        indonesia: 'Mereka sudah selesai membawa hasil tangkapan ikan cakalang ke pangkalan pendaratan.',
        english: 'They have finished bringing skipjack tuna catches to the fish landing pier.'
      }
    ]
  },
  {
    id: 'kuliner',
    title: 'Kuliner & Jamuan Makan',
    iconName: 'Utensils',
    description: 'Frasa seputar makanan khas Mandar seperti Jepa, Bau Peapi, dan adab jamuan.',
    phrases: [
      {
        id: 'kl-1',
        mandar: 'Inggai maande jepa anna bau peapi mamesa.',
        lontara: 'ᨕᨗᨁᨕᨗ ᨆᨕᨉᨙ ᨍᨙᨄ ᨕᨊ ᨅᨕᨘ ᨄᨙᨕᨄᨗ ᨆᨆᨙᨔ',
        phonetic: '[inggai maande jepa anna bau peapi mamesa]',
        indonesia: 'Marilah kita makan jepa (lempeng singkong) dan ikan masak kuah kuning lezat.',
        english: 'Come, let us eat jepa (cassava flatbread) and delicious bau peapi (spiced fish soup).',
        culturalNote: 'Jepa dan bau peapi adalah hidangan pusaka ikonik suku Mandar yang kaya rempah kunyit dan asam mangga.'
      },
      {
        id: 'kl-2',
        mandar: 'Manyamang toddong kandena, manisi golla kambu iya.',
        lontara: 'ᨆᨎᨆ ᨈᨚᨉᨚ ᨀᨉᨙᨊ ᨆᨊᨗᨔᨗ ᨁᨚᨒ ᨀᨅᨘ ᨕᨗᨐ',
        phonetic: '[manyamang toddong kandena, manisi gh Consumersolla kambu iya]',
        indonesia: 'Sangat enak masakannya, manis sekali wajik golla kambu ini.',
        english: 'The dish is extremely delicious, this golla kambu sweet is very fragrant.',
        culturalNote: 'Golla kambu dibuat dari ketan, gula merah aren, dan parutan kelapa dibungkus daun pisang kering.'
      },
      {
        id: 'kl-3',
        mandar: 'Maala uissang resina kue tetu mambolongang?',
        lontara: 'ᨆᨕᨒ ᨕᨘᨕᨗᨔ ᨑᨙᨔᨗᨊ ᨀᨘᨕᨙ ᨈᨙᨈᨘ ᨆᨅᨚᨒᨚᨂ',
        phonetic: '[maala uissang resina kue tetu mawolongang]',
        indonesia: 'Bolehkah saya mengetahui resep kue perahu tetu pandan khas Mandar?',
        english: 'May I know the authentic recipe for Mandar boat cake (kue tetu)?'
      }
    ]
  },
  {
    id: 'pasar',
    title: 'Pasar & Jual Beli',
    iconName: 'ShoppingBag',
    description: 'Ungkapan tawar-menawar, menanyakan harga sarung sutra Saqbe dan rempah di pasar.',
    phrases: [
      {
        id: 'ps-1',
        mandar: 'Pira allinna lipaq saqbe Sureq Salaka iya?',
        lontara: 'ᨄᨗᨑ ᨕᨒᨗᨊ ᨒᨗᨄ ᨔᨀᨙ ᨔᨘᨑᨙ ᨔᨒᨀ ᨕᨗᨐ',
        phonetic: '[pira allinna lipak sakbe surek salaka iya?]',
        indonesia: 'Berapa harga sarung tenun sutra motif Sureq Salaka ini?',
        english: 'How much is the price of this Sureq Salaka silk sarong?',
        culturalNote: 'Sureq Salaka adalah motif tenun sutra Mandar dengan garis perak berwibawa.'
      },
      {
        id: 'ps-2',
        mandar: 'Maala dikurangang allinna saqgediq, amboq?',
        lontara: 'ᨆᨕᨒ ᨉᨗᨀᨘᨑᨂ ᨕᨒᨗᨊ ᨔᨀᨙᨉᨗ ᨕᨅᨚ',
        phonetic: '[maala dikurangang allinna sakgedik, ambok?]',
        indonesia: 'Bolehkah harganya dikurangi sedikit, bapak?',
        english: 'Could you give a slight discount, sir?'
      },
      {
        id: 'ps-3',
        mandar: 'Meloqnaq melli tellu kodi baqbaq bau luring.',
        lontara: 'ᨆᨙᨒᨚᨊ ᨆᨙᨒᨗ ᨈᨛᨒᨘ ᨀᨚᨉᨗ ᨅᨅ ᨅᨕᨘ ᨒᨘᨑᨗ',
        phonetic: '[meloknak melli tellu kodi bakbak bau luring]',
        indonesia: 'Saya ingin membeli tiga ikat ikan teri segar.',
        english: 'I would like to buy three bundles of fresh anchovies.'
      }
    ]
  },
  {
    id: 'keluarga',
    title: 'Keluarga & Kekerabatan',
    iconName: 'Users',
    description: 'Panggilan kehormatan dalam sistem silsilah dan kekerabatan rumpun Mandar.',
    phrases: [
      {
        id: 'klg-1',
        mandar: 'Amboq anna Indoq mamboyang di Tinambung.',
        lontara: 'ᨕᨅᨚ ᨕᨊ ᨕᨗᨉᨚ ᨆᨅᨚᨐ ᨉᨗ ᨈᨗᨊᨅᨘ',
        phonetic: '[ambok anna indok mawoyang di tinambung]',
        indonesia: 'Ayah dan ibu tinggal menetap di rumah Tinambung.',
        english: 'Father and mother reside at home in Tinambung.'
      },
      {
        id: 'klg-2',
        mandar: 'Kakaqku mappadede anaqna mating di Boyang Kayang.',
        lontara: 'ᨀᨀᨀᨘ ᨆᨄᨉᨙᨉᨙ ᨕᨊᨊ ᨆᨈᨗ ᨉᨗ ᨅᨚᨐ ᨀᨐ',
        phonetic: '[kakakku mappadedze anakna mating di woyang kayang]',
        indonesia: 'Kakak sulung saya mengantar anaknya pergi ke rumah adat panggung utama.',
        english: 'My elder sibling is escorting their child to the Grand Traditional House.'
      }
    ]
  },
  {
    id: 'arah',
    title: 'Arah, Tempat & Perjalanan',
    iconName: 'Navigation',
    description: 'Orientasi geografis khas Mandar yang mengacu pada laut (lau) dan daratan/gunung (dia).',
    phrases: [
      {
        id: 'ar-1',
        mandar: 'Inna muola lamba allo iya? Mating di lau.',
        lontara: 'ᨕᨗᨊ ᨆᨘᨕᨚᨒ ᨒᨅ ᨕᨒᨚ ᨕᨗᨐ ᨆᨈᨗ ᨉᨗ ᨒᨕᨘ',
        phonetic: '[inna muola lamba allo iya? mating di lau]',
        indonesia: 'Ke mana arah tujuanmu pergi hari ini? Menuju ke arah laut lepas.',
        english: 'Where are you heading today? Towards the open sea.',
        culturalNote: 'Sistem arah Mandar tradisional berpatokan pada sumbu Lau (laut) dan Dia/Buluq (pegunungan).'
      },
      {
        id: 'ar-2',
        mandar: 'Daqdu mai lalan di Boyang Maraqdia di Banggae.',
        lontara: 'ᨉᨀᨉᨘ ᨆᨕᨗ ᨒᨒ ᨉᨗ ᨅᨚᨐ ᨆᨑᨉᨗᨐ ᨉᨗ ᨅᨂᨕᨙ',
        phonetic: '[dakdu mai lalan di woyang marakdia di banggae]',
        indonesia: 'Tunjukkanlah jalan menuju ke istana kediaman Raja (Maraqdia) di Banggae.',
        english: 'Please show the way towards the Royal Residence in Banggae.'
      }
    ]
  }
];

export const ThematicPhrasebook: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('sapaan');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentCategory = PHRASEBOOK_DATA.find(c => c.id === activeCategory) || PHRASEBOOK_DATA[0];

  const filteredPhrases = currentCategory.phrases.filter(p => 
    p.mandar.toLowerCase().includes(searchPhrase.toLowerCase()) ||
    p.indonesia.toLowerCase().includes(searchPhrase.toLowerCase()) ||
    p.english.toLowerCase().includes(searchPhrase.toLowerCase())
  );

  const handlePlay = (mandarText: string) => {
    speakText(mandarText, { lang: 'mandar', rate: 0.88 });
  };

  const handleCopy = (phrase: PhraseItem) => {
    const text = `🗣️ FRASA MANDAR:\n"${phrase.mandar}"\nLontara: ${phrase.lontara}\nFonetik: ${phrase.phonetic}\nArtinya: ${phrase.indonesia}\nEnglish: ${phrase.english}\n${phrase.culturalNote ? `💡 Catatan Budaya: ${phrase.culturalNote}\n` : ''}— Dari KADIMA-ID`;
    navigator.clipboard.writeText(text);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-mandar-maroon-900 via-mandar-maroon-800 to-mandar-navy-950 text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 select-none opacity-10 text-[120px] font-lontara text-white pointer-events-none">
          ᨄᨕᨘ
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mandar-gold-500/20 text-mandar-gold-300 border border-mandar-gold-400/30 text-xs font-bold mb-3">
            <BookMarked className="w-3.5 h-3.5 text-mandar-gold-400" />
            <span>Fitur Baru #4 • Buku Frasa Percakapan Tematis</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Frasa & Percakapan Audio Sehari-hari
          </h2>
          <p className="text-mandar-sand-200 text-sm sm:text-base leading-relaxed">
            Kumpulan percakapan situasional terstruktur untuk wisatawan, pelajar, dan pecinta budaya: sapaan santun, tradisi berlayar perahu Sandeq, jamuan kuliner jepa, hingga etiket adat luhur Mandar.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-mandar-sand-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
          {PHRASEBOOK_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchPhrase('');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-mandar-maroon-700 text-white border-mandar-maroon-800 shadow-md'
                  : 'bg-mandar-sand-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-mandar-sand-200 dark:border-slate-700 hover:border-mandar-maroon-400'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            placeholder="Cari frasa atau arti..."
            className="w-full sm:w-60 px-3.5 py-2 pl-9 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800 border border-mandar-sand-200 dark:border-slate-700 text-xs outline-none focus:border-mandar-maroon-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Active Category Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
            {currentCategory.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            {currentCategory.description}
          </p>
        </div>
        <span className="text-xs font-bold text-mandar-maroon-700 dark:text-mandar-gold-400 bg-mandar-sand-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {filteredPhrases.length} Frasa
        </span>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPhrases.map((phrase) => (
          <div
            key={phrase.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-mandar-sand-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              {/* Lontara Script */}
              <div className="text-xl font-lontara text-mandar-gold-700 dark:text-mandar-gold-400 tracking-wider">
                {phrase.lontara}
              </div>

              {/* Mandar Main Text */}
              <h4 className="text-lg font-bold text-mandar-maroon-900 dark:text-white leading-snug">
                &ldquo;{phrase.mandar}&rdquo;
              </h4>

              {/* Phonetic Pronunciation */}
              <div className="text-xs font-mono text-stone-400">
                IPA: {phrase.phonetic}
              </div>

              {/* Indonesian & English Meaning */}
              <div className="pt-2 border-t border-mandar-sand-100 dark:border-slate-800 space-y-1 text-xs">
                <p className="text-stone-800 dark:text-slate-200 font-medium">
                  🇮🇩 <span className="font-semibold">Arti:</span> {phrase.indonesia}
                </p>
                <p className="text-stone-500 dark:text-slate-400 italic">
                  🇬🇧 <span className="font-semibold">English:</span> {phrase.english}
                </p>
              </div>

              {/* Cultural Note Badge if present */}
              {phrase.culturalNote && (
                <div className="mt-2 p-3 rounded-2xl bg-mandar-sand-50 dark:bg-slate-800/60 border border-mandar-sand-200 dark:border-slate-700 text-[11px] text-stone-600 dark:text-slate-300">
                  <span className="font-bold text-mandar-maroon-700 dark:text-mandar-gold-400 block mb-0.5">
                    💡 Etiket & Norma Budaya:
                  </span>
                  {phrase.culturalNote}
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-mandar-sand-100 dark:border-slate-800">
              <button
                onClick={() => handlePlay(phrase.mandar)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-mandar-maroon-700 hover:bg-mandar-maroon-800 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Pelafalan Audio</span>
              </button>

              <button
                onClick={() => handleCopy(phrase)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-mandar-sand-300 dark:border-slate-700 hover:bg-mandar-sand-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                {copiedId === phrase.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === phrase.id ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
