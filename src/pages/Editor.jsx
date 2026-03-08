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
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'computers', label: 'Computers', icon: Monitor },
  { id: 'phones', label: 'Phones', icon: Smartphone },
  { id: 'review', label: 'Review & Submit', icon: Send },
];

function Stepper({ currentStep, onStepClick }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentStep;
        const isDone = idx < currentStep;
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(idx)}
            className={`
              group relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200
              ${isActive ? 'bg-white/[0.08] text-white' : isDone ? 'text-cyan-400 hover:text-cyan-300' : 'text-zinc-600 hover:text-zinc-400'}
            `}
          >
            <div className={`
              flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-all
              ${isActive ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' : isDone ? 'bg-cyan-500/15 text-cyan-400' : 'bg-white/[0.04] text-zinc-600'}
            `}>
              {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.2 } }),
};

export default function Editor() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token, profileData, setProfileData } = useStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (profileData) {
      setData(profileData);
    } else if (user) {
      setData(createDefaultProfile(user.login));
    }
  }, [isAuthenticated, user, profileData, navigate]);

  if (!data) return null;

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setProfileData(next);
      return next;
    });
  };

  const goTo = (idx) => {
    setDirection(idx > step ? 1 : -1);
    setStep(idx);
  };

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
      <div className="mx-auto max-w-lg px-4 pt-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          <h2 className="mb-2 text-xl font-bold">Profile Submitted!</h2>
          <p className="mb-6 text-sm text-zinc-400">
            A Pull Request has been created. Once merged, your profile will be live.
          </p>
          <a href={submitted.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            View Pull Request
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
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
          {step === 0 && <ProfileStep data={data} onChange={updateData} />}
          {step === 1 && <ComputersStep data={data} onChange={updateData} />}
          {step === 2 && <PhonesStep data={data} onChange={updateData} />}
          {step === 3 && <ReviewStep data={data} onSubmit={handleSubmit} submitting={submitting} />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={prev} disabled={step === 0} className="btn-secondary">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="btn-primary">
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Submitting...' : 'Submit Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
