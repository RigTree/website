import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Smartphone, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { createDefaultPhone, DISPLAY_TYPES } from '../../lib/schema';

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-500">{label}</label>
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
    <div className="space-y-4">
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
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer mt-2">
            <input type="checkbox" checked={p.os.root} onChange={(e) => set('os.root', e.target.checked)} className="rounded border-zinc-700 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/30" />
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
      <h2 className="mb-1 text-xl font-bold">Smartphones</h2>
      <p className="mb-6 text-sm text-zinc-500">Add your mobile devices.</p>

      <div className="space-y-3">
        {data.phones.map((phone, idx) => (
          <motion.div key={idx} layout className="glass overflow-hidden">
            <div
              className="flex cursor-pointer items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors"
              onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
            >
              <Smartphone className="h-5 w-5 text-violet-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200">{phone.brand && phone.model ? `${phone.brand} ${phone.model}` : 'Unnamed Phone'}</p>
                <p className="text-xs text-zinc-500">{phone.soc || 'No SoC specified'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setEditingIdx(idx); }} className="btn-ghost p-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); removePhone(idx); }} className="btn-ghost p-1.5 text-zinc-600 hover:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
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
                  className="overflow-hidden border-t border-white/[0.04]"
                >
                  <div className="p-4">
                    <PhoneForm phone={phone} onUpdate={(updater) => updatePhone(idx, updater)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <button onClick={addPhone} className="btn-secondary mt-4 w-full justify-center">
        <Plus className="h-4 w-4" />
        Add Phone
      </button>
    </div>
  );
}
