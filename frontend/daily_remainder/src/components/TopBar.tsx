import React from "react";
import { Link, useLocation } from "react-router-dom";

const TopBar: React.FC = () => {
  const location = useLocation();
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 0 24px 0',
      minHeight: 60,
      gap: 0,
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      <div style={{ flex: 1 }} />
      <div style={{
        fontWeight: 700,
        fontSize: '2.2rem',
        letterSpacing: 1,
        textAlign: 'center',
        lineHeight: 1.1,
      }}>
        Al-Mudhakkirah – The Daily Islamic Reminder
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ minWidth: 260, textAlign: 'right', marginRight: 48, display: 'flex', gap: 24, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/' ? 'underline' : 'none', fontSize: 18 }}>Home</Link>
          <Link to="/login" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/login' ? 'underline' : 'none', fontSize: 18 }}>Login</Link>
          <Link to="/register" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/register' ? 'underline' : 'none', fontSize: 18 }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
