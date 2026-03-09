import { motion } from 'framer-motion';
import { User, MapPin } from 'lucide-react';

export default function ProfileStep({ data, onChange }) {
  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-xs)', letterSpacing: '-0.02em' }}>Profile Information</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>Basic info that appears on your public profile.</p>

      <div className="card" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--border-hover)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
            {data.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{data.username}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GitHub username (auto-detected)</p>
          </div>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <User size={11} /> Display Name
          </label>
          <input type="text" className="input-base" placeholder="e.g. daglaroglou" value={data.profile.display_name} onChange={(e) => update('display_name', e.target.value)} />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <MapPin size={11} /> Location
          </label>
          <input type="text" className="input-base" placeholder="e.g. Greece" value={data.profile.location} onChange={(e) => update('location', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
