"use client";

import { useEffect, useRef } from "react";

const interactiveSelector =
  'a, button, input, textarea, select, label, summary, [role="button"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!dot || !ring || !finePointer.matches || reduceMotion.matches) {
      return;
    }

    const root = document.documentElement;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let animationFrame = 0;

    root.classList.add("custom-cursor-active");

    const render = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      animationFrame = requestAnimationFrame(render);
    };

    const setHoverState = (element: EventTarget | null) => {
      const isHovering =
        element instanceof Element && Boolean(element.closest(interactiveSelector));

      dot.classList.toggle("is-hovering", isHovering);
      ring.classList.toggle("is-hovering", isHovering);
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      dot.classList.remove("is-hidden");
      ring.classList.remove("is-hidden");
      setHoverState(event.target);
    };

    const handlePointerDown = () => {
      dot.classList.add("is-pressed");
      ring.classList.add("is-pressed");
    };

    const handlePointerUp = () => {
      dot.classList.remove("is-pressed");
      ring.classList.remove("is-pressed");
    };

    const handlePointerLeave = () => {
      dot.classList.add("is-hidden");
      ring.classList.add("is-hidden");
    };

    const handlePointerEnter = () => {
      dot.classList.remove("is-hidden");
      ring.classList.remove("is-hidden");
    };

    animationFrame = requestAnimationFrame(render);
    document.addEventListener("pointermove", handlePointerMove, { capture: true });
    document.addEventListener("pointerdown", handlePointerDown, { capture: true });
    document.addEventListener("pointerup", handlePointerUp, { capture: true });
    document.addEventListener("pointerleave", handlePointerLeave, { capture: true });
    document.addEventListener("pointerenter", handlePointerEnter, { capture: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      root.classList.remove("custom-cursor-active");
      document.removeEventListener("pointermove", handlePointerMove, { capture: true });
      document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
      document.removeEventListener("pointerup", handlePointerUp, { capture: true });
      document.removeEventListener("pointerleave", handlePointerLeave, { capture: true });
      document.removeEventListener("pointerenter", handlePointerEnter, { capture: true });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot is-hidden" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring is-hidden" aria-hidden="true" />
    </>
  );
}
