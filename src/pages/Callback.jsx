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
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass mx-auto max-w-sm p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-cyan-400" />
            <h2 className="mb-2 text-lg font-semibold">Authenticating...</h2>
            <p className="text-sm text-zinc-500">Connecting with GitHub</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-8 w-8 text-emerald-400" />
            <h2 className="mb-2 text-lg font-semibold">Welcome!</h2>
            <p className="text-sm text-zinc-500">Redirecting to the editor...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 h-8 w-8 text-red-400" />
            <h2 className="mb-2 text-lg font-semibold">Authentication Failed</h2>
            <p className="mb-4 text-sm text-zinc-500">{error}</p>
            <a href="/" className="btn-secondary text-sm">Back to Home</a>
          </>
        )}
      </motion.div>
    </div>
  );
}
