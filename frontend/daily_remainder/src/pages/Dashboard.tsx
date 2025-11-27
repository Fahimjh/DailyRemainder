
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getBookmarksServer } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeMode, setRemoveMode] = useState(false);
  const [selected, setSelected] = useState<{ayah: Set<number>, juz: Set<number>, surah: Set<number>}>({ ayah: new Set(), juz: new Set(), surah: new Set() });
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await getBookmarksServer(token || undefined);
        setBookmarks(res || []);
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [user]);

  const ayahBookmarks = bookmarks.filter(b => b.type === "ayah");
  const juzBookmarks = bookmarks.filter(b => b.type === "juz");
  const surahBookmarks = bookmarks.filter(b => b.type === "surah");

  // Helper to get unique key for each bookmark
  const getKey = (b: any, i: number, type: string) => b._id || `${type}-${b.data?.number || ''}-${i}`;

  // Remove selected bookmarks
  const handleRemove = async () => {
    const newAyahs = ayahBookmarks.filter((_, i) => !selected.ayah.has(i));
    const newJuz = juzBookmarks.filter((_, i) => !selected.juz.has(i));
    const newSurah = surahBookmarks.filter((_, i) => !selected.surah.has(i));
    // Merge back to bookmarks array
    const newBookmarks = [
      ...newAyahs.map(a => ({ ...a, type: "ayah" })),
      ...newJuz.map(j => ({ ...j, type: "juz" })),
      ...newSurah.map(s => ({ ...s, type: "surah" })),
    ];
    setBookmarks(newBookmarks);
    setRemoveMode(false);
    setSelected({ ayah: new Set(), juz: new Set(), surah: new Set() });
    // Save to backend using API.post
    try {
      const API = (await import('../services/apiInstance')).default;
      await API.post('/auth/updateBookmarks', { userId: user?._id, bookmarks: newBookmarks });
      setUser && setUser({ ...(user as any), bookmarks: newBookmarks });
    } catch {
      // ignore
    }
  };

  const toggleSelect = (type: 'ayah' | 'juz' | 'surah', idx: number) => {
    setSelected(prev => {
      const set = new Set(prev[type]);
      if (set.has(idx)) set.delete(idx); else set.add(idx);
      return { ...prev, [type]: set };
    });
  };

  return (
    <>
      <div className="container" style={{ marginTop: 32 }}>
        <div className="dashboard-page">
          <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Dashboard</h2>
          <p style={{ textAlign: 'center', marginBottom: 24 }}>
            Welcome to Al-Mudhakkirah – The Daily Islamic Reminder dashboard.
          </p>
          {bookmarks.length > 0 && (
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <button className="btn outline" onClick={() => setRemoveMode(r => !r)}>
                {removeMode ? 'Cancel Remove' : 'Remove Bookmarks'}
              </button>
              {removeMode && (
                <button className="btn" style={{ marginLeft: 12 }} onClick={handleRemove} disabled={selected.ayah.size + selected.juz.size + selected.surah.size === 0}>
                  Remove Selected
                </button>
              )}
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', margin: '24px 0' }}>Loading bookmarks...</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
              <div style={{ minWidth: 220, flex: 1 }}>
                <h3 style={{ textAlign: 'center', marginBottom: 10 }}>Bookmarked Ayahs</h3>
                {ayahBookmarks.length === 0 ? <div className="hint" style={{ textAlign: 'center' }}>No ayah bookmarks.</div> : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {ayahBookmarks.map((b, i) => (
                      <li key={getKey(b, i, 'ayah')} style={{ marginBottom: 12, background: '#f8f8f8', borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {removeMode && (
                          <input type="checkbox" checked={selected.ayah.has(i)} onChange={() => toggleSelect('ayah', i)} style={{ position: 'absolute', left: 8, top: 8 }} />
                        )}
                        <div style={{ fontWeight: 500, color: '#222', marginBottom: 4, direction: 'rtl', textAlign: 'right', width: '100%' }}>{b.data?.arabic}</div>
                        {b.data?.translation_bn && <div style={{ color: '#06624b', fontSize: 15, textAlign: 'center', width: '100%' }}>{b.data.translation_bn}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ minWidth: 180, flex: 1 }}>
                <h3 style={{ textAlign: 'center', marginBottom: 10 }}>Bookmarked Juz</h3>
                {juzBookmarks.length === 0 ? <div className="hint" style={{ textAlign: 'center' }}>No juz bookmarks.</div> : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {juzBookmarks.map((b, i) => (
                      <li key={getKey(b, i, 'juz')} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {removeMode && (
                          <input type="checkbox" checked={selected.juz.has(i)} onChange={() => toggleSelect('juz', i)} style={{ position: 'absolute', left: 8, top: 8 }} />
                        )}
                        <button style={{ background: 'none', border: 'none', color: '#06624b', fontWeight: 600, cursor: 'pointer', fontSize: 16, textDecoration: 'underline', textAlign: 'center' }}
                          onClick={() => navigate(`/quran?juz=${b.data?.number}`)}>
                          {b.data?.name || `Juz ${b.data?.number}`}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ minWidth: 180, flex: 1 }}>
                <h3 style={{ textAlign: 'center', marginBottom: 10 }}>Bookmarked Surahs</h3>
                {surahBookmarks.length === 0 ? <div className="hint" style={{ textAlign: 'center' }}>No surah bookmarks.</div> : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {surahBookmarks.map((b, i) => (
                      <li key={getKey(b, i, 'surah')} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {removeMode && (
                          <input type="checkbox" checked={selected.surah.has(i)} onChange={() => toggleSelect('surah', i)} style={{ position: 'absolute', left: 8, top: 8 }} />
                        )}
                        <button style={{ background: 'none', border: 'none', color: '#06624b', fontWeight: 600, cursor: 'pointer', fontSize: 16, textDecoration: 'underline', textAlign: 'center', display: 'block' }}
                          onClick={() => navigate(`/surahs?num=${b.data?.number}`)}>
                          <span style={{ display: 'block', direction: 'rtl', textAlign: 'right', fontWeight: 600 }}>
                            {b.data?.name || `Surah ${b.data?.number}`}
                          </span>
                          <span style={{ display: 'block', direction: 'ltr', textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#222' }}>
                            {b.data?.englishName || b.data?.englishNameTranslation || b.data?.transliteration || `Surah ${b.data?.number}`}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ width: '100%', textAlign: 'center', margin: '32px 0 12px 0', color: '#044f46', fontWeight: 500, fontSize: 16 }}>
        © 2025 Al-Mudhakkirah – The Daily Islamic Reminder. All rights reserved By Fahimjh.
      </div>
    </>
  );
};

export default Dashboard;
