"use client";

import { useEffect, useState } from "react";
import { RigTreeMark } from "@/components/rigtree-mark";
import { ParticlesBackground } from "@/components/particles-background";
import { Cpu, HardDrive, ShieldCheck, Zap } from "lucide-react";

const STAGES = [
  "Initializing RigTree Engine...",
  "Loading OpenDB hardware catalog...",
  "Verifying component compatibility...",
  "Rendering hardware profile specs...",
];

export default function Loading() {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        const next = (prev + 1) % STAGES.length;
        setProgress((next + 1) * 25);
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden px-4">
      {/* Background visuals */}
      <div className="orb orb-blue absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none" />
      <div className="orb orb-purple absolute right-[20%] top-[20%] h-[350px] w-[350px] opacity-15 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.14] pointer-events-none" />
      <ParticlesBackground />

      {/* Main Glassmorphic Loader Card */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-8 shadow-soft backdrop-blur-xl">
        {/* Scanning laser beam overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#a3e635]/20 to-transparent animate-loader-scan" />

        {/* Animated RigTree Logo + Glowing Radar Rings */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer spinning gradient ring */}
          <div className="absolute size-28 rounded-full border border-dashed border-[#a3e635]/40 animate-radar-spin" />
          {/* Pulsing ring halo */}
          <div className="absolute size-24 rounded-full border border-[#a3e635]/30 bg-[#a3e635]/5 animate-pulse-ring" />
          
          {/* Logo container */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-[#a3e635]/50 bg-secondary/90 text-foreground shadow-[0_0_25px_rgba(163,230,53,0.25)] backdrop-blur">
            <RigTreeMark className="size-8 text-[#a3e635]" />
          </div>
        </div>

        {/* Brand & Ticker Status */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-[#a3e635] animate-ping" />
            <h2 className="font-mono text-sm font-bold tracking-wider text-foreground uppercase">
              RigTree System Loading
            </h2>
          </div>
          <p className="h-5 font-mono text-xs text-muted-foreground transition-all duration-300">
            {STAGES[stageIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-full space-y-2">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="size-3 text-[#a3e635]" />
              HARDWARE_DB
            </span>
            <span className="text-[#a3e635] font-semibold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-lime-500 via-[#a3e635] to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(163,230,53,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Hardware Status Badges / Skeletons */}
        <div className="mt-6 grid grid-cols-3 w-full gap-2 border-t border-border/60 pt-4 text-center font-mono text-[10px]">
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/50 bg-secondary/40 px-2 py-1.5 text-muted-foreground">
            <Cpu className="size-3 text-[#a3e635]" />
            <span>CPU OK</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/50 bg-secondary/40 px-2 py-1.5 text-muted-foreground">
            <HardDrive className="size-3 text-cyan-400" />
            <span>OPNDB</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/50 bg-secondary/40 px-2 py-1.5 text-muted-foreground">
            <ShieldCheck className="size-3 text-emerald-400" />
            <span>SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
