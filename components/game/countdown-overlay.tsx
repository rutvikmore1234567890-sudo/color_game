"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CountdownOverlayProps {
  active: boolean;
  count: number;
}

/** Big pulsing number shown for the 3-2-1 beat before a round begins. */
export function CountdownOverlay({ active, count }: CountdownOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-7xl sm:text-8xl font-black text-white"
              style={{
                textShadow:
                  "0 0 40px rgba(168,85,247,0.8), 0 0 80px rgba(56,232,224,0.5)",
              }}
              aria-live="assertive"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
