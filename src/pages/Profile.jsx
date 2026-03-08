import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Github, Monitor, Laptop, Smartphone, Cpu, MemoryStick, HardDrive,
  CircuitBoard, Zap, Fan, Box, Tv, Keyboard, Mouse, Headphones, Mic, Speaker,
  Camera, Globe, Loader2, AlertCircle,
} from 'lucide-react';
import { GitHubService } from '../lib/github';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SpecBadge({ icon: Icon, label, value, color = 'cyan' }) {
  if (!value || value === 'N/A' || value === 0) return null;
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/15',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/15',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/15',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/15',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/15',
  };
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${colors[color]}`}>
      {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" />}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider opacity-60">{label}</p>
        <p className="text-xs font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ComponentSection({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>
    </div>
  );
}

function ComputerCard({ computer, index }) {
  const c = computer;
  const isLaptop = c.type === 'laptop';
  const TypeIcon = isLaptop ? Laptop : Monitor;

  const totalRam = (c.components.ram || []).reduce((sum, r) => sum + (r.capacity_gb || 0), 0);
  const totalStorage = (c.components.storage || []).reduce((sum, s) => sum + (s.capacity_gb || 0), 0);

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass overflow-hidden"
    >
      <div className="border-b border-white/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <TypeIcon className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-zinc-100 font-mono">{c.name || c.id}</h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span className="capitalize">{c.type}</span>
              <span className="text-zinc-700">·</span>
              <span>{c.role}</span>
              <span className="text-zinc-700">·</span>
              <span>{c.manufacturer}</span>
              {c.year > 0 && <><span className="text-zinc-700">·</span><span>{c.year}</span></>}
            </div>
            {c.description && <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{c.description}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {c.components.cpu?.brand && (
          <ComponentSection title="Processor" icon={Cpu}>
            <SpecBadge icon={Cpu} label="CPU" value={`${c.components.cpu.brand} ${c.components.cpu.series} ${c.components.cpu.model}`} color="cyan" />
            {c.components.cpu.cores > 0 && <SpecBadge label="Cores / Threads" value={`${c.components.cpu.cores}C / ${c.components.cpu.threads}T`} color="cyan" />}
            {c.components.cpu.base_clock_mhz > 0 && <SpecBadge label="Base Clock" value={`${c.components.cpu.base_clock_mhz} MHz`} color="cyan" />}
          </ComponentSection>
        )}

        {c.components.gpu?.length > 0 && (
          <ComponentSection title="Graphics" icon={Tv}>
            {c.components.gpu.map((g, i) => (
              <SpecBadge key={i} icon={Tv} label={`GPU ${c.components.gpu.length > 1 ? i + 1 : ''}`} value={`${g.brand} ${g.model}${g.vram_gb ? ` (${g.vram_gb}GB)` : ''}`} color="violet" />
            ))}
          </ComponentSection>
        )}

        {c.components.ram?.length > 0 && (
          <ComponentSection title="Memory" icon={MemoryStick}>
            <SpecBadge icon={MemoryStick} label="Total RAM" value={`${totalRam} GB`} color="emerald" />
            {c.components.ram.map((r, i) => (
              <SpecBadge key={i} label={r.manufacturer || 'Module'} value={`${r.capacity_gb}GB ${r.type} @ ${r.speed_mhz}MHz`} color="emerald" />
            ))}
          </ComponentSection>
        )}

        {c.components.motherboard?.brand && (
          <ComponentSection title="Motherboard" icon={CircuitBoard}>
            <SpecBadge icon={CircuitBoard} label="Board" value={`${c.components.motherboard.brand} ${c.components.motherboard.model}`} color="amber" />
            {c.components.motherboard.chipset && <SpecBadge label="Chipset" value={c.components.motherboard.chipset} color="amber" />}
          </ComponentSection>
        )}

        {c.components.storage?.length > 0 && (
          <ComponentSection title="Storage" icon={HardDrive}>
            <SpecBadge icon={HardDrive} label="Total" value={totalStorage >= 1000 ? `${(totalStorage / 1000).toFixed(1)} TB` : `${totalStorage} GB`} color="blue" />
            {c.components.storage.map((s, i) => (
              <SpecBadge key={i} label={`${s.type} ${s.form_factor}`} value={`${s.brand ? s.brand + ' ' : ''}${s.model} (${s.capacity_gb}GB)`} color="blue" />
            ))}
          </ComponentSection>
        )}

        {c.type === 'desktop' && c.components.psu?.brand && (
          <ComponentSection title="Power & Cooling" icon={Zap}>
            <SpecBadge icon={Zap} label="PSU" value={`${c.components.psu.brand} ${c.components.psu.model} ${c.components.psu.wattage}W ${c.components.psu.efficiency}`} color="amber" />
            {c.components.cooler?.brand && (
              <SpecBadge icon={Fan} label="Cooler" value={`${c.components.cooler.brand} ${c.components.cooler.model}${c.components.cooler.water_cooling ? ' (AIO)' : ''}`} color="cyan" />
            )}
            {c.components.case?.brand && (
              <SpecBadge icon={Box} label="Case" value={`${c.components.case.brand} ${c.components.case.model}`} color="violet" />
            )}
          </ComponentSection>
        )}

        {c.software?.os?.name && (
          <ComponentSection title="Software" icon={Globe}>
            <SpecBadge icon={Globe} label="OS" value={`${c.software.os.name}${c.software.os.version ? ' ' + c.software.os.version : ''}${c.software.os.edition ? ' ' + c.software.os.edition : ''}`} color="emerald" />
            {c.software.os.desktop_environment && <SpecBadge label="DE" value={c.software.os.desktop_environment} color="emerald" />}
            {c.software.os.renderer && <SpecBadge label="Renderer" value={c.software.os.renderer} color="emerald" />}
          </ComponentSection>
        )}

        {c.peripherals?.monitor?.length > 0 && (
          <ComponentSection title="Peripherals" icon={Tv}>
            {c.peripherals.monitor.map((m, i) => (
              <SpecBadge key={i} icon={Tv} label="Monitor" value={`${m.brand} ${m.model} ${m.size_inch}" ${m.resolution?.width}x${m.resolution?.height} @${m.refresh_rate_hz}Hz`} color="violet" />
            ))}
            {c.peripherals.keyboard?.brand && c.peripherals.keyboard.brand !== 'N/A' && (
              <SpecBadge icon={Keyboard} label="Keyboard" value={`${c.peripherals.keyboard.brand} ${c.peripherals.keyboard.model}`} color="cyan" />
            )}
            {c.peripherals.mouse?.brand && c.peripherals.mouse.brand !== 'N/A' && (
              <SpecBadge icon={Mouse} label="Mouse" value={`${c.peripherals.mouse.brand} ${c.peripherals.mouse.model}`} color="cyan" />
            )}
            {c.peripherals.audio?.headphones?.brand && c.peripherals.audio.headphones.brand !== 'N/A' && (
              <SpecBadge icon={Headphones} label="Headphones" value={`${c.peripherals.audio.headphones.brand} ${c.peripherals.audio.headphones.model}`} color="rose" />
            )}
            {c.peripherals.audio?.microphone?.brand && c.peripherals.audio.microphone.brand !== 'N/A' && (
              <SpecBadge icon={Mic} label="Microphone" value={`${c.peripherals.audio.microphone.brand} ${c.peripherals.audio.microphone.model}`} color="rose" />
            )}
            {c.peripherals.audio?.speakers?.brand && c.peripherals.audio.speakers.brand !== 'N/A' && (
              <SpecBadge icon={Speaker} label="Speakers" value={`${c.peripherals.audio.speakers.brand} ${c.peripherals.audio.speakers.model}`} color="rose" />
            )}
          </ComponentSection>
        )}

        {c.camera?.brand && c.camera.brand !== 'N/A' && (
          <ComponentSection title="Camera" icon={Camera}>
            <SpecBadge icon={Camera} label="Webcam" value={`${c.camera.brand} ${c.camera.model} ${c.camera.resolution?.width}x${c.camera.resolution?.height} @${c.camera.fps}fps`} color="amber" />
          </ComponentSection>
        )}
      </div>
    </motion.div>
  );
}

function PhoneCard({ phone, index }) {
  const p = phone;
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass overflow-hidden"
    >
      <div className="border-b border-white/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20">
            <Smartphone className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">{p.brand} {p.model}</h3>
            <p className="text-xs text-zinc-500">{p.soc}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
        {p.ram_gb > 0 && <SpecBadge icon={MemoryStick} label="RAM" value={`${p.ram_gb} GB`} color="emerald" />}
        {p.storage_gb > 0 && <SpecBadge icon={HardDrive} label="Storage" value={`${p.storage_gb} GB`} color="blue" />}
        {p.battery > 0 && <SpecBadge icon={Zap} label="Battery" value={`${p.battery} mAh`} color="amber" />}
        {p.display?.size_inch > 0 && (
          <SpecBadge icon={Tv} label="Display" value={`${p.display.size_inch}" ${p.display.type} ${p.display.refresh_rate}Hz`} color="violet" />
        )}
        {p.display?.resolution?.width > 0 && (
          <SpecBadge label="Resolution" value={`${p.display.resolution.width}x${p.display.resolution.height}`} color="violet" />
        )}
        {p.camera?.rear?.length > 0 && (
          <SpecBadge icon={Camera} label="Cameras" value={`${p.camera.front || 0}MP + ${p.camera.rear.join('+')}MP`} color="rose" />
        )}
        {p.os?.name && <SpecBadge icon={Globe} label="OS" value={p.os.name} color="emerald" />}
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="h-10 w-10 text-zinc-600" />
        <h2 className="text-xl font-bold text-zinc-300">Profile Not Found</h2>
        <p className="text-sm text-zinc-500">
          No profile exists for <span className="font-mono text-zinc-400">@{username}</span>.
        </p>
        <Link to="/" className="btn-secondary mt-2">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial="hidden" animate="visible" className="mb-10">
        <motion.div variants={fadeUp} custom={0} className="glass p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-2xl font-bold text-white">
              {data.profile.display_name?.[0]?.toUpperCase() || data.username[0].toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {data.profile.display_name || data.username}
              </h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500 sm:justify-start">
                {data.profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {data.profile.location}
                  </span>
                )}
                <a
                  href={`https://github.com/${data.profile.github || data.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-zinc-300 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" /> @{data.profile.github || data.username}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {data.computers?.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            <Monitor className="h-4 w-4" />
            Computers
          </h2>
          <div className="space-y-4">
            {data.computers.map((comp, idx) => (
              <ComputerCard key={comp.id} computer={comp} index={idx} />
            ))}
          </div>
        </section>
      )}

      {data.phones?.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            <Smartphone className="h-4 w-4" />
            Smartphones
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.phones.map((phone, idx) => (
              <PhoneCard key={idx} phone={phone} index={idx} />
            ))}
          </div>
        </section>
      )}

      {data.last_updated && (
        <p className="text-center text-xs text-zinc-600">
          Last updated: {new Date(data.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}
