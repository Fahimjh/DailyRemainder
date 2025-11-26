import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopBar from "./components/TopBar";
import "./AppBackground.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DailyAyah from "./pages/DailyAyah";
import Quran from "./pages/Quran";
import PrayerTimes from "./pages/PrayerTimes";
import Tasbih from "./pages/Tasbih";
import Qibla from "./pages/Qibla";
import CalendarHijri from "./pages/CalendarHijri";
import SurahExplorer from "./pages/SurahExplorer";
import Bookmarks from "./pages/Bookmarks";
import ProtectedRoute from "./components/ProtectedRoute";
import JuzDetail from "./pages/JuzDetail";
          <Route path="/quran/juz/:number" element={<JuzDetail />} />



const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ayah" element={<DailyAyah />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/prayer" element={<PrayerTimes />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/calendar" element={<CalendarHijri />} />
          <Route path="/surahs" element={<SurahExplorer />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};


export default App;
