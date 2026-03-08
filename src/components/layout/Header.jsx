import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, LogOut, Pencil } from 'lucide-react';
import useStore from '../../store/useStore';
import { getAuthUrl } from '../../lib/constants';

export default function Header() {
  const { isAuthenticated, user, logout } = useStore();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: -10 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500"
          >
            <Monitor className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">
            Rig<span className="gradient-text">Tree</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/editor" className="btn-ghost">
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Editor</span>
              </Link>
              <Link to={`/${user?.login}`} className="btn-ghost">
                <img
                  src={user?.avatar_url}
                  alt={user?.login}
                  className="h-5 w-5 rounded-full ring-1 ring-white/10"
                />
                <span className="hidden sm:inline">{user?.login}</span>
              </Link>
              <button onClick={logout} className="btn-ghost text-zinc-500 hover:text-red-400">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <a href={getAuthUrl()} className="btn-primary text-xs">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
