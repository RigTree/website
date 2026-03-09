import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, LogOut, Pencil } from 'lucide-react';
import useStore from '../../store/useStore';
import { getAuthUrl } from '../../lib/constants';

export default function Header() {
  const { isAuthenticated, user, logout } = useStore();

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

        {/* Nav */}
        <nav className="flex items-center gap-2">
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
