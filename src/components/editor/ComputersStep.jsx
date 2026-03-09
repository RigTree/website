import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Monitor, Laptop, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import {
  createDefaultComputer, createDefaultGpu, createDefaultRam,
  createDefaultStorage, createDefaultMonitor, createDefaultOS,
  COMPUTER_TYPES, COMPUTER_ROLES, RAM_TYPES,
  STORAGE_TYPES, STORAGE_FORM_FACTORS, PSU_EFFICIENCIES,
} from '../../lib/schema';

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      className="input-base"
      placeholder={placeholder}
      value={value || (type === 'number' ? '' : '')}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value)}
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select className="input-base" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt || '— Select —'}</option>
      ))}
    </select>
  );
}

function CheckboxInput({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ accentColor: 'var(--text-primary)', width: '0.875rem', height: '0.875rem' }} />
      {label}
    </label>
  );
}

function ArrayEditor({ items, onAdd, onRemove, onUpdate, renderItem, addLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ position: 'relative', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-md)' }}>
          <button onClick={() => onRemove(idx)} className="btn-ghost" style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', padding: '0.2rem', color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color='#f87171'} onMouseLeave={(e) => e.currentTarget.style.color='var(--text-muted)'}>
            <Trash2 size={13} />
          </button>
          {renderItem(item, idx, onUpdate)}
        </div>
      ))}
      <button onClick={onAdd} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px dashed var(--border-hover)', padding: '0.625rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <Plus size={13} />
        {addLabel}
      </button>
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={onToggle} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', fontSize: '0.8rem', fontWeight: 500, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color var(--dur-base)' }} onMouseEnter={(e) => e.currentTarget.style.color='var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color='var(--text-secondary)'}>
        {title}
        {open ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComputerForm({ computer, onUpdate }) {
  const [openSections, setOpenSections] = useState({ general: true, cpu: true, gpu: true, ram: true, storage: true, os: true });
  const toggle = (s) => setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const set = (path, value) => {
    onUpdate((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const c = computer;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Section title="General" open={openSections.general} onToggle={() => toggle('general')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Type"><SelectInput value={c.type} onChange={(v) => set('type', v)} options={COMPUTER_TYPES} /></Field>
          <Field label="Name"><TextInput value={c.name} onChange={(v) => set('name', v)} placeholder="e.g. D3SKT0P" /></Field>
          <Field label="Role"><SelectInput value={c.role} onChange={(v) => set('role', v)} options={COMPUTER_ROLES} /></Field>
          <Field label="Manufacturer"><TextInput value={c.manufacturer} onChange={(v) => set('manufacturer', v)} placeholder="Custom Build" /></Field>
          <Field label="Year"><TextInput value={c.year} onChange={(v) => set('year', v)} type="number" /></Field>
          <Field label="Options" className="flex flex-col justify-end"><CheckboxInput label="Virtual Machine" checked={c.virtual_machine} onChange={(v) => set('virtual_machine', v)} /></Field>
        </div>
        <Field label="Description"><TextInput value={c.description} onChange={(v) => set('description', v)} placeholder="Brief description of this machine..." /></Field>
      </Section>

      <Section title="CPU" open={openSections.cpu} onToggle={() => toggle('cpu')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Brand"><TextInput value={c.components.cpu.brand} onChange={(v) => set('components.cpu.brand', v)} placeholder="Intel" /></Field>
          <Field label="Series"><TextInput value={c.components.cpu.series} onChange={(v) => set('components.cpu.series', v)} placeholder="i5" /></Field>
          <Field label="Model"><TextInput value={c.components.cpu.model} onChange={(v) => set('components.cpu.model', v)} placeholder="11600K" /></Field>
          <Field label="Architecture"><TextInput value={c.components.cpu.architecture} onChange={(v) => set('components.cpu.architecture', v)} placeholder="Rocket Lake" /></Field>
          <Field label="Cores"><TextInput value={c.components.cpu.cores} onChange={(v) => set('components.cpu.cores', v)} type="number" /></Field>
          <Field label="Threads"><TextInput value={c.components.cpu.threads} onChange={(v) => set('components.cpu.threads', v)} type="number" /></Field>
          <Field label="Base Clock (MHz)"><TextInput value={c.components.cpu.base_clock_mhz} onChange={(v) => set('components.cpu.base_clock_mhz', v)} type="number" /></Field>
        </div>
      </Section>

      <Section title={`GPUs (${c.components.gpu.length})`} open={openSections.gpu} onToggle={() => toggle('gpu')}>
        <ArrayEditor
          items={c.components.gpu}
          onAdd={() => set('components.gpu', [...c.components.gpu, createDefaultGpu()])}
          onRemove={(idx) => set('components.gpu', c.components.gpu.filter((_, i) => i !== idx))}
          onUpdate={(idx, field, val) => {
            const arr = [...c.components.gpu];
            arr[idx] = { ...arr[idx], [field]: val };
            set('components.gpu', arr);
          }}
          addLabel="Add GPU"
          renderItem={(gpu, idx, onItemUpdate) => (
            <div className="grid grid-cols-3 gap-3 pr-6">
              <Field label="Brand"><TextInput value={gpu.brand} onChange={(v) => onItemUpdate(idx, 'brand', v)} placeholder="NVIDIA" /></Field>
              <Field label="Model"><TextInput value={gpu.model} onChange={(v) => onItemUpdate(idx, 'model', v)} placeholder="GTX 1660 SUPER" /></Field>
              <Field label="VRAM (GB)"><TextInput value={gpu.vram_gb} onChange={(v) => onItemUpdate(idx, 'vram_gb', Number(v))} type="number" /></Field>
            </div>
          )}
        />
      </Section>

      <Section title={`RAM (${c.components.ram.length})`} open={openSections.ram} onToggle={() => toggle('ram')}>
        <ArrayEditor
          items={c.components.ram}
          onAdd={() => set('components.ram', [...c.components.ram, createDefaultRam()])}
          onRemove={(idx) => set('components.ram', c.components.ram.filter((_, i) => i !== idx))}
          onUpdate={(idx, field, val) => {
            const arr = [...c.components.ram];
            arr[idx] = { ...arr[idx], [field]: field === 'type' ? val : Number(val) || val };
            set('components.ram', arr);
          }}
          addLabel="Add RAM Module"
          renderItem={(ram, idx, onItemUpdate) => (
            <div className="grid grid-cols-2 gap-3 pr-6 sm:grid-cols-3">
              <Field label="Type"><SelectInput value={ram.type} onChange={(v) => onItemUpdate(idx, 'type', v)} options={RAM_TYPES} /></Field>
              <Field label="Capacity (GB)"><TextInput value={ram.capacity_gb} onChange={(v) => onItemUpdate(idx, 'capacity_gb', Number(v))} type="number" /></Field>
              <Field label="Speed (MHz)"><TextInput value={ram.speed_mhz} onChange={(v) => onItemUpdate(idx, 'speed_mhz', Number(v))} type="number" /></Field>
              <Field label="Manufacturer"><TextInput value={ram.manufacturer} onChange={(v) => onItemUpdate(idx, 'manufacturer', v)} placeholder="Corsair" /></Field>
              <Field label="Model"><TextInput value={ram.model} onChange={(v) => onItemUpdate(idx, 'model', v)} placeholder="Vengeance RGB Pro" /></Field>
              <Field label="Modules"><TextInput value={ram.modules} onChange={(v) => onItemUpdate(idx, 'modules', Number(v))} type="number" /></Field>
            </div>
          )}
        />
      </Section>

      <Section title="Motherboard" open={openSections.mobo} onToggle={() => toggle('mobo')}>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Brand"><TextInput value={c.components.motherboard.brand} onChange={(v) => set('components.motherboard.brand', v)} placeholder="GIGABYTE" /></Field>
          <Field label="Model"><TextInput value={c.components.motherboard.model} onChange={(v) => set('components.motherboard.model', v)} placeholder="Z590 UD AC" /></Field>
          <Field label="Chipset"><TextInput value={c.components.motherboard.chipset} onChange={(v) => set('components.motherboard.chipset', v)} placeholder="Z590" /></Field>
        </div>
      </Section>

      <Section title={`Storage (${c.components.storage.length})`} open={openSections.storage} onToggle={() => toggle('storage')}>
        <ArrayEditor
          items={c.components.storage}
          onAdd={() => set('components.storage', [...c.components.storage, createDefaultStorage()])}
          onRemove={(idx) => set('components.storage', c.components.storage.filter((_, i) => i !== idx))}
          onUpdate={(idx, field, val) => {
            const arr = [...c.components.storage];
            arr[idx] = { ...arr[idx], [field]: field === 'capacity_gb' ? Number(val) : val };
            set('components.storage', arr);
          }}
          addLabel="Add Storage"
          renderItem={(disk, idx, onItemUpdate) => (
            <div className="grid grid-cols-2 gap-3 pr-6 sm:grid-cols-3">
              <Field label="Type"><SelectInput value={disk.type} onChange={(v) => onItemUpdate(idx, 'type', v)} options={STORAGE_TYPES} /></Field>
              <Field label="Form Factor"><SelectInput value={disk.form_factor} onChange={(v) => onItemUpdate(idx, 'form_factor', v)} options={STORAGE_FORM_FACTORS} /></Field>
              <Field label="Brand"><TextInput value={disk.brand} onChange={(v) => onItemUpdate(idx, 'brand', v)} placeholder="Samsung" /></Field>
              <Field label="Model"><TextInput value={disk.model} onChange={(v) => onItemUpdate(idx, 'model', v)} placeholder="970 EVO Plus" /></Field>
              <Field label="Capacity (GB)"><TextInput value={disk.capacity_gb} onChange={(v) => onItemUpdate(idx, 'capacity_gb', Number(v))} type="number" /></Field>
            </div>
          )}
        />
      </Section>

      {c.type === 'desktop' && (
        <>
          <Section title="PSU" open={openSections.psu} onToggle={() => toggle('psu')}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="Brand"><TextInput value={c.components.psu.brand} onChange={(v) => set('components.psu.brand', v)} placeholder="Corsair" /></Field>
              <Field label="Model"><TextInput value={c.components.psu.model} onChange={(v) => set('components.psu.model', v)} placeholder="RM650x" /></Field>
              <Field label="Wattage"><TextInput value={c.components.psu.wattage} onChange={(v) => set('components.psu.wattage', v)} type="number" /></Field>
              <Field label="Efficiency"><SelectInput value={c.components.psu.efficiency} onChange={(v) => set('components.psu.efficiency', v)} options={PSU_EFFICIENCIES} /></Field>
            </div>
          </Section>

          <Section title="Cooler" open={openSections.cooler} onToggle={() => toggle('cooler')}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="Brand"><TextInput value={c.components.cooler.brand} onChange={(v) => set('components.cooler.brand', v)} placeholder="ARCTIC" /></Field>
              <Field label="Model"><TextInput value={c.components.cooler.model} onChange={(v) => set('components.cooler.model', v)} placeholder="Freezer 34" /></Field>
              <Field label="Fans"><TextInput value={c.components.cooler.fans} onChange={(v) => set('components.cooler.fans', v)} type="number" /></Field>
              <Field label="Options"><CheckboxInput label="Water Cooling" checked={c.components.cooler.water_cooling} onChange={(v) => set('components.cooler.water_cooling', v)} /></Field>
            </div>
          </Section>

          <Section title="Case" open={openSections.case} onToggle={() => toggle('case')}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Brand"><TextInput value={c.components.case.brand} onChange={(v) => set('components.case.brand', v)} placeholder="Corsair" /></Field>
              <Field label="Model"><TextInput value={c.components.case.model} onChange={(v) => set('components.case.model', v)} placeholder="Carbide Spec Delta" /></Field>
              <Field label="Fans"><TextInput value={c.components.case.fans} onChange={(v) => set('components.case.fans', v)} type="number" /></Field>
            </div>
          </Section>
        </>
      )}

      <Section title="Operating System" open={openSections.os} onToggle={() => toggle('os')}>
        <ArrayEditor
          items={c.software.os_list || []}
          onAdd={() => set('software.os_list', [...(c.software.os_list || []), createDefaultOS()])}
          onRemove={(idx) => set('software.os_list', (c.software.os_list || []).filter((_, i) => i !== idx))}
          onUpdate={(idx, field, val) => {
            const arr = [...(c.software.os_list || [])];
            arr[idx] = { ...arr[idx], [field]: val };
            set('software.os_list', arr);
          }}
          addLabel="Add OS (dual boot)"
          renderItem={(os, idx, onItemUpdate) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', paddingRight: '2rem' }}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Field label="OS Name"><TextInput value={os.name} onChange={(v) => onItemUpdate(idx, 'name', v)} placeholder="Windows / Arch Linux" /></Field>
                <Field label="Version"><TextInput value={os.version} onChange={(v) => onItemUpdate(idx, 'version', v)} placeholder="11 / 6.x" /></Field>
                <Field label="Edition"><TextInput value={os.edition} onChange={(v) => onItemUpdate(idx, 'edition', v)} placeholder="Pro / KDE" /></Field>
                <Field label="Kernel"><TextInput value={os.kernel} onChange={(v) => onItemUpdate(idx, 'kernel', v)} placeholder="6.6.0" /></Field>
                <Field label="Desktop Environment"><TextInput value={os.desktop_environment} onChange={(v) => onItemUpdate(idx, 'desktop_environment', v)} placeholder="GNOME / KDE" /></Field>
                <Field label="Renderer"><TextInput value={os.renderer} onChange={(v) => onItemUpdate(idx, 'renderer', v)} placeholder="Wayland / X11" /></Field>
              </div>
              <CheckboxInput label="Primary / Default boot entry" checked={os.is_primary} onChange={(v) => onItemUpdate(idx, 'is_primary', v)} />
            </div>
          )}
        />
      </Section>

      <Section title="Peripherals" open={openSections.peripherals} onToggle={() => toggle('peripherals')}>
        <p className="section-label">Monitors</p>
        <ArrayEditor
          items={c.peripherals.monitor}
          onAdd={() => set('peripherals.monitor', [...c.peripherals.monitor, createDefaultMonitor()])}
          onRemove={(idx) => set('peripherals.monitor', c.peripherals.monitor.filter((_, i) => i !== idx))}
          onUpdate={(idx, field, val) => {
            const arr = [...c.peripherals.monitor];
            if (field.startsWith('resolution.')) {
              const key = field.split('.')[1];
              arr[idx] = { ...arr[idx], resolution: { ...arr[idx].resolution, [key]: Number(val) } };
            } else {
              arr[idx] = { ...arr[idx], [field]: ['size_inch', 'refresh_rate_hz'].includes(field) ? Number(val) : val };
            }
            set('peripherals.monitor', arr);
          }}
          addLabel="Add Monitor"
          renderItem={(mon, idx, onItemUpdate) => (
            <div className="grid grid-cols-2 gap-3 pr-6 sm:grid-cols-3">
              <Field label="Brand"><TextInput value={mon.brand} onChange={(v) => onItemUpdate(idx, 'brand', v)} placeholder="MSI" /></Field>
              <Field label="Model"><TextInput value={mon.model} onChange={(v) => onItemUpdate(idx, 'model', v)} placeholder="MAG245R" /></Field>
              <Field label="Size (inch)"><TextInput value={mon.size_inch} onChange={(v) => onItemUpdate(idx, 'size_inch', v)} type="number" /></Field>
              <Field label="Width (px)"><TextInput value={mon.resolution.width} onChange={(v) => onItemUpdate(idx, 'resolution.width', v)} type="number" /></Field>
              <Field label="Height (px)"><TextInput value={mon.resolution.height} onChange={(v) => onItemUpdate(idx, 'resolution.height', v)} type="number" /></Field>
              <Field label="Refresh Rate (Hz)"><TextInput value={mon.refresh_rate_hz} onChange={(v) => onItemUpdate(idx, 'refresh_rate_hz', v)} type="number" /></Field>
            </div>
          )}
        />

        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p className="section-label">Keyboard</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Brand"><TextInput value={c.peripherals.keyboard.brand} onChange={(v) => set('peripherals.keyboard.brand', v)} /></Field>
            <Field label="Model"><TextInput value={c.peripherals.keyboard.model} onChange={(v) => set('peripherals.keyboard.model', v)} /></Field>
            <Field label="Switches"><TextInput value={c.peripherals.keyboard.switches} onChange={(v) => set('peripherals.keyboard.switches', v)} /></Field>
            <Field label="Layout (%)"><TextInput value={c.peripherals.keyboard.layout} onChange={(v) => set('peripherals.keyboard.layout', v)} type="number" /></Field>
          </div>

          <p className="section-label">Mouse</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Brand"><TextInput value={c.peripherals.mouse.brand} onChange={(v) => set('peripherals.mouse.brand', v)} /></Field>
            <Field label="Model"><TextInput value={c.peripherals.mouse.model} onChange={(v) => set('peripherals.mouse.model', v)} /></Field>
          </div>

          <p className="section-label">Audio</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Headphones Brand"><TextInput value={c.peripherals.audio.headphones.brand} onChange={(v) => set('peripherals.audio.headphones.brand', v)} /></Field>
            <Field label="Headphones Model"><TextInput value={c.peripherals.audio.headphones.model} onChange={(v) => set('peripherals.audio.headphones.model', v)} /></Field>
            <Field label="Mic Brand"><TextInput value={c.peripherals.audio.microphone.brand} onChange={(v) => set('peripherals.audio.microphone.brand', v)} /></Field>
            <Field label="Mic Model"><TextInput value={c.peripherals.audio.microphone.model} onChange={(v) => set('peripherals.audio.microphone.model', v)} /></Field>
            <Field label="Speakers Brand"><TextInput value={c.peripherals.audio.speakers.brand} onChange={(v) => set('peripherals.audio.speakers.brand', v)} /></Field>
            <Field label="Speakers Model"><TextInput value={c.peripherals.audio.speakers.model} onChange={(v) => set('peripherals.audio.speakers.model', v)} /></Field>
          </div>
        </div>
      </Section>

      <Section title="Camera" open={openSections.camera} onToggle={() => toggle('camera')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Brand"><TextInput value={c.camera.brand} onChange={(v) => set('camera.brand', v)} placeholder="Creative" /></Field>
          <Field label="Model"><TextInput value={c.camera.model} onChange={(v) => set('camera.model', v)} placeholder="Live! Cam Sync 1080p" /></Field>
          <Field label="Width (px)"><TextInput value={c.camera.resolution.width} onChange={(v) => set('camera.resolution.width', Number(v))} type="number" /></Field>
          <Field label="Height (px)"><TextInput value={c.camera.resolution.height} onChange={(v) => set('camera.resolution.height', Number(v))} type="number" /></Field>
          <Field label="FPS"><TextInput value={c.camera.fps} onChange={(v) => set('camera.fps', Number(v))} type="number" /></Field>
        </div>
      </Section>
    </div>
  );
}

export default function ComputersStep({ data, onChange }) {
  const [editingIdx, setEditingIdx] = useState(null);

  const addComputer = () => {
    const newComputer = createDefaultComputer();
    onChange((prev) => ({
      ...prev,
      computers: [...prev.computers, newComputer],
    }));
    setEditingIdx(data.computers.length);
  };

  const removeComputer = (idx) => {
    onChange((prev) => ({
      ...prev,
      computers: prev.computers.filter((_, i) => i !== idx),
    }));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const updateComputer = (idx, updater) => {
    onChange((prev) => {
      const computers = [...prev.computers];
      computers[idx] = typeof updater === 'function' ? updater(computers[idx]) : updater;
      return { ...prev, computers };
    });
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-xs)', letterSpacing: '-0.02em' }}>Computers</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>Add your desktops, laptops, and other machines.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {data.computers.map((comp, idx) => (
          <motion.div key={comp.id} layout className="card" style={{ overflow: 'hidden' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', cursor: 'pointer', transition: 'background var(--dur-base)' }}
              onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {comp.type === 'laptop' ? <Laptop size={16} style={{ color: 'var(--text-muted)' }} /> : <Monitor size={16} style={{ color: 'var(--text-muted)' }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{comp.name || 'Unnamed Computer'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.type} · {comp.role} · {comp.manufacturer}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <button onClick={(e) => { e.stopPropagation(); setEditingIdx(idx); }} className="btn-ghost" style={{ padding: '0.35rem' }}>
                  <Pencil size={13} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); removeComputer(idx); }} className="btn-ghost" style={{ padding: '0.35rem', color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {editingIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
                >
                  <div style={{ padding: 'var(--space-lg)' }}>
                    <ComputerForm
                      computer={comp}
                      onUpdate={(updater) => updateComputer(idx, updater)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <button onClick={addComputer} className="btn-secondary" style={{ marginTop: 'var(--space-md)', width: '100%', justifyContent: 'center' }}>
        <Plus size={14} />
        Add Computer
      </button>
    </div>
  );
}
