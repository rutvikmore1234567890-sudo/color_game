"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Hand, X } from "lucide-react";
import type { GameStatus } from "@/types/game";

interface StatusBannerProps {
  status: GameStatus;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  "playing-sequence": {
    label: "Watch carefully",
    icon: <Eye className="w-4 h-4" />,
    className: "text-cyan-300",
  },
  "player-turn": {
    label: "Your turn",
    icon: <Hand className="w-4 h-4" />,
    className: "text-fuchsia-300",
  },
  "correct-feedback": {
    label: "Correct",
    icon: <Check className="w-4 h-4" />,
    className: "text-emerald-300",
  },
  "round-complete": {
    label: "Round complete!",
    icon: <Check className="w-4 h-4" />,
    className: "text-emerald-300",
  },
  "wrong-feedback": {
    label: "Wrong",
    icon: <X className="w-4 h-4" />,
    className: "text-rose-400",
  },
};

/** Live-region status text announcing the current phase of play. */
export function StatusBanner({ status }: StatusBannerProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className="h-9 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {config && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 font-display text-sm sm:text-base font-semibold tracking-wide uppercase ${config.className}`}
          >
            {config.icon}
            {config.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
