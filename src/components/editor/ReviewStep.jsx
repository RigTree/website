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
      <h2 className="mb-1 text-xl font-bold">Review & Submit</h2>
      <p className="mb-6 text-sm text-zinc-500">Review your profile data and submit it as a Pull Request.</p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="glass p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{data.profile.display_name || '—'}</p>
          <p className="text-xs text-zinc-500 mt-1">Display Name</p>
        </div>
        <div className="glass p-4 text-center">
          <p className="text-2xl font-bold text-zinc-200">{data.profile.location || '—'}</p>
          <p className="text-xs text-zinc-500 mt-1">Location</p>
        </div>
        <div className="glass p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Monitor className="h-4 w-4 text-cyan-400" />
            <p className="text-2xl font-bold text-zinc-200">{totalComputers}</p>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Computers</p>
        </div>
        <div className="glass p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Smartphone className="h-4 w-4 text-violet-400" />
            <p className="text-2xl font-bold text-zinc-200">{totalPhones}</p>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Phones</p>
        </div>
      </div>

      <div className="glass overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FileJson className="h-4 w-4" />
            <span className="font-mono">{data.username}.json</span>
          </div>
          <button onClick={copyJson} className="btn-ghost text-xs">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="max-h-96 overflow-auto p-4 text-xs font-mono text-zinc-400 leading-relaxed">
          {json}
        </pre>
      </div>

      <motion.div className="mt-6 flex flex-col items-center gap-3">
        <button onClick={onSubmit} disabled={submitting} className="btn-primary w-full max-w-xs py-3">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? 'Creating Pull Request...' : 'Submit as Pull Request'}
        </button>
        <p className="text-xs text-zinc-600 text-center max-w-md">
          This will fork the repository, commit your profile JSON, and open a Pull Request for review.
        </p>
      </motion.div>
    </div>
  );
}
