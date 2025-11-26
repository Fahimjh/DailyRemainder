import "./JuzDetail.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/apiInstance";
import BackHomeButton from "../components/BackHomeButton";

interface Ayah {
  number: number;
  text: string;
  surah: { number: number; name: string; englishName: string };
}

const JuzDetail: React.FC = () => {
  const { number } = useParams();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [juzInfo, setJuzInfo] = useState<any>(null);

  useEffect(() => {
    if (!number) return;
    setLoading(true);
    API.get(`/quran/juz/${number}`)
      .then(res => {
        setJuzInfo(res.data);
        setAyahs(res.data.ayahs || []);
      })
      .catch(() => setAyahs([]))
      .finally(() => setLoading(false));
  }, [number]);

  if (loading) return <div>Loading...</div>;
  if (!juzInfo) return <div>Juz not found.</div>;

  return (
    <div className="container">
      <h2>Juz {number}</h2>
      <div style={{ marginTop: 24 }}>
        {ayahs.map(a => (
          <div key={a.number} className="juz-ayah">
            <div className="juz-ayah-arabic">{a.text}</div>
            <div className="juz-ayah-meta">Surah {a.surah.englishName} ({a.surah.name}) - Ayah {a.number}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JuzDetail;
