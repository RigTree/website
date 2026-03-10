import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Download, Users, Sun, Moon, Home, Menu, X } from 'lucide-react';
import useStore from '../../store/useStore';
import { getAuthUrl } from '../../lib/constants';

export default function Header() {
  const { isAuthenticated, user, logout } = useStore();

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.55rem' }}
        >
          <svg
            width="20" height="22" viewBox="0 0 20 22" fill="none"
            aria-hidden="true"
            style={{ color: 'var(--accent)', flexShrink: 0, filter: 'drop-shadow(0 0 6px var(--glow-purple))' }}
          >
            <circle cx="10" cy="3" r="2.5" fill="currentColor" />
            <circle cx="3" cy="18.5" r="2" fill="currentColor" />
            <circle cx="17" cy="18.5" r="2" fill="currentColor" />
            <circle cx="10" cy="11.5" r="1.5" fill="currentColor" />
            <line x1="10" y1="5.5" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="13" x2="3" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="13" x2="17" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            RigTree
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <Link to="/" className="btn-ghost" style={{ fontSize: '0.8rem' }}>
            <Home size={13} />
            <span>Home</span>
          </Link>

          <Link to="/browse" className="btn-ghost" style={{ fontSize: '0.8rem' }}>
            <Users size={13} />
            <span>Browse</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/editor" className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                <Download size={14} />
                <span>Import</span>
              </Link>
              <Link to={`/${user?.login}`} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                <img
                  src={user?.avatar_url}
                  alt={user?.login}
                  style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--border-hover)' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{user?.login}</span>
              </Link>
              <button
                onClick={logout}
                className="btn-ghost"
                style={{ color: 'var(--text-muted)' }}
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <a href={getAuthUrl()} className="btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in
            </a>
          )}
        </nav>

        {/* Mobile: right side */}
        <div className="flex sm:hidden items-center gap-1" ref={menuRef}>
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '0.45rem 0.6rem' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {isAuthenticated && (
            <img
              src={user?.avatar_url}
              alt={user?.login}
              style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-hover)', flexShrink: 0 }}
            />
          )}

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="btn-ghost"
            style={{ padding: '0.45rem 0.6rem' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '1rem',
                width: '200px',
                background: 'rgba(10,10,20,0.82)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 20px 60px rgba(0,0,0,0.5)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.125rem',
                zIndex: 100,
              }}
            >
              <Link to="/" className="btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.875rem', width: '100%' }}
                onClick={() => setMenuOpen(false)}>
                <Home size={14} /> Home
              </Link>
              <Link to="/browse" className="btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.875rem', width: '100%' }}
                onClick={() => setMenuOpen(false)}>
                <Users size={14} /> Browse
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/editor" className="btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.875rem', width: '100%' }}
                    onClick={() => setMenuOpen(false)}>
                    <Download size={14} /> Import
                  </Link>
                  <Link to={`/${user?.login}`} className="btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.875rem', width: '100%' }}
                    onClick={() => setMenuOpen(false)}>
                    <Users size={14} /> My Profile
                  </Link>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0.5rem' }} />
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', fontSize: '0.875rem', width: '100%', color: '#f87171' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <a href={getAuthUrl()} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.82rem', marginTop: '0.25rem' }}
                  onClick={() => setMenuOpen(false)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </a>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}


