import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, ExternalLink, CheckCircle2, Send,
  Plus, X, Monitor, Smartphone, Copy, Check,
} from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { createDefaultProfile } from '../lib/schema';
import { OAUTH_PROXY_URL } from '../lib/constants';

function openLocalApp(url) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 1000);
}

function computerSummary(c) {
  const parts = [];
  const cpu = c.components?.cpu;
  if (cpu?.brand || cpu?.model) parts.push(`${cpu.brand} ${cpu.model}`.trim());
  const totalRam = c.components?.ram?.reduce((sum, r) => sum + (r.capacity_gb || 0) * (r.modules || 1), 0);
  if (totalRam) parts.push(`${totalRam}GB RAM`);
  const os = c.software?.os_list?.[0]?.name;
  if (os) parts.push(os);
  return parts.join(' · ') || 'No details';
}

function phoneSummary(p) {
  const parts = [];
  if (p.soc) parts.push(p.soc);
  if (p.ram_gb) parts.push(`${p.ram_gb}GB RAM`);
  if (p.storage_gb) parts.push(`${p.storage_gb}GB`);
  if (p.os?.name) parts.push(p.os.name);
  return parts.join(' · ') || 'No details';
}

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();

  const [data, setData]                 = useState(null);
  const [pendingFetch, setPendingFetch] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(null);
  const [copied, setCopied]             = useState(false);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (profileData) setData(profileData);
    else if (user) setData(createDefaultProfile(user.login));
  }, [isAuthenticated, user, profileData, navigate]);

  useEffect(() => () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  }, []);

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setProfileData(next);
      return next;
    });
  };

  /* ── Fetch flow ── */

  const addDevice = async (type) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    try {
      const res = await fetch(`${OAUTH_PROXY_URL}/session`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const { session_id } = await res.json();
      const endpoint = `${OAUTH_PROXY_URL}/session/${session_id}`;

      setPendingFetch({ type, sessionId: session_id, endpoint });

      openLocalApp(`rigtree://fetch?endpoint=${encodeURIComponent(endpoint)}&type=${type}`);

      pollingRef.current = setInterval(async () => {
        try {
          const r = await fetch(endpoint);
          if (!r.ok) return;
          const result = await r.json();
          if (result.status === 'received' && result.data) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            const device = result.data;

            updateData((prev) => {
              if (type === 'computer') {
                return { ...prev, computers: [...prev.computers, { ...device, id: device.id || `computer-${Date.now()}` }] };
              }
              return { ...prev, phones: [...prev.phones, device] };
            });

            setPendingFetch(null);
          }
        } catch { /* keep polling */ }
      }, 2000);
    } catch {
      alert('Failed to create session.');
    }
  };

  const cancelFetch = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = null;
    setPendingFetch(null);
  };

  const copyEndpoint = () => {
    if (!pendingFetch?.endpoint) return;
    navigator.clipboard.writeText(pendingFetch.endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeComputer = (idx) => updateData((p) => ({ ...p, computers: p.computers.filter((_, i) => i !== idx) }));
  const removePhone    = (idx) => updateData((p) => ({ ...p, phones: p.phones.filter((_, i) => i !== idx) }));

  /* ── Submit ── */

  const handleSubmit = async () => {
    if (!data) return;
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

  if (!data) return null;

  /* ── Submitted ── */
  if (submitted) {
    return (
      <div style={{ maxWidth: '32rem', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
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

  const hasDevices = data.computers.length > 0 || data.phones.length > 0;
  const fetchingComputer = pendingFetch?.type === 'computer';
  const fetchingPhone    = pendingFetch?.type === 'phone';

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>

      {/* Header */}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={user.avatar_url} alt={user.login}
            style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {user.name || user.login}&rsquo;s Rig
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Add devices via RigTree Fetch, then submit
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* ── Profile ── */}
        <Section title="Profile" subtitle="Basic info for your public page">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Display Name" value={data.profile.display_name}
              onChange={(v) => updateData((p) => ({ ...p, profile: { ...p.profile, display_name: v } }))} />
            <Field label="Location" value={data.profile.location}
              onChange={(v) => updateData((p) => ({ ...p, profile: { ...p.profile, location: v } }))} />
          </div>
        </Section>

        {/* ── Computers ── */}
        <Section title="Computers" subtitle="Desktops, laptops and workstations">
          {data.computers.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {data.computers.map((c, i) => (
                <DeviceCard
                  key={c.id || i}
                  icon={<Monitor size={14} />}
                  name={c.name || c.manufacturer || 'Unnamed'}
                  badge={c.type}
                  detail={computerSummary(c)}
                  onRemove={() => removeComputer(i)}
                />
              ))}
            </div>
          )}

          {fetchingComputer ? (
            <FetchingIndicator
              endpoint={pendingFetch.endpoint}
              copied={copied}
              onCopy={copyEndpoint}
              onCancel={cancelFetch}
            />
          ) : (
            <button onClick={() => addDevice('computer')} disabled={!!pendingFetch} className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.8rem', opacity: pendingFetch ? 0.4 : 1 }}>
              <Plus size={14} /> Add Computer
            </button>
          )}
        </Section>

        {/* ── Phones ── */}
        <Section title="Phones" subtitle="Smartphones and mobile devices">
          {data.phones.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {data.phones.map((p, i) => (
                <DeviceCard
                  key={`phone-${i}`}
                  icon={<Smartphone size={14} />}
                  name={[p.brand, p.model].filter(Boolean).join(' ') || 'Unnamed'}
                  detail={phoneSummary(p)}
                  onRemove={() => removePhone(i)}
                />
              ))}
            </div>
          )}

          {fetchingPhone ? (
            <FetchingIndicator
              endpoint={pendingFetch.endpoint}
              copied={copied}
              onCopy={copyEndpoint}
              onCancel={cancelFetch}
            />
          ) : (
            <button onClick={() => addDevice('phone')} disabled={!!pendingFetch} className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.8rem', opacity: pendingFetch ? 0.4 : 1 }}>
              <Plus size={14} /> Add Phone
            </button>
          )}
        </Section>

        {/* ── Submit ── */}
        {hasDevices && (
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting || !!pendingFetch}
              className="btn-primary"
              style={{ padding: '0.75rem 2.5rem', fontSize: '0.9rem' }}
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? 'Creating Pull Request…' : 'Submit as Pull Request'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '28rem', lineHeight: 1.6 }}>
              This will fork the repository, commit your profile JSON, and open a Pull Request for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shared pieces ── */

function Section({ title, subtitle, children }) {
  return (
    <div>
      <div style={{ marginBottom: '0.875rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</p>
      </div>
      <div className="card" style={{ padding: '1.25rem' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        style={{ width: '100%', fontSize: '0.85rem' }}
      />
    </div>
  );
}

function DeviceCard({ icon, name, badge, detail, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: 8,
    }}>
      <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </span>
          {badge && (
            <span style={{
              fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '0.15rem 0.45rem', borderRadius: 4,
              background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', flexShrink: 0,
            }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {detail}
        </p>
      </div>
      <button onClick={onRemove} className="btn-ghost" style={{ padding: '0.3rem', flexShrink: 0, color: 'var(--text-muted)' }}>
        <X size={13} />
      </button>
    </div>
  );
}

function FetchingIndicator({ endpoint, copied, onCopy, onCancel }) {
  return (
    <div style={{
      padding: '1rem',
      border: '1px dashed var(--border-hover)',
      borderRadius: 8,
      background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Loader2 size={13} className="animate-spin" style={{ color: 'var(--text-secondary)' }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Waiting for RigTree Fetch…
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.5rem 0.75rem',
        background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)',
        borderRadius: 6, marginBottom: '0.75rem',
      }}>
        <code style={{
          flex: 1, fontSize: '0.65rem', color: 'var(--text-muted)',
          fontFamily: '"JetBrains Mono", monospace',
          wordBreak: 'break-all',
        }}>
          {endpoint}
        </code>
        <button onClick={onCopy} className="btn-ghost" style={{ padding: '0.25rem 0.4rem', flexShrink: 0 }}>
          {copied ? <Check size={11} style={{ color: 'var(--text-secondary)' }} /> : <Copy size={11} />}
        </button>
      </div>

      <button onClick={onCancel} className="btn-ghost"
        style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Cancel
      </button>
    </div>
  );
}
