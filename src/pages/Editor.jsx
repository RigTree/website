import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Monitor, Smartphone, Send, ChevronLeft, ChevronRight,
  Loader2, ExternalLink, CheckCircle2, Circle,
} from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { createDefaultProfile } from '../lib/schema';
import ProfileStep from '../components/editor/ProfileStep';
import ComputersStep from '../components/editor/ComputersStep';
import PhonesStep from '../components/editor/PhonesStep';
import ReviewStep from '../components/editor/ReviewStep';

const STEPS = [
  { id: 'profile',   label: 'Profile',        desc: 'Your name & location',   icon: User },
  { id: 'computers', label: 'Computers',       desc: 'PCs, laptops & desktops', icon: Monitor },
  { id: 'phones',    label: 'Phones',          desc: 'Smartphones & tablets',  icon: Smartphone },
  { id: 'review',    label: 'Review & Submit', desc: 'Check & create PR',      icon: Send },
];

const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:   (d) => ({ x: d > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }),
};

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();
  const [step,       setStep]       = useState(0);
  const [direction,  setDirection]  = useState(1);
  const [data,       setData]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (profileData)      setData(profileData);
    else if (user)        setData(createDefaultProfile(user.login));
  }, [isAuthenticated, user, profileData, navigate]);

  if (!data) return null;

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setProfileData(next);
      return next;
    });
  };

  const goTo = (idx) => { setDirection(idx > step ? 1 : -1); setStep(idx); };
  const next = () => { if (step < STEPS.length - 1) goTo(step + 1); };
  const prev = () => { if (step > 0) goTo(step - 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const gh = new GitHubService(token);
      const pr = await gh.submitProfile(data);
      setSubmitted(pr);
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '32rem', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{ padding: '3rem 2rem' }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <CheckCircle2 size={28} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Profile Submitted!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            A Pull Request has been created. Once a maintainer merges it, your profile will go live.
          </p>
          <a href={submitted.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink size={14} />
            View Pull Request
          </a>
        </motion.div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: '82vh', paddingBottom: '5rem' }}>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 64, left: 0, right: 0, height: 2, zIndex: 40, background: 'var(--border)' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', background: 'var(--text-primary)' }}
        />
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        {/* Page header */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <img
              src={user.avatar_url}
              alt={user.login}
              style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }}
            />
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {user.name || user.login}'s Rig
              </h1>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                Step {step + 1} of {STEPS.length} — {STEPS[step].label}
              </p>
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-[200px_1fr]">

          {/* ── Sidebar nav ── */}
          <div>
            {/* Mobile: horizontal pill row */}
            <div className="flex lg:hidden" style={{ gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                      border: isActive ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={12} style={{ color: 'var(--text-secondary)' }} />
                      : <Icon size={12} />}
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop: vertical sidebar */}
            <div className="hidden lg:flex" style={{ flexDirection: 'column', gap: '0.25rem', position: 'sticky', top: '5.5rem' }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
                Steps
              </p>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                      border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isActive ? 'var(--text-primary)' : isDone ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isActive ? 'var(--text-primary)' : isDone ? 'var(--border-hover)' : 'var(--border)'}`,
                    }}>
                      {isDone
                        ? <CheckCircle2 size={13} style={{ color: 'var(--text-secondary)' }} />
                        : <Icon size={13} style={{ color: isActive ? 'var(--bg-base)' : 'var(--text-muted)' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: 1.2 }}>
                        {s.label}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.2 }}>
                        {s.desc}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Quick stats */}
              <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.6rem' }}>Summary</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Computers</span>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>{data.computers?.length ?? 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Phones</span>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>{data.phones?.length ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          <div>
            <div style={{ overflow: 'hidden' }}>
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {step === 0 && <ProfileStep  data={data} onChange={updateData} user={user} />}
                  {step === 1 && <ComputersStep data={data} onChange={updateData} />}
                  {step === 2 && <PhonesStep   data={data} onChange={updateData} />}
                  {step === 3 && <ReviewStep   data={data} onSubmit={handleSubmit} submitting={submitting} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav buttons */}
            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button onClick={prev} disabled={step === 0} className="btn-secondary" style={{ opacity: step === 0 ? 0.3 : 1 }}>
                <ChevronLeft size={14} />
                Back
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {step + 1} / {STEPS.length}
              </span>
              {step < STEPS.length - 1 ? (
                <button onClick={next} className="btn-primary">
                  Continue
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? 'Submitting…' : 'Submit Profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
