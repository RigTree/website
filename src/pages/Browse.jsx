import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Monitor, Smartphone, Users, Loader2, AlertCircle } from 'lucide-react';
import { GitHubService } from '../lib/github';
import { GITHUB_API } from '../lib/constants';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const svc = new GitHubService(null);

async function fetchProfileCard(username) {
  const [profile, ghUser] = await Promise.all([
    svc.getUserProfile(username),
    fetch(`${GITHUB_API}/users/${username}`)
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null),
  ]);
  return { username, profile, ghUser };
}

export default function Browse() {
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const usernames = await svc.listProfiles();
        const results   = await Promise.all(usernames.map(fetchProfileCard));
        if (!cancelled) setCards(results.filter((c) => c.profile));
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load profiles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: '80vh', paddingTop: '4rem', paddingBottom: '6rem' }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* heading */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{
            fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em',
            color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'monospace',
          }}>
            Community
          </p>
          <h1 className="display-xl" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
            Browse Rigs
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.7 }}>
            Explore setups from the community. Click any card to see the full rig.
          </p>
        </div>

        {/* states */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <Loader2 size={18} className="animate-spin" />
            <span style={{ fontSize: '0.9rem' }}>Loading profiles…</span>
          </div>
        )}

        {error && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', maxWidth: 420 }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {!loading && !error && cards.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: 400, margin: '0 auto' }}>
            <Users size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No profiles yet. Be the first!</p>
          </div>
        )}

        {/* grid */}
        {!loading && cards.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {cards.map(({ username, profile, ghUser }, i) => (
              <motion.div
                key={username}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={`/${username}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className="card"
                    style={{
                      padding: '1.4rem',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    {/* avatar + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                      {ghUser?.avatar_url ? (
                        <img
                          src={ghUser.avatar_url}
                          alt={username}
                          style={{
                            width: 44, height: 44, borderRadius: '50%',
                            border: '2px solid var(--border-hover)',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: 'var(--bg-elevated)',
                          border: '2px solid var(--border-default)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Users size={18} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontWeight: 600, fontSize: '0.95rem',
                          color: 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {profile?.profile?.display_name || username}
                        </p>
                        <p style={{
                          fontSize: '0.75rem', color: 'var(--text-muted)',
                          fontFamily: 'monospace',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          @{username}
                        </p>
                      </div>
                    </div>

                    {/* location */}
                    {profile?.profile?.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                        <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {profile.profile.location}
                        </span>
                      </div>
                    )}

                    {/* stats */}
                    <div style={{
                      display: 'flex', gap: '0.5rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-default)',
                    }}>
                      <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.4rem 0.6rem',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <Monitor size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {profile?.computers?.length ?? 0} PC{profile?.computers?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.4rem 0.6rem',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <Smartphone size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {profile?.phones?.length ?? 0} Phone{profile?.phones?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
