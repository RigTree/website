import Header from './Header';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: 'var(--space-lg) var(--space-md)',
          textAlign: 'center',
          fontSize: '0.7rem',
          fontFamily: '"JetBrains Mono", monospace',
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}
      >
        RIGTREE — Open-source hardware showcase. Built with React &amp; the GitHub API.
      </footer>
    </div>
  );
}
