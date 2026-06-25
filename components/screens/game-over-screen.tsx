"use client";

import { motion } from "framer-motion";
import { Home, RotateCcw, Target, Timer, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Confetti } from "@/components/ui/confetti";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { COLOR_DEFINITIONS } from "@/constants/colors";
import { CONFETTI_TRIGGER_ROUND } from "@/constants/colors";
import { fadeInUp, staggerContainer } from "@/animations/variants";
import { formatTime } from "@/lib/utils";
import type { GameOverSummary } from "@/types/game";

interface GameOverScreenProps {
  summary: GameOverSummary;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function GameOverScreen({
  summary,
  onPlayAgain,
  onHome,
}: GameOverScreenProps) {
  const showConfetti = summary.reachedRound >= CONFETTI_TRIGGER_ROUND;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[100dvh] px-4 py-10 gap-6"
    >
      <Confetti active={showConfetti} />

      <motion.div variants={fadeInUp} className="text-center">
        <p className="font-display text-xs sm:text-sm tracking-[0.3em] text-rose-400 uppercase mb-2">
          Game Over
        </p>
        <h1 className="font-display text-6xl sm:text-7xl font-black text-white">
          <AnimatedCounter value={summary.finalScore} />
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Final Score</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="w-full max-w-2xl">
        <GlassCard className="p-5 sm:p-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <SummaryStat
              icon={<Trophy className="w-4 h-4 text-amber-300" />}
              label="Reached Round"
              value={summary.reachedRound}
            />
            <SummaryStat
              icon={<TrendingUp className="w-4 h-4 text-fuchsia-300" />}
              label="Best Round"
              value={summary.bestRound}
            />
            <SummaryStat
              icon={<Target className="w-4 h-4 text-cyan-300" />}
              label="Accuracy"
              value={`${summary.accuracy}%`}
            />
            <SummaryStat
              icon={<Timer className="w-4 h-4 text-emerald-300" />}
              label="Time"
              value={formatTime(summary.elapsedMs)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <SequenceDisplay
              title="Correct sequence"
              sequence={summary.correctSequence}
            />
            <SequenceDisplay
              title="Your sequence"
              sequence={summary.playerSequence}
              highlightLastAsWrong
            />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex gap-3">
        <Button size="lg" onClick={onPlayAgain} aria-label="Play again">
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={onHome}
          aria-label="Return to home screen"
        >
          <Home className="w-5 h-5" />
          Home
        </Button>
      </motion.div>
    </motion.div>
  );
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {icon}
        <span className="font-display text-lg sm:text-xl font-bold text-white tabular-nums">
          {value}
        </span>
      </div>
      <p className="text-[11px] uppercase tracking-wider text-zinc-400">
        {label}
      </p>
    </div>
  );
}

function SequenceDisplay({
  title,
  sequence,
  highlightLastAsWrong = false,
}: {
  title: string;
  sequence: string[];
  highlightLastAsWrong?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sequence.map((color, i) => {
          const def = COLOR_DEFINITIONS[color as keyof typeof COLOR_DEFINITIONS];
          const isLastWrong = highlightLastAsWrong && i === sequence.length - 1;
          return (
            <span
              key={i}
              className="w-6 h-6 rounded-md"
              style={{
                backgroundColor: def.hex,
                boxShadow: isLastWrong
                  ? "0 0 0 2px #fb4141, 0 0 12px #fb4141"
                  : `0 0 8px ${def.hex}66`,
              }}
              aria-label={def.label}
              title={def.label}
            />
          );
        })}
      </div>
    </div>
  );
}
