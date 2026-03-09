import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ExternalLink, CheckCircle2, Send, Copy, Check } from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { createDefaultProfile } from '../lib/schema';
import ProfileStep from '../components/editor/ProfileStep';
import ComputersStep from '../components/editor/ComputersStep';
import PhonesStep from '../components/editor/PhonesStep';

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();
  const [data,       setData]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(null);
  const [copied,     setCopied]     = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (profileData) setData(profileData);
    else if (user)   setData(createDefaultProfile(user.login));
  }, [isAuthenticated, user, profileData, navigate]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://rigtree.pages.dev/${user.login}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) return null;

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setProfileData(next);
      return next;
    });
  };

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
        <div className="card" style={{ padding: '3rem 2rem' }}>
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
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
            A Pull Request has been created. Once a maintainer merges it, your profile will go live.
          </p>
          <a href={submitted.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink size={14} />
            View Pull Request
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {user.name || user.login}s Rig
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 3 }}>
              Edit your rig profile below and submit when ready
            </p>
          </div>
          <button
            onClick={copyShareLink}
            className="btn-ghost"
            style={{ fontSize: '0.75rem', gap: '0.4rem', flexShrink: 0 }}
            title={`https://rigtree.pages.dev/${user.login}`}
          >
            {copied ? <Check size={13} style={{ color: 'var(--text-secondary)' }} /> : <Copy size={13} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy link'}</span>
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <EditorSection title="Profile" subtitle="Basic info shown on your public profile page">
          <ProfileStep data={data} onChange={updateData} user={user} />
        </EditorSection>

        <EditorSection title="Computers" subtitle="Desktops, laptops and workstations">
          <ComputersStep data={data} onChange={updateData} />
        </EditorSection>

        <EditorSection title="Phones" subtitle="Smartphones, tablets and mobile devices">
          <PhonesStep data={data} onChange={updateData} />
        </EditorSection>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
            style={{ padding: '0.75rem 2.5rem', fontSize: '0.9rem' }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {submitting ? 'Creating Pull Request...' : 'Submit as Pull Request'}
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '28rem', lineHeight: 1.6 }}>
            This will fork the repository, commit your profile JSON, and open a Pull Request for review.
          </p>
        </div>
      </div>
    </div>
  );
}

function EditorSection({ title, subtitle, children }) {
  return (
    <div>
      <div style={{ marginBottom: '0.875rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</p>
      </div>
      <div className="card" style={{ padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}
