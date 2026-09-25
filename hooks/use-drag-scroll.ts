"use client";

import { useEffect, useRef } from "react";

/** Click-drag-to-pan for a horizontal rail, with a movement threshold so a drag doesn't register as a click. */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;

    const onDown = (e: MouseEvent) => {
      down = true;
      moved = 0;
      startX = e.pageX;
      startLeft = rail.scrollLeft;
      rail.style.cursor = "grabbing";
      rail.style.scrollSnapType = "none";
    };

    const onMove = (e: MouseEvent) => {
      if (!down) return;
      const d = e.pageX - startX;
      moved = Math.abs(d);
      if (moved > 4) e.preventDefault();
      rail.scrollLeft = startLeft - d;
    };

    const onUp = () => {
      if (!down) return;
      down = false;
      rail.style.cursor = "grab";
      rail.style.scrollSnapType = "x mandatory";
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    rail.style.cursor = "grab";
    rail.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    rail.addEventListener("click", onClickCapture, true);

    return () => {
      rail.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      rail.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return ref;
}
