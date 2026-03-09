import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, MapPin, Github } from 'lucide-react';
import { COUNTRIES } from '../../lib/countries';

export default function ProfileStep({ data, onChange, user }) {
  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  return (
    <div>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--border-hover)', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name || user.login}
              </p>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', padding: '0.15rem 0.45rem', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                GitHub
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>@{user.login}</p>
          </div>
          <Github size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
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
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Defaults to your GitHub username if left blank.
          </p>
        </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
              <MapPin size={11} /> Location
            </label>
            {/* Country picker dropdown */}
            <CountryPicker value={data.profile.location} onChange={(v) => update('location', v)} />
          </div>
      </div>
    </div>
  );
}


function FlagImg({ code, size = 20 }) {
  return (
    <img
      src={`https://flagcdn.com/${size}x${Math.round(size * 0.75)}/${code.toLowerCase()}.png`}
      width={size}
      height={Math.round(size * 0.75)}
      alt=""
      style={{ borderRadius: 2, display: 'block', flexShrink: 0, objectFit: 'cover' }}
    />
  );
}

function CountryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropRect, setDropRect] = useState(null);
  const btnRef = useRef(null);

  const updateRect = () => {
    if (btnRef.current) setDropRect(btnRef.current.getBoundingClientRect());
  };

  // Re-position dropdown on scroll/resize so it tracks the button
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      const portal = document.getElementById('country-picker-portal');
      if (portal && portal.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);

  const toggleOpen = () => {
    updateRect();
    setOpen(s => !s);
  };

  const filtered = query
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  const selected = COUNTRIES.find(c => c.name === value);

  // Determine whether to open up or down based on available space
  const spaceBelow = dropRect ? window.innerHeight - dropRect.bottom : 999;
  const dropUp = dropRect && spaceBelow < 260 && dropRect.top > 260;

  const dropdown = open && dropRect && createPortal(
    <div
      id="country-picker-portal"
      style={{
        position: 'fixed',
        top: dropUp ? dropRect.top - 248 : dropRect.bottom + 4,
        left: dropRect.left,
        width: dropRect.width,
        zIndex: 9999,
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        maxHeight: 244,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
      }}
    >
      {/* Search */}
      <div style={{ padding: '0.5rem', borderBottom: '1px solid #2e2e2e', flexShrink: 0 }}>
        <input
          autoFocus
          placeholder="Search countries…"
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
      {/* List */}
      <div style={{ overflowY: 'auto', flexGrow: 1, padding: '0.3rem' }}>
        {filtered.length === 0 && (
          <p style={{ padding: '0.6rem', fontSize: '0.82rem', color: '#666', textAlign: 'center' }}>No results</p>
        )}
        {filtered.map(c => (
          <button
            key={c.code}
            type="button"
            onPointerDown={() => { onChange(c.name); setOpen(false); setQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.55rem',
              width: '100%', textAlign: 'left',
              padding: '0.38rem 0.55rem', borderRadius: '5px',
              background: 'transparent', border: 'none',
              color: '#f0f0f0', cursor: 'pointer', fontSize: '0.875rem',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2e2e2e'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <FlagImg code={c.code} size={20} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        className="input-base"
        onClick={toggleOpen}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '0.925rem' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {selected && <FlagImg code={selected.code} size={20} />}
          <span>{value || 'Select a country'}</span>
        </span>
        <span style={{ opacity: 0.45, fontSize: '0.7rem', flexShrink: 0 }}>{open ? '▴' : '▾'}</span>
      </button>
      {dropdown}
    </div>
  );
}
