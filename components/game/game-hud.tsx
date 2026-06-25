"use client";

import { Pause, Timer, Trophy, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatTime } from "@/lib/utils";
import type { SessionStats } from "@/types/game";

interface GameHudProps {
  stats: SessionStats;
  sequenceLength: number;
  playerProgress: number;
  onPause: () => void;
}

/** Top status bar visible throughout an active run. */
export function GameHud({
  stats,
  sequenceLength,
  playerProgress,
  onPause,
}: GameHudProps) {
  const progressPercent =
    sequenceLength > 0 ? (playerProgress / sequenceLength) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <Stat
            icon={<Trophy className="w-4 h-4 text-amber-300" />}
            label="Round"
            value={stats.round}
          />
          <Stat
            icon={<Zap className="w-4 h-4 text-cyan-300" />}
            label="Score"
            value={stats.score}
          />
          <Stat
            icon={<Timer className="w-4 h-4 text-fuchsia-300" />}
            label="Time"
            value={formatTime(stats.elapsedMs)}
            isText
          />
        </div>

        <button
          type="button"
          onClick={onPause}
          aria-label="Pause game"
          className="p-2.5 rounded-xl glass-panel hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Pause className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium w-16 shrink-0">
          Sequence
        </span>
        <ProgressBar value={progressPercent} />
        <span className="text-[11px] text-zinc-400 font-medium w-10 text-right shrink-0">
          {playerProgress}/{sequenceLength}
        </span>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  isText = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  isText?: boolean;
}) {
  return (
    <div className="glass-panel rounded-xl px-3 py-1.5 flex items-center gap-1.5">
      {icon}
      <span className="font-display text-sm sm:text-base font-bold text-white tabular-nums">
        {isText ? value : <AnimatedCounter value={Number(value)} />}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
