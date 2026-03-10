import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Loader2, ExternalLink, CheckCircle2, Send,
  Plus, X, Monitor, Smartphone, Copy, Check,
  ArrowLeft, ArrowRight, GitFork, ScanLine,
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

const BLANK_COMP       = { name: '', type: 'desktop', cpuBrand: '', cpuModel: '', ramGb: '', ramType: 'DDR4', ramMhz: '', gpuModel: '', os: '', storage: [{ type: 'SSD', capacityGb: '' }] };
const BLANK_PHONE_FORM = { brand: '', model: '', soc: '', ramGb: '', storageGb: '', os: '' };

const STEPS = [
  { id: 'devices', label: 'Devices',  icon: Monitor,     desc: 'Computers & phones' },
  { id: 'review',  label: 'Review',   icon: GitFork,     desc: 'Review & publish' },
];

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [data, setData]                 = useState(null);
  const [step, setStep]                 = useState(0);
  const [pendingFetch, setPendingFetch] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(null);
  const [copied, setCopied]             = useState(false);
  const [computerFormOpen, setComputerFormOpen] = useState(false);
  const [computerForm, setComputerForm]         = useState(BLANK_COMP);
  const [phoneFormOpen, setPhoneFormOpen]       = useState(false);
  const [phoneForm, setPhoneForm]               = useState(BLANK_PHONE_FORM);
  // Track which device IDs existed before this import session (those are readonly)
  const [originalComputerIds, setOriginalComputerIds] = useState(new Set());
  const [originalPhoneIndices, setOriginalPhoneIndices] = useState(new Set());
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (!user) return;
    // Always fetch fresh from GitHub so locally-merged phones/computers show up
    const gh = new GitHubService(token);
    gh.getUserProfile(user.login)
      .then((profile) => {
        const d = profile || createDefaultProfile(user.login);
        setData(d);
        setProfileData(d);
        // Snapshot the IDs/indices that already exist so they stay readonly
        setOriginalComputerIds(new Set((d.computers || []).map((c) => c.id).filter(Boolean)));
        setOriginalPhoneIndices(new Set(Array.from({ length: (d.phones || []).length }, (_, i) => i)));
      })
      .catch(() => {
        // Fall back to cached store data, or a blank profile
        const d = profileData || createDefaultProfile(user.login);
        setData(d);
      });
  }, [isAuthenticated, user, token]);

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

    if (!OAUTH_PROXY_URL) {
      alert('Import via RigTree is not configured. Set VITE_OAUTH_PROXY_URL in your environment.');
      return;
    }

    try {
      const res = await fetch(`${OAUTH_PROXY_URL}/session`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server returned ${res.status}`);
      }
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
    } catch (err) {
      const msg = err.message || 'Failed to create session.';
      alert(msg.includes('fetch') ? 'Failed to create session. Check that the OAuth proxy worker is deployed and VITE_OAUTH_PROXY_URL is correct.' : msg);
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

  const removeComputer = (idx) => {
    const comp = data.computers[idx];
    if (comp?.id && originalComputerIds.has(comp.id)) return; // cannot remove existing
    updateData((p) => ({ ...p, computers: p.computers.filter((_, i) => i !== idx) }));
  };
  const removePhone = (idx) => {
    if (originalPhoneIndices.has(idx)) return; // cannot remove existing
    updateData((p) => ({ ...p, phones: p.phones.filter((_, i) => i !== idx) }));
  };

  /* ── Manual adds ── */
  const addComputerManually = () => {
    const c = {
      id: `computer-${Date.now()}`,
      type: computerForm.type || 'desktop',
      name: computerForm.name,
      manufacturer: 'Custom Build',
      role: 'daily-driver',
      description: '',
      virtual_machine: false,
      year: new Date().getFullYear(),
      components: {
        cpu: { brand: computerForm.cpuBrand, model: computerForm.cpuModel, series: '', architecture: '', cores: 0, threads: 0, base_clock_mhz: 0 },
        gpu: computerForm.gpuModel ? [{ brand: '', model: computerForm.gpuModel, vram_gb: 0 }] : [],
        ram: computerForm.ramGb ? [{ type: computerForm.ramType || 'DDR4', capacity_gb: Number(computerForm.ramGb), modules: 1, speed_mhz: Number(computerForm.ramMhz) || 0, manufacturer: '', model: '' }] : [],
        motherboard: { brand: '', model: '', chipset: '' },
        storage: (computerForm.storage || []).filter(s => s.capacityGb).map(s => ({ type: s.type, form_factor: 'M.2', brand: '', model: '', capacity_gb: Number(s.capacityGb) })),
        psu: { brand: '', model: '', wattage: 0, efficiency: '' },
        cooler: { brand: '', model: '', fans: 0, water_cooling: false },
        case: { brand: '', model: '', fans: 0 },
      },
      software: {
        os_list: computerForm.os ? [{ name: computerForm.os, version: '', edition: '', kernel: '', desktop_environment: '', renderer: '', is_primary: true }] : [],
      },
      peripherals: {
        monitor: [],
        keyboard: { brand: '', model: '', switches: '', layout: 100 },
        mouse: { brand: '', model: '' },
        audio: { headphones: { brand: '', model: '' }, microphone: { brand: '', model: '' }, speakers: { brand: '', model: '' } },
      },
      camera: { brand: '', model: '', resolution: { width: 0, height: 0 }, fps: 0 },
    };
    updateData((prev) => ({ ...prev, computers: [...prev.computers, c] }));
    setComputerFormOpen(false);
    setComputerForm(BLANK_COMP);
  };

  const addPhoneManually = () => {
    const p = {
      brand: phoneForm.brand,
      model: phoneForm.model,
      soc: phoneForm.soc,
      ram_gb: Number(phoneForm.ramGb) || 0,
      storage_gb: Number(phoneForm.storageGb) || 0,
      battery: 0,
      display: { size_inch: 0, resolution: { width: 0, height: 0 }, refresh_rate: 60, type: 'AMOLED' },
      camera: { front: 0, rear: [] },
      os: { name: phoneForm.os, root: false },
    };
    updateData((prev) => ({ ...prev, phones: [...prev.phones, p] }));
    setPhoneFormOpen(false);
    setPhoneForm(BLANK_PHONE_FORM);
  };

  /* ── Phone auto-detect (pre-fills the form for review/edit) ── */
  const detectThisPhone = async () => {
    let brand = '', model = '', osName = '', osVersion = '';

    const ua = navigator.userAgent;

    // iOS — Safari/WebKit doesn't expose userAgentData
    const iosMatch = ua.match(/\(iPhone;\s+CPU\s+(?:iPhone\s+)?OS\s+([\d_]+)/i);
    if (iosMatch) {
      brand = 'Apple'; model = 'iPhone';
      osName = 'iOS'; osVersion = iosMatch[1].replace(/_/g, '.');
    }

    // Android — try UA Client Hints first (Chromium-based)
    if (!brand && navigator.userAgentData) {
      try {
        const hints = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
        model   = hints.model || '';
        osName  = hints.platform || '';
        osVersion = hints.platformVersion || '';
      } catch {}
    }

    // Android fallback via classic UA string
    if (!brand && !model) {
      const androidMatch = ua.match(/Android\s+([\d.]+);\s+([^)]+?)\s*(?:Build\/|wv\))/i)
        || ua.match(/Android\s+([\d.]+);\s+([^)]+)\)/i);
      if (androidMatch) {
        osName = 'Android'; osVersion = androidMatch[1];
        const raw = androidMatch[2].trim().replace(/\s*Build.*/, '');
        const parts = raw.split(/\s+/);
        brand = parts[0] || '';
        model = parts.slice(1).join(' ') || raw;
      }
    }

    if (!brand && !model) {
      alert('Could not detect device — your browser may not expose this info.');
      return;
    }

    // Open the manual form pre-filled so the user can refine (e.g., exact model)
    setPhoneForm({ brand, model, soc: '', ramGb: '', storageGb: '', os: [osName, osVersion].filter(Boolean).join(' ') });
    setPhoneFormOpen(true);
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
          {STEPS[step].label === 'Devices' && 'Add Devices'}
          {STEPS[step].label === 'Review'  && 'Review & Submit'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {STEPS[step].desc}
        </p>
        {STEPS[step].label === 'Devices' && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Existing devices are shown as reference. To remove or edit them, visit{' '}
            <Link to={`/${user?.login}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              your profile
            </Link>
            .
          </p>
        )}
      </div>

      {/* ── Step content ── */}
      <div key={step} style={{ animation: 'slide-up-in 0.28s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* ─── Step 0: Devices ─── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* ── Computers ── */}
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
                  readonly={!!(c.id && originalComputerIds.has(c.id))}
                  onRemove={() => removeComputer(i)}
                />
              )}
            >
              {fetchingComputer ? (
                <FetchingIndicator
                  endpoint={pendingFetch.endpoint}
                  rigtreeUrl={pendingFetch.rigtreeUrl}
                  copied={copied}
                  onCopy={copyEndpoint}
                  onCancel={cancelFetch}
                />
              ) : computerFormOpen ? (
                <ManualComputerForm
                  form={computerForm}
                  onChange={setComputerForm}
                  onSubmit={addComputerManually}
                  onCancel={() => { setComputerFormOpen(false); setComputerForm(BLANK_COMP); }}
                />
              ) : (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button
                    onClick={() => addDevice('computer')}
                    disabled={!!pendingFetch}
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem', opacity: pendingFetch ? 0.4 : 1 }}
                  >
                    <ExternalLink size={13} /> Import via RigTree
                  </button>
                  <button
                    onClick={() => setComputerFormOpen(true)}
                    disabled={!!pendingFetch}
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem', opacity: pendingFetch ? 0.4 : 1 }}
                  >
                    <Plus size={13} /> Add Manually
                  </button>
                </div>
              )}
            </DeviceSection>

            {/* ── Phones ── */}
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
                  readonly={originalPhoneIndices.has(i)}
                  onRemove={() => removePhone(i)}
                />
              )}
            >
              {phoneFormOpen ? (
                <ManualPhoneForm
                  form={phoneForm}
                  onChange={setPhoneForm}
                  onSubmit={addPhoneManually}
                  onCancel={() => { setPhoneFormOpen(false); setPhoneForm(BLANK_PHONE_FORM); }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <button
                    onClick={() => setPhoneFormOpen(true)}
                    className="btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem' }}
                  >
                    <Plus size={13} /> Add Manually
                  </button>
                  {isMobile && (
                    <button
                      onClick={detectThisPhone}
                      className="btn-ghost"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.78rem' }}
                    >
                      <ScanLine size={13} /> Detect This Device
                    </button>
                  )}
                </div>
              )}
            </DeviceSection>

          </div>
        )}

        {/* ─── Step 1: Review ─── */}
        {step === 1 && (
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

function DeviceSection({ title, icon, subtitle, devices, renderCard, children }) {
  return (
    <div style={{
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
      background: 'var(--bg-elevated)', overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1.125rem',
        borderBottom: devices.length > 0 ? '1px solid var(--border)' : 'none',
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

      {/* add / action area */}
      {children && (
        <div style={{
          padding: '0.625rem 0.875rem',
          borderTop: devices.length > 0 ? '1px solid var(--border)' : 'none',
        }}>
          {children}
        </div>
      )}
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

/* ── MField (shared mini form field) ── */

function MField({ label, value, onChange, type = 'text', placeholder, options, span }) {
  return (
    <div style={span ? { gridColumn: `span ${span}` } : {}}>
      <label style={{
        display: 'block', fontSize: '0.67rem', fontWeight: 500, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'monospace',
      }}>
        {label}
      </label>
      {type === 'select' ? (
        <select className="input-base" value={value} onChange={(e) => onChange(e.target.value)}
          style={{ fontSize: '0.82rem', width: '100%' }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="input-base" placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontSize: '0.82rem', width: '100%' }} />
      )}
    </div>
  );
}

/* ── ManualComputerForm ── */

function ManualComputerForm({ form, onChange, onSubmit, onCancel }) {
  const f = (field) => (val) => onChange((prev) => ({ ...prev, [field]: val }));
  const setStorage = (next) => onChange((prev) => ({ ...prev, storage: next }));
  const addDisk = () => setStorage([...(form.storage || []), { type: 'SSD', capacityGb: '' }]);
  const removeDisk = (i) => setStorage((form.storage || []).filter((_, idx) => idx !== i));
  const updateDisk = (i, field, val) => {
    const next = [...(form.storage || [])];
    next[i] = { ...next[i], [field]: val };
    setStorage(next);
  };
  const canSubmit = form.name || form.cpuBrand || form.cpuModel;
  const disks = form.storage || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.125rem' }}>
      <p style={{
        fontSize: '0.67rem', fontFamily: 'monospace', textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--text-muted)', fontWeight: 500,
      }}>
        Fill in what you know — the rest can stay blank
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <MField label="Name" placeholder="Gaming PC / Home Server" value={form.name} onChange={f('name')} span={2} />
        <MField label="Type" type="select" options={['desktop','laptop','workstation','server']} value={form.type} onChange={f('type')} />
        <MField label="OS" placeholder="Windows 11 / Ubuntu 24.04" value={form.os} onChange={f('os')} />
        <MField label="CPU Brand" placeholder="Intel / AMD / Apple" value={form.cpuBrand} onChange={f('cpuBrand')} />
        <MField label="CPU Model" placeholder="i7-14700K / M4 Pro" value={form.cpuModel} onChange={f('cpuModel')} />
        <MField label="RAM Type" type="select" options={['DDR5','DDR4','DDR3','DDR2','DDR']} value={form.ramType} onChange={f('ramType')} />
        <MField label="RAM (GB)" type="number" placeholder="32" value={form.ramGb} onChange={f('ramGb')} />
        <MField label="RAM MHz" type="number" placeholder="6000" value={form.ramMhz} onChange={f('ramMhz')} />
        <MField label="GPU" placeholder="RTX 4080 / RX 7900 XTX" value={form.gpuModel} onChange={f('gpuModel')} />
      </div>

      {/* Storage drives */}
      <div>
        <p style={{ fontSize: '0.67rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.4rem' }}>
          Storage Drives
        </p>
        {disks.map((disk, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.375rem', marginBottom: '0.375rem', alignItems: 'end' }}>
            <MField
              label={i === 0 ? 'Type' : ''}
              type="select"
              options={['SSD','HDD','NVMe','eMMC']}
              value={disk.type}
              onChange={(v) => updateDisk(i, 'type', v)}
            />
            <MField
              label={i === 0 ? 'Capacity (GB)' : ''}
              type="number"
              placeholder="512"
              value={disk.capacityGb}
              onChange={(v) => updateDisk(i, 'capacityGb', v)}
            />
            {disks.length > 1 && (
              <button
                onClick={() => removeDisk(i)}
                className="btn-ghost"
                style={{ padding: '0.35rem', color: 'var(--text-muted)', marginBottom: i === 0 ? '0' : '0', alignSelf: 'flex-end' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={13} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addDisk}
          className="btn-ghost"
          style={{ fontSize: '0.72rem', padding: '0.3rem 0.625rem', color: 'var(--text-secondary)', border: '1px dashed var(--border)' }}
        >
          <Plus size={12} /> Add Drive
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
        <button onClick={onCancel} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.4rem 0.875rem' }}>
          Cancel
        </button>
        <button onClick={onSubmit} disabled={!canSubmit} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.4rem 1.125rem' }}>
          <Plus size={13} /> Add Computer
        </button>
      </div>
    </div>
  );
}

/* ── ManualPhoneForm ── */

function ManualPhoneForm({ form, onChange, onSubmit, onCancel }) {
  const f = (field) => (val) => onChange((prev) => ({ ...prev, [field]: val }));
  const canSubmit = form.brand || form.model;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.125rem' }}>
      <p style={{
        fontSize: '0.67rem', fontFamily: 'monospace', textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--text-muted)', fontWeight: 500,
      }}>
        Fill in what you know — the rest can stay blank
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <MField label="Brand" placeholder="Apple / Samsung / Google" value={form.brand} onChange={f('brand')} />
        <MField label="Model" placeholder="iPhone 16 Pro / Galaxy S25" value={form.model} onChange={f('model')} />
        <MField label="SoC" placeholder="A18 Pro / Snapdragon 8 Elite" value={form.soc} onChange={f('soc')} />
        <MField label="OS" placeholder="iOS 18.3 / Android 15" value={form.os} onChange={f('os')} />
        <MField label="RAM (GB)" type="number" placeholder="8" value={form.ramGb} onChange={f('ramGb')} />
        <MField label="Storage (GB)" type="number" placeholder="256" value={form.storageGb} onChange={f('storageGb')} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
        <button onClick={onCancel} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.4rem 0.875rem' }}>
          Cancel
        </button>
        <button onClick={onSubmit} disabled={!canSubmit} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.4rem 1.125rem' }}>
          <Plus size={13} /> Add Phone
        </button>
      </div>
    </div>
  );
}
