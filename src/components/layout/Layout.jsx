import { useEffect, useState } from 'react';
import Header from './Header';
import { GITHUB_API, REPO_OWNER, REPO_NAME } from '../../lib/constants';

export default function Layout({ children }) {
  const [commitSha, setCommitSha] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCommit() {
      try {
        const res = await fetch(
          `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/commits/main`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.sha) {
          setCommitSha(data.sha);
        }
      } catch {
        // ignore failures – just don't show the commit
      }
    }

    loadCommit();
    return () => {
      cancelled = true;
    };
  }, []);

  const shortCommit = commitSha ? commitSha.slice(0, 7) : '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: 'var(--space-xl) var(--space-lg)',
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-md)',
          }}
        >
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            RIGTREE &mdash; &copy; {new Date().getFullYear()}
          </span>

          {shortCommit && (
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
              }}
            >
              commit: {shortCommit}
            </span>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Editor', href: '/editor' },
              { label: 'GitHub', href: 'https://github.com/daglaroglou/rigtree', external: true },
            ].map(({ label, href, external }) => (
              external ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    transition: 'color var(--dur-base)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {label}
                </a>
              ) : (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    transition: 'color var(--dur-base)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {label}
                </a>
              )
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
