import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Github, Monitor, Laptop, Smartphone, Cpu, MemoryStick, HardDrive,
  CircuitBoard, Zap, Fan, Box, Tv, Keyboard, Mouse, Headphones, Mic, Speaker,
  Camera, Globe, Loader2, AlertCircle, Copy, Check, Link2,
} from 'lucide-react';
import { GitHubService } from '../lib/github';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

function SpecBadge({ icon: Icon, label, value }) {
  if (!value || value === 'N/A' || value === 0) return null;
  return (
    <div className="spec-badge">
      {Icon && <Icon size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />}
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 1 }}>
          {label}
        </p>
        <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ComponentSection({ title, icon: Icon, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 'var(--space-sm)', fontSize: '0.68rem', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        <Icon size={11} />
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-sm)' }}>
        {children}
      </div>
    </div>
  );
}

function ComputerCard({ computer: c, index }) {
  const isLaptop  = c.type === 'laptop';
  const TypeIcon  = isLaptop ? Laptop : Monitor;
  const totalRam  = (c.components.ram || []).reduce((sum, r) => sum + (r.capacity_gb || 0), 0);
  const totalStorage = (c.components.storage || []).reduce((sum, s) => sum + (s.capacity_gb || 0), 0);

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="card"
    >
      <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <div style={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
          <TypeIcon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {c.name || c.id}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ textTransform: 'capitalize' }}>{c.type}</span>
            {c.role && <span>· {c.role}</span>}
            {c.manufacturer && <span>· {c.manufacturer}</span>}
            {c.year > 0 && <span>· {c.year}</span>}
          </div>
          {c.description && <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{c.description}</p>}
        </div>
      </div>

      <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {c.components.cpu?.brand && (
          <ComponentSection title="Processor" icon={Cpu}>
            <SpecBadge icon={Cpu} label="CPU" value={`${c.components.cpu.brand} ${c.components.cpu.series} ${c.components.cpu.model}`} />
            {c.components.cpu.cores > 0 && <SpecBadge label="Cores / Threads" value={`${c.components.cpu.cores}C / ${c.components.cpu.threads}T`} />}
            {c.components.cpu.base_clock_mhz > 0 && <SpecBadge label="Base Clock" value={`${c.components.cpu.base_clock_mhz} MHz`} />}
          </ComponentSection>
        )}

        {c.components.gpu?.length > 0 && (
          <ComponentSection title="Graphics" icon={Tv}>
            {c.components.gpu.map((g, i) => (
              <SpecBadge key={i} icon={Tv} label={`GPU${c.components.gpu.length > 1 ? ' ' + (i + 1) : ''}`} value={`${g.brand} ${g.model}${g.vram_gb ? ` (${g.vram_gb}GB)` : ''}`} />
            ))}
          </ComponentSection>
        )}

        {c.components.ram?.length > 0 && (
          <ComponentSection title="Memory" icon={MemoryStick}>
            <SpecBadge icon={MemoryStick} label="Total RAM" value={`${totalRam} GB`} />
            {c.components.ram.map((r, i) => (
              <SpecBadge key={i} label={r.manufacturer || 'Module'} value={`${r.capacity_gb}GB ${r.type} @ ${r.speed_mhz}MHz`} />
            ))}
          </ComponentSection>
        )}

        {c.components.motherboard?.brand && (
          <ComponentSection title="Motherboard" icon={CircuitBoard}>
            <SpecBadge icon={CircuitBoard} label="Board" value={`${c.components.motherboard.brand} ${c.components.motherboard.model}`} />
            {c.components.motherboard.chipset && <SpecBadge label="Chipset" value={c.components.motherboard.chipset} />}
          </ComponentSection>
        )}

        {c.components.storage?.length > 0 && (
          <ComponentSection title="Storage" icon={HardDrive}>
            <SpecBadge icon={HardDrive} label="Total" value={totalStorage >= 1000 ? `${(totalStorage / 1000).toFixed(1)} TB` : `${totalStorage} GB`} />
            {c.components.storage.map((s, i) => (
              <SpecBadge key={i} label={`${s.type} ${s.form_factor}`} value={`${s.brand ? s.brand + ' ' : ''}${s.model} (${s.capacity_gb}GB)`} />
            ))}
          </ComponentSection>
        )}

        {c.type === 'desktop' && c.components.psu?.brand && (
          <ComponentSection title="Power & Cooling" icon={Zap}>
            <SpecBadge icon={Zap} label="PSU" value={`${c.components.psu.brand} ${c.components.psu.model} ${c.components.psu.wattage}W ${c.components.psu.efficiency}`} />
            {c.components.cooler?.brand && <SpecBadge icon={Fan} label="Cooler" value={`${c.components.cooler.brand} ${c.components.cooler.model}${c.components.cooler.water_cooling ? ' (AIO)' : ''}`} />}
            {c.components.case?.brand && <SpecBadge icon={Box} label="Case" value={`${c.components.case.brand} ${c.components.case.model}`} />}
          </ComponentSection>
        )}

        {(() => {
          const osList = c.software?.os_list?.length > 0
            ? c.software.os_list
            : (c.software?.os?.name ? [c.software.os] : []);
          if (!osList.length) return null;
          const isDualBoot = osList.length > 1;
          return (
            <ComponentSection title="Software" icon={Globe}>
              {isDualBoot && (
                <div className="spec-badge" style={{ gridColumn: '1 / -1' }}>
                  <Globe size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 1 }}>Setup</p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Dual Boot ({osList.length} entries)</p>
                  </div>
                </div>
              )}
              {osList.map((os, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <SpecBadge
                    icon={Globe}
                    label={isDualBoot ? `OS ${i + 1}${os.is_primary === false ? '' : ' (primary)'}` : 'OS'}
                    value={`${os.name}${os.version ? ' ' + os.version : ''}${os.edition ? ' ' + os.edition : ''}`}
                  />
                  {os.desktop_environment && <SpecBadge label="DE" value={os.desktop_environment} />}
                  {os.renderer && <SpecBadge label="Renderer" value={os.renderer} />}
                </div>
              ))}
            </ComponentSection>
          );
        })()}

        {c.peripherals?.monitor?.length > 0 && (
          <ComponentSection title="Peripherals" icon={Tv}>
            {c.peripherals.monitor.map((m, i) => (
              <SpecBadge key={i} icon={Tv} label="Monitor" value={`${m.brand} ${m.model} ${m.size_inch}" ${m.resolution?.width}x${m.resolution?.height} @${m.refresh_rate_hz}Hz`} />
            ))}
            {c.peripherals.keyboard?.brand && c.peripherals.keyboard.brand !== 'N/A' && <SpecBadge icon={Keyboard} label="Keyboard" value={`${c.peripherals.keyboard.brand} ${c.peripherals.keyboard.model}`} />}
            {c.peripherals.mouse?.brand && c.peripherals.mouse.brand !== 'N/A' && <SpecBadge icon={Mouse} label="Mouse" value={`${c.peripherals.mouse.brand} ${c.peripherals.mouse.model}`} />}
            {c.peripherals.audio?.headphones?.brand && c.peripherals.audio.headphones.brand !== 'N/A' && <SpecBadge icon={Headphones} label="Headphones" value={`${c.peripherals.audio.headphones.brand} ${c.peripherals.audio.headphones.model}`} />}
            {c.peripherals.audio?.microphone?.brand && c.peripherals.audio.microphone.brand !== 'N/A' && <SpecBadge icon={Mic} label="Microphone" value={`${c.peripherals.audio.microphone.brand} ${c.peripherals.audio.microphone.model}`} />}
            {c.peripherals.audio?.speakers?.brand && c.peripherals.audio.speakers.brand !== 'N/A' && <SpecBadge icon={Speaker} label="Speakers" value={`${c.peripherals.audio.speakers.brand} ${c.peripherals.audio.speakers.model}`} />}
          </ComponentSection>
        )}

        {c.camera?.brand && c.camera.brand !== 'N/A' && (
          <ComponentSection title="Camera" icon={Camera}>
            <SpecBadge icon={Camera} label="Webcam" value={`${c.camera.brand} ${c.camera.model} ${c.camera.resolution?.width}x${c.camera.resolution?.height} @${c.camera.fps}fps`} />
          </ComponentSection>
        )}
      </div>
    </motion.div>
  );
}

function PhoneCard({ phone: p, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="card"
    >
      <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <div style={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
          <Smartphone size={18} />
        </div>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{p.brand} {p.model}</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{p.soc}</p>
        </div>
      </div>
      <div style={{ padding: 'var(--space-xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-sm)' }}>
        {p.ram_gb > 0 && <SpecBadge icon={MemoryStick} label="RAM" value={`${p.ram_gb} GB`} />}
        {p.storage_gb > 0 && <SpecBadge icon={HardDrive} label="Storage" value={`${p.storage_gb} GB`} />}
        {p.battery > 0 && <SpecBadge icon={Zap} label="Battery" value={`${p.battery} mAh`} />}
        {p.display?.size_inch > 0 && <SpecBadge icon={Tv} label="Display" value={`${p.display.size_inch}" ${p.display.type} ${p.display.refresh_rate}Hz`} />}
        {p.display?.resolution?.width > 0 && <SpecBadge label="Resolution" value={`${p.display.resolution.width}x${p.display.resolution.height}`} />}
        {p.camera?.rear?.length > 0 && <SpecBadge icon={Camera} label="Cameras" value={`${p.camera.front || 0}MP + ${p.camera.rear.join('+')}MP`} />}
        {p.os?.name && <SpecBadge icon={Globe} label="OS" value={p.os.name} />}
      </div>
    </motion.div>
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <div
      className="reveal"
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}
    >
      <Icon size={12} />
      {label}
      <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: 'var(--space-sm)' }} />
    </div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [copied, setCopied]   = useState(false);
  useReveal();

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://rigtree.pages.dev/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: 'var(--space-xl) var(--space-lg) var(--space-3xl)' }}>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card"
        style={{ marginBottom: 'var(--space-2xl)', padding: 'clamp(1rem, 4vw, var(--space-2xl))' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-xl)' }}>
          <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-hover)', background: 'var(--bg-overlay)' }}>
            <img
              src={`https://avatars.githubusercontent.com/${data.username || username}`}
              alt={data.profile.display_name || data.username}
              width={64}
              height={64}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.display = 'flex';
                e.currentTarget.parentElement.style.alignItems = 'center';
                e.currentTarget.parentElement.style.justifyContent = 'center';
                e.currentTarget.parentElement.style.fontSize = '1.5rem';
                e.currentTarget.parentElement.style.fontWeight = '800';
                e.currentTarget.parentElement.style.color = 'var(--text-secondary)';
                e.currentTarget.parentElement.textContent = (data.profile.display_name?.[0] || data.username[0]).toUpperCase();
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0 }}>
                {data.profile.display_name || data.username}
              </h1>
              <button
                onClick={copyUrl}
                title="Copy profile link"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', background: 'transparent',
                  color: copied ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontSize: '0.72rem', fontFamily: 'monospace', cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = copied ? 'var(--text-secondary)' : 'var(--text-muted)'; }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
            {data.profile.bio && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 'var(--space-md)' }}>
                {data.profile.bio}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {data.profile.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={12} /> {data.profile.location}
                </span>
              )}
              <a
                href={`https://github.com/${data.profile.github || data.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', transition: 'color var(--dur-base)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <Github size={12} /> @{data.profile.github || data.username}
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Computers */}
      {data.computers?.length > 0 && (
        <section style={{ marginBottom: 'var(--space-2xl)' }}>
          <SectionHeading icon={Monitor} label="Computers" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {data.computers.map((comp, idx) => (
              <ComputerCard key={comp.id} computer={comp} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Phones */}
      {data.phones?.length > 0 && (
        <section style={{ marginBottom: 'var(--space-2xl)' }}>
          <SectionHeading icon={Smartphone} label="Smartphones" />
          <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {data.phones.map((phone, idx) => (
              <PhoneCard key={idx} phone={phone} index={idx} />
            ))}
          </div>
        </section>
      )}

      {data.last_updated && (
        <p style={{ textAlign: 'center', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          UPDATED {new Date(data.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
        </p>
      )}
    </div>
  );
}
