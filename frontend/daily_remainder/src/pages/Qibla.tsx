import React, { useEffect, useState } from "react";
import BackHomeButton from "../components/BackHomeButton";

// Kaaba coords
const KAABA = { lat: 21.422487, lon: 39.826206 };

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

// Bearing from lat1/lon1 to Kaaba
function bearingToKaaba(lat: number, lon: number) {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lon - lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360; // degrees clockwise from north
}

const Qibla: React.FC = () => {
  const [bearing, setBearing] = useState<number | null>(null);
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p) => {
      const lat = p.coords.latitude;
      const lon = p.coords.longitude;
      setPos({ lat, lon });
      setBearing(bearingToKaaba(lat, lon));
    }, () => alert("Unable to get location. Allow location and refresh."));
  }, []);

  return (
    <div className="container">
      <BackHomeButton />
      <h2>Qibla Direction</h2>
      <div className="card big qibla-card">
        {pos && bearing !== null ? (
          <>
            <div>Your location: {pos.lat.toFixed(4)}, {pos.lon.toFixed(4)}</div>
            <div>Qibla Bearing (° from North): <strong>{bearing.toFixed(1)}°</strong></div>
            <div className="compass">
              <div className="needle" style={{ transform: `rotate(${bearing}deg)` }} />
              <div className="north">N</div>
            </div>
          </>
        ) : (
          <div>Please allow location access</div>
        )}
      </div>
    </div>
  );
};

export default Qibla;
