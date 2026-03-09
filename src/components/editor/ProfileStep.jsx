import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

function CountryPicker({ value, onChange }) {
    const countries = [
      "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
      "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
      "Côte d'Ivoire","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Costa Rica","Croatia","Cuba","Cyprus","Czechia",
      "Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
      "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
      "Fiji","Finland","France",
      "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
      "Haiti","Honduras","Hungary",
      "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
      "Jamaica","Japan","Jordan",
      "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan",
      "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
      "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
      "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
      "Oman",
      "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
      "Qatar",
      "Republic of the Congo","Romania","Russia","Rwanda",
      "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
      "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
      "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
      "Vanuatu","Vatican City","Venezuela","Vietnam",
      "Yemen",
      "Zambia","Zimbabwe"
    ];

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [rect, setRect] = useState(null);
    const btnRef = useRef(null);

    // Close on click outside
    useEffect(() => {
      if (!open) return;
      function onDoc(e) {
        if (btnRef.current && btnRef.current.contains(e.target)) return;
        // allow clicks inside the portal dropdown
        const portal = document.getElementById('country-picker-portal');
        if (portal && portal.contains(e.target)) return;
        setOpen(false);
      }
      document.addEventListener('pointerdown', onDoc);
      return () => document.removeEventListener('pointerdown', onDoc);
    }, [open]);

    const openDropdown = () => {
      if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
      setOpen((s) => !s);
    };

    const filtered = query ? countries.filter((c) => c.toLowerCase().includes(query.toLowerCase())) : countries;

    const dropdown = open && rect && createPortal(
      <div
        id="country-picker-portal"
        style={{
          position: 'fixed',
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          maxHeight: 260,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ padding: '0.5rem 0.5rem 0' }}>
          <input
            autoFocus
            placeholder="Search countries"
            className="input-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ overflowY: 'auto', padding: '0.4rem 0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {filtered.map((c) => (
            <button
              key={c}
              type="button"
              onPointerDown={() => { onChange(c); setOpen(false); setQuery(''); }}
              style={{ textAlign: 'left', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>,
      document.body
    );

    return (
      <div style={{ position: 'relative' }}>
        <button
          ref={btnRef}
          type="button"
          className="input-base"
          onClick={openDropdown}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '0.95rem' }}
        >
          <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{value || 'Select a country'}</span>
          <span style={{ opacity: 0.6 }}>{open ? '▴' : '▾'}</span>
        </button>
        {dropdown}
      </div>
    );
  }
