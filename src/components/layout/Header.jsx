import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, LogOut, Pencil, Users, Search, X } from 'lucide-react';
import useStore from '../../store/useStore';
import { getAuthUrl } from '../../lib/constants';
import { GitHubService } from '../../lib/github';

const svc = new GitHubService(null);

export default function Header() {
  const { isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const [allUsers, setAllUsers]     = useState([]);
  const [activeIdx, setActiveIdx]   = useState(-1);
  const inputRef = useRef(null);

  // load all profile names once when search opens
  useEffect(() => {
    if (!searchOpen || allUsers.length > 0) return;
    svc.listProfiles().then(setAllUsers).catch(() => {});
  }, [searchOpen]);

  const suggestions = useMemo(() => {
    const q = query.trim().replace(/^@/, '').toLowerCase();
    if (!q) return allUsers.slice(0, 8);
    return allUsers.filter((u) => u.toLowerCase().includes(q)).slice(0, 8);
  }, [query, allUsers]);

  const openSearch = () => {
    setSearchOpen(true);
    setActiveIdx(-1);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    setActiveIdx(-1);
  };

  const goToUser = (username) => {
    navigate(`/${username}`);
    closeSearch();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      goToUser(suggestions[activeIdx]);
      return;
    }
    const trimmed = query.trim().replace(/^@/, '');
    if (!trimmed) return;
    goToUser(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { closeSearch(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    }
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-hover)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
            }}
          >
            <Cpu size={15} style={{ color: 'var(--text-secondary)' }} />
          </motion.div>
          <span
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Rig<span style={{ color: 'var(--text-muted)' }}>Tree</span>
          </span>
        </Link>

        {/* Search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                paddingTop: '6rem',
                padding: '6rem 1rem 0',
              }}
              onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
            >
              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', maxWidth: 480 }}
              >
                {/* Input */}
                <form
                  onSubmit={handleSearch}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: suggestions.length > 0 ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
                    padding: '0.25rem 0.75rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                  }}
                >
                  <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search username…"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      padding: '0.85rem 0',
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex' }}
                  >
                    <X size={16} />
                  </button>
                </form>

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-hover)',
                    borderTop: '1px solid var(--border-default)',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    overflow: 'hidden',
                  }}>
                    {suggestions.map((username, idx) => {
                      const isActive = idx === activeIdx;
                      return (
                        <button
                          key={username}
                          type="button"
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => goToUser(username)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.6rem 1rem',
                            background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                            border: 'none',
                            borderTop: idx > 0 ? '1px solid var(--border-default)' : 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.1s',
                          }}
                        >
                          <img
                            src={`https://avatars.githubusercontent.com/${username}?s=40`}
                            alt={username}
                            style={{
                              width: 28, height: 28, borderRadius: '50%',
                              border: '1px solid var(--border-hover)',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <p style={{
                              fontSize: '0.875rem', fontWeight: 500,
                              color: 'var(--text-primary)',
                              fontFamily: '"JetBrains Mono", monospace',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {/* Highlight matching letters */}
                              {(() => {
                                const q = query.trim().replace(/^@/, '').toLowerCase();
                                if (!q) return username;
                                const i = username.toLowerCase().indexOf(q);
                                if (i === -1) return username;
                                return (
                                  <>
                                    {username.slice(0, i)}
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                                      {username.slice(i, i + q.length)}
                                    </span>
                                    {username.slice(i + q.length)}
                                  </>
                                );
                              })()}
                            </p>
                          </div>
                          {isActive && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>↵</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={openSearch}
            className="btn-ghost"
            style={{ fontSize: '0.8rem' }}
            aria-label="Search users"
          >
            <Search size={14} />
          </button>

          <Link to="/browse" className="btn-ghost" style={{ fontSize: '0.8rem' }}>
            <Users size={13} />
            <span className="hidden sm:inline">Browse</span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/editor" className="btn-ghost">
                <Pencil size={14} />
                <span className="hidden sm:inline">Editor</span>
              </Link>
              <Link to={`/${user?.login}`} className="btn-ghost">
                <img
                  src={user?.avatar_url}
                  alt={user?.login}
                  style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--border-hover)' }}
                />
                <span className="hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
                  {user?.login}
                </span>
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
            <a href={getAuthUrl()} className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.8rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

