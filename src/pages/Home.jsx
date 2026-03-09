import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, ArrowRight, Github, GitPullRequest, Share2, Zap, HardDrive, Users } from 'lucide-react';
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

/* ---- Step ---- */
function HowItWorksStep({ number, title, description }) {
  return (
    <div className="reveal" style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
      <div
        style={{
          width: 40, height: 40, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700,
          color: 'var(--text-secondary)',
          background: 'var(--bg-elevated)',
        }}
      >
        {number}
      </div>
      <div style={{ paddingTop: '0.25rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ---- Profile Preview ---- */
function ProfilePreview({ username }) {
  return (
    <Link
      to={`/${username}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md) var(--space-lg)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color var(--dur-base) var(--ease-smooth), transform var(--dur-base) var(--ease-smooth)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      <img
        src={`https://avatars.githubusercontent.com/${username}`}
        alt={username}
        width={32}
        height={32}
        style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-hover)', flexShrink: 0, objectFit: 'cover' }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling.style.display = 'flex';
        }}
      />
      <div
        style={{
          display: 'none', width: 32, height: 32, flexShrink: 0,
          alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border-hover)', borderRadius: '50%',
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)',
        }}
      >
        {username[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {username}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>rigtree.pages.dev/{username}</p>
      </div>
      <ArrowRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </Link>
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
                padding: '0.35rem 0.9rem',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-xl)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
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
            <Link to="/daglaroglou" className="btn-secondary">
              See Example
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
        <div style={{ display: 'grid', gap: 'var(--space-3xl)', gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
          <div>
            <p className="mono-label reveal" style={{ marginBottom: 'var(--space-lg)' }}>How it works</p>
            <h2
              className="reveal"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                marginBottom: 'var(--space-xl)',
              }}
            >
              From zero to shareable<br />in three steps.
            </h2>
            <p className="reveal" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '28rem' }}>
              No accounts to manage, no databases to worry about.
              Everything lives in a public GitHub repository as plain JSON — open to read, open to fork.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <HowItWorksStep
              number="01"
              title="Sign in with GitHub"
              description="One click, zero friction. We only request the permissions needed to open a Pull Request on your behalf."
            />
            <div style={{ width: 1, height: 'var(--space-xl)', background: 'var(--border)', marginLeft: 20 }} />
            <HowItWorksStep
              number="02"
              title="Fill in your specs"
              description="Use the guided editor to add your computers, phones, components, peripherals, and software."
            />
            <div style={{ width: 1, height: 'var(--space-xl)', background: 'var(--border)', marginLeft: 20 }} />
            <HowItWorksStep
              number="03"
              title="Share your link"
              description={`Your profile goes live at rigtree.pages.dev/your-username once the PR is merged.`}
            />
          </div>
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
        <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <FeatureCard
            icon={Monitor}
            title="Full PC Specs"
            description="CPU, GPU, RAM, storage, motherboard, PSU, cooler, case — document every component in detail."
            delay={0} dir="left"
          />
          <FeatureCard
            icon={HardDrive}
            title="Dual Boot Support"
            description="Run Windows and Arch? List all your OS entries, with kernel, DE, renderer, and primary boot flag."
            delay={1} dir=""
          />
          <FeatureCard
            icon={Smartphone}
            title="Mobile Devices"
            description="SoC, RAM, display type, refresh rate, cameras, battery, and OS — all in one card."
            delay={2} dir=""
          />
          <FeatureCard
            icon={GitPullRequest}
            title="Git-Native Storage"
            description="Profiles are JSON files in a public repo. Version-controlled, forkable, and zero-cost to host."
            delay={3} dir=""
          />
          <FeatureCard
            icon={Share2}
            title="One Link to Share"
            description="A clean URL like rigtree.pages.dev/you is all you need to show off your entire hardware tree."
            delay={4} dir=""
          />
          <FeatureCard
            icon={Zap}
            title="Instant & Free"
            description="No subscriptions. No ads. Deployed on Cloudflare Pages — fast worldwide, always on."
            delay={5} dir="right"
          />
        </div>
      </section>

      {/* ---- Community Profiles ---- */}
      {profiles.length > 0 && (
        <section
          style={{
            position: 'relative',
            maxWidth: '72rem',
            margin: '0 auto',
            padding: '0 var(--space-lg) var(--space-3xl)',
          }}
        >
          <div className="reveal" style={{ maxWidth: 520, margin: '0 auto' }}>
            <p className="mono-label" style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
              Community
            </p>
            <h2
              style={{
                textAlign: 'center',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              Browse setups
            </h2>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', lineHeight: 1.65 }}>
              Real hardware from real people. Click any profile to explore their full spec tree.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {profiles.map((p) => (
                <ProfilePreview key={p} username={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
            padding: 'clamp(2rem, 6vw, 4rem)',
            textAlign: 'center',
            background: 'var(--bg-elevated)',
          }}
        >
          <div
            style={{
              width: 48, height: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-hover)',
              borderRadius: 'var(--radius-md)',
              margin: '0 auto var(--space-lg)',
              color: 'var(--text-secondary)',
            }}
          >
            <Users size={22} />
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
            }}
          >
            Add your setup to the tree.
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '28rem', margin: '0 auto var(--space-2xl)', lineHeight: 1.75 }}>
            It takes under five minutes. Sign in with GitHub, fill in your specs, and your profile is live once the PR merges.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center' }}>
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
              href="https://github.com/daglaroglou/rigtree"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={14} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
