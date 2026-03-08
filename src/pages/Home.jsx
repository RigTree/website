import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Cpu, Smartphone, ArrowRight, Github, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { getAuthUrl } from '../lib/constants';
import { GitHubService } from '../lib/github';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 animate-grid-fade"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-violet-500/8 blur-3xl" />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass group relative p-6 hover:bg-white/[0.05] transition-colors duration-300"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 group-hover:from-cyan-500/30 group-hover:to-violet-500/30 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
    </motion.div>
  );
}

function ProfilePreview({ username }) {
  return (
    <Link
      to={`/${username}`}
      className="glass group flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-xs font-bold text-cyan-400">
        {username[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{username}</p>
        <p className="text-xs text-zinc-500">View setup →</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { isAuthenticated } = useStore();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const svc = new GitHubService('');
    svc.listProfiles().then(setProfiles).catch(() => {});
  }, []);

  return (
    <div className="relative">
      <GridBackground />

      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20 md:pt-36 md:pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            Open-Source Hardware Showcase
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
          >
            Your Rig.{' '}
            <span className="gradient-text">Your Tree.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mb-10 max-w-xl text-base text-zinc-400 leading-relaxed sm:text-lg"
          >
            Create a beautiful profile to showcase your PC builds, laptops, and
            smartphones. Like Linktree, but for hardware enthusiasts.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            {isAuthenticated ? (
              <Link to="/editor" className="btn-primary px-8 py-3 text-sm">
                Open Editor
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <a href={getAuthUrl()} className="btn-primary px-8 py-3 text-sm">
                <Github className="h-4 w-4" />
                Get Started with GitHub
              </a>
            )}
            <Link to="/dag" className="btn-secondary px-8 py-3 text-sm">
              See Example
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={Monitor}
            title="Showcase Your Builds"
            description="Add desktops, laptops, servers — with every component from CPU to case fans."
            delay={0}
          />
          <FeatureCard
            icon={Smartphone}
            title="Mobile Arsenal"
            description="List your smartphones with specs like SoC, display, cameras, and battery."
            delay={1}
          />
          <FeatureCard
            icon={Cpu}
            title="Powered by GitHub"
            description="No database needed. Your profile is stored as JSON via Pull Requests on GitHub."
            delay={2}
          />
        </div>
      </section>

      {profiles.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Community Profiles
            </h2>
            <div className="mx-auto grid max-w-md gap-2">
              {profiles.map((p) => (
                <ProfilePreview key={p} username={p} />
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
