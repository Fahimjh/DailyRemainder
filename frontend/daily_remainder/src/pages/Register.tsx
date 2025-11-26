import React, { useState, useContext } from "react";
import "./Register.css";
import API from "../services/apiInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BackHomeButton from "../components/BackHomeButton";

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
    <div className="container form-wrap">
      <BackHomeButton />
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
