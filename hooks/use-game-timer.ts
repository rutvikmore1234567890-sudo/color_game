"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks elapsed milliseconds while `isRunning` is true. Pausing freezes
 * the displayed time rather than resetting it; `reset()` zeroes it out
 * for a new run.
 */
export function useGameTimer(isRunning: boolean) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      startRef.current = null;
      return;
    }

    startRef.current = performance.now();

    const tick = () => {
      if (startRef.current === null) return;
      const now = performance.now();
      const delta = now - startRef.current;
      setElapsedMs(accumulatedRef.current + delta);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      if (startRef.current !== null) {
        accumulatedRef.current += performance.now() - startRef.current;
      }
    };
  }, [isRunning]);

  const reset = () => {
    accumulatedRef.current = 0;
    startRef.current = isRunning ? performance.now() : null;
    setElapsedMs(0);
  };

  return { elapsedMs, reset };
}
