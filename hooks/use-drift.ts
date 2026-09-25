"use client";

import { useEffect, useRef } from "react";

type DriftTarget = { el: HTMLElement | SVGElement; kx: number; ky: number };

let targets: DriftTarget[] = [];
let tx = 0;
let ty = 0;
let cx = 0;
let cy = 0;
let raf = 0;
let listenerAttached = false;

function tick() {
  cx += (tx - cx) * 0.06;
  cy += (ty - cy) * 0.06;
  targets.forEach((t) => {
    t.el.style.transform = `translate3d(${(cx * t.kx).toFixed(2)}px, ${(cy * t.ky).toFixed(2)}px, 0)`;
  });
  raf =
    Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001
      ? requestAnimationFrame(tick)
      : 0;
}

function onMove(e: MouseEvent) {
  tx = (e.clientX / window.innerWidth - 0.5) * 2;
  ty = (e.clientY / window.innerHeight - 0.5) * 2;
  if (!raf) raf = requestAnimationFrame(tick);
}

function registerDriftTarget(el: HTMLElement | SVGElement, kx: number, ky: number) {
  if (!listenerAttached) {
    window.addEventListener("mousemove", onMove);
    listenerAttached = true;
  }
  const entry: DriftTarget = { el, kx, ky };
  targets.push(entry);
  return () => {
    targets = targets.filter((t) => t !== entry);
  };
}

/** Drifts the attached element a few px against the mouse pointer (parallax). */
export function useDrift<T extends HTMLElement | SVGElement>(kx: number, ky: number) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    return registerDriftTarget(el, kx, ky);
  }, [kx, ky]);

  return ref;
}
