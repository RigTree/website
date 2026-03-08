import { motion } from 'framer-motion';
import { User, MapPin } from 'lucide-react';

export default function ProfileStep({ data, onChange }) {
  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold">Profile Information</h2>
      <p className="mb-6 text-sm text-zinc-500">Basic info that appears on your public profile.</p>

      <div className="glass p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-lg font-bold text-cyan-400">
            {data.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{data.username}</p>
            <p className="text-xs text-zinc-500">GitHub username (auto-detected)</p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            <User className="mr-1.5 inline h-3.5 w-3.5" />
            Display Name
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. daglaroglou"
            value={data.profile.display_name}
            onChange={(e) => update('display_name', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            <MapPin className="mr-1.5 inline h-3.5 w-3.5" />
            Location
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Greece"
            value={data.profile.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
