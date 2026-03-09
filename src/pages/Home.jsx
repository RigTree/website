import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, ArrowRight, Github, GitPullRequest, Share2, Zap, HardDrive } from 'lucide-react';
import useStore from '../store/useStore';
import { getAuthUrl } from '../lib/constants';
import { GitHubService } from '../lib/github';

/* ---- scroll-reveal hook ---- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---- static variants ---- */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ---- Grid Background ---- */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="grid-bg" />
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '50vh',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ---- Feature Card ---- */
function FeatureCard({ icon: Icon, title, description, delay, dir }) {
  return (
    <div
      className={`card reveal ${dir === 'left' ? 'reveal-left' : dir === 'right' ? 'reveal-right' : ''}`}
      style={{ padding: 'var(--space-xl)', transitionDelay: `${delay * 80}ms` }}
    >
      <div
        style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-lg)',
          color: 'var(--text-secondary)',
        }}
      >
        <Icon size={18} />
      </div>
      <h3
        style={{
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useStore();
  const [profiles, setProfiles] = useState([]);
  useReveal();

  useEffect(() => {
    const svc = new GitHubService('');
    svc.listProfiles().then(setProfiles).catch(() => {});
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <GridBackground />

      {/* ---- Hero ---- */}
      <section
        style={{
          position: 'relative',
          maxWidth: '72rem',
          margin: '0 auto',
          padding: 'clamp(5rem, 12vw, 10rem) var(--space-lg) var(--space-3xl)',
          textAlign: 'center',
        }}
      >
        <motion.div initial="hidden" animate="visible">

          {/* badge */}
          <motion.div variants={fadeUp} custom={0}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.85rem',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-xl)',
              }}
            >
              Open-Source Hardware Showcase
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="display-xl shimmer-text"
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            Your Rig.{' '}
            <br />
            Your Tree.
          </motion.h1>

          {/* sub */}
          <motion.p
            variants={fadeUp}
            custom={2}
            style={{
              maxWidth: '38rem',
              margin: '0 auto',
              marginBottom: 'var(--space-2xl)',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.75,
            }}
          >
            A community-driven page to showcase your PC builds, laptops, and
            smartphones. Share every spec — from CPU to case fans — with a single link.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            custom={3}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}
          >
            {isAuthenticated ? (
              <Link to="/editor" className="btn-primary">
                Open Editor
                <ArrowRight size={14} className="btn-icon" />
              </Link>
            ) : (
              <a href={getAuthUrl()} className="btn-primary">
                <Github size={14} />
                Get Started with GitHub
                <ArrowRight size={14} className="btn-icon" />
              </a>
            )}
            <Link to="/browse" className="btn-secondary">
              Browse
              <ArrowRight size={14} className="btn-icon" />
            </Link>
          </motion.div>

          {/* stat strip */}
          {profiles.length > 0 && (
            <motion.div
              variants={fadeUp}
              custom={4}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: '0.4rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', marginRight: '0.25rem' }}>
                {profiles.slice(0, 5).map((p) => (
                  <img
                    key={p}
                    src={`https://avatars.githubusercontent.com/${p}`}
                    alt={p}
                    width={20}
                    height={20}
                    style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--bg-base)', marginLeft: -6, objectFit: 'cover' }}
                  />
                ))}
              </div>
              <span><strong style={{ color: 'var(--text-secondary)' }}>{profiles.length}</strong> {profiles.length === 1 ? 'setup' : 'setups'} shared so far</span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ---- How It Works ---- */}
      <section
        style={{
          position: 'relative',
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 var(--space-lg) var(--space-3xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          <p className="mono-label reveal" style={{ marginBottom: 'var(--space-lg)' }}>How it works</p>
          <h2
            className="reveal"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
            }}
          >
            From zero to shareable in three steps.
          </h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            { n: '01', title: 'Sign in with GitHub', desc: 'One click. We only request permissions needed to open a PR on your behalf.' },
            { n: '02', title: 'Fill in your specs', desc: 'Add computers, phones, components, and peripherals in the editor.' },
            { n: '03', title: 'Share your link', desc: 'Your profile goes live. You can copy your share link from the Editor at any time.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="card reveal" style={{ padding: 'var(--space-xl)' }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '2.25rem', fontWeight: 900, color: 'var(--border-hover)', lineHeight: 1, marginBottom: 'var(--space-lg)' }}>{n}</p>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Feature Cards ---- */}
      <section
        style={{
          position: 'relative',
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 var(--space-lg) var(--space-3xl)',
        }}
      >
        <p className="mono-label reveal" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>Everything you need</p>
        <div className="feature-grid-6">
          <FeatureCard
            icon={Monitor}
            title="Full PC Specs"
            description="CPU, GPU, RAM, storage, cooler, case — every component."
            delay={0} dir="left"
          />
          <FeatureCard
            icon={HardDrive}
            title="Dual Boot"
            description="List OS entries with kernel, DE, and primary boot flag."
            delay={1} dir=""
          />
          <FeatureCard
            icon={Smartphone}
            title="Mobile Devices"
            description="SoC, RAM, display, cameras, battery, and OS in one card."
            delay={2} dir=""
          />
          <FeatureCard
            icon={GitPullRequest}
            title="Git-Native"
            description="JSON files in a public repo. Version-controlled and free."
            delay={3} dir=""
          />
          <FeatureCard
            icon={Share2}
            title="One Link"
            description="A clean URL like is all you need."
            delay={4} dir=""
          />
          <FeatureCard
            icon={Zap}
            title="Instant & Free"
            description="No subscriptions, no ads. Deployed on Cloudflare Pages."
            delay={5} dir="right"
          />
        </div>
      </section>

      {/* ---- Bottom CTA ---- */}
      <section
        style={{
          position: 'relative',
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 var(--space-lg) var(--space-3xl)',
        }}
      >
        <div
          className="card reveal"
          style={{
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            background: 'var(--bg-elevated)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2xl)' }}>
            <div style={{ flex: 1, minWidth: '16rem' }}>
              <p className="mono-label" style={{ marginBottom: 'var(--space-md)' }}>Get started</p>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.15,
                  marginBottom: 'var(--space-md)',
                }}
              >
                Add your setup<br />to the tree.
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '26rem', lineHeight: 1.75 }}>
                Under five minutes from sign-in to live profile. Everything is plain JSON in a public GitHub repo — no databases, no subscriptions.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flexShrink: 0 }}>
              {isAuthenticated ? (
                <Link to="/editor" className="btn-primary">
                  Open Editor
                  <ArrowRight size={14} className="btn-icon" />
                </Link>
              ) : (
                <a href={getAuthUrl()} className="btn-primary">
                  <Github size={14} />
                  Sign in with GitHub
                  <ArrowRight size={14} className="btn-icon" />
                </a>
              )}
              <a
                href="https://github.com/rigtree"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Github size={14} />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
