import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileJson, Copy, Check, Send, Loader2, Monitor, Smartphone } from 'lucide-react';

export default function ReviewStep({ data, onSubmit, submitting }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalComputers = data.computers.length;
  const totalPhones = data.phones.length;

  return (
    <div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-xs)', letterSpacing: '-0.02em' }}>Review &amp; Submit</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>Review your profile data and submit it as a Pull Request.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        {[{ label: 'Display Name', value: data.profile.display_name || '—' }, { label: 'Location', value: data.profile.location || '—' }, { label: 'Computers', value: totalComputers, icon: Monitor }, { label: 'Phones', value: totalPhones, icon: Smartphone }].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            {Icon && <Icon size={14} style={{ margin: '0 auto var(--space-xs)', color: 'var(--text-muted)' }} />}
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: typeof value === 'number' ? 'monospace' : undefined }}>{value}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '0.625rem var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            <FileJson size={13} />
            {data.username}.json
          </div>
          <button onClick={copyJson} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
            {copied ? <Check size={12} style={{ color: 'var(--text-secondary)' }} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{ maxHeight: '24rem', overflow: 'auto', padding: 'var(--space-lg)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', lineHeight: 1.7, background: 'var(--bg-base)' }}>
          {json}
        </pre>
      </div>

      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button onClick={onSubmit} disabled={submitting} className="btn-primary" style={{ width: '100%', maxWidth: '18rem', padding: '0.75rem' }}>
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {submitting ? 'Creating Pull Request…' : 'Submit as Pull Request'}
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '28rem' }}>
          This will fork the repository, commit your profile JSON, and open a Pull Request for review.
        </p>
      </div>
    </div>
  );
}
