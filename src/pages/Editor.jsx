import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, ExternalLink, CheckCircle2, Send,
  Plus, X, Monitor, Smartphone, Copy, Check,
  ArrowLeft, ArrowRight, User, MapPin, GitFork, ScanLine,
} from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { createDefaultProfile } from '../lib/schema';
import { OAUTH_PROXY_URL } from '../lib/constants';
import ProfileStep from '../components/editor/ProfileStep';

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

const STEPS = [
  { id: 'profile', label: 'Profile',  icon: User,        desc: 'Your public identity' },
  { id: 'devices', label: 'Devices',  icon: Monitor,     desc: 'Computers & phones' },
  { id: 'review',  label: 'Review',   icon: GitFork,     desc: 'Review & publish' },
];

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();

  const [data, setData]                 = useState(null);
  const [step, setStep]                 = useState(0);
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

      const rigtreeUrl = `rigtree://fetch?endpoint=${encodeURIComponent(endpoint)}&type=${type}`;
      setPendingFetch({ type, sessionId: session_id, endpoint, rigtreeUrl });
      openLocalApp(rigtreeUrl);

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

  /* ── Phone auto-detect ── */
  const detectThisPhone = async () => {
    let brand = '', model = '', osName = '', osVersion = '';

    // Chrome UA Client Hints (Android Chrome, Edge)
    if (navigator.userAgentData) {
      try {
        const ua = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
        brand = '';
        model = ua.model || '';
        osName = ua.platform || '';
        osVersion = ua.platformVersion || '';
      } catch {}
    }

    // Fallback: classic UA string
    if (!model) {
      const ua = navigator.userAgent;
      const iosMatch = ua.match(/iPhone\s+OS\s+([\d_]+)/i);
      if (iosMatch) {
        brand = 'Apple'; model = 'iPhone';
        osName = 'iOS'; osVersion = iosMatch[1].replace(/_/g, '.');
      }
      const androidMatch = ua.match(/Android\s+([\d.]+);\s+([^)]+)\)/i);
      if (androidMatch) {
        osName = 'Android'; osVersion = androidMatch[1];
        const parts = androidMatch[2].trim().split(/\s+/);
        brand = parts[0] || '';
        model = parts.slice(1).join(' ') || androidMatch[2].trim();
      }
    }

    if (!brand && !model) {
      alert('Could not detect device — your browser may not expose this info.');
      return;
    }

    updateData((prev) => ({
      ...prev,
      phones: [...prev.phones, {
        brand,
        model,
        soc: '',
        ram_gb: 0,
        storage_gb: 0,
        battery: 0,
        display: { size_inch: 0, resolution: { width: 0, height: 0 }, refresh_rate: 60, type: 'AMOLED' },
        camera: { front: 0, rear: [] },
        os: { name: [osName, osVersion].filter(Boolean).join(' '), root: false },
      }],
    }));
  };

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
      <div style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem 1.5rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '26rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
            border: '1px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 0 0 10px rgba(255,255,255,0.025), 0 0 0 20px rgba(255,255,255,0.01)',
          }}>
            <CheckCircle2 size={30} style={{ color: 'var(--text-primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.625rem', letterSpacing: '-0.04em' }}>
            Profile Submitted!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.75 }}>
            A Pull Request has been created. Once a maintainer merges it your profile will go live on RigTree.
          </p>
          <a href={submitted.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary"
            style={{ padding: '0.7rem 1.75rem' }}>
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
    <div style={{ maxWidth: '46rem', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
        {user && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 0.75rem 0.3rem 0.3rem',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '9999px',
          }}>
            <img src={user.avatar_url} alt={user.login}
              style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--border-hover)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {user.name || user.login}
            </span>
          </div>
        )}
        <span style={{
          fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>
          Step {step + 1} / {STEPS.length}
        </span>
      </div>

      {/* ── Step indicator ── */}
      <div style={{ marginBottom: '2.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.25rem' }}>
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            const isActive   = i === step;
            const isDone     = i < step;
            const isPending  = i > step;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <button
                  onClick={() => isDone && setStep(i)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                    background: 'none', border: 'none', padding: '0 0.5rem',
                    cursor: isDone ? 'pointer' : 'default',
                    opacity: isPending ? 0.3 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive
                      ? 'var(--text-primary)'
                      : isDone
                        ? 'var(--bg-elevated)'
                        : 'var(--bg-elevated)',
                    border: `1.5px solid ${isActive ? 'var(--text-primary)' : isDone ? 'var(--border-hover)' : 'var(--border)'}`,
                    color: isActive ? 'var(--accent-fg)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.06)' : 'none',
                  }}>
                    {isDone
                      ? <Check size={14} strokeWidth={2.5} />
                      : <StepIcon size={14} strokeWidth={isActive ? 2.5 : 2} />
                    }
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    letterSpacing: '0.01em', whiteSpace: 'nowrap',
                  }}>
                    {s.label}
                  </span>
                </button>

                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 1, margin: '0 0.25rem', marginBottom: '1.35rem',
                    background: i < step ? 'var(--border-hover)' : 'var(--border)',
                    transition: 'background 0.3s ease',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--text-primary), var(--text-secondary))',
            borderRadius: 9999,
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
      </div>

      {/* ── Step heading ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '0.375rem' }}>
          {STEPS[step].label === 'Profile' && 'Your Profile'}
          {STEPS[step].label === 'Devices' && 'Your Devices'}
          {STEPS[step].label === 'Review'  && 'Review & Submit'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {STEPS[step].desc}
        </p>
      </div>

      {/* ── Step content ── */}
      <div key={step} style={{ animation: 'slide-up-in 0.28s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* ─── Step 0: Profile ─── */}
        {step === 0 && (
          <ProfileStep data={data} onChange={updateData} user={user} />
        )}

        {/* ─── Step 1: Devices ─── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DeviceSection
              title="Computers"
              icon={<Monitor size={15} />}
              subtitle="Desktops, laptops and workstations"
              devices={data.computers}
              renderCard={(c, i) => (
                <DeviceCard
                  key={c.id || i}
                  icon={<Monitor size={13} />}
                  name={c.name || c.manufacturer || 'Unnamed'}
                  badge={c.type}
                  detail={computerSummary(c)}
                  onRemove={() => removeComputer(i)}
                />
              )}
              isFetching={fetchingComputer}
              fetchInfo={pendingFetch}
              copied={copied}
              onCopy={copyEndpoint}
              onAdd={() => addDevice('computer')}
              onCancel={cancelFetch}
              pendingFetch={pendingFetch}
            />

            <DeviceSection
              title="Phones"
              icon={<Smartphone size={15} />}
              subtitle="Smartphones and mobile devices"
              devices={data.phones}
              renderCard={(p, i) => (
                <DeviceCard
                  key={`phone-${i}`}
                  icon={<Smartphone size={13} />}
                  name={[p.brand, p.model].filter(Boolean).join(' ') || 'Unnamed'}
                  detail={phoneSummary(p)}
                  onRemove={() => removePhone(i)}
                />
              )}
              isFetching={fetchingPhone}
              fetchInfo={pendingFetch}
              copied={copied}
              onCopy={copyEndpoint}
              onAdd={() => addDevice('phone')}
              onDetect={detectThisPhone}
              onCancel={cancelFetch}
              pendingFetch={pendingFetch}
            />
          </div>
        )}

        {/* ─── Step 2: Review ─── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Summary card */}
            <div style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            }}>
              <div style={{
                padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{
                  fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase',
                  letterSpacing: '0.09em', color: 'var(--text-muted)', fontWeight: 500,
                }}>
                  Profile Summary
                </span>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <ReviewRow label="Name"      value={data.profile.display_name || user?.login || '—'} />
                {data.profile.location && <ReviewRow label="Location"  value={data.profile.location} />}
                <ReviewRow label="Computers" value={`${data.computers.length} device${data.computers.length !== 1 ? 's' : ''}`} />
                <ReviewRow label="Phones"    value={`${data.phones.length} device${data.phones.length !== 1 ? 's' : ''}`} />
              </div>
            </div>

            {/* Device previews */}
            {data.computers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {data.computers.map((c, i) => (
                  <DeviceCard key={c.id || i} icon={<Monitor size={13} />}
                    name={c.name || c.manufacturer || 'Unnamed'} badge={c.type}
                    detail={computerSummary(c)} readonly />
                ))}
              </div>
            )}
            {data.phones.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {data.phones.map((p, i) => (
                  <DeviceCard key={`phone-${i}`} icon={<Smartphone size={13} />}
                    name={[p.brand, p.model].filter(Boolean).join(' ') || 'Unnamed'}
                    detail={phoneSummary(p)} readonly />
                ))}
              </div>
            )}

            {/* No devices warning */}
            {!hasDevices && (
              <div style={{
                padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)',
              }}>
                <p style={{ fontSize: '0.825rem', color: 'rgba(251,191,36,0.85)', lineHeight: 1.6 }}>
                  No devices added yet — go back to the Devices step to add at least one computer or phone before submitting.
                </p>
              </div>
            )}

            {/* Fine print */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
              Submitting will fork the RigTree repository, commit your profile JSON and open a Pull Request for maintainer review.
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        marginTop: '2.75rem', paddingTop: '2rem', borderTop: '1px solid var(--border)',
        justifyContent: step === 0 ? 'flex-end' : 'space-between',
      }}>
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="btn-secondary">
            <ArrowLeft size={14} /> Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="btn-primary">
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasDevices || !!pendingFetch}
            className="btn-primary"
            style={{ padding: '0.65rem 1.75rem' }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {submitting ? 'Creating PR…' : 'Submit as Pull Request'}
          </button>
        )}
      </div>

    </div>
  );
}

/* ── DeviceSection ── */

function DeviceSection({ title, icon, subtitle, devices, renderCard, isFetching, fetchInfo, copied, onCopy, onAdd, onDetect, onCancel, pendingFetch }) {
  return (
    <div style={{
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
      background: 'var(--bg-elevated)', overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1.125rem',
        borderBottom: (devices.length > 0 || isFetching) ? '1px solid var(--border)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-overlay)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}>
            {icon}
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{title}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
        </div>
        <span style={{
          fontSize: '0.68rem', fontWeight: 600, padding: '0.18rem 0.55rem',
          borderRadius: 9999, background: 'var(--bg-overlay)', border: '1px solid var(--border)',
          color: devices.length > 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
          fontFamily: 'monospace',
        }}>
          {devices.length}
        </span>
      </div>

      {/* device list */}
      {devices.length > 0 && (
        <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {devices.map(renderCard)}
        </div>
      )}

      {/* add / fetching */}
      <div style={{
        padding: '0.625rem 0.875rem',
        borderTop: devices.length > 0 ? '1px solid var(--border)' : 'none',
      }}>
        {isFetching ? (
          <FetchingIndicator
            endpoint={fetchInfo.endpoint}
            rigtreeUrl={fetchInfo.rigtreeUrl}
            copied={copied}
            onCopy={onCopy}
            onCancel={onCancel}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              onClick={onAdd}
              disabled={!!pendingFetch}
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem', opacity: pendingFetch ? 0.4 : 1 }}
            >
              <Plus size={13} /> Add via RigTree Fetch
            </button>
            {onDetect && (
              <button
                onClick={onDetect}
                disabled={!!pendingFetch}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem', opacity: pendingFetch ? 0.4 : 1 }}
              >
                <ScanLine size={13} /> Detect This Device
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── DeviceCard ── */

function DeviceCard({ icon, name, badge, detail, onRemove, readonly }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.6rem 0.875rem',
      background: 'var(--bg-overlay)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      transition: 'border-color 0.15s ease',
    }}
      onMouseEnter={(e) => !readonly && (e.currentTarget.style.borderColor = 'var(--border-hover)')}
      onMouseLeave={(e) => !readonly && (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </span>
          {badge && (
            <span style={{
              fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '0.1rem 0.4rem', borderRadius: 3,
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
              border: '1px solid var(--border)', flexShrink: 0,
            }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {detail}
        </p>
      </div>
      {!readonly && (
        <button
          onClick={onRemove}
          className="btn-ghost"
          style={{ padding: '0.25rem', flexShrink: 0, color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

/* ── FetchingIndicator ── */

function FetchingIndicator({ endpoint, rigtreeUrl, copied, onCopy, onCancel }) {
  return (
    <div style={{
      padding: '0.875rem',
      border: '1px dashed var(--border-hover)',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(255,255,255,0.015)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Loader2 size={12} className="animate-spin" style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Waiting for RigTree Fetch…
          </span>
        </div>
        {rigtreeUrl && (
          <a
            href={rigtreeUrl}
            style={{
              fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-secondary)',
              textDecoration: 'none', padding: '0.2rem 0.55rem',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-overlay)', whiteSpace: 'nowrap',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Open app
          </a>
        )}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.4rem 0.625rem',
        background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
        borderRadius: 6, marginBottom: '0.625rem',
      }}>
        <code style={{
          flex: 1, fontSize: '0.61rem', color: 'var(--text-muted)',
          fontFamily: '"JetBrains Mono", monospace', wordBreak: 'break-all',
        }}>
          {endpoint}
        </code>
        <button onClick={onCopy} className="btn-ghost" style={{ padding: '0.2rem 0.35rem', flexShrink: 0 }}>
          {copied ? <Check size={11} style={{ color: 'var(--text-secondary)' }} /> : <Copy size={11} />}
        </button>
      </div>

      <button onClick={onCancel} className="btn-ghost"
        style={{ fontSize: '0.72rem', width: '100%', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Cancel
      </button>
    </div>
  );
}

/* ── ReviewRow ── */

function ReviewRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={{
        fontSize: '0.7rem', fontFamily: 'monospace', textTransform: 'uppercase',
        letterSpacing: '0.06em', color: 'var(--text-muted)', flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}
