"use client";

import { useEffect, useRef } from "react";

const ROWS = [
  {
    text: "DESKTOP · LAPTOP · WORKSTATION · PERIPHERALS · GAMING · MOBILE · ",
    dir: 1,     // moves right as you scroll down
    speed: 0.14,
    baseOffset: -60,
  },
  {
    text: "RTX 4090 · RYZEN 9 · DDR5-6000 · PCIE 5.0 · THUNDERBOLT 4 · OLED · ",
    dir: -1,    // moves left as you scroll down
    speed: 0.18,
    baseOffset: -120,
  },
  {
    text: "SHARE YOUR RIG · BUILD YOUR PROFILE · SHOW YOUR SETUP · CLAIM YOUR HANDLE · ",
    dir: 1,
    speed: 0.11,
    baseOffset: -40,
  },
];

/**
 * Scroll-driven parallax text runner.
 * Rows slide left / right at a speed proportional to window.scrollY.
 * The container clips overflow so nothing bleeds outside.
 */
export function ScrollText() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const scrollY = window.scrollY;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const { dir, speed, baseOffset } = ROWS[i];
        const x = baseOffset + dir * scrollY * speed;
        el.style.transform = `translateX(${x}px)`;
      });
      rafId = null;
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // set initial position

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      className="relative select-none overflow-hidden border-y border-border/40 bg-background py-2"
      aria-hidden="true"
    >
      {/* Fade masks on left and right edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-[linear-gradient(90deg,hsl(var(--background)),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-[linear-gradient(270deg,hsl(var(--background)),transparent)]" />

      {ROWS.map((row, i) => (
        <div key={i} className="overflow-hidden py-2.5">
          <div
            ref={(el) => { rowRefs.current[i] = el; }}
            className="will-change-transform whitespace-nowrap font-mono text-[clamp(1.5rem,4vw,3rem)] font-extrabold leading-none tracking-[0.08em] text-border/50"
            style={{ transform: `translateX(${row.baseOffset}px)` }}
          >
            {/* Repeat enough times to always fill the viewport width regardless of direction */}
            {(row.text).repeat(6)}
          </div>
        </div>
      ))}
    </section>
  );
}
