import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink, CheckCircle2, Copy, Check,
  User, Monitor, Smartphone, ClipboardCheck,
  ChevronLeft, ChevronRight, ArrowUpRight,
} from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { createDefaultProfile } from '../lib/schema';
import ProfileStep   from '../components/editor/ProfileStep';
import ComputersStep from '../components/editor/ComputersStep';
import PhonesStep    from '../components/editor/PhonesStep';
import ReviewStep    from '../components/editor/ReviewStep';

const STEPS = [
  { id: 'profile',   label: 'Profile',   Icon: User,           subtitle: 'Display name & location' },
  { id: 'computers', label: 'Computers', Icon: Monitor,        subtitle: 'Desktops, laptops & servers' },
  { id: 'phones',    label: 'Phones',    Icon: Smartphone,     subtitle: 'Smartphones & tablets' },
  { id: 'review',    label: 'Review',    Icon: ClipboardCheck, subtitle: 'Preview & submit' },
];

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();
  const [data,       setData]       = useState(null);
  const [step,       setStep]       = useState('profile');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(null);
  const [copied,     setCopied]     = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (profileData) setData(profileData);
    else if (user)   setData(createDefaultProfile(user.login));
  }, [isAuthenticated, user, profileData, navigate]);

  if (!data) return null;

  const updateData = updater => setData(prev => {
    const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
    setProfileData(next);
    return next;
  });

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

  const copyLink = () => {
    navigator.clipboard.writeText(`https://rigtree.pages.dev/${user.login}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepIdx    = STEPS.findIndex(s => s.id === step);
  const activeStep = STEPS[stepIdx];
  const { Icon }   = activeStep;
  const badges     = { computers: data.computers.length, phones: data.phones.length };

  /* ── Success screen ──────────────────────────────────── */
  if (submitted) {
    return (
      <div style={{ maxWidth: '32rem', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <CheckCircle2 size={28} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Profile Submitted!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
            A Pull Request has been opened. Once a maintainer merges it, your profile will go live.
          </p>
          <a href={submitted.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink size={14} /> View Pull Request
          </a>
        </div>
      </div>
    );
  }

  /* ── Main editor layout ──────────────────────────────── */
  return (
    <div style={{ maxWidth: '76rem', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>

      {/* User bar */}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          marginBottom: '1.75rem', padding: '0.75rem 1.25rem',
          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <img src={user.avatar_url} alt={user.login}
            style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {user.name || user.login}
            </p>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>@{user.login}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <button onClick={copyLink} className="btn-ghost" style={{ fontSize: '0.75rem' }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <a href={`https://rigtree.pages.dev/${user.login}`} target="_blank" rel="noopener noreferrer"
              className="btn-ghost" style={{ fontSize: '0.75rem' }}>
              <ArrowUpRight size={13} />
              <span className="hidden sm:inline">Profile</span>
            </a>
          </div>
        </div>
      )}

      {/* Mobile tab row (shown < 768 px via CSS) */}
      <div className="editor-mobile-tabs">
        {STEPS.map(s => {
          const SIcon  = s.Icon;
          const active = s.id === step;
          const badge  = badges[s.id];
          return (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.48rem 0.9rem', borderRadius: 'var(--radius-md)',
              border: active ? '1px solid var(--border-hover)' : '1px solid var(--border)',
              background: active ? 'var(--bg-elevated)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: active ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s',
            }}>
              <SIcon size={13} />
              {s.label}
              {badge > 0 && (
                <span style={{ padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="editor-layout">

        {/* ── Sidebar ── */}
        <aside className="editor-sidebar">
          <p style={{ fontSize: '0.66rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Sections
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {STEPS.map(s => {
              const SIcon  = s.Icon;
              const active = s.id === step;
              const badge  = badges[s.id];
              return (
                <button key={s.id} onClick={() => setStep(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.575rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: active ? '1px solid var(--border-hover)' : '1px solid transparent',
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <SIcon size={14} style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: active ? 600 : 400, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {s.label}
                  </span>
                  {badge > 0 && (
                    <span style={{
                      fontSize: '0.65rem', fontFamily: 'monospace',
                      padding: '0.15rem 0.45rem', borderRadius: '999px',
                      background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)', minWidth: '1.4rem', textAlign: 'center',
                    }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0.5rem' }} />

          {/* Summary widget */}
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.66rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.625rem' }}>
              Summary
            </p>
            <SummaryRow label="Name"      value={data.profile.display_name || '—'} />
            <SummaryRow label="Location"  value={data.profile.location      || '—'} />
            <SummaryRow label="Computers" value={`${data.computers.length} added`} />
            <SummaryRow label="Phones"    value={`${data.phones.length} added`}    />
          </div>

          {/* CTA */}
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setStep('review')} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.82rem' }}>
              Review &amp; Submit →
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 'var(--radius-md)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              }}>
                <Icon size={15} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {activeStep.label}
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {activeStep.subtitle}
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)', flexShrink: 0 }}>
              {stepIdx + 1} / {STEPS.length}
            </span>
          </div>

          {/* Step content */}
          <div className="card" style={{ padding: '1.5rem' }}>
            {step === 'profile'   && <ProfileStep   data={data} onChange={updateData} user={user} />}
            {step === 'computers' && <ComputersStep data={data} onChange={updateData} />}
            {step === 'phones'    && <PhonesStep    data={data} onChange={updateData} />}
            {step === 'review'    && <ReviewStep    data={data} onSubmit={handleSubmit} submitting={submitting} />}
          </div>

          {/* Prev / Next */}
          {step !== 'review' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setStep(STEPS[Math.max(0, stepIdx - 1)].id)}
                disabled={stepIdx === 0}
                className="btn-ghost"
                style={{ fontSize: '0.8rem', opacity: stepIdx === 0 ? 0.3 : 1 }}
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIdx + 1)].id)}
                className="btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                {stepIdx === STEPS.length - 2 ? 'Review & Submit' : 'Next'} <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.3rem' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: 500, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
