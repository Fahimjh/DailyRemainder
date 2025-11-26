import React, { useEffect, useState } from "react";
import API from "../services/apiInstance";
import Loader from "../components/Loader";
import "./CalendarHijri.css";
import BackHomeButton from "../components/BackHomeButton";

const dayNames = [
  { en: "Sun", ar: "الأحد" },
  { en: "Mon", ar: "الإثنين" },
  { en: "Tue", ar: "الثلاثاء" },
  { en: "Wed", ar: "الأربعاء" },
  { en: "Thu", ar: "الخميس" },
  { en: "Fri", ar: "الجمعة" },
  { en: "Sat", ar: "السبت" },
];

// Get Hijri weekday names (Arabic and transliteration) for the week from the API data if available
const getHijriWeekdays = (days: any[]) => {
  // Find the first 7 unique weekdays in order from the API data
  const week: {ar: string, en: string, enStatic: string}[] = [];
  const seen: Record<string, boolean> = {};
  for (let i = 0; i < days.length && week.length < 7; i++) {
    const wd = days[i]?.hijri?.weekday;
    const gd = days[i]?.gregorian?.weekday;
    if (wd && !seen[wd.ar]) {
      // Map to static English name for column alignment
      const staticEn = dayNames.find(d => d.ar === wd.ar)?.en || gd?.en || "";
      week.push({ ar: wd.ar, en: wd.en, enStatic: staticEn });
      seen[wd.ar] = true;
    }
  }
  // Fallback to static if not enough data
  if (week.length < 7) {
    return dayNames.map(d => ({ ar: d.ar, en: d.en, enStatic: d.en }));
  }
  return week;
};

const monthNames = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const CalendarHijri: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get Hijri month name (Arabic and English) from first day if available
  const hijriMonthAr = days[0]?.hijri?.month?.ar || "";
  const hijriMonthEn = days[0]?.hijri?.month?.en || "";

  const fetchMonth = async (m: number, y: number) => {
    setLoading(true);
    try {
      const res = await API.get(`/date/month?month=${m}&year=${y}`);
      setDays(res.data.days);
    } catch {
      alert("Could not fetch Hijri month calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonth(month, year);
  }, [month, year]);

  const handlePrev = () => {
    let m = month - 1, y = year;
    if (m < 1) { m = 12; y -= 1; }
    setMonth(m); setYear(y);
  };
  const handleNext = () => {
    let m = month + 1, y = year;
    if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y);
  };

  // Prepare grid: find first day of week for the month
  const firstDayIdx = days.length > 0 ? new Date(days[0].gregorian.date.split('-').reverse().join('-')).getDay() : 0;
  const grid: any[] = [];
  for (let i = 0; i < firstDayIdx; i++) grid.push(null); // empty cells
  days.forEach(d => grid.push(d));
  while (grid.length % 7 !== 0) grid.push(null);

  if (loading) return <Loader />;

  return (
    <div className="calendar-page">
      <h2 style={{ textAlign: 'center' }}>Hijri & Gregorian Calendar</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18, alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', width: '100%' }}>
          <button className="btn outline" onClick={handlePrev}>Previous</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 17, color: '#1a7f37' }}>{hijriMonthAr}</div>
            <div style={{ fontWeight: 500, fontSize: 14, color: '#888' }}>{hijriMonthEn}</div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{monthNames[month - 1]} {year}</div>
          </div>
          <button className="btn outline" onClick={handleNext}>Next</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', background: '#fff' }}>
          <thead>
            <tr>
              {getHijriWeekdays(days).map((d, i) => (
                <th key={i} style={{ padding: 6, fontWeight: 600 }}>
                  <div style={{ fontSize: 15 }}>{d.ar}</div>
                  <div style={{ fontSize: 13, color: '#1a7f37' }}>{d.en}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{d.enStatic}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: grid.length / 7 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {grid.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell, colIdx) => {
                  // Highlight today (fix DD-MM-YYYY parsing)
                  let isToday = false;
                  if (cell) {
                    const today = new Date();
                    const [gd, gm, gy] = cell.gregorian.date.split('-').map(Number); // DD-MM-YYYY
                    isToday =
                      gy === today.getFullYear() &&
                      gm === today.getMonth() + 1 &&
                      gd === today.getDate();
                  }
                  return (
                    <td
                      key={colIdx}
                      style={{ padding: 8, minWidth: 60, height: 60, verticalAlign: 'top', background: isToday ? '#e6f7e6' : undefined, border: isToday ? '2px solid #1a7f37' : undefined, borderRadius: isToday ? 8 : undefined }}
                      className={isToday ? 'calendar-today' : ''}
                    >
                      {cell && (
                        <>
                          <div style={{ fontWeight: 600 }}>{cell.hijri.day}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{cell.gregorian.day}</div>
                          <div style={{ fontSize: 12, marginTop: 2 }}>{cell.hijri.date}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{cell.gregorian.date}</div>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarHijri;
