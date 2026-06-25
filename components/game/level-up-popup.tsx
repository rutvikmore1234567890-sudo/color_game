"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LevelUpPopup({ active, round }: { active: boolean; round: number }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="glass-panel rounded-2xl px-6 py-4 flex items-center gap-3 border border-fuchsia-400/30"
            style={{ boxShadow: "0 0 50px rgba(168,85,247,0.5)" }}
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
            <div>
              <p className="font-display text-lg font-bold text-white leading-tight">
                Round {round}
              </p>
              <p className="text-xs text-zinc-300">Level up!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
