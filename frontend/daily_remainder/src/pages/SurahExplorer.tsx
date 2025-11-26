import React, { useEffect, useState } from "react";
import API from "../services/apiInstance";

interface Ayah {
  number: number;
  text: string;
  bangla?: string;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  ayahs: Ayah[];
  name_bn?: string;
  translation_bn?: string;
}

const TOTAL_SURAH = 114;

const SurahExplorer: React.FC = () => {
  const [surahNum, setSurahNum] = useState<number>(1);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSurah = async (num: number) => {
    setLoading(true);
    try {
      const res = await API.get(`/quran/surah/${num}`);
      setSurah(res.data);
    } catch {
      setSurah(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurah(surahNum);
  }, [surahNum]);

  const handlePrev = () => {
    if (surahNum > 1) setSurahNum(surahNum - 1);
  };
  const handleNext = () => {
    if (surahNum < TOTAL_SURAH) setSurahNum(surahNum + 1);
  };

  return (
    <div className="container">
      <h2>Surah Explorer</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn outline" onClick={handlePrev} disabled={surahNum === 1}>Previous Surah</button>
        <button className="btn outline" onClick={handleNext} disabled={surahNum === TOTAL_SURAH}>Next Surah</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : !surah ? (
        <div>Surah not found.</div>
      ) : (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>{surah.name}</div>
          <div className="ayah-translation ayah-translation-bn" style={{ marginBottom: 8 }}>{surah.englishName}</div>
          {/* Removed English translated name as requested */}
          <div className="muted">Total Ayahs: {surah.ayahs.length}</div>
          <div style={{ marginTop: 24 }}>
            {surah.ayahs.map((a) => (
              <div key={a.number} className="juz-ayah">
                <div className="juz-ayah-arabic">{a.text}</div>
                {a.bangla && (
                  <div className="ayah-translation ayah-translation-bn" style={{ marginBottom: 8 }}>{a.bangla}</div>
                )}
                <div className="juz-ayah-meta">Ayah {a.number}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurahExplorer;
