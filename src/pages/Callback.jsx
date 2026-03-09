import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { exchangeCodeForToken, GitHubService } from '../lib/github';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useStore();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = sessionStorage.getItem('oauth_state');

      if (!code) {
        setStatus('error');
        setError('No authorization code received from GitHub.');
        return;
      }

      if (state !== savedState) {
        setStatus('error');
        setError('State mismatch. Possible CSRF attack.');
        return;
      }

      sessionStorage.removeItem('oauth_state');

      try {
        const token = await exchangeCodeForToken(code);
        const gh = new GitHubService(token);
        const user = await gh.getUser();
        setAuth(token, user);

        const existing = await gh.getUserProfile(user.login);
        if (existing) {
          useStore.getState().setProfileData(existing);
        }

        setStatus('success');
        setTimeout(() => navigate('/editor'), 1200);
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Authentication failed.');
      }
    }

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card"
        style={{ width: '100%', maxWidth: '22rem', padding: 'var(--space-2xl)', textAlign: 'center' }}
      >
        {status === 'loading' && (
          <>
            <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto var(--space-lg)', color: 'var(--text-muted)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Authenticating…</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Connecting with GitHub</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 size={28} style={{ margin: '0 auto var(--space-lg)', color: 'var(--text-secondary)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Welcome!</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting to the editor…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={28} style={{ margin: '0 auto var(--space-lg)', color: '#f87171' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Authentication Failed</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>{error}</p>
            <a href="/" className="btn-secondary" style={{ fontSize: '0.8rem' }}>Back to Home</a>
          </>
        )}
      </motion.div>
    </div>
  );
}
