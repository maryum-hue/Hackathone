import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import '../Pages/styles.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userEmail');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand">
          <Link to="/dashboard" className="logo-link">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path 
                  fill="#2196f3" 
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-primary">Edu</span>
              <span className="logo-secondary">Manage</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Dashboard
              </Link>
              
              <Link to="/form" className={`nav-link ${isActive('/form')}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                Register Student
              </Link>

              {/* Student Card Link (only shown if user is a student) */}
              <div className="student-card-nav">
                <Link to="/my-card" className={`nav-link blue-btn ${isActive('/my-card')}`}>
                  <svg className="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="white" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-8 6H8v1h3c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-1v1H8v-1H6v-2h4v-1H7c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1h1V8h2v1h2v2zm4 6.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5zm1-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-4.5z"/>
                  </svg>
                  My Student Card
                </Link>
              </div>
            </>
          ) : (
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <svg className="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Login
            </Link>
          )}
        </div>

        {/* User Profile & Mobile Menu Toggle */}
        <div className="navbar-right">
          {user ? (
            <>
              <div className="user-profile">
                <div className="user-avatar">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <p className="user-name">{user.email}</p>
                  <p className="user-status">Online</p>
                </div>
              </div>
              
              <button onClick={handleLogout} className="logout-btn">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="login-btn">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M10 17l5-5-5-5v10z"/>
              </svg>
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="mobile-user-name">{user.email}</p>
                  <p className="mobile-user-status">Online</p>
                </div>
              </div>

              <Link 
                to="/dashboard" 
                className={`mobile-nav-link ${isActive('/dashboard')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="mobile-nav-icon" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Dashboard
              </Link>

              <Link 
                to="/form" 
                className={`mobile-nav-link ${isActive('/form')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="mobile-nav-icon" viewBox="0 0 24 24">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                Register Student
              </Link>

              <Link 
                to="/my-card" 
                className={`mobile-nav-link ${isActive('/my-card')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="mobile-nav-icon" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-8 6H8v1h3c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-1v1H8v-1H6v-2h4v-1H7c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1h1V8h2v1h2v2zm4 6.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5zm1-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-4.5z"/>
                </svg>
                My Student Card
              </Link>

              <button 
                onClick={handleLogout} 
                className="mobile-logout-btn"
              >
                <svg className="mobile-nav-icon" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="mobile-nav-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;