import React, { useEffect, useState } from "react";
import { getRandomAyah, addBookmarkServer, getBookmarksServer } from "../services/api";
import { Ayah, Bookmark } from "../types/ayah";
import "./DailyAyah.css";

const LOCAL_KEY = "daily_ayah_bookmarks";
const USER_KEY = "user";
const TOKEN_KEY = "token";

const DailyAyah: React.FC = () => {
  const [ayah, setAyah] = useState<Ayah | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [localBookmarks, setLocalBookmarks] = useState<Ayah[]>(() => {
    const v = localStorage.getItem(LOCAL_KEY);
    return v ? JSON.parse(v) : [];
  });
  const [serverBookmarks, setServerBookmarks] = useState<Bookmark[] | null>(null);

  const loadAyah = async () => {
    try {
      setLoading(true);
      const res = await getRandomAyah();
      setAyah(res);
    } catch (err: any) {
      setMsg("Failed to load ayah.");
    } finally {
      setLoading(false);
    }
  };

  const bookmarkLocal = (a: Ayah) => {
    const arr = [a, ...localBookmarks];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
    setLocalBookmarks(arr);
    setMsg("Bookmarked locally.");
  };

  const bookmarkServer = async (a: Ayah) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setMsg("Login to save bookmarks to your account.");
        return;
      }
      await addBookmarkServer("ayah", a, token);
      setMsg("Bookmarked to your account.");
      await loadServerBookmarks();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to save bookmark on server.");
    }
  };

  const loadServerBookmarks = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;
      const res = await getBookmarksServer(token);
      setServerBookmarks(res);
    } catch (err) {
      // ignore silently
    }
  };

  useEffect(() => {
    loadAyah();
    loadServerBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ayah-page">
      <div className="ayah-card">
        <div className="ayah-head">
          <h2>Daily Ayah</h2>
          <div className="ayah-actions">
            <button onClick={loadAyah} className="btn small">{loading ? "..." : "Next Ayah"}</button>
            {ayah && (
              <>
                <button className="btn outline" onClick={() => bookmarkLocal(ayah)}>Bookmark Locally</button>
                <button className="btn primary" onClick={() => bookmarkServer(ayah)}>Save to Account</button>
              </>
            )}
          </div>
        </div>

        {msg && <div className="msg">{msg}</div>}

        {ayah ? (
          <div className="ayah-body">
            <div className="ayah-arabic">{ayah.arabic}</div>
            {ayah.translation && <div className="ayah-translation">{ayah.translation}</div>}
          </div>
        ) : (
          <div className="hint">Loading...</div>
        )}

        <div className="bookmarks-section">
          <h3>Your Local Bookmarks</h3>
          {localBookmarks.length === 0 ? <div className="hint">No local bookmarks yet.</div> : (
            <ul className="bm-list">
              {localBookmarks.map((b, i) => (
                <li key={i}>
                  <div className="bm-arabic">{b.arabic}</div>
                  {b.translation && <div className="bm-trans">{b.translation}</div>}
                </li>
              ))}
            </ul>
          )}

          <h3>Your Server Bookmarks</h3>
          {serverBookmarks === null ? <div className="hint">Login to see server bookmarks.</div> : (
            serverBookmarks.length === 0 ? <div className="hint">No bookmarks in your account.</div> : (
              <ul className="bm-list">
                {serverBookmarks.map((b) => (
                  <li key={b._id}>
                    <div className="bm-arabic">{b.data?.arabic}</div>
                    {b.data?.translation && <div className="bm-trans">{b.data.translation}</div>}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyAyah;
