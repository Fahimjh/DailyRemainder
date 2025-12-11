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
    
    const ayah = {
      arabic: arData.text,
      translation_bn: bnData.text,
      surah_en: arData.surah.englishName,
      surah_ar: arData.surah.name,
      number: arData.numberInSurah,
      reference_en: `Surah ${arData.surah.englishName}, Ayah ${arData.numberInSurah}`,
      reference_ar: `سورة ${arData.surah.name}، آية ${arData.numberInSurah}`
    };
    res.json(ayah);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ayah" });
  }
});

export default router;
