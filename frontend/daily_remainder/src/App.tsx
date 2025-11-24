import Header from "./components/Header";
import Card from "./components/Card";
import "./App.css";

function App() {
  return (
    <>
      <Header />

      <div className="grid">
        <Card title="Prayer Times" />
        <Card title="Daily Dua" />
        <Card title="Quran Surahs" />
        <Card title="Hadith" />
        <Card title="Tasbih Counter" />
        <Card title="Qibla Direction" />
      </div>
    </>
  );
}

export default App;
