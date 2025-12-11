import React, { useState, useContext } from "react";
import API from "../services/apiInstance";
import "./AuthCard.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      // Immediately log in after registration
      const loginRes = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", loginRes.data.token);
      setUser(loginRes.data.user);
      nav("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <div className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card auth-card">
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Register</h2>
          <form onSubmit={submit} className="form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            <button type="submit" className="btn" style={{ marginTop: 8, padding: '12px 0', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>Register</button>
          </form>
        </div>
      </div>
      <div style={{ width: '100%', textAlign: 'center', margin: '32px 0 12px 0', color: '#044f46', fontWeight: 500, fontSize: 20 }}>
        © 2025 Al-Mudhakkirah – The Daily Islamic Reminder. All rights reserved By Fahimjh.
      </div>
    </>
  );
};

export default Register;
