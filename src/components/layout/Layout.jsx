import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/[0.04] py-6 text-center text-xs text-zinc-600">
        <span className="font-mono">RigTree</span> — Open-source hardware showcase.
        Built with React & the GitHub API.
      </footer>
    </div>
  );
}
