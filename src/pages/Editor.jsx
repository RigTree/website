import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, ExternalLink, CheckCircle2, Send,
  Copy, Check, Radio, RefreshCw,
} from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { OAUTH_PROXY_URL } from '../lib/constants';

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useStore();

  const [sessionId, setSessionId]       = useState(null);
  const [receivedData, setReceivedData] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(null);
  const [copied, setCopied]             = useState(false);
  const [error, setError]               = useState(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    createSession();
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [isAuthenticated, navigate]);

  const createSession = async () => {
    setReceivedData(null);
    setSubmitted(null);
    setError(null);
    if (pollingRef.current) clearInterval(pollingRef.current);

    try {
      const res = await fetch(`${OAUTH_PROXY_URL}/session`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const { session_id } = await res.json();
      setSessionId(session_id);
      startPolling(session_id);
    } catch {
      setError('Failed to create session. Make sure the worker is running.');
    }
  };

  const startPolling = (id) => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${OAUTH_PROXY_URL}/session/${id}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.status === 'received' && result.data) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setReceivedData(result.data);
        }
      } catch { /* keep polling */ }
    }, 2000);
  };

  const endpoint = sessionId ? `${OAUTH_PROXY_URL}/session/${sessionId}` : null;

  const copyEndpoint = () => {
    if (!endpoint) return;
    navigator.clipboard.writeText(endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!receivedData) return;
    setSubmitting(true);
    try {
      const gh = new GitHubService(token);
      const pr = await gh.submitProfile(receivedData);
      setSubmitted(pr);
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Submitted state ── */
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
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={submitted.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <ExternalLink size={14} />
              View Pull Request
            </a>
            <button onClick={createSession} className="btn-ghost">
              <RefreshCw size={14} />
              New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <div style={{ maxWidth: '40rem', margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>
      {/* Header */}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '2.5rem', paddingBottom: '2rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Import Rig Data
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Awaiting data from your app
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
          <button onClick={createSession} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <RefreshCw size={14} />
            Retry
          </button>
        </div>

      /* Waiting state */
      ) : !receivedData ? (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Radio size={14} style={{ color: 'var(--text-secondary)' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Session Active
            </h2>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Send a{' '}
            <code style={{ padding: '0.15rem 0.4rem', borderRadius: 4, background: 'rgba(255,255,255,0.06)', fontSize: '0.75rem' }}>
              POST
            </code>{' '}
            request with your rig JSON to this endpoint:
          </p>

          {endpoint && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              marginBottom: '1.5rem',
            }}>
              <code style={{
                flex: 1, fontSize: '0.75rem', color: 'var(--text-primary)',
                fontFamily: '"JetBrains Mono", monospace',
                wordBreak: 'break-all',
              }}>
                {endpoint}
              </code>
              <button onClick={copyEndpoint} className="btn-ghost" style={{ flexShrink: 0, padding: '0.35rem 0.6rem' }}>
                {copied ? <Check size={13} style={{ color: 'var(--text-secondary)' }} /> : <Copy size={13} />}
              </button>
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.6rem', padding: '2rem 0 1rem',
            color: 'var(--text-muted)', fontSize: '0.8rem',
          }}>
            <Loader2 size={14} className="animate-spin" />
            Waiting for data…
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1rem' }}>
            <button
              onClick={createSession}
              className="btn-ghost"
              style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
            >
              <RefreshCw size={13} />
              New Session
            </button>
          </div>
        </div>

      /* Received state */
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Data Received
              </h2>
            </div>

            {receivedData.username && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Profile: <strong style={{ color: 'var(--text-primary)' }}>{receivedData.username}</strong>
                {receivedData.computers?.length > 0 && ` · ${receivedData.computers.length} computer${receivedData.computers.length > 1 ? 's' : ''}`}
                {receivedData.phones?.length > 0 && ` · ${receivedData.phones.length} phone${receivedData.phones.length > 1 ? 's' : ''}`}
              </div>
            )}

            <pre style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: '0.7rem',
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--text-secondary)',
              overflow: 'auto',
              maxHeight: '20rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {JSON.stringify(receivedData, null, 2)}
            </pre>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary"
              style={{ padding: '0.75rem 2.5rem', fontSize: '0.9rem' }}
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? 'Creating Pull Request…' : 'Submit as Pull Request'}
            </button>
            <button onClick={createSession} className="btn-ghost" style={{ fontSize: '0.75rem' }}>
              <RefreshCw size={13} />
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
