import { RigTreeMark } from "@/components/rigtree-mark";
import { ParticlesBackground } from "@/components/particles-background";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Background visuals */}
      <div className="orb orb-blue absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.12] pointer-events-none" />
      <ParticlesBackground />

      <div className="relative z-10 flex flex-col items-center justify-center gap-5">
        {/* Animated ring + logo */}
        <div className="relative flex items-center justify-center">
          {/* Spinning gradient ring */}
          <div className="absolute size-24 rounded-full border-animate opacity-70" />
          {/* Inner pulsing logo */}
          <div className="animate-pulse">
            <span className="flex size-16 items-center justify-center rounded-xl border border-border/80 bg-secondary/80 text-foreground shadow-soft backdrop-blur">
              <RigTreeMark className="size-8" />
            </span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
}
