"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "how-it-works", label: "How it works" },
  { id: "preview", label: "Preview" },
  { id: "features", label: "Features" },
  { id: "browse", label: "Ideas" },
] as const;

/**
 * Floating section-navigator pill on the right edge.
 * Shows which section the user is currently reading.
 * Dots are clickable to jump to that section.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>("hero");
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Show only after the user scrolls a bit
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionEls: { id: string; el: Element }[] = [];

    for (const s of SECTIONS) {
      const el =
        s.id === "hero"
          ? document.querySelector("section")
          : document.getElementById(s.id);
      if (el) sectionEls.push({ id: s.id, el });
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const found = sectionEls.find((s) => s.el === entry.target);
            if (found) setActive(found.id);
          }
        }
      },
      { threshold: 0.35 }
    );

    for (const { el } of sectionEls) observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Page sections"
      className={[
        "fixed right-5 top-1/2 z-40 -translate-y-1/2 flex-col items-center gap-3 transition-all duration-500",
        visible ? "flex opacity-100" : "hidden opacity-0",
      ].join(" ")}
    >
      {/* vertical line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/50" />

      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            aria-label={`Go to ${s.label}`}
            className="group relative z-10 flex items-center justify-end gap-2"
          >
            {/* tooltip label */}
            <span
              className={[
                "pointer-events-none whitespace-nowrap rounded-md border border-border bg-background/90 px-2 py-1 font-mono text-[10px] text-muted-foreground shadow-soft backdrop-blur transition-all duration-200",
                "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
              ].join(" ")}
            >
              {s.label}
            </span>

            {/* dot */}
            <span
              className={[
                "block rounded-full border transition-all duration-300",
                isActive
                  ? "size-2.5 border-transparent bg-foreground shadow-[0_0_6px_2px_hsl(var(--foreground)/0.35)]"
                  : "size-2 border-border/70 bg-secondary group-hover:border-foreground/40 group-hover:bg-muted",
              ].join(" ")}
            />
          </button>
        );
      })}
    </nav>
  );
}
