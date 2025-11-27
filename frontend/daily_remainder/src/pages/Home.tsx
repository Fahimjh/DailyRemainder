import React, { useContext } from "react";
import Card from "../components/Card";
import "./Home.css";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home: React.FC = () => {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <>
      <main className="container home-grid">
        <Card title="Prayer Times" subtitle="Local prayer schedule" onClick={() => nav("/prayer")} />
        <Card title="Daily Ayah" subtitle="Random Ayah & translation" onClick={() => nav("/ayah")} />
        <Card title="Quran" subtitle="Browse Quran by Juz/পারা" onClick={() => nav("/quran")} />
        <Card title="Surah Explorer" subtitle="Browse/Explore Surah" onClick={() => nav("/surahs")} />
        <Card title="Tasbih" subtitle="Digital tasbih counter" onClick={() => nav("/tasbih")} />
        <Card title="Qibla" subtitle="Find Qibla direction" onClick={() => nav("/qibla")} />
        <Card title="Hijri Calendar" subtitle="Today's Hijri date" onClick={() => nav("/calendar")} />
      </main>
      <div style={{ width: '100%', textAlign: 'center', margin: '32px 0 12px 0', color: '#044f46', fontWeight: 500, fontSize: 16 }}>
        © 2025 Al-Mudhakkirah – The Daily Islamic Reminder. All rights reserved By Fahimjh.
      </div>
      {!user && (
        <div className="home-login-prompt">
          <span>Log in to bookmark your favorite Ayah, Juz, and Surah for quick access anytime!</span>
        </div>
      )}
    </>
  );
};

export default Home;
