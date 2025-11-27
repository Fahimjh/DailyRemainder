import React, { useContext } from "react";
import "./TopBar.css";
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
      <div className="topbar-desktop-root">
        <div className="topbar-desktop-flex" />
        <div className="topbar-title">Al-Mudhakkirah – The Daily Islamic Reminder</div>
        <div className="topbar-desktop-flex topbar-desktop-nav">
          <div className="topbar-desktop-links">
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
        </div>
      </div>
    );
  }

  // Mobile TopBar
  return (
    <div className="topbar-mobile-root">
      <div className="topbar-title topbar-mobile-title">Al-Mudhakkirah – The Daily Islamic Reminder</div>
      <div className="topbar-nav topbar-mobile-nav">
        {user && location.pathname !== '/dashboard' && (
          <Link to="/dashboard" className={`topbar-mobile-link${location.pathname === '/dashboard' ? ' active' : ''}`}>Dashboard</Link>
        )}
        {(!user || location.pathname !== '/') && (
          <Link to="/" className={`topbar-mobile-link${location.pathname === '/' ? ' active' : ''}`}>Home</Link>
        )}
        {!user && (
          <Link to="/login" className={`topbar-mobile-link${location.pathname === '/login' ? ' active' : ''}`}>Login</Link>
        )}
        {user ? (
          <span onClick={handleLogout} className="topbar-logout topbar-mobile-link">Logout</span>
        ) : (
          <Link to="/register" className={`topbar-mobile-link${location.pathname === '/register' ? ' active' : ''}`}>Register</Link>
        )}
      </div>
      <div className="mobile-landscape-msg">
        For best experience, please use landscape mode on your phone.
      </div>
    </div>
  );
}

export default TopBar;
