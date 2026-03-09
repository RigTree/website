import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Github, Monitor, Laptop, Smartphone, Cpu, MemoryStick, HardDrive,
  CircuitBoard, Zap, Fan, Box, Tv, Keyboard, Mouse, Headphones, Mic, Speaker,
  Camera, Globe, Loader2, AlertCircle, Copy, Check, Pencil, X, Save,
  ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react';
import { GitHubService } from '../lib/github';
import useStore from '../store/useStore';
import { COUNTRIES } from '../lib/countries';

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

function SpecRow({ icon: Icon, label, value }) {
  if (!value || value === 'N/A') return null;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', minWidth: 0 }}>
      <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', flexShrink: 0, minWidth: '5.5rem' }}>
        {Icon && <Icon size={10} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />}{label}
      </span>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  );
}

function SpecGroup({ icon: Icon, title, accent, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <Icon size={11} style={{ color: accent || 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: accent || 'var(--text-muted)', fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.25rem' }}>
        {children}
      </div>
    </div>
  );
}

function ComputerCard({ computer: c, index }) {
  const [expanded, setExpanded] = useState(true);
  const isLaptop = c.type === 'laptop';
  const TypeIcon = isLaptop ? Laptop : Monitor;

  const totalRam = (c.components?.ram || []).reduce((s, r) => s + (r.capacity_gb || 0), 0);
  const totalStorage = (c.components?.storage || []).reduce((s, d) => s + (d.capacity_gb || 0), 0);
  const cpuLabel = [c.components?.cpu?.brand, c.components?.cpu?.series, c.components?.cpu?.model].filter(Boolean).join(' ');
  const gpuList = (c.components?.gpu || []).map(g => [g.brand, g.model].filter(Boolean).join(' ')).filter(Boolean);
  const ramLabel = totalRam > 0 ? `${totalRam} GB${c.components?.ram?.[0]?.type ? ' ' + c.components.ram[0].type : ''}${c.components?.ram?.[0]?.speed_mhz ? ' @ ' + c.components.ram[0].speed_mhz + ' MHz' : ''}` : null;
  const storageList = (c.components?.storage || []).map(s =>
    [s.type, s.capacity_gb ? (s.capacity_gb >= 1000 ? `${(s.capacity_gb/1000).toFixed(1)} TB` : `${s.capacity_gb} GB`) : null].filter(Boolean).join(' ')
  ).filter(Boolean);
  const osList = c.software?.os_list?.length > 0 ? c.software.os_list : (c.software?.os?.name ? [c.software.os] : []);
  const hasMobo = c.components?.motherboard?.brand;
  const hasPSU  = c.components?.psu?.brand;
  const hasCooler = c.components?.cooler?.brand;
  const hasCase   = c.components?.case?.brand;
  const hasPeripherals = c.peripherals?.monitor?.length > 0 || c.peripherals?.keyboard?.brand;

  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="visible" viewport={{ once: true }}
      style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ width: 38, height: 38, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--bg-overlay)', border: '1px solid var(--border-hover)', color: 'var(--text-secondary)' }}>
          <TypeIcon size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '-0.01em' }}>
              {c.name || c.id || 'Unnamed'}
            </h3>
            <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', textTransform: 'capitalize', color: 'var(--text-muted)', background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 9999, padding: '0.1rem 0.5rem' }}>
              {c.type}
            </span>
            {c.year > 0 && (
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 9999, padding: '0.1rem 0.5rem' }}>
                {c.year}
              </span>
            )}
          </div>
          {/* Quick summary line */}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[cpuLabel, gpuList[0], ramLabel].filter(Boolean).join(' Â· ') || c.description || 'No details'}
          </p>
        </div>
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </div>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {c.description && (
                <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-overlay)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{c.description}</p>
                </div>
              )}

              <div style={{ padding: '1.125rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                {/* CPU */}
                {cpuLabel && (
                  <SpecGroup icon={Cpu} title="Processor" accent="#7dd3fc">
                    <SpecRow label="CPU" value={cpuLabel} />
                    {c.components.cpu.cores > 0 && <SpecRow label="Cores / Threads" value={`${c.components.cpu.cores}C / ${c.components.cpu.threads}T`} />}
                    {c.components.cpu.base_clock_mhz > 0 && <SpecRow label="Base Clock" value={`${c.components.cpu.base_clock_mhz} MHz`} />}
                  </SpecGroup>
                )}

                {/* GPU */}
                {gpuList.length > 0 && (
                  <SpecGroup icon={Tv} title="Graphics" accent="#c084fc">
                    {c.components.gpu.map((g, i) => (
                      <SpecRow key={i} label={`GPU${c.components.gpu.length > 1 ? ' ' + (i + 1) : ''}`} value={`${[g.brand, g.model].filter(Boolean).join(' ')}${g.vram_gb ? ` Â· ${g.vram_gb}GB` : ''}`} />
                    ))}
                  </SpecGroup>
                )}

                {/* RAM */}
                {totalRam > 0 && (
                  <SpecGroup icon={MemoryStick} title="Memory" accent="#86efac">
                    <SpecRow label="Total" value={`${totalRam} GB`} />
                    {c.components.ram.map((r, i) => (
                      <SpecRow key={i} label={r.manufacturer || `Module ${i + 1}`} value={[r.capacity_gb ? `${r.capacity_gb}GB` : null, r.type, r.speed_mhz ? `${r.speed_mhz} MHz` : null].filter(Boolean).join(' ')} />
                    ))}
                  </SpecGroup>
                )}

                {/* Storage */}
                {storageList.length > 0 && (
                  <SpecGroup icon={HardDrive} title="Storage" accent="#fbbf24">
                    {totalStorage > 0 && <SpecRow label="Total" value={totalStorage >= 1000 ? `${(totalStorage / 1000).toFixed(1)} TB` : `${totalStorage} GB`} />}
                    {c.components.storage.map((s, i) => (
                      <SpecRow key={i} label={s.type || `Disk ${i + 1}`} value={[s.brand, s.model, s.capacity_gb ? (s.capacity_gb >= 1000 ? `${(s.capacity_gb/1000).toFixed(1)} TB` : `${s.capacity_gb} GB`) : null].filter(Boolean).join(' ')} />
                    ))}
                  </SpecGroup>
                )}

                {/* Motherboard */}
                {hasMobo && (
                  <SpecGroup icon={CircuitBoard} title="Motherboard" accent="#94a3b8">
                    <SpecRow label="Board" value={[c.components.motherboard.brand, c.components.motherboard.model].filter(Boolean).join(' ')} />
                    {c.components.motherboard.chipset && <SpecRow label="Chipset" value={c.components.motherboard.chipset} />}
                  </SpecGroup>
                )}

                {/* OS */}
                {osList.length > 0 && (
                  <SpecGroup icon={Globe} title="Software" accent="#67e8f9">
                    {osList.map((os, i) => (
                      <SpecRow key={i} label={osList.length > 1 ? `OS ${i + 1}` : 'OS'} value={[os.name, os.version, os.edition].filter(Boolean).join(' ')} />
                    ))}
                  </SpecGroup>
                )}

                {/* PSU + Cooling */}
                {(hasPSU || hasCooler || hasCase) && (
                  <SpecGroup icon={Zap} title="Power & Cooling" accent="#fb923c">
                    {hasPSU && <SpecRow label="PSU" value={[c.components.psu.brand, c.components.psu.model, c.components.psu.wattage ? `${c.components.psu.wattage}W` : null].filter(Boolean).join(' ')} />}
                    {hasCooler && <SpecRow label="Cooler" value={[c.components.cooler.brand, c.components.cooler.model, c.components.cooler.water_cooling ? '(AIO)' : null].filter(Boolean).join(' ')} />}
                    {hasCase && <SpecRow label="Case" value={[c.components.case.brand, c.components.case.model].filter(Boolean).join(' ')} />}
                  </SpecGroup>
                )}

                {/* Peripherals */}
                {hasPeripherals && (
                  <SpecGroup icon={Keyboard} title="Peripherals" accent="#a78bfa">
                    {c.peripherals.monitor?.map((m, i) => (
                      <SpecRow key={i} label="Monitor" value={[m.brand, m.model, m.size_inch ? `${m.size_inch}"` : null, m.refresh_rate_hz ? `${m.refresh_rate_hz}Hz` : null].filter(Boolean).join(' ')} />
                    ))}
                    {c.peripherals.keyboard?.brand && c.peripherals.keyboard.brand !== 'N/A' && <SpecRow label="Keyboard" value={[c.peripherals.keyboard.brand, c.peripherals.keyboard.model].filter(Boolean).join(' ')} />}
                    {c.peripherals.mouse?.brand && c.peripherals.mouse.brand !== 'N/A' && <SpecRow label="Mouse" value={[c.peripherals.mouse.brand, c.peripherals.mouse.model].filter(Boolean).join(' ')} />}
                  </SpecGroup>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PhoneCard({ phone: p, index }) {
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="visible" viewport={{ once: true }}
      style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ padding: '1rem 1.125rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'var(--bg-overlay)' }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hover)', color: 'var(--text-secondary)', flexShrink: 0 }}>
          <Smartphone size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[p.brand, p.model].filter(Boolean).join(' ') || 'Unknown Phone'}
          </h3>
          {p.soc && <p style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{p.soc}</p>}
        </div>
        {p.os?.name && (
          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 9999, padding: '0.15rem 0.55rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
            {p.os.name}
          </span>
        )}
      </div>

      {/* Specs grid */}
      <div style={{ padding: '0.875rem 1.125rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem 1rem' }}>
        {p.ram_gb > 0 && (
          <div>
            <p style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>RAM</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.ram_gb} GB</p>
          </div>
        )}
        {p.storage_gb > 0 && (
          <div>
            <p style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Storage</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.storage_gb} GB</p>
          </div>
        )}
        {p.battery > 0 && (
          <div>
            <p style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Battery</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.battery} mAh</p>
          </div>
        )}
        {p.display?.size_inch > 0 && (
          <div>
            <p style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Display</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.display.size_inch}" Â· {p.display.refresh_rate}Hz</p>
          </div>
        )}
        {p.display?.resolution?.width > 0 && (
          <div>
            <p style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Resolution</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.display.resolution.width}Ã—{p.display.resolution.height}</p>
          </div>
        )}
        {p.camera?.rear?.length > 0 && (
          <div>
            <p style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Cameras</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.camera.front || 0}MP + {p.camera.rear.join('+')}MP</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const { user, token } = useStore();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [urlCopied, setUrlCopied] = useState(false);
  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const isOwner = !!user && user.login === username;
  const [editMode, setEditMode]           = useState(false);
  const [editName, setEditName]           = useState('');
  const [editLocation, setEditLocation]   = useState('');
  const [editBio, setEditBio]             = useState('');
  const [saving, setSaving]               = useState(false);
  const [saveMsg, setSaveMsg]             = useState('');

  useEffect(() => {
    if (data) {
      setEditName(data.profile.display_name || '');
      setEditLocation(data.profile.location || '');
      setEditBio(data.profile.bio || '');
    }
  }, [data]);

  const saveProfile = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const gh = new GitHubService(token);
      const updated = {
        ...data,
        profile: { ...data.profile, display_name: editName, location: editLocation, bio: editBio },
        last_updated: new Date().toISOString(),
      };
      await gh.submitProfile(updated);
      setData(updated);
      setEditMode(false);
      setSaveMsg('Profile update submitted as a Pull Request!');
      setTimeout(() => setSaveMsg(''), 5000);
    } catch (err) {
      setSaveMsg(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const gh = new GitHubService('');
    gh.getUserProfile(username)
      .then((profile) => {
        if (!profile) throw new Error('Profile not found');
        setData(profile);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)', padding: 'var(--space-lg)', textAlign: 'center' }}>
        <AlertCircle size={36} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Profile Not Found</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          No profile exists for <code style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>@{username}</code>.
        </p>
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const computerCount = data.computers?.length || 0;
  const phoneCount    = data.phones?.length || 0;

  return (
    <div style={{ maxWidth: '58rem', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem) 6rem' }}>

      {/* â”€â”€ Hero Card â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: '2rem' }}
      >
        {/* Top accent strip */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.04))' }} />

        {/* Main hero content */}
        <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1.25rem' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-hover)', background: 'var(--bg-overlay)' }}>
              <img
                src={`https://avatars.githubusercontent.com/${data.username || username}`}
                alt={data.profile.display_name || data.username}
                width={76} height={76}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const p = e.currentTarget.parentElement;
                  p.style.cssText += ';display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:var(--text-secondary);';
                  p.textContent = (data.profile.display_name?.[0] || data.username[0]).toUpperCase();
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.2rem' }}>
                  {data.profile.display_name || data.username}
                </h1>
                <p style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: data.profile.bio ? '0.6rem' : 0 }}>
                  @{data.username}
                </p>
              </div>
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                <button onClick={copyUrl} className="btn-ghost"
                  style={{ fontSize: '0.73rem', padding: '0.35rem 0.7rem', gap: '0.35rem' }}
                  title="Copy profile URL"
                >
                  {urlCopied ? <Check size={12} /> : <Copy size={12} />}
                  {urlCopied ? 'Copied!' : 'Copy URL'}
                </button>
                {isOwner && (
                  <button onClick={() => setEditMode(e => !e)} className="btn-ghost"
                    style={{ fontSize: '0.73rem', padding: '0.35rem 0.7rem', gap: '0.35rem' }}
                  >
                    {editMode ? <X size={12} /> : <Pencil size={12} />}
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
            </div>

            {data.profile.bio && (
              <p style={{ fontSize: '0.845rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '42rem' }}>
                {data.profile.bio}
              </p>
            )}

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.25rem', fontSize: '0.79rem', color: 'var(--text-muted)' }}>
              {data.profile.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={11} />{data.profile.location}
                </span>
              )}
              <a href={`https://github.com/${data.profile.github || data.username}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', transition: 'color var(--dur-base)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Github size={11} />@{data.profile.github || data.username}
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
          {[
            { icon: Monitor, label: 'Computers', value: computerCount },
            { icon: Smartphone, label: 'Phones', value: phoneCount },
          ].map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <div key={i} style={{ flex: 1, padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', borderRight: i === 0 ? '1px solid var(--border)' : 'none' }}>
                <StatIcon size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.92rem', fontWeight: 700, fontFamily: 'monospace', color: stat.value > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Inline edit form (owner only) */}
        <AnimatePresence>
          {isOwner && editMode && (
            <motion.div
              key="edit"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'var(--bg-overlay)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <p style={{ fontSize: '0.7rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>Edit Profile</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Display Name</label>
                    <input className="input-base" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Display name" style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Country</label>
                    <select className="input-base" value={editLocation} onChange={e => setEditLocation(e.target.value)} style={{ width: '100%' }}>
                      <option value="">â€” No location â€”</option>
                      {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Bio</label>
                    <input className="input-base" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Brief bio" style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                </div>
                {saveMsg && <p style={{ fontSize: '0.78rem', color: saveMsg.startsWith('Save failed') ? '#f87171' : 'var(--text-secondary)' }}>{saveMsg}</p>}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={saveProfile} disabled={saving} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.45rem 1.125rem' }}>
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    {saving ? 'Submittingâ€¦' : 'Save as PR'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* â”€â”€ Computers â”€â”€ */}
      {computerCount > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <Monitor size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 600 }}>Computers</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{computerCount}</span>
          </div>
          <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.computers.map((comp, idx) => (
              <ComputerCard key={comp.id || idx} computer={comp} index={idx} />
            ))}
          </motion.div>
        </section>
      )}

      {/* â”€â”€ Phones â”€â”€ */}
      {phoneCount > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <Smartphone size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 600 }}>Smartphones</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{phoneCount}</span>
          </div>
          <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {data.phones.map((phone, idx) => (
              <PhoneCard key={idx} phone={phone} index={idx} />
            ))}
          </motion.div>
        </section>
      )}

      {/* Empty state */}
      {computerCount === 0 && phoneCount === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Monitor size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p style={{ fontSize: '0.875rem' }}>No devices registered yet.</p>
        </div>
      )}

      {data.last_updated && (
        <p style={{ textAlign: 'center', fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '1.5rem' }}>
          LAST UPDATED Â· {new Date(data.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
        </p>
      )}
    </div>
  );
}
