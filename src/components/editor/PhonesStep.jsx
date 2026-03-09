import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Smartphone, Trash2, ChevronDown } from 'lucide-react';
import { createDefaultPhone, DISPLAY_TYPES } from '../../lib/schema';
import { PHONE_BRANDS, getModelsForBrand, getDefaultOsForBrand } from '../../lib/phones';

/* ─── generic portal select picker (same pattern as CountryPicker) ─── */
function SelectPicker({ id, value, options, placeholder, onChange, disabled, allowCustom = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropRect, setDropRect] = useState(null);
  const btnRef = useRef(null);

  const updateRect = () => {
    if (btnRef.current) setDropRect(btnRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      const portal = document.getElementById(`picker-portal-${id}`);
      if (portal && portal.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open, id]);

  const toggleOpen = () => {
    if (disabled) return;
    updateRect();
    setOpen(s => !s);
    setQuery('');
  };

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const spaceBelow = dropRect ? window.innerHeight - dropRect.bottom : 999;
  const dropUp = dropRect && spaceBelow < 260 && dropRect.top > 260;

  const dropdown = open && dropRect && createPortal(
    <div
      id={`picker-portal-${id}`}
      style={{
        position: 'fixed',
        top: dropUp ? dropRect.top - 252 : dropRect.bottom + 4,
        left: dropRect.left,
        width: Math.max(dropRect.width, 220),
        zIndex: 9999,
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        maxHeight: 248,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
      }}
    >
      <div style={{ padding: '0.5rem', borderBottom: '1px solid #2e2e2e', flexShrink: 0 }}>
        <input
          autoFocus
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#181818', border: '1px solid #333', borderRadius: '6px',
            padding: '0.4rem 0.65rem', fontSize: '0.85rem',
            color: '#f0f0f0', outline: 'none',
          }}
        />
      </div>
      <div style={{ overflowY: 'auto', flexGrow: 1, padding: '0.3rem' }}>
        {allowCustom && query.trim() && !options.some(o => o.toLowerCase() === query.trim().toLowerCase()) && (
          <button
            type="button"
            onPointerDown={() => { onChange(query.trim()); setOpen(false); setQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              width: '100%', textAlign: 'left',
              padding: '0.38rem 0.7rem', marginBottom: '0.2rem', borderRadius: '5px',
              background: 'rgba(255,255,255,0.04)',
              border: 'none', borderBottom: '1px solid #2e2e2e', cursor: 'pointer',
              fontSize: '0.82rem', color: '#a0c4ff',
            }}
            onPointerEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
            onPointerLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <span style={{ opacity: 0.6, flexShrink: 0 }}>Custom →</span>
            <strong style={{ fontWeight: 600 }}>"{ query.trim() }"</strong>
          </button>
        )}
        {filtered.length === 0 && !allowCustom && (
          <p style={{ padding: '0.6rem', fontSize: '0.82rem', color: '#666', textAlign: 'center' }}>No results</p>
        )}
        {filtered.length === 0 && allowCustom && !query.trim() && (
          <p style={{ padding: '0.6rem', fontSize: '0.82rem', color: '#666', textAlign: 'center' }}>Type to search or enter custom</p>
        )}
        {filtered.map(opt => (
          <button
            key={opt}
            type="button"
            onPointerDown={() => { onChange(opt); setOpen(false); setQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center',
              width: '100%', textAlign: 'left',
              padding: '0.38rem 0.7rem', borderRadius: '5px',
              background: opt === value ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer',
              fontSize: '0.87rem', color: '#f0f0f0',
            }}
            onPointerEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onPointerLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.5rem', padding: '0.55rem 0.75rem',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', color: value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.875rem', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', opacity: disabled ? 0.45 : 1,
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <ChevronDown size={13} style={{ flexShrink: 0, color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {dropdown}
    </>
  );
}

/* ─── RAM / Storage chip selector ─── */
function StoragePicker({ label, options, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{label}</label>
      {options && options.length > 0 ? (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                style={{
                  padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-md)',
                  border: `1px solid ${opt === value ? 'var(--border-hover)' : 'var(--border)'}`,
                  background: opt === value ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: opt === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.82rem', fontFamily: 'monospace', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt} GB
              </button>
            ))}
          </div>
          <input
            type="number"
            className="input-base"
            placeholder="Custom GB..."
            value={options.includes(value) ? '' : (value || '')}
            onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
            style={{ marginTop: '0.4rem' }}
          />
        </div>
      ) : (
        <input
          type="number"
          className="input-base"
          value={value || ''}
          onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        />
      )}
    </div>
  );
}

/* ─── helpers ─── */
function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{label}</label>
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
      onChange={e => onChange(type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value)}
    />
  );
}

/* ─── per-phone form ─── */
function PhoneForm({ phone, onUpdate, formIdx }) {
  const set = (path, value) => {
    onUpdate(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const p = phone;
  const brandModels = p.brand ? getModelsForBrand(p.brand) : [];
  const modelNames = brandModels.map(m => m.name);
  const selectedModel = brandModels.find(m => m.name === p.model);

  const handleBrandSelect = brand => {
    onUpdate(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.brand = brand;
      copy.model = '';
      copy.soc = '';
      copy.ram_gb = 0;
      copy.storage_gb = 0;
      copy.battery = 0;
      return copy;
    });
  };

  const handleModelSelect = modelName => {
    const models = getModelsForBrand(p.brand);
    const m = models.find(x => x.name === modelName);
    if (!m) return;
    onUpdate(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.model = m.name;
      copy.soc = m.soc || '';
      copy.battery = m.battery || 0;
      copy.ram_gb = Array.isArray(m.ram_gb) ? m.ram_gb[0] : (m.ram_gb || 0);
      copy.storage_gb = Array.isArray(m.storage_gb) ? m.storage_gb[0] : (m.storage_gb || 0);
      if (!copy.os) copy.os = { name: '', root: false };
      copy.os.name = getDefaultOsForBrand(copy.brand);
      if (m.display) {
        copy.display.size_inch = m.display.size_inch || 0;
        copy.display.type = m.display.type || 'OLED';
        copy.display.refresh_rate = m.display.refresh_rate || 60;
        copy.display.resolution = { width: m.display.width || 0, height: m.display.height || 0 };
      }
      if (m.camera) {
        copy.camera.front = m.camera.front || 0;
        copy.camera.rear = m.camera.rear || [];
      }
      return copy;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

      {/* Brand + Model */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Brand">
          <SelectPicker
            id={`brand-${formIdx}`}
            value={p.brand}
            options={PHONE_BRANDS}
            placeholder="Select or type brand..."
            onChange={handleBrandSelect}
            allowCustom
          />
        </Field>
        <Field label="Model">
          <SelectPicker
            id={`model-${formIdx}`}
            value={p.model}
            options={modelNames}
            placeholder={p.brand ? 'Select or type model...' : 'Pick brand first'}
            onChange={handleModelSelect}
            disabled={!p.brand}
            allowCustom
          />
        </Field>
      </div>

      {/* RAM + Storage chips */}
      <div className="grid grid-cols-2 gap-3">
        <StoragePicker
          label="RAM (GB)"
          options={selectedModel ? selectedModel.ram_gb : null}
          value={p.ram_gb}
          onChange={v => set('ram_gb', Number(v))}
        />
        <StoragePicker
          label="Storage (GB)"
          options={selectedModel ? selectedModel.storage_gb : null}
          value={p.storage_gb}
          onChange={v => set('storage_gb', Number(v))}
        />
      </div>

      {/* SoC + Battery */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="SoC"><TextInput value={p.soc} onChange={v => set('soc', v)} placeholder="Snapdragon 8 Elite" /></Field>
        <Field label="Battery (mAh)"><TextInput value={p.battery} onChange={v => set('battery', v)} type="number" /></Field>
      </div>

      {/* Display */}
      <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '0.5rem' }}>Display</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Size (inch)"><TextInput value={p.display.size_inch} onChange={v => set('display.size_inch', v)} type="number" /></Field>
        <Field label="Width (px)"><TextInput value={p.display.resolution.width} onChange={v => set('display.resolution.width', Number(v))} type="number" /></Field>
        <Field label="Height (px)"><TextInput value={p.display.resolution.height} onChange={v => set('display.resolution.height', Number(v))} type="number" /></Field>
        <Field label="Refresh Rate"><TextInput value={p.display.refresh_rate} onChange={v => set('display.refresh_rate', v)} type="number" /></Field>
        <Field label="Type">
          <select className="input-base" value={p.display.type} onChange={e => set('display.type', e.target.value)}>
            {DISPLAY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      {/* Camera */}
      <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '0.5rem' }}>Camera</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Front (MP)"><TextInput value={p.camera.front} onChange={v => set('camera.front', v)} type="number" /></Field>
        <Field label="Rear (MP, comma-separated)">
          <input
            className="input-base"
            placeholder="50, 12, 5"
            value={(p.camera.rear || []).join(', ')}
            onChange={e => set('camera.rear', e.target.value.split(',').map(v => Number(v.trim())).filter(Boolean))}
          />
        </Field>
      </div>

      {/* Software */}
      <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '0.5rem' }}>Software</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="OS Name"><TextInput value={p.os.name} onChange={v => set('os.name', v)} placeholder="Nothing OS" /></Field>
        <Field label="Rooted">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '0.5rem' }}>
            <input type="checkbox" checked={p.os.root} onChange={e => set('os.root', e.target.checked)} style={{ accentColor: 'var(--text-primary)', width: '0.875rem', height: '0.875rem' }} />
            Device is rooted
          </label>
        </Field>
      </div>
    </div>
  );
}

/* ─── step wrapper ─── */
export default function PhonesStep({ data, onChange }) {
  const [editingIdx, setEditingIdx] = useState(null);

  const addPhone = () => {
    onChange(prev => ({ ...prev, phones: [...prev.phones, createDefaultPhone()] }));
    setEditingIdx(data.phones.length);
  };

  const removePhone = idx => {
    onChange(prev => ({ ...prev, phones: prev.phones.filter((_, i) => i !== idx) }));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const updatePhone = (idx, updater) => {
    onChange(prev => {
      const phones = [...prev.phones];
      phones[idx] = typeof updater === 'function' ? updater(phones[idx]) : updater;
      return { ...prev, phones };
    });
  };

  return (
    <div>
      {data.phones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px dashed var(--border-hover)', borderRadius: 'var(--radius-lg)' }}>
          <Smartphone size={32} style={{ color: 'var(--text-secondary)', margin: '0 auto 0.875rem', opacity: 0.6 }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No phones yet</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Add your smartphone, tablet, or any other mobile device.</p>
          <button onClick={addPhone} className="btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={14} /> Add Your First Phone
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.phones.map((phone, idx) => (
            <div key={idx} className="card" style={{ overflow: 'hidden' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <Smartphone size={16} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {phone.brand && phone.model ? `${phone.brand} ${phone.model}` : 'Unnamed Phone'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {[phone.soc, phone.ram_gb ? `${phone.ram_gb}GB RAM` : null, phone.storage_gb ? `${phone.storage_gb}GB` : null].filter(Boolean).join(' · ') || 'No specs yet'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{editingIdx === idx ? 'collapse ▲' : 'edit ▼'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); removePhone(idx); }}
                    className="btn-ghost"
                    style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {editingIdx === idx && (
                <div style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-lg)' }}>
                  <PhoneForm phone={phone} onUpdate={updater => updatePhone(idx, updater)} formIdx={idx} />
                </div>
              )}
            </div>
          ))}
          <button onClick={addPhone} className="btn-secondary" style={{ marginTop: '0.25rem', width: '100%', justifyContent: 'center' }}>
            <Plus size={14} /> Add Another Phone
          </button>
        </div>
      )}
    </div>
  );
}
