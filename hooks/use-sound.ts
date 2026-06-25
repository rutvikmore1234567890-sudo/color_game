"use client";

import { useEffect, useState } from "react";
import { SoundEngine } from "@/lib/sound-engine";

/**
 * Provides a stable SoundEngine instance for the lifetime of the
 * component tree, and exposes settings-aware play methods that silently
 * no-op when sound/music is toggled off. The engine is created once via
 * a lazy useState initializer (not a ref-checked-during-render pattern)
 * so it never touches mutable state during render.
 */
export function useSound(soundEnabled: boolean, musicEnabled: boolean) {
  const [engine] = useState(() => new SoundEngine());

  useEffect(() => {
    return () => {
      engine.dispose();
    };
  }, [engine]);

  useEffect(() => {
    if (musicEnabled) {
      engine.startAmbientMusic();
    } else {
      engine.stopAmbientMusic();
    }
  }, [engine, musicEnabled]);

  const playSequenceTone = (frequency: number, durationSec: number) => {
    if (!soundEnabled) return;
    engine.playSequenceTone(frequency, durationSec);
  };

  const playCorrectClick = (frequency: number) => {
    if (!soundEnabled) return;
    engine.playCorrectClick(frequency);
  };

  const playWrongClick = () => {
    if (!soundEnabled) return;
    engine.playWrongClick();
  };

  const playRoundComplete = () => {
    if (!soundEnabled) return;
    engine.playRoundComplete();
  };

  const playVictoryFanfare = () => {
    if (!soundEnabled) return;
    engine.playVictoryFanfare();
  };

  const playGameOver = () => {
    if (!soundEnabled) return;
    engine.playGameOver();
  };

  const playCountdownTick = (isLast: boolean) => {
    if (!soundEnabled) return;
    engine.playCountdownTick(isLast);
  };

  const playUiClick = () => {
    if (!soundEnabled) return;
    engine.playUiClick();
  };

  return {
    playSequenceTone,
    playCorrectClick,
    playWrongClick,
    playRoundComplete,
    playVictoryFanfare,
    playGameOver,
    playCountdownTick,
    playUiClick,
  };
}

export type UseSoundReturn = ReturnType<typeof useSound>;
