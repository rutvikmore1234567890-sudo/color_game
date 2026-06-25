"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  hue: string;
}

const HUES = ["#a855f7", "#38e8e0", "#fb4141", "#fbbf24", "#22d3a8"];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 6,
    hue: HUES[i % HUES.length],
  }));
}

/**
 * Ambient backdrop: animated gradient wash, two large blurred glow orbs
 * that drift slowly, a sprinkle of floating particles, and a subtle
 * parallax shift that follows the cursor. Pure decoration — sits behind
 * everything with pointer-events disabled.
 */
export function AnimatedBackground({
  animationsEnabled = true,
}: {
  animationsEnabled?: boolean;
}) {
  const particles = useMemo(() => generateParticles(28), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const orbOneX = useTransform(springX, (v) => v * -20);
  const orbOneY = useTransform(springY, (v) => v * -20);
  const orbTwoX = useTransform(springX, (v) => v * 16);
  const orbTwoY = useTransform(springY, (v) => v * 16);

  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!animationsEnabled || reduced) return;

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [animationsEnabled, reduced, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0f2e] via-[#0a0815] to-[#07060d]" />

      <motion.div
        style={{ x: orbOneX, y: orbOneY }}
        className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-purple-600/25 blur-[120px] animate-float-slow"
      />
      <motion.div
        style={{ x: orbTwoX, y: orbTwoY }}
        className="absolute bottom-[-10rem] right-[-8rem] w-[34rem] h-[34rem] rounded-full bg-cyan-500/20 blur-[120px] animate-float-slower"
      />
      <div className="absolute top-1/3 left-1/2 w-[26rem] h-[26rem] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[100px]" />

      {animationsEnabled &&
        !reduced &&
        particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              backgroundColor: p.hue,
              boxShadow: `0 0 6px ${p.hue}`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [-10, -90],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
    </div>
  );
}
