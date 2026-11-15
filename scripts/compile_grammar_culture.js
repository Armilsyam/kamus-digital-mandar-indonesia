const fs = require('fs');
const path = require('path');

const grammarData = {
  phonology: {
    totalPhonemes: 24,
    vowels: [
      { char: "a", ipa: "[a]", name: "Vokal Depan Terbuka", example: "api (api), anaq (anak)" },
      { char: "i", ipa: "[i]", name: "Vokal Depan Tertutup", example: "ina (ibu), iqdai (tidak)" },
      { char: "u", ipa: "[u]", name: "Vokal Belakang Tertutup", example: "uma (kebun), urang (hujan)" },
      { char: "e", ipa: "[e]", name: "Vokal Depan Sedang", example: "eloq (mau), epeq (sayap)" },
      { char: "o", ipa: "[o]", name: "Vokal Belakang Sedang", example: "olo (arah), oto (mobil)" }
    ],
    consonants: [
      { char: "p", ipa: "[p]", type: "Konsonan Hambat Bilabial Tak Bersuara", example: "pau (kata)" },
      { char: "b", ipa: "[b] / [w]", type: "Konsonan Hambat Bilabial Bersuara", example: "boyang (rumah), tabe [tawe] (permisi)" },
      { char: "t", ipa: "[t]", type: "Konsonan Hambat Alveolar Tak Bersuara", example: "tunu (bakar)" },
      { char: "d", ipa: "[d] / [ð]", type: "Konsonan Hambat Alveolar Bersuara", example: "dundu (minum), tada [tadza] (tombak)" },
      { char: "c", ipa: "[c]", type: "Konsonan Hambat Palatal Tak Bersuara", example: "cawa (tertawa)" },
      { char: "j", ipa: "[ɟ] / [j]", type: "Konsonan Hambat Palatal Bersuara", example: "jama (kerja), kaja [kaya] (berlebihan)" },
      { char: "k", ipa: "[k]", type: "Konsonan Hambat Velar Tak Bersuara", example: "kande (makan)" },
      { char: "g", ipa: "[g] / [ɣ]", type: "Konsonan Hambat Velar Bersuara", example: "giling (giling), pago [pagho] (gayung tempurung)" },
      { char: "q", ipa: "[ʔ]", type: "Konsonan Hambat Glotal (Hamzah)", example: "anaq (anak), saqbe (sutra), teqneq (manis)" },
      { char: "m", ipa: "[m]", type: "Konsonan Nasal Bilabial", example: "mata (mata)" },
      { char: "n", ipa: "[n]", type: "Konsonan Nasal Alveolar", example: "naung (turun)" },
      { char: "ny", ipa: "[ɲ]", type: "Konsonan Nasal Palatal", example: "nyawa (jiwa)" },
      { char: "ng", ipa: "[ŋ]", type: "Konsonan Nasal Velar", example: "ngiang (dengung)" },
      { char: "s", ipa: "[s]", type: "Konsonan Frikatif Alveolar Tak Bersuara", example: "sombal (layar)" },
      { char: "r", ipa: "[r]", type: "Konsonan Getar Alveolar", example: "rarung (jarum)" },
      { char: "l", ipa: "[l]", type: "Konsonan Lateral Alveolar", example: "litaq (tanah)" },
      { char: "w", ipa: "[w]", type: "Konsonan Semi-Vokal Labial-Velar", example: "wai (air)" },
      { char: "y", ipa: "[j]", type: "Konsonan Semi-Vokal Palatal", example: "yau (saya)" },
      { char: "h", ipa: "[h]", type: "Konsonan Frikatif Glotal", example: "haraq (harap)" }
    ],
    allophones: [
      {
        phoneme: "/b/",
        realization: "[w] atau [β]",
        environment: "Bila berada di antara dua vokal (intervokalik)",
        ruleFormula: "/b/ → [w] / V _ V",
        examples: [
          { base: "tabe", phonemic: "/tabe/", phonetic: "[tawe]", meaning: "permisi / maaf" },
          { base: "kaboro", phonemic: "/kaboro/", phonetic: "[kaworo]", meaning: "sayang / cinta" },
          { base: "lebaq", phonemic: "/lebaq/", phonetic: "[lewaʔ]", meaning: "selesai / sudah" }
        ]
      },
      {
        phoneme: "/d/",
        realization: "[dz] atau [ð] (seperti huruf Arab ذ / zal)",
        environment: "Bila berada di antara dua vokal (intervokalik)",
        ruleFormula: "/d/ → [ð] / V _ V",
        examples: [
          { base: "tada", phonemic: "/tada/", phonetic: "[taða] / [tadza]", meaning: "tombak" },
          { base: "madondong", phonemic: "/madondong/", phonetic: "[maðondzoŋ]", meaning: "besok / pagi hari" },
          { base: "pada", phonemic: "/pada/", phonetic: "[paða]", meaning: "sama / serupa" }
        ]
      },
      {
        phoneme: "/g/",
        realization: "[gh] atau [ɣ] (seperti huruf Arab غ / ghain)",
        environment: "Bila berada di antara dua vokal (intervokalik)",
        ruleFormula: "/g/ → [ɣ] / V _ V",
        examples: [
          { base: "pago", phonemic: "/pago/", phonetic: "[paɣo]", meaning: "gayung dr tempurung kelapa" },
          { base: "tagala", phonemic: "/tagala/", phonetic: "[taɣala]", meaning: "pegang / rangkul" },
          { base: "bagoq", phonemic: "/bagoq/", phonetic: "[baɣoʔ]", meaning: "pukul" }
        ]
      },
      {
        phoneme: "/j/",
        realization: "[y] atau [j] (semi-vokal palatal)",
        environment: "Bila berada di antara dua vokal (intervokalik)",
        ruleFormula: "/j/ → [j] / V _ V",
        examples: [
          { base: "pajama", phonemic: "/pajama/", phonetic: "[payama]", meaning: "pekerjaan" },
          { base: "kaja", phonemic: "/kaja/", phonetic: "[kaya]", meaning: "berlebihan" }
        ]
      }
    ],
    morphophonemics: [
      { prefix: "mang-", rootInitial: "p", resultCluster: "pp", example: "mang- + pau = mappau (berkata/berbicara)" },
      { prefix: "mang-", rootInitial: "t", resultCluster: "tt", example: "mang- + tunu = mattunu (membakar)" },
      { prefix: "mang-", rootInitial: "c", resultCluster: "cc", example: "mang- + cawa = maccawa (tertawa)" },
      { prefix: "mang-", rootInitial: "k", resultCluster: "kk", example: "mang- + kande = makkande (makan)" },
      { prefix: "mang-", rootInitial: "s", resultCluster: "ss", example: "mang- + sambayang = massambayang (sembahyang)" },
      { prefix: "mang-", rootInitial: "b", resultCluster: "mb", example: "mang- + boyang = mamboyang (berumah tangga)" },
      { prefix: "mang-", rootInitial: "d", resultCluster: "nd", example: "mang- + dundu = mandundu (meminum)" },
      { prefix: "mang-", rootInitial: "j", resultCluster: "nj", example: "mang- + jama = manjama (bekerja)" },
      { prefix: "mang-", rootInitial: "g", resultCluster: "ngg", example: "mang- + giling = manggiling (menggiling)" },
      { prefix: "mang-", rootInitial: "l", resultCluster: "ll", example: "mang- + loppa = malloppa (melompat)" },
      { prefix: "mang-", rootInitial: "r", resultCluster: "rr", example: "mang- + rammang = marrammang (berteduh)" },
      { prefix: "mang-", rootInitial: "w", resultCluster: "ww", example: "mang- + wawa = mawwawa (membawa)" },
      { prefix: "mang-", rootInitial: "y", resultCluster: "yy", example: "mang- + yau = mayyau (mengaku saya)" }
    ],
    stressPatterns: [
      { type: "Ekasuku (Monosyllabic)", rule: "Tekanan jatuh pada satu-satunya suku kata", example: "di (di), mi (sudah), ba (bawa)" },
      { type: "Dwisuku (Disyllabic)", rule: "Tekanan jatuh pada suku kata pertama (penultima)", example: "’boyang (rumah), ’kande (makan), ’litaq (tanah)" },
      { type: "Trisuku (Trisyllabic)", rule: "Tekanan jatuh pada suku kata kedua (penultima dari akhir)", example: "ka’lamang (kelapa), ma’niri (bersih), ba’lana (belanga)" },
      { type: "Catursuku (Quadrisyllabic)", rule: "Tekanan sekunder pada suku kata pertama, tekanan primer pada suku kata ketiga", example: "’pasi’tengang (persamaan), ’kaqa’la-ala (panjang tangan)" }
    ]
  },
  pronouns: [
    {
      person: "Orang Pertama Tunggal (Saya)",
      seri1: "iyau",
      seri1Usage: "Bentuk bebas / Fokus subjek",
      seri2: "-u / u-",
      seri2Usage: "Pelaku transitif / Genitif kepunyaan",
      seri3: "-aq / -maq",
      seri3Usage: "Objek penderita / Enklitik pasif",
      example: "Iyau mappau (Saya berbicara) | Boyangu (Rumahku) | Naperoaq (Dia mengajak saya)"
    },
    {
      person: "Orang Pertama Jamak Eksklusif (Kami)",
      seri1: "iyamiq",
      seri1Usage: "Bentuk bebas",
      seri2: "-mang / ki-",
      seri2Usage: "Pelaku transitif",
      seri3: "-kamiq",
      seri3Usage: "Objek / Enklitik",
      example: "Iyamiq mamba (Kami pergi) | Boyangmang (Rumah kami)"
    },
    {
      person: "Orang Pertama Jamak Inklusif (Kita)",
      seri1: "itaq",
      seri1Usage: "Bentuk bebas (sopan)",
      seri2: "-ta / ta-",
      seri2Usage: "Pelaku transitif",
      seri3: "-kitaq",
      seri3Usage: "Objek / Enklitik",
      example: "Itaq maqallio (Kita yang beli) | Boyangta (Rumah kita)"
    },
    {
      person: "Orang Kedua Tunggal (Engkau/Kamu)",
      seri1: "iqo",
      seri1Usage: "Bentuk bebas",
      seri2: "-mu / mu-",
      seri2Usage: "Pelaku transitif / Pemilik",
      seri3: "-o / moqo",
      seri3Usage: "Objek / Enklitik",
      example: "Iqo madondong pole (Kamu besok datang) | Boyangmu (Rumahmu) | Kupatudoqo (Kusuruh engkau)"
    },
    {
      person: "Orang Ketiga Tunggal/Jamak (Dia/Mereka)",
      seri1: "iya / iseqiya",
      seri1Usage: "Bentuk bebas",
      seri2: "-na / na-",
      seri2Usage: "Pelaku transitif / Pemilik",
      seri3: "-i / -di",
      seri3Usage: "Objek / Enklitik",
      example: "Iya namande (Dia makan) | Boyangna (Rumahnya) | Diandedi (Dimakan olehnya)"
    }
  ],
  affixes: {
    prefixes: [
      { affix: "ma- / maq-", function: "Membentuk kata kerja aktif transitif/intransitif atau kata sifat", example: "maande (makan), maaccur (meremukkan)" },
      { affix: "me- / meq-", function: "Menyatakan perbuatan berulang, menuju ke arah, atau merintih", example: "meqakke (berangkat), meadede (merintih aduh)" },
      { affix: "pa- / paq-", function: "Menyatakan pelaku, alat, atau kausatif", example: "paagama (santri/orang alim), passorong (uang mahar)" },
      { affix: "pe- / peq-", function: "Menyatakan tindakan pencarian atau penjemputan", example: "peala (penjemput), peakal (curang)" },
      { affix: "na-", function: "Awalan persona ketiga pasif (di-) atau kata tugas", example: "nawajiqi (diwajibkan olehnya), naala (diambilnya)" },
      { affix: "di-", function: "Bentuk pasif umum dalam bahasa Mandar", example: "didundu (diminum), diande (dimakan)" },
      { affix: "ti-", function: "Menyatakan ketidaksengajaan (ter- dalam BI)", example: "titedo (tersandung), tibangngang (terheran-heran)" },
      { affix: "si-", function: "Menyatakan saling (resiprokal / ber-an)", example: "sitimbe (saling lempar), sibatta (saling parang)" },
      { affix: "ka-", function: "Menyatakan sifat gemar melakukan sesuatu (kata ulang)", example: "kaala-ala (panjang tangan), kapau-pau (panjang mulut)" },
      { affix: "ke-", function: "Menyatakan mempunyai / berpemilikan", example: "kebara-barang (mempunyai banyak barang), keanaq (mempunyai anak)" },
      { affix: "um-", function: "Menyatakan dalam keadaan atau perbuatan aktif", example: "ummorong (berenang), ummewa (melawan)" }
    ],
    infixes: [
      { affix: "-um-", function: "Melakukan pekerjaan seperti kata dasar", example: "tumekeq (memanjat), tumadu (makan sirih)" },
      { affix: "-al-", function: "Membentuk intensitas atau variasi gerak", example: "calalaq (bercahaya)" },
      { affix: "-ar-", function: "Menyatakan jamak atau pengulangan", example: "tarawa (tertawa riuh)" }
    ],
    suffixes: [
      { affix: "-ang", function: "Membentuk nomina proses, tempat, atau benefaktif (kan)", example: "alang (ambilkan), accurang (berhancuran)" },
      { affix: "-i", function: "Membentuk lokatif atau kausatif pengulangan", example: "utui (carikan kutunya), alai (ambillah)" }
    ],
    clitics: [
      { clitic: "-mi / -mo", meaning: "Penanda aspek perfek (sudah / lah)", example: "uissangmi (sudah kutahu), alaimo (ambillah sudah)" },
      { clitic: "-pa / -pai", meaning: "Penanda aspek imperfek (masih / belum / nanti)", example: "monge-mongeq pai (masih sakit rasanya)" },
      { clitic: "-di", meaning: "Partikel penegas atau pronomina enklitik", example: "sangapa di mu bengang aq (berapa saja kau berikan padaku)" },
      { clitic: "-toi / -toqo", meaning: "Juga / pula", example: "meloq toi (mau juga)" },
      { clitic: "-tuqu", meaning: "Penunjuk kepastian / itulah", example: "masiriq mi tuqu tau (pasti kita akan malu)" },
      { clitic: "-bandi", meaning: "Lagi / masih terus berlangsung", example: "tandaq bandi (masih saja sampai)" },
      { clitic: "-nasang", meaning: "Semua / seluruhnya", example: "latto nasang mi (sudah nampak semua)" },
      { clitic: "-dua / -duai", meaning: "Masih / tetap", example: "uso-uso dua pai (ia masih terengah-engah)" }
    ]
  }
};

const cultureData = {
  sandeq: {
    title: "Perahu Sandeq (Mahakarya Maritim Mandar)",
    description: "Perahu bercadik tradisional suku Mandar yang diakui sebagai perahu layar tercepat tanpa mesin di kawasan Austronesia. Menjadi lambang ketangguhan para passombal (pelaut Mandar) mengarungi Laut Jawa, Selat Makassar, hingga Samudra Pasifik.",
    anatomy: [
      { part: "Sombal", meaning: "Layar segitiga berbentuk guntingan unik (sombal tanjaq) penangkap angin laut." },
      { part: "Pallayarang", meaning: "Tiang layar utama dari kayu ulin atau bambu petung pilihan yang kokoh dan lentur." },
      { part: "Baratan", meaning: "Lengan penyeimbang (cadik ganda) dari bambu panjang di sisi kiri dan kanan perahu." },
      { part: "Tada (Cadik)", meaning: "Bilah bambu pelampung penyeimbang ombak di ujung baratan." },
      { part: "Guling", meaning: "Kemudi samping tradisional yang dikendalikan dengan keahlian presisi tinggi." },
      { part: "Pantoq", meaning: "Tali-temali pengikat layar dan tiang dari serat alami tahan air laut." },
      { part: "Pacceko", meaning: "Ruang kecil penyimpanan bekal makanan para pelaut di tengah lambung perahu." }
    ],
    philosophy: "Filosofi 'Mellamun Bomboq, Mappasombo Litaq' (Menenggelamkan ego ombak, memuliakan daratan), menegaskan bahwa laut bukan pemisah melainkan jalan persaudaraan dan kehormatan hidup."
  },
  saqbe: {
    title: "Lipaq Saqbe Mandar (Tenun Sutra Khas Sulawesi Barat)",
    description: "Kain tenun sutra tradisional Mandar yang ditenun dengan alat tenun gedongan tradisional (panetteq) oleh perempuan Mandar. Kaya akan motif geometris kotak-kotak yang sarat strata sosial dan nilai kesantunan (siriq).",
    motifs: [
      { name: "Sureq Salaka", meaning: "Motif kotak bergaris putih perak yang melambangkan kemurnian hati, kebangsawanan, dan kejujuran." },
      { name: "Sureq Padhadhang", meaning: "Motif garis pedang melambangkan keberanian, ketegasan memegang prinsip, dan keperkasaan ksatria Mandar." },
      { name: "Sureq Balo Tappang", meaning: "Motif kotak-kotak besar tegas melambangkan kedudukan terhormat para Tomakaka dan pemimpin adat." },
      { name: "Sureq Balo Gandang", meaning: "Motif kotak berirama teratur seperti tabuhan gendang upacara Sayyang Pattudu." },
      { name: "Sureq Marasa", meaning: "Motif tenun kaya warna yang anggun untuk mempelai dalam upacara perkawinan adat Mandar." },
      { name: "Sureq Puqseq", meaning: "Motif pusar di tengah kain tenun sebagai lambang pusat asal-usul kehidupan dan tali persaudaraan." }
    ]
  },
  kalindaqdaq: {
    title: "Kalindaqdaq (Sastra Lisan & Puisi Tradisional Mandar)",
    description: "Bentuk puisi lisan tradisional suku Mandar yang terdiri atas bait empat baris dengan pola persajakan dan jumlah suku kata ketat berirama 8 - 7 - 8 - 7. Kalindaqdaq diucapkan dalam percintaan, nasihat adat, keagamaan, serta pembakar semangat passombal.",
    meterPattern: "Baris 1: 8 Suku Kata | Baris 2: 7 Suku Kata | Baris 3: 8 Suku Kata | Baris 4: 7 Suku Kata",
    poems: [
      {
        id: "k-1",
        category: "Percintaan (Kalindaqdaq Masiriq)",
        linesMandar: [
          "Mellongeq mepasorongan", // 8
          "Pindang pura tinindo",  // 7
          "Taqe-taqe na balimbing", // 8
          "Lappaq tinindo tulu"    // 7
        ],
        syllables: [8, 7, 8, 7],
        linesIndonesian: [
          "Melongok sembari menyodorkan",
          "Piring yang telah retak",
          "Ranting-ranting belimbing",
          "Runtuh terkulai selalu"
        ],
        meaning: "Menggambarkan kerinduan mendalam seorang kekasih yang menanti kepulangan pujaan hatinya dari seberang lautan."
      },
      {
        id: "k-2",
        category: "Nasihat & Budi Pekerti (Paqtondongan)",
        linesMandar: [
          "Pettuqgalang masseq toi", // 8
          "Agamana Puangta",        // 7
          "Daqa muleppas siriqmu",   // 8
          "Tandanau di aheraq"      // 7
        ],
        syllables: [8, 7, 8, 7],
        linesIndonesian: [
          "Peganglah teguh selalu",
          "Agama Tuhan Yang Maha Esa",
          "Jangan engkau lepaskan harga dirimu (siriq)",
          "Hingga sampai ke hari akhirat"
        ],
        meaning: "Pesan leluhur Mandar tentang menjunjung tinggi nilai keimanan dan menjaga martabat (siriq) dalam setiap langkah kehidupan."
      },
      {
        id: "k-3",
        category: "Keberanian Maritim (Passombal)",
        linesMandar: [
          "Bongi diapa naqeloq",    // 8
          "Sombal tanjaq malolo",   // 7
          "Sau di sasiq malambiq",  // 8
          "Pole mai mambawa"        // 7
        ],
        syllables: [8, 7, 8, 7],
        linesIndonesian: [
          "Malam inilah yang dikehendaki",
          "Layar gunting yang anggun",
          "Melaut hingga ke samudra luas",
          "Pulang membawa berkah rezeki"
        ],
        meaning: "Syair pembakar semangat passombal saat melepas sauh di malam hari diiringi tiupan angin darat menuju perairan lepas."
      }
    ]
  },
  sayyangPattudu: {
    title: "Tradisi Sayyang Pattudu (Kuda Menari Mandar)",
    description: "Warisan Budaya Takbenda khas Mandar berupa arak-arakan kuda terlatih yang menari mengikuti tabuhan rebana (Calong). Tradisi ini diselenggarakan sebagai bentuk apresiasi tinggi bagi anak-anak yang telah mengkhatamkan 30 juz Al-Qur'an.",
    elements: [
      { name: "Pattudu (Gerakan Tari Kuda)", meaning: "Kuda melangkah dengan ritme ketukan kaki teratur seiring irama tabuhan rebana." },
      { name: "Kain Lipaq Saqbe & Renda", meaning: "Kuda dihiasi pelana bersulam emas, perak, dan sarung sutra Mandar terbaik." },
      { name: "Pappasang (Syair Pujian)", meaning: "Lantunan doa dan puji-pujian kepada Nabi serta motivasi cinta Al-Qur'an." }
    ]
  },
  culinary: [
    {
      name: "Jepa",
      description: "Makanan pokok tradisional suku Mandar berbahan dasar parutan singkong atau sagu yang dipanggang di atas piring tanah liat (panjuqjuran). Disantap bersama ikan bakar Bau Peapi."
    },
    {
      name: "Bau Peapi",
      description: "Olahan ikan masak berkuah kuning asam segar khas Mandar dengan rempah belimbing wuluh, kunyit, daun bawang, dan minyak kelapa mandar (moliq)."
    },
    {
      name: "Golla Kambu",
      description: "Kudapan manis tradisional berbahan beras ketan, gula merah aren asli, santan kelapa, dan butiran kacang tanah gurih yang legit."
    },
    {
      name: "Kue Tetu",
      description: "Kue lembut yang dicetak dalam wadah daun pandan berbentuk perahu (tetu), berisi tepung terigu berpadu santan gurih dan lapisan lelehan gula aren."
    },
    {
      name: "Sambal Mandar",
      description: "Sambal khas berbahan cabai rawit pedas, jeruk purut nipis, garam, dan siraman minyak kelapa murni khas pesisir Mandar."
    }
  ],
  quizBank: [
    {
      id: "q-1",
      question: "Apa arti dari kata Mandar 'boyang'?",
      options: ["Rumah", "Perahu", "Kebun", "Pakaian"],
      correctIndex: 0,
      explanation: "Boyang dalam bahasa Mandar berarti rumah, khususnya rumah panggung tradisional Mandar."
    },
    {
      id: "q-2",
      question: "Perahu tradisional Mandar yang terkenal dengan layar segitiga dan kecepatan tingginya disebut...",
      options: ["Sandeq", "Phinisi", "Jukung", "Kora-kora"],
      correctIndex: 0,
      explanation: "Sandeq adalah perahu layar bercadik khas Mandar yang merupakan perahu tercepat tanpa mesin."
    },
    {
      id: "q-3",
      question: "Bagaimanakah alofon konsonan /b/ dalam bahasa Mandar jika berada di antara dua vokal?",
      options: ["Diucapkan sebagai [w]", "Diucapkan sebagai [p]", "Diucapkan sebagai [b] tebal", "Diucapkan sebagai [m]"],
      correctIndex: 0,
      explanation: "Dalam fonologi Mandar, fonem /b/ bila diapit dua vokal (intervokalik) direalisasikan menjadi [w], seperti kata 'tabe' diucapkan [tawe]."
    },
    {
      id: "q-4",
      question: "Dalam asimilasi morfofonemik Mandar, penggabungan prefiks 'mang-' + 'pau' menghasilkan bentuk...",
      options: ["mappau", "mampau", "mangpau", "mapau"],
      correctIndex: 0,
      explanation: "Gugus nasal /ng/ bertemu konsonan tak bersuara /p/ mengalami asimilasi total membentuk konsonan geminat /pp/, sehingga menjadi 'mappau' (berkata)."
    },
    {
      id: "q-5",
      question: "Pola irama suku kata yang baku pada puisi sastra lisan 'Kalindaqdaq' adalah...",
      options: ["8 - 7 - 8 - 7", "8 - 8 - 8 - 8", "10 - 8 - 10 - 8", "4 - 4 - 4 - 4"],
      correctIndex: 0,
      explanation: "Kalindaqdaq memiliki pola ketat 4 baris dengan susunan suku kata 8 - 7 - 8 - 7."
    },
    {
      id: "q-6",
      question: "Makanan tradisional pengganti nasi khas pesisir Mandar dari olahan singkong/sagu yang dipanggang disebut...",
      options: ["Jepa", "Golla Kambu", "Bau Peapi", "Tetu"],
      correctIndex: 0,
      explanation: "Jepa adalah roti pipih bakar tradisional Mandar berbahan singkong atau tepung sagu."
    },
    {
      id: "q-7",
      question: "Motif tenun sutra Lipaq Saqbe yang melambangkan kemurnian hati dan kejujuran adalah...",
      options: ["Sureq Salaka", "Sureq Padhadhang", "Sureq Balo Tappang", "Sureq Puqseq"],
      correctIndex: 0,
      explanation: "Sureq Salaka adalah motif tenun bergaris perak putih yang melambangkan kejujuran dan kemurnian budi pekerti."
    },
    {
      id: "q-8",
      question: "Huruf 'q' dalam ortografi Bahasa Mandar melambangkan bunyi...",
      options: ["Konsonan hambat glotal (hamzah /ʔ/)", "Konsonan k velar keras", "Konsonan g lunak", "Vokal panjang"],
      correctIndex: 0,
      explanation: "Huruf 'q' secara resmi melambangkan bunyi hambat glotal (glottal stop / hamzah), seperti pada kata 'anaq' dan 'saqbe'."
    },
    {
      id: "q-9",
      question: "Kata ganti orang pertama tunggal bentuk bebas (Seri I) dalam Bahasa Mandar adalah...",
      options: ["iyau", "iqo", "itaq", "iya"],
      correctIndex: 0,
      explanation: "Dalam sistem pronomina persona Mandar, 'iyau' adalah bentuk bebas untuk orang pertama tunggal (saya)."
    },
    {
      id: "q-10",
      question: "Tradisi arak-arakan kuda menari untuk mengapresiasi anak yang telah khatam Al-Qur'an dinamakan...",
      options: ["Sayyang Pattudu", "Pakkacaping", "Sandeq Race", "Mappadendang"],
      correctIndex: 0,
      explanation: "Sayyang Pattudu adalah tradisi kuda menari khas Mandar dalam rangka syukuran khatam Al-Qur'an."
    }
  ]
};

const outputDir = path.resolve('c:/Users/Administrator/kamusdigitalmandarindoesia/src/data');
fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'mandar_grammar.json'), JSON.stringify(grammarData, null, 2), 'utf-8');
fs.writeFileSync(path.join(outputDir, 'mandar_culture.json'), JSON.stringify(cultureData, null, 2), 'utf-8');

console.log("Successfully created mandar_grammar.json and mandar_culture.json!");
