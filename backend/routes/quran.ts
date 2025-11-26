import { Router } from "express";
import axios from "axios";

const router = Router();
// Get a specific Juz by number (default to en.asad translation)
router.get("/juz/:number", async (req, res) => {
  try {
    const { number } = req.params;
    // Fetch Arabic and Bengali translations in parallel
    const [arRes, bnRes] = await Promise.all([
      axios.get(`https://api.alquran.cloud/v1/juz/${number}/quran-uthmani`),
      axios.get(`https://api.alquran.cloud/v1/juz/${number}/bn.bengali`)
    ]);
    const arAyahs = arRes.data.data.ayahs;
    const bnAyahs = bnRes.data.data.ayahs;
    // Merge by ayah number (assuming both arrays are in the same order)
    const mergedAyahs = arAyahs.map((arAyah: any, idx: number) => ({
      number: arAyah.number,
      text: arAyah.text,
      surah: arAyah.surah,
      bangla: bnAyahs[idx]?.text || ""
    }));
    // Return the same structure as before, but with merged ayahs
    res.json({
      ...arRes.data.data,
      ayahs: mergedAyahs
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Juz" });
  }
});

// Get all surahs
router.get("/surah", async (req, res) => {
  try {
    const response = await axios.get("https://api.alquran.cloud/v1/surah");
    res.json(response.data.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch surahs" });
  }
});

// Get a specific surah by number
router.get("/surah/:number", async (req, res) => {
  try {
    const { number } = req.params;
    // Fetch Arabic and Bengali surah data in parallel
    const [arRes, bnRes] = await Promise.all([
      axios.get(`https://api.alquran.cloud/v1/surah/${number}`),
      axios.get(`https://api.alquran.cloud/v1/surah/${number}/bn.bengali`)
    ]);
    const arData = arRes.data.data;
    const bnData = bnRes.data.data;
    // Merge ayahs for Bengali translation
    const mergedAyahs = arData.ayahs.map((arAyah: any, idx: number) => ({
      number: arAyah.number,
      text: arAyah.text,
      bangla: bnData.ayahs[idx]?.text || ""
    }));
    // Return both Arabic and Bengali surah info, and merged ayahs
    res.json({
      number: arData.number,
      name: arData.name, // Arabic name
      englishName: arData.englishName, // Transliteration (e.g. Al-Faatiha)
      englishNameTranslation: arData.englishNameTranslation, // English meaning
      ayahs: mergedAyahs
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch surah" });
  }
});

export default router;
