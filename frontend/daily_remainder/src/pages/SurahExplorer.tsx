import React, { useEffect, useState, useContext } from "react";
import API from "../services/apiInstance";
import { addBookmarkServer } from "../services/api";
import { AuthContext } from "../context/AuthContext";

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
  const [msg, setMsg] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const handleBookmarkSurah = async () => {
    if (!user || !surah) return;
    try {
      await addBookmarkServer("surah", {
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation
      });
      setMsg("Bookmark saved!");
    } catch {
      setMsg("Failed to save bookmark.");
    }
    setTimeout(() => setMsg(null), 2500);
  };

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
        {user && (
          <button className="btn primary" style={{ marginLeft: 16 }} onClick={handleBookmarkSurah}>Bookmark</button>
        )}
      </div>
      {msg && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ background: '#e6fff2', color: '#06624b', border: '1px solid #b2e5d3', borderRadius: 6, padding: '8px 18px', margin: '10px 0 0 0', fontWeight: 500, textAlign: 'center', minWidth: 0, maxWidth: 260, width: 'auto', boxShadow: '0 2px 8px #b2e5d355', transition: 'opacity 0.3s' }}>{msg}</div>
        </div>
      )}
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
