"use client";

import { useCallback, useState } from "react";
import type { Difficulty, GameSettings } from "@/types/game";

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: "normal",
  soundEnabled: true,
  musicEnabled: false,
  animationsEnabled: true,
};

/**
 * Session-only settings (no localStorage/cookies per the project
 * requirements) — everything resets to defaults on page refresh.
 */
export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setSettings((prev) => ({ ...prev, difficulty }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleMusic = useCallback(() => {
    setSettings((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  }, []);

  const toggleAnimations = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      animationsEnabled: !prev.animationsEnabled,
    }));
  }, []);

  return {
    settings,
    setDifficulty,
    toggleSound,
    toggleMusic,
    toggleAnimations,
  };
}
