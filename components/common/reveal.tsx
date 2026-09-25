"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Position among sibling reveals in the same section — staggers the delay. */
  index?: number;
  className?: string;
};

/**
 * Fades/slides an element in the first time it enters the viewport. Direction
 * (left/right/up) is derived from the element's own position so headings
 * glide from the left, right-aligned content from the right, and wide
 * elements simply rise.
 */
export function Reveal({ children, index = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    const half = window.innerWidth / 2;
    const wide = rect.width > window.innerWidth * 0.72;
    const dx = wide ? 0 : mid < half ? -34 : 34;
    const dy = wide ? 26 : 14;

    el.style.opacity = "0";
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    el.style.transition =
      "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveal = () => {
      el.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
      el.style.opacity = "1";
      el.style.transform = "translate3d(0,0,0)";
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    io.observe(el);

    const safety = setTimeout(() => {
      if (el.style.opacity === "0") {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    }, 6000);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [index]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
