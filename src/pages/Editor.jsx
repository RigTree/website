import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Monitor, Smartphone, Send, ChevronLeft, ChevronRight, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';
import { GitHubService } from '../lib/github';
import { createDefaultProfile } from '../lib/schema';
import ProfileStep from '../components/editor/ProfileStep';
import ComputersStep from '../components/editor/ComputersStep';
import PhonesStep from '../components/editor/PhonesStep';
import ReviewStep from '../components/editor/ReviewStep';

const STEPS = [
  { id: 'profile',   label: 'Profile',          icon: User },
  { id: 'computers', label: 'Computers',         icon: Monitor },
  { id: 'phones',    label: 'Phones',            icon: Smartphone },
  { id: 'review',    label: 'Review & Submit',   icon: Send },
];

function Stepper({ currentStep, onStepClick }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        marginBottom: 'var(--space-2xl)',
      }}
    >
      {STEPS.map((step, idx) => {
        const Icon    = step.icon;
        const isActive = idx === currentStep;
        const isDone   = idx < currentStep;
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 500,
              background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
              border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
              transition: 'all var(--dur-base) var(--ease-smooth)',
            }}
          >
            <div
              style={{
                width: 24, height: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: isActive ? 'var(--text-primary)' : isDone ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                color: isActive ? 'var(--bg-base)' : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                border: `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border)'}`,
                flexShrink: 0,
              }}
            >
              {isDone ? <CheckCircle2 size={12} /> : <Icon size={12} />}
            </div>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:   (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
};

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();
  const [step,       setStep]       = useState(0);
  const [direction,  setDirection]  = useState(1);
  const [data,       setData]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (profileData)      setData(profileData);
    else if (user)        setData(createDefaultProfile(user.login));
  }, [isAuthenticated, user, profileData, navigate]);

  if (!data) return null;

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setProfileData(next);
      return next;
    });
  };

  const goTo = (idx) => { setDirection(idx > step ? 1 : -1); setStep(idx); };
  const next = () => { if (step < STEPS.length - 1) goTo(step + 1); };
  const prev = () => { if (step > 0) goTo(step - 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const gh = new GitHubService(token);
      const pr = await gh.submitProfile(data);
      setSubmitted(pr);
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '32rem', margin: '0 auto', padding: 'var(--space-3xl) var(--space-lg)', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{ padding: 'var(--space-2xl)' }}
        >
          <CheckCircle2 size={40} style={{ margin: '0 auto var(--space-lg)', color: 'var(--text-secondary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
            Profile Submitted!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2xl)', lineHeight: 1.65 }}>
            A Pull Request has been created. Once merged, your profile will be live.
          </p>
          <a
            href={submitted.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            View Pull Request
            <ExternalLink size={14} className="btn-icon" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-3xl)' }}>
      <Stepper currentStep={step} onStepClick={goTo} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {step === 0 && <ProfileStep  data={data} onChange={updateData} />}
          {step === 1 && <ComputersStep data={data} onChange={updateData} />}
          {step === 2 && <PhonesStep   data={data} onChange={updateData} />}
          {step === 3 && <ReviewStep   data={data} onSubmit={handleSubmit} submitting={submitting} />}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={prev} disabled={step === 0} className="btn-secondary">
          <ChevronLeft size={14} />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="btn-primary">
            Next
            <ChevronRight size={14} className="btn-icon" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {submitting ? 'Submitting…' : 'Submit Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
