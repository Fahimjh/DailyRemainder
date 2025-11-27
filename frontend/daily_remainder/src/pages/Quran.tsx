import React, { useEffect, useState, useContext } from "react";
import API from "../services/apiInstance";
import { addBookmarkServer } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import "./Quran.css";


const TOTAL_JUZ = 30;

const Quran: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJuz = Number(searchParams.get('juz')) || 1;
  const [juz, setJuz] = useState<number>(initialJuz);
  const [loading, setLoading] = useState(false);
  const [juzInfo, setJuzInfo] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const handleBookmarkJuz = async () => {
    if (!user) return;
    try {
      await addBookmarkServer("juz", { number: juz, name: `Juz ${juz}` });
      setMsg("Bookmark saved!");
    } catch {
      setMsg("Failed to save bookmark.");
    }
    setTimeout(() => setMsg(null), 2500);
  };

  const fetchJuz = async (juzNum: number) => {
    setLoading(true);
    try {
      const res = await API.get(`/quran/juz/${juzNum}`);
      setJuzInfo(res.data);
    } catch {
      setJuzInfo(null);
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
      <h2>Quran - Juz {juz}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn outline" onClick={handlePrev} disabled={juz === 1}>Previous Juz</button>
        <button className="btn outline" onClick={handleNext} disabled={juz === TOTAL_JUZ}>Next Juz</button>
        {user && (
          <button className="btn primary" style={{ marginLeft: 16 }} onClick={handleBookmarkJuz}>Bookmark</button>
        )}
      </div>
      {msg && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ background: '#e6fff2', color: '#06624b', border: '1px solid #b2e5d3', borderRadius: 6, padding: '8px 18px', margin: '10px 0 0 0', fontWeight: 500, textAlign: 'center', minWidth: 0, maxWidth: 260, width: 'auto', boxShadow: '0 2px 8px #b2e5d355', transition: 'opacity 0.3s' }}>{msg}</div>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : !juzInfo ? (
        <div>Juz not found.</div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {/* Display Juz details here, e.g., summary or metadata if needed */}
        </div>
      )}
    </div>
  );
};

export default Quran;
