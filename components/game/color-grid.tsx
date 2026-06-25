"use client";

import { useCallback, useMemo } from "react";
import { COLOR_IDS } from "@/types/game";
import { ColorTile } from "@/components/game/color-tile";
import { useKeyboardInput } from "@/hooks/use-keyboard-input";
import type { ColorId } from "@/types/game";

interface ColorGridProps {
  flashTile: ColorId | null;
  activeTile: ColorId | null;
  feedbackTile: { color: ColorId; correct: boolean } | null;
  isInputEnabled: boolean;
  animationsEnabled: boolean;
  onTileClick: (color: ColorId) => void;
}

/**
 * Lays out the five color tiles in a responsive grid: 2-3 split on
 * narrow screens, a clean 5-across row once there's room — and wires up
 * keyboard support (1-5 keys) for accessibility.
 */
export function ColorGrid({
  flashTile,
  activeTile,
  feedbackTile,
  isInputEnabled,
  animationsEnabled,
  onTileClick,
}: ColorGridProps) {
  const handleKeyPress = useCallback(
    (color: ColorId) => {
      if (isInputEnabled) onTileClick(color);
    },
    [isInputEnabled, onTileClick]
  );

  useKeyboardInput(handleKeyPress, isInputEnabled);

  const tiles = useMemo(() => COLOR_IDS, []);

  return (
    <div
      role="group"
      aria-label="Color tiles"
      className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 w-full max-w-md sm:max-w-2xl mx-auto"
    >
      {tiles.map((colorId, index) => (
        <div
          key={colorId}
          className={
            index === 3
              ? "col-span-1 col-start-1 sm:col-start-auto"
              : index === 4
                ? "col-span-1"
                : ""
          }
        >
          <ColorTile
            colorId={colorId}
            isFlashing={flashTile === colorId}
            isActive={activeTile === colorId}
            isCorrectFeedback={
              feedbackTile?.color === colorId && feedbackTile.correct
            }
            isWrongFeedback={
              feedbackTile?.color === colorId && !feedbackTile.correct
            }
            isDisabled={!isInputEnabled}
            animationsEnabled={animationsEnabled}
            onClick={onTileClick}
          />
        </div>
      ))}
    </div>
  );
}
