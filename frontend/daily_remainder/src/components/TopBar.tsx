import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Custom hook to detect mobile screen
function useIsMobile(maxWidth = 700) {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= maxWidth);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= maxWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [maxWidth]);
  return isMobile;
}

const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Desktop TopBar (PC)
  if (!isMobile) {
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
            {user && location.pathname !== '/dashboard' && (
              <Link to="/dashboard" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/dashboard' ? 'underline' : 'none', fontSize: 18 }}>Dashboard</Link>
            )}
            {(!user || location.pathname !== '/') && (
              <Link to="/" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/' ? 'underline' : 'none', fontSize: 18 }}>Home</Link>
            )}
            {!user && (
              <Link to="/login" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/login' ? 'underline' : 'none', fontSize: 18 }}>Login</Link>
            )}
            {user ? (
              <span onClick={handleLogout} style={{ color: '#069077', fontWeight: 600, cursor: 'pointer', fontSize: 18 }}>Logout</span>
            ) : (
              <Link to="/register" style={{ color: '#069077', fontWeight: 600, textDecoration: location.pathname === '/register' ? 'underline' : 'none', fontSize: 18 }}>Register</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile TopBar
  return (
    <div className="topbar-mobile-root">
      <div className="topbar-title">Al-Mudhakkirah – The Daily Islamic Reminder</div>
      <div className="topbar-nav">
        {user && location.pathname !== '/dashboard' && (
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        )}
        {(!user || location.pathname !== '/') && (
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        )}
        {!user && (
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
        )}
        {user ? (
          <span onClick={handleLogout} className="topbar-logout">Logout</span>
        ) : (
          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link>
        )}
      </div>
      <div className="mobile-landscape-msg">
        For best experience, please use landscape mode on your phone.
      </div>
    </div>
  );
}

export default TopBar;
