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
  const [serverBookmarks, setServerBookmarks] = useState<Bookmark[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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

  const bookmarkServer = async (a: Ayah) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setMsg("Login to save bookmarks to your account.");
        return;
      }
      await addBookmarkServer("ayah", a, token);
      setMsg("Bookmark saved!");
      setTimeout(() => setMsg(null), 2500);
      await loadServerBookmarks();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to save bookmark on server.");
      setTimeout(() => setMsg(null), 2500);
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setIsLoggedIn(true);
      loadServerBookmarks();
    } else {
      setIsLoggedIn(false);
    }
    
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
                {isLoggedIn && (
                  <button className="btn outline" onClick={() => bookmarkServer(ayah)}>Bookmark</button>
                )}
              </>
            )}
          </div>
        </div>

        {msg && (
          <div className="msg-container">
            <div className="msg">{msg}</div>
          </div>
        )}

        {ayah ? (
          <div className="ayah-body">
            <div className="ayah-arabic">{ayah.arabic}</div>
            {ayah.translation_bn && (
              <div className="ayah-translation ayah-translation-bn">{ayah.translation_bn}</div>
            )}
            {ayah.reference_bn && (
              <div className="ayah-ref ayah-ref-bn">{ayah.reference_bn.replace(/سورة.*?،/g, '').trim()}</div>
            )}
            {ayah.surah_ar && ayah.number && (
              <div className="ayah-ref ayah-ref-ar">سورة {ayah.surah_ar}، آية {ayah.number}</div>
            )}
          </div>
        ) : (
          <div className="hint">Loading...</div>
        )}

      </div>
    </div>
  );
};

export default DailyAyah;
