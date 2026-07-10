"use client";

import { useEffect, useRef } from "react";

/**
 * Mounts an IntersectionObserver that adds `.revealed` to every `.reveal`
 * element on the page, triggering the CSS fade-up transition.
 */
export function ScrollReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const targets = document.querySelectorAll<HTMLElement>(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    for (const el of targets) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
