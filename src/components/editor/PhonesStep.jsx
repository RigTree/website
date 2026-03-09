import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Smartphone, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { createDefaultPhone, DISPLAY_TYPES } from '../../lib/schema';

function Field({ label, children }) {
  return (
    <div>
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
      value={value || ''}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value)}
    />
  );
}

function PhoneForm({ phone, onUpdate }) {
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

  const p = phone;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Brand"><TextInput value={p.brand} onChange={(v) => set('brand', v)} placeholder="Nothing" /></Field>
        <Field label="Model"><TextInput value={p.model} onChange={(v) => set('model', v)} placeholder="Phone 3" /></Field>
        <Field label="SoC"><TextInput value={p.soc} onChange={(v) => set('soc', v)} placeholder="Snapdragon 8s Gen 4" /></Field>
        <Field label="RAM (GB)"><TextInput value={p.ram_gb} onChange={(v) => set('ram_gb', v)} type="number" /></Field>
        <Field label="Storage (GB)"><TextInput value={p.storage_gb} onChange={(v) => set('storage_gb', v)} type="number" /></Field>
        <Field label="Battery (mAh)"><TextInput value={p.battery} onChange={(v) => set('battery', v)} type="number" /></Field>
      </div>

      <p className="section-label mt-4">Display</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Size (inch)"><TextInput value={p.display.size_inch} onChange={(v) => set('display.size_inch', v)} type="number" /></Field>
        <Field label="Width (px)"><TextInput value={p.display.resolution.width} onChange={(v) => set('display.resolution.width', Number(v))} type="number" /></Field>
        <Field label="Height (px)"><TextInput value={p.display.resolution.height} onChange={(v) => set('display.resolution.height', Number(v))} type="number" /></Field>
        <Field label="Refresh Rate"><TextInput value={p.display.refresh_rate} onChange={(v) => set('display.refresh_rate', v)} type="number" /></Field>
        <Field label="Type">
          <select className="input-base" value={p.display.type} onChange={(e) => set('display.type', e.target.value)}>
            {DISPLAY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <p className="section-label mt-4">Camera</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Front (MP)"><TextInput value={p.camera.front} onChange={(v) => set('camera.front', v)} type="number" /></Field>
        <Field label="Rear Cameras (MP, comma-separated)">
          <input
            className="input-base"
            placeholder="50, 12, 5"
            value={(p.camera.rear || []).join(', ')}
            onChange={(e) => set('camera.rear', e.target.value.split(',').map((v) => Number(v.trim())).filter(Boolean))}
          />
        </Field>
      </div>

      <p className="section-label mt-4">Software</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="OS Name"><TextInput value={p.os.name} onChange={(v) => set('os.name', v)} placeholder="Nothing OS" /></Field>
        <Field label="Rooted">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '0.5rem' }}>
            <input type="checkbox" checked={p.os.root} onChange={(e) => set('os.root', e.target.checked)} style={{ accentColor: 'var(--text-primary)', width: '0.875rem', height: '0.875rem' }} />
            Device is rooted
          </label>
        </Field>
      </div>
    </div>
  );
}

export default function PhonesStep({ data, onChange }) {
  const [editingIdx, setEditingIdx] = useState(null);

  const addPhone = () => {
    onChange((prev) => ({ ...prev, phones: [...prev.phones, createDefaultPhone()] }));
    setEditingIdx(data.phones.length);
  };

  const removePhone = (idx) => {
    onChange((prev) => ({ ...prev, phones: prev.phones.filter((_, i) => i !== idx) }));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const updatePhone = (idx, updater) => {
    onChange((prev) => {
      const phones = [...prev.phones];
      phones[idx] = typeof updater === 'function' ? updater(phones[idx]) : updater;
      return { ...prev, phones };
    });
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-xs)', letterSpacing: '-0.02em' }}>Smartphones</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>Add your mobile devices.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {data.phones.map((phone, idx) => (
          <motion.div key={idx} layout className="card" style={{ overflow: 'hidden' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', cursor: 'pointer', transition: 'background var(--dur-base)' }}
              onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Smartphone size={16} style={{ color: 'var(--text-muted)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{phone.brand && phone.model ? `${phone.brand} ${phone.model}` : 'Unnamed Phone'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{phone.soc || 'No SoC specified'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <button onClick={(e) => { e.stopPropagation(); setEditingIdx(idx); }} className="btn-ghost" style={{ padding: '0.35rem' }}>
                  <Pencil size={13} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); removePhone(idx); }} className="btn-ghost" style={{ padding: '0.35rem', color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
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
                    <PhoneForm phone={phone} onUpdate={(updater) => updatePhone(idx, updater)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <button onClick={addPhone} className="btn-secondary" style={{ marginTop: 'var(--space-md)', width: '100%', justifyContent: 'center' }}>
        <Plus size={14} />
        Add Phone
      </button>
    </div>
  );
}
