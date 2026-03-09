import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Cpu, Smartphone, ArrowRight, Github } from 'lucide-react';
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
      <div
        style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border-hover)',
          borderRadius: '50%',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          flexShrink: 0,
        }}
      >
        {username[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {username}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>View setup →</p>
      </div>
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
            Create a beautiful profile to showcase your PC builds, laptops, and
            smartphones. Like Linktree, but built for hardware enthusiasts.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            custom={3}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center' }}
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
            <Link to="/dag" className="btn-secondary">
              See Example
              <ArrowRight size={14} className="btn-icon" />
            </Link>
          </motion.div>
        </motion.div>
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
        <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <FeatureCard
            icon={Monitor}
            title="Showcase Your Builds"
            description="Add desktops, laptops, servers — every component from CPU to case fans."
            delay={0}
            dir="left"
          />
          <FeatureCard
            icon={Smartphone}
            title="Mobile Arsenal"
            description="List your smartphones with SoC, display, cameras, and battery specs."
            delay={1}
            dir=""
          />
          <FeatureCard
            icon={Cpu}
            title="Powered by GitHub"
            description="No database needed. Profiles are stored as JSON via Pull Requests."
            delay={2}
            dir="right"
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
          <div className="reveal" style={{ maxWidth: 480, margin: '0 auto' }}>
            <p
              className="mono-label"
              style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
            >
              Community Profiles
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {profiles.map((p) => (
                <ProfilePreview key={p} username={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
