// src/pages/Tasbih.tsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { saveTasbihCount } from "../services/api";
import "./Tasbih.css";

const LOCAL_KEY = "tasbih_local_count";
const USER_KEY = "user";
const TOKEN_KEY = "token";

const Tasbih: React.FC = () => {
  const [count, setCount] = useState<number>(() => {
    const v = localStorage.getItem(LOCAL_KEY);
    return v ? Number(v) : 0;
  });
  const { user } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, String(count));
  }, [count]);

  const increment = () => setCount((c) => c + 1);
  const reset = () => setCount(0);
  const decrement = () => setCount((c) => Math.max(0, c - 1));

  const handleSave = async () => {
    setMessage(null);
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return;
    try {
      setSaving(true);
      const user = JSON.parse(userJson);
      await saveTasbihCount(user._id || user.id || user.userId, count, token || undefined);
      setMessage("Saved to your account.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to save — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tasbih-page">
      <div className="tasbih-card">
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
        </div>
        <h2 className="tasbih-title">Tasbih Counter</h2>

        <div className="counter-display" aria-live="polite">
          <div className="count-number">{count}</div>
        </div>

        <div className="button-row">
          <button className="btn outline" onClick={decrement} aria-label="decrement">-</button>
          <button className="btn big" onClick={increment} aria-label="increment">+ 1</button>
          <button className="btn outline" onClick={reset} aria-label="reset">Reset</button>
        </div>

        <div className="save-row">
          {user && (
            <button className="btn save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save to Account"}
            </button>
          )}
        </div>

        {message && <div className="msg">{message}</div>}
      </div>
    </div>
  );
};

export default Tasbih;
