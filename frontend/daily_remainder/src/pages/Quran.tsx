

import React, { useEffect, useState } from "react";
import API from "../services/apiInstance";
import "./Quran.css";
import BackHomeButton from "../components/BackHomeButton";

interface Ayah {
  number: number;
  text: string;
  surah: { number: number; name: string; englishName: string };
  bangla?: string;
}

const TOTAL_JUZ = 30;

const Quran: React.FC = () => {
  const [juz, setJuz] = useState<number>(1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [juzInfo, setJuzInfo] = useState<any>(null);

  const fetchJuz = async (juzNum: number) => {
    setLoading(true);
    try {
      const res = await API.get(`/quran/juz/${juzNum}`);
      setJuzInfo(res.data);
      setAyahs(res.data.ayahs || []);
    } catch {
      setJuzInfo(null);
      setAyahs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJuz(juz);
  }, [juz]);

  const handlePrev = () => {
    if (juz > 1) setJuz(juz - 1);
  };
  const handleNext = () => {
    if (juz < TOTAL_JUZ) setJuz(juz + 1);
  };

  return (
    <div className="container">
      <BackHomeButton />
      <h2>Quran - Juz {juz}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn outline" onClick={handlePrev} disabled={juz === 1}>Previous Juz</button>
        <button className="btn outline" onClick={handleNext} disabled={juz === TOTAL_JUZ}>Next Juz</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : !juzInfo ? (
        <div>Juz not found.</div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {ayahs.map(a => (
            <div key={a.number} className="juz-ayah">
              <div className="juz-ayah-arabic">{a.text}</div>
              {a.bangla && (
                <div className="ayah-translation ayah-translation-bn" style={{ marginBottom: 8 }}>{a.bangla}</div>
              )}
              <div className="juz-ayah-meta">Surah {a.surah.englishName} ({a.surah.name}) - Ayah {a.number}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quran;
