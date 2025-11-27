import React, { useEffect, useState } from "react";
import API from "../services/apiInstance";
import Loader from "../components/Loader";
import "./CalendarHijri.css";

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
      <h2 className="calendar-title">Hijri & Gregorian Calendar</h2>
      <div className="calendar-header-outer">
        <div className="calendar-header">
          <button className="btn outline" onClick={handlePrev}>Previous</button>
          <div className="calendar-month-info">
            <div className="calendar-hijri-ar">{hijriMonthAr}</div>
            <div className="calendar-hijri-en">{hijriMonthEn}</div>
            <div className="calendar-gregorian">{monthNames[month - 1]} {year}</div>
          </div>
          <button className="btn outline" onClick={handleNext}>Next</button>
        </div>
      </div>
      <div className="calendar-table-wrapper">
        <table className="calendar-table">
          <thead>
            <tr>
              {getHijriWeekdays(days).map((d, i) => (
                <th key={i} className="calendar-th">
                  <div className="calendar-th-ar">{d.ar}</div>
                  <div className="calendar-th-en">{d.en}</div>
                  <div className="calendar-th-enstatic">{d.enStatic}</div>
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
                      className={isToday ? 'calendar-today calendar-td' : 'calendar-td'}
                    >
                      {cell && (
                        <>
                          <div className="calendar-hijri-day">{cell.hijri.day}</div>
                          <div className="calendar-gregorian-day">{cell.gregorian.day}</div>
                          <div className="calendar-hijri-date">{cell.hijri.date}</div>
                          <div className="calendar-gregorian-date">{cell.gregorian.date}</div>
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
