import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Smartphone, Trash2 } from 'lucide-react';
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Phones</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Add your smartphones and tablets.</p>
        </div>
        {data.phones.length > 0 && (
          <button onClick={addPhone} className="btn-primary" style={{ flexShrink: 0, fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      {data.phones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 2rem', border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius-lg)' }}>
          <Smartphone size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>No phones yet</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Add your smartphone, tablet, or any other mobile device.</p>
          <button onClick={addPhone} className="btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={14} /> Add Your First Phone
          </button>
        </div>
      ) : (
        <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.phones.map((phone, idx) => (
          <motion.div key={idx} layout className="card" style={{ overflow: 'hidden' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background 0.15s' }}
              onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              }}>
                <Smartphone size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {phone.brand && phone.model ? `${phone.brand} ${phone.model}` : 'Unnamed Phone'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{phone.soc || 'No SoC specified'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{editingIdx === idx ? 'collapse ▲' : 'edit ▼'}</span>
                <button onClick={(e) => { e.stopPropagation(); removePhone(idx); }} className="btn-ghost"
                  style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
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

      <button onClick={addPhone} className="btn-secondary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
        <Plus size={14} />
        Add Another Phone
      </button>
        </>
      )}
    </div>
  );
}
