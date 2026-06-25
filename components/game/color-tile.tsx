"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { COLOR_DEFINITIONS } from "@/constants/colors";
import { shakeAnimation } from "@/animations/variants";
import { cn } from "@/lib/utils";
import type { ColorId } from "@/types/game";

interface ColorTileProps {
  colorId: ColorId;
  isFlashing: boolean;
  isActive: boolean;
  isCorrectFeedback: boolean;
  isWrongFeedback: boolean;
  isDisabled: boolean;
  animationsEnabled: boolean;
  onClick: (color: ColorId) => void;
}

/**
 * A single tile in the color grid. Memoized since the grid re-renders on
 * every state tick (timers, scores) but most tiles aren't visually
 * affected by most of those ticks.
 */
function ColorTileComponent({
  colorId,
  isFlashing,
  isActive,
  isCorrectFeedback,
  isWrongFeedback,
  isDisabled,
  animationsEnabled,
  onClick,
}: ColorTileProps) {
  const def = COLOR_DEFINITIONS[colorId];
  const isLit = isFlashing || isActive;

  return (
    <motion.button
      type="button"
      aria-label={`${def.label} tile${isDisabled ? "" : `, press ${def.key}`}`}
      aria-pressed={isLit}
      disabled={isDisabled}
      onClick={() => onClick(colorId)}
      animate={
        animationsEnabled && isWrongFeedback
          ? shakeAnimation
          : { x: 0 }
      }
      whileHover={!isDisabled ? { scale: 1.03 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      className={cn(
        "relative aspect-square w-full rounded-[1.75rem] sm:rounded-[2rem] bg-gradient-to-br transition-colors duration-150 cursor-pointer disabled:cursor-default",
        "border border-white/10",
        isLit ? def.activeClass : def.idleClass
      )}
      style={
        isLit
          ? {
              boxShadow: `0 0 45px 8px ${def.hex}99, 0 0 90px 20px ${def.hex}55, inset 0 0 30px ${def.hex}66`,
            }
          : {
              boxShadow: `inset 0 2px 12px rgba(0,0,0,0.5)`,
            }
      }
    >
      <span className="sr-only">{def.label}</span>

      {/* Inner glassy highlight */}
      <span
        className="absolute inset-2 rounded-[1.5rem] sm:rounded-[1.75rem] bg-white/5 pointer-events-none"
        aria-hidden="true"
      />

      {/* Correct-click expanding ring */}
      {isCorrectFeedback && animationsEnabled && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-[1.75rem] sm:rounded-[2rem] border-2"
          style={{ borderColor: def.hex }}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 1.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      {/* Pulse while flashing in sequence playback */}
      {isFlashing && animationsEnabled && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-[1.75rem] sm:rounded-[2rem]"
          style={{ backgroundColor: def.hex, opacity: 0.25 }}
          initial={{ scale: 0.9, opacity: 0.4 }}
          animate={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <span
        aria-hidden="true"
        className="absolute bottom-2 right-3 text-[10px] sm:text-xs font-display text-white/30 select-none"
      >
        {def.key}
      </span>
    </motion.button>
  );
}

export const ColorTile = memo(ColorTileComponent);
