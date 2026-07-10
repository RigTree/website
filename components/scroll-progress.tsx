"use client";

import { useEffect, useRef } from "react";

/**
 * Thin gradient progress bar pinned under the fixed nav.
 * Fills left→right as the user scrolls down the page.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    /* sits directly below the 64px fixed nav */
    <div
      className="fixed left-0 top-16 z-50 h-[2px] w-full overflow-hidden"
      aria-hidden="true"
    >
      {/* background track */}
      <div className="absolute inset-0 bg-border/40" />
      {/* filled portion */}
      <div
        ref={barRef}
        className="absolute left-0 top-0 h-full w-0 transition-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(210 100% 60%), hsl(270 80% 65%), hsl(190 90% 55%))",
        }}
      />
    </div>
  );
}
