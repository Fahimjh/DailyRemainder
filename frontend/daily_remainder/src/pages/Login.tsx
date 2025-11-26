import React, { useState, useContext } from "react";
import API from "../services/apiInstance";
import "./AuthCard.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      nav("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card auth-card">
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
          <form onSubmit={submit} className="form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            <button type="submit" className="btn" style={{ marginTop: 8, padding: '12px 0', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>Login</button>
          </form>
        </div>
      </div>
      <div style={{ width: '100%', textAlign: 'center', margin: '32px 0 12px 0', color: '#044f46', fontWeight: 500, fontSize: 20 }}>
        © 2025 Al-Mudhakkirah – The Daily Islamic Reminder. All rights reserved By Fahimjh.
      </div>
    </>
  );
};

export default Login;
