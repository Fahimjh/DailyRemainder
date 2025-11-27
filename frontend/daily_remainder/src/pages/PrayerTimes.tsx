import React, { useEffect, useState } from "react";
import { getPrayerTimesByCity } from "../services/api";
import { PrayerResponse, Timings } from "../types/prayer";
import "./PrayerTimes.css";

const DEFAULT_CITY = "Dhaka";
const DEFAULT_COUNTRY = "Bangladesh";

const formatTime = (t: string) => {
  // the API sends times like "05:12 (BST)"; remove bracket part
  return t.split(" ")[0];
};

const TimingRow: React.FC<{ name: string; time: string }> = ({ name, time }) => (
  <div className="timing-row">
    <div className="timing-name">{name}</div>
    <div className="timing-time">{formatTime(time)}</div>
  </div>
);

const PrayerTimes: React.FC = () => {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [timings, setTimings] = useState<Timings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimings = async (c: string, ctr: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = (await getPrayerTimesByCity(c, ctr)) as PrayerResponse;
      if (res?.data?.timings) {
        setTimings(res.data.timings);
      } else {
        setError("No timings returned");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // on first load try current default, and try geolocation if allowed
  useEffect(() => {
    // attempt browser geolocation -> reverse geocode fallback skipped for simplicity
    // if user allows, we'll try to get approximate locality using built-in geolocation + a free reverse geocode API
    // but to keep this simple, we just load default and allow user to change city/country manually.
    fetchTimings(city, country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTimings(city.trim() || DEFAULT_CITY, country.trim() || DEFAULT_COUNTRY);
  };

  return (
    <div className="prayer-page">
      <div className="prayer-card">
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
        </div>
        <h2 className="prayer-title">Prayer Times</h2>

        <form className="prayer-form" onSubmit={onSearch}>
          <div className="form-row">
            <input
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g., Dhaka)"
              aria-label="city"
            />
            <input
              className="input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country (e.g., Bangladesh)"
              aria-label="country"
            />
            <button className="btn" type="submit" aria-label="search">
              {loading ? "Loading..." : "Get Times"}
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        {!timings && !loading && !error && (
          <div className="hint">Enter city + country and press Get Times</div>
        )}

        {timings && (
          <div className="timings">
            <TimingRow name="Fajr" time={timings.Fajr} />
            <TimingRow name="Sunrise" time={timings.Sunrise} />
            <TimingRow name="Dhuhr" time={timings.Dhuhr} />
            <TimingRow name="Asr" time={timings.Asr} />
            <TimingRow name="Maghrib" time={timings.Maghrib || timings.Sunset} />
            <TimingRow name="Isha" time={timings.Isha} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimes;
