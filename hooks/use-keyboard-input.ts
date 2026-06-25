"use client";

import { useEffect } from "react";
import { COLOR_DEFINITIONS } from "@/constants/colors";
import type { ColorId } from "@/types/game";

/**
 * Lets the player use number keys 1-5 to trigger tiles (mapped via each
 * color's `key` in COLOR_DEFINITIONS), in addition to mouse/touch and
 * native button Tab+Enter/Space focus handling already provided by
 * rendering tiles as real <button> elements.
 */
export function useKeyboardInput(
  onColorPress: (color: ColorId) => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const keyToColor = new Map<string, ColorId>(
      Object.values(COLOR_DEFINITIONS).map((def) => [def.key, def.id])
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      const color = keyToColor.get(event.key);
      if (color) {
        onColorPress(color);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onColorPress, enabled]);
}
