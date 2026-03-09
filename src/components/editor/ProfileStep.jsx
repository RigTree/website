import { User, MapPin, Github } from 'lucide-react';

export default function ProfileStep({ data, onChange, user }) {
  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
        Profile
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Basic info shown on your public profile page.
      </p>

      {/* GitHub identity (read-only) */}
      {user && (
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name || user.login}
              </p>
              <span style={{
                fontSize: '0.65rem', fontFamily: 'monospace', padding: '0.15rem 0.5rem',
                background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)', border: '1px solid var(--border)',
              }}>
                GitHub
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>@{user.login}</p>
          </div>
          <Github size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
      )}

      {/* Editable fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem',
            fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <User size={11} /> Display Name
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="How your name appears on your profile"
            value={data.profile.display_name}
            onChange={(e) => update('display_name', e.target.value)}
            style={{ fontSize: '0.95rem' }}
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Defaults to your GitHub username if left blank.
          </p>
        </div>

        <div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem',
            fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <MapPin size={11} /> Location
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Greece, Athens"
            value={data.profile.location}
            onChange={(e) => update('location', e.target.value)}
            style={{ fontSize: '0.95rem' }}
          />
        </div>
      </div>
    </div>
  );
}

