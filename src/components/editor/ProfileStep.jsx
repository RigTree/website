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

const COUNTRIES = [
  {code:'AF',name:'Afghanistan'},{code:'AL',name:'Albania'},{code:'DZ',name:'Algeria'},{code:'AD',name:'Andorra'},{code:'AO',name:'Angola'},
  {code:'AG',name:'Antigua and Barbuda'},{code:'AR',name:'Argentina'},{code:'AM',name:'Armenia'},{code:'AU',name:'Australia'},{code:'AT',name:'Austria'},
  {code:'AZ',name:'Azerbaijan'},{code:'BS',name:'Bahamas'},{code:'BH',name:'Bahrain'},{code:'BD',name:'Bangladesh'},{code:'BB',name:'Barbados'},
  {code:'BY',name:'Belarus'},{code:'BE',name:'Belgium'},{code:'BZ',name:'Belize'},{code:'BJ',name:'Benin'},{code:'BT',name:'Bhutan'},
  {code:'BO',name:'Bolivia'},{code:'BA',name:'Bosnia and Herzegovina'},{code:'BW',name:'Botswana'},{code:'BR',name:'Brazil'},{code:'BN',name:'Brunei'},
  {code:'BG',name:'Bulgaria'},{code:'BF',name:'Burkina Faso'},{code:'BI',name:'Burundi'},{code:'CV',name:"Cabo Verde"},{code:'KH',name:'Cambodia'},
  {code:'CM',name:'Cameroon'},{code:'CA',name:'Canada'},{code:'CF',name:'Central African Republic'},{code:'TD',name:'Chad'},{code:'CL',name:'Chile'},
  {code:'CN',name:'China'},{code:'CO',name:'Colombia'},{code:'KM',name:'Comoros'},{code:'CG',name:'Republic of the Congo'},{code:'CD',name:'DR Congo'},
  {code:'CR',name:'Costa Rica'},{code:'HR',name:'Croatia'},{code:'CU',name:'Cuba'},{code:'CY',name:'Cyprus'},{code:'CZ',name:'Czechia'},
  {code:'CI',name:"Côte d'Ivoire"},{code:'DK',name:'Denmark'},{code:'DJ',name:'Djibouti'},{code:'DM',name:'Dominica'},{code:'DO',name:'Dominican Republic'},
  {code:'EC',name:'Ecuador'},{code:'EG',name:'Egypt'},{code:'SV',name:'El Salvador'},{code:'GQ',name:'Equatorial Guinea'},{code:'ER',name:'Eritrea'},
  {code:'EE',name:'Estonia'},{code:'SZ',name:'Eswatini'},{code:'ET',name:'Ethiopia'},{code:'FJ',name:'Fiji'},{code:'FI',name:'Finland'},
  {code:'FR',name:'France'},{code:'GA',name:'Gabon'},{code:'GM',name:'Gambia'},{code:'GE',name:'Georgia'},{code:'DE',name:'Germany'},
  {code:'GH',name:'Ghana'},{code:'GR',name:'Greece'},{code:'GD',name:'Grenada'},{code:'GT',name:'Guatemala'},{code:'GN',name:'Guinea'},
  {code:'GW',name:'Guinea-Bissau'},{code:'GY',name:'Guyana'},{code:'HT',name:'Haiti'},{code:'HN',name:'Honduras'},{code:'HU',name:'Hungary'},
  {code:'IS',name:'Iceland'},{code:'IN',name:'India'},{code:'ID',name:'Indonesia'},{code:'IR',name:'Iran'},{code:'IQ',name:'Iraq'},
  {code:'IE',name:'Ireland'},{code:'IL',name:'Israel'},{code:'IT',name:'Italy'},{code:'JM',name:'Jamaica'},{code:'JP',name:'Japan'},
  {code:'JO',name:'Jordan'},{code:'KZ',name:'Kazakhstan'},{code:'KE',name:'Kenya'},{code:'KI',name:'Kiribati'},{code:'XK',name:'Kosovo'},
  {code:'KW',name:'Kuwait'},{code:'KG',name:'Kyrgyzstan'},{code:'LA',name:'Laos'},{code:'LV',name:'Latvia'},{code:'LB',name:'Lebanon'},
  {code:'LS',name:'Lesotho'},{code:'LR',name:'Liberia'},{code:'LY',name:'Libya'},{code:'LI',name:'Liechtenstein'},{code:'LT',name:'Lithuania'},
  {code:'LU',name:'Luxembourg'},{code:'MG',name:'Madagascar'},{code:'MW',name:'Malawi'},{code:'MY',name:'Malaysia'},{code:'MV',name:'Maldives'},
  {code:'ML',name:'Mali'},{code:'MT',name:'Malta'},{code:'MH',name:'Marshall Islands'},{code:'MR',name:'Mauritania'},{code:'MU',name:'Mauritius'},
  {code:'MX',name:'Mexico'},{code:'FM',name:'Micronesia'},{code:'MD',name:'Moldova'},{code:'MC',name:'Monaco'},{code:'MN',name:'Mongolia'},
  {code:'ME',name:'Montenegro'},{code:'MA',name:'Morocco'},{code:'MZ',name:'Mozambique'},{code:'MM',name:'Myanmar'},{code:'NA',name:'Namibia'},
  {code:'NR',name:'Nauru'},{code:'NP',name:'Nepal'},{code:'NL',name:'Netherlands'},{code:'NZ',name:'New Zealand'},{code:'NI',name:'Nicaragua'},
  {code:'NE',name:'Niger'},{code:'NG',name:'Nigeria'},{code:'KP',name:'North Korea'},{code:'MK',name:'North Macedonia'},{code:'NO',name:'Norway'},
  {code:'OM',name:'Oman'},{code:'PK',name:'Pakistan'},{code:'PW',name:'Palau'},{code:'PA',name:'Panama'},{code:'PG',name:'Papua New Guinea'},
  {code:'PY',name:'Paraguay'},{code:'PE',name:'Peru'},{code:'PH',name:'Philippines'},{code:'PL',name:'Poland'},{code:'PT',name:'Portugal'},
  {code:'QA',name:'Qatar'},{code:'RO',name:'Romania'},{code:'RU',name:'Russia'},{code:'RW',name:'Rwanda'},{code:'KN',name:'Saint Kitts and Nevis'},
  {code:'LC',name:'Saint Lucia'},{code:'VC',name:'Saint Vincent and the Grenadines'},{code:'WS',name:'Samoa'},{code:'SM',name:'San Marino'},
  {code:'ST',name:'Sao Tome and Principe'},{code:'SA',name:'Saudi Arabia'},{code:'SN',name:'Senegal'},{code:'RS',name:'Serbia'},
  {code:'SC',name:'Seychelles'},{code:'SL',name:'Sierra Leone'},{code:'SG',name:'Singapore'},{code:'SK',name:'Slovakia'},{code:'SI',name:'Slovenia'},
  {code:'SB',name:'Solomon Islands'},{code:'SO',name:'Somalia'},{code:'ZA',name:'South Africa'},{code:'KR',name:'South Korea'},
  {code:'SS',name:'South Sudan'},{code:'ES',name:'Spain'},{code:'LK',name:'Sri Lanka'},{code:'SD',name:'Sudan'},{code:'SR',name:'Suriname'},
  {code:'SE',name:'Sweden'},{code:'CH',name:'Switzerland'},{code:'SY',name:'Syria'},{code:'TW',name:'Taiwan'},{code:'TJ',name:'Tajikistan'},
  {code:'TZ',name:'Tanzania'},{code:'TH',name:'Thailand'},{code:'TL',name:'Timor-Leste'},{code:'TG',name:'Togo'},{code:'TO',name:'Tonga'},
  {code:'TT',name:'Trinidad and Tobago'},{code:'TN',name:'Tunisia'},{code:'TR',name:'Turkey'},{code:'TM',name:'Turkmenistan'},{code:'TV',name:'Tuvalu'},
  {code:'UG',name:'Uganda'},{code:'UA',name:'Ukraine'},{code:'AE',name:'United Arab Emirates'},{code:'GB',name:'United Kingdom'},
  {code:'US',name:'United States'},{code:'UY',name:'Uruguay'},{code:'UZ',name:'Uzbekistan'},{code:'VU',name:'Vanuatu'},
  {code:'VA',name:'Vatican City'},{code:'VE',name:'Venezuela'},{code:'VN',name:'Vietnam'},{code:'YE',name:'Yemen'},
  {code:'ZM',name:'Zambia'},{code:'ZW',name:'Zimbabwe'},
];

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
