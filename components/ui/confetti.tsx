"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ConfettiPieceConfig {
  id: number;
  left: number;
  rotate: number;
  duration: number;
  delay: number;
  color: string;
  width: number;
  height: number;
}

const CONFETTI_COLORS = [
  "#fb4141",
  "#3b82f6",
  "#22d3a8",
  "#fbbf24",
  "#a855f7",
  "#38e8e0",
];

function generatePieces(count: number): ConfettiPieceConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    rotate: Math.random() * 360,
    duration: 2.6 + Math.random() * 1.8,
    delay: Math.random() * 0.6,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    width: 6 + Math.random() * 6,
    height: 10 + Math.random() * 8,
  }));
}

/** Falling confetti burst, used when the player reaches round 10+. */
export function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(() => generatePieces(70), []);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{ y: -40, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            rotate: piece.rotate,
            opacity: [1, 1, 0.3],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
