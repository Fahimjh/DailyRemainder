import { Router } from "express";
import axios from "axios";

const router = Router();

// Fetch a random ayah from AlQuran Cloud API
router.get("/random", async (req, res) => {
  try {
    // There are 6236 ayahs in the Quran
    const ayahNumber = Math.floor(Math.random() * 6236) + 1;
    // Fetch English translation
    const enUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.asad`;
    const bnUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/bn.bengali`;
    const arUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}`;
    const [enRes, bnRes, arRes] = await Promise.all([
      axios.get(enUrl),
      axios.get(bnUrl),
      axios.get(arUrl)
    ]);
    const enData = enRes.data.data;
    const bnData = bnRes.data.data;
    const arData = arRes.data.data;
    // Try to extract Bengali surah name from Bengali translation if possible
    // Fallback to Arabic if not available
    let surah_bn = arData.surah.name;
    // The AlQuran Cloud API does not provide Bengali surah names directly, so we use a mapping for common surahs
    const surahBnMap: { [key: string]: string } = {
      "Al-Fatiha": "আল-ফাতিহা",
      "Al-Baqarah": "আল-বাকারা",
      "Aali Imran": "আলে ইমরান",
      "An-Nisa": "আন-নিসা",
      "Al-Ma'idah": "আল-মায়িদা",
      "Al-An'am": "আল-আন'আম",
      "Al-A'raf": "আল-আ'রাফ",
      "Al-Anfal": "আল-আনফাল",
      "At-Tawbah": "আত-তাওবা",
      "Yunus": "ইউনুস",
      "Hud": "হুদ",
      "Yusuf": "ইউসুফ",
      "Ar-Ra'd": "আর-রাদ",
      "Ibrahim": "ইব্রাহিম",
      "Al-Hijr": "আল-হিজর",
      "An-Nahl": "আন-নাহল",
      "Al-Isra": "আল-ইসরা",
      "Al-Kahf": "আল-কাহফ",
      "Maryam": "মারিয়াম",
      "Ta-Ha": "ত্ব-হা",
      "Al-Anbiya": "আল-আম্বিয়া",
      "Al-Hajj": "আল-হাজ্জ",
      "Al-Muminun": "আল-মুমিনুন",
      "An-Nur": "আন-নূর",
      "Al-Furqan": "আল-ফুরকান",
      "Ash-Shu'ara": "আশ-শু'আরা",
      "An-Naml": "আন-নামল",
      "Al-Qasas": "আল-কাসাস",
      "Al-Ankabut": "আল-আনকাবুত",
      "Ar-Rum": "আর-রুম",
      "Luqman": "লুকমান",
      "As-Sajda": "আস-সাজদা",
      "Al-Ahzab": "আল-আহযাব",
      "Saba": "সাবা",
      "Fatir": "ফাতির",
      "Ya-Sin": "ইয়াসিন",
      "As-Saffat": "আস-সাফফাত",
      "Sad": "সাদ",
      "Az-Zumar": "আয-যুমার",
      "Ghafir": "গাফির",
      "Fussilat": "ফুসসিলাত",
      "Ash-Shura": "আশ-শুরা",
      "Az-Zukhruf": "আয-যুখরুফ",
      "Ad-Dukhan": "আদ-দুখান",
      "Al-Jathiya": "আল-জাথিয়া",
      "Al-Ahqaf": "আল-আহকাফ",
      "Muhammad": "মুহাম্মাদ",
      "Al-Fath": "আল-ফাতহ",
      "Al-Hujurat": "আল-হুজুরাত",
      "Qaf": "কাফ",
      "Adh-Dhariyat": "আয-যারিয়াত",
      "At-Tur": "আত-তূর",
      "An-Najm": "আন-নাজম",
      "Al-Qamar": "আল-কামার",
      "Ar-Rahman": "আর-রাহমান",
      "Al-Waqia": "আল-ওয়াকিয়া",
      "Al-Hadid": "আল-হাদিদ",
      "Al-Mujadila": "আল-মুজাদিলা",
      "Al-Hashr": "আল-হাশর",
      "Al-Mumtahina": "আল-মুমতাহিনা",
      "As-Saff": "আস-সাফ",
      "Al-Jumua": "আল-জুমু'আ",
      "Al-Munafiqun": "আল-মুনাফিকুন",
      "At-Taghabun": "আত-তাগাবুন",
      "At-Talaq": "আত-তালাক",
      "At-Tahrim": "আত-তাহরিম",
      "Al-Mulk": "আল-মুলক",
      "Al-Qalam": "আল-কলম",
      "Al-Haqqa": "আল-হাক্কা",
      "Al-Maarij": "আল-মাআরিজ",
      "Nuh": "নূহ",
      "Al-Jinn": "আল-জিন",
      "Al-Muzzammil": "আল-মুজ্জাম্মিল",
      "Al-Muddathir": "আল-মুদ্দাসসির",
      "Al-Qiyama": "আল-কিয়ামা",
      "Al-Insan": "আল-ইনসান",
      "Al-Mursalat": "আল-মুরসালাত",
      "An-Naba": "আন-নাবা",
      "An-Nazi'at": "আন-নাজিয়াত",
      "Abasa": "আবাসা",
      "At-Takwir": "আত-তাকভীর",
      "Al-Infitar": "আল-ইনফিতার",
      "Al-Mutaffifin": "আল-মুতাফফিফিন",
      "Al-Inshiqaq": "আল-ইনশিকাক",
      "Al-Buruj": "আল-বুরুজ",
      "At-Tariq": "আত-তারিক",
      "Al-Ala": "আল-আ'লা",
      "Al-Ghashiya": "আল-গাশিয়াহ",
      "Al-Fajr": "আল-ফজর",
      "Al-Balad": "আল-বালাদ",
      "Ash-Shams": "আশ-শামস",
      "Al-Lail": "আল-লাইল",
      "Ad-Duha": "আদ-দুহা",
      "Ash-Sharh": "আশ-শারহ",
      "At-Tin": "আত-তিন",
      "Al-Alaq": "আল-আলাক",
      "Al-Qadr": "আল-কদর",
      "Al-Bayyina": "আল-বাইয়্যিনা",
      "Az-Zalzalah": "আয-যালজালাহ",
      "Al-Adiyat": "আল-আদিয়াত",
      "Al-Qaria": "আল-কারিয়া",
      "At-Takathur": "আত-তাকাসুর",
      "Al-Asr": "আল-আসর",
      "Al-Humazah": "আল-হুমাযাহ",
      "Al-Fil": "আল-ফীল",
      "Quraish": "কুরাইশ",
      "Al-Maun": "আল-মাউন",
      "Al-Kawthar": "আল-কাউসার",
      "Al-Kafirun": "আল-কাফিরুন",
      "An-Nasr": "আন-নাসর",
      "Al-Masad": "আল-মাসাদ",
      "Al-Ikhlas": "আল-ইখলাস",
      "Al-Falaq": "আল-ফালাক",
      "An-Nas": "আন-নাস"
    };
    if (surahBnMap[String(arData.surah.englishName)]) {
      surah_bn = surahBnMap[String(arData.surah.englishName)];
    }
    const ayah = {
      arabic: arData.text,
      translation_bn: bnData.text,
      surah_bn: surah_bn,
      surah_ar: arData.surah.name,
      number: arData.numberInSurah,
      reference_bn: `সূরা ${surah_bn}, আয়াত ${arData.numberInSurah}`,
      reference_ar: `سورة ${arData.surah.name}، آية ${arData.numberInSurah}`
    };
    res.json(ayah);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ayah" });
  }
});

export default router;
