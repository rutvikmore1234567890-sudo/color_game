import type { DifficultyConfig } from "@/types/game";

/**
 * Computes the ON duration (ms) for a flashed tile at a given round.
 * Easy/Normal hold steady (flashShrinkPerRoundMs = 0). Hard/Insane shrink
 * the flash duration every round, floored at minFlashOnMs so the game
 * never becomes literally unplayable.
 */
export function getFlashOnDuration(
  round: number,
  config: DifficultyConfig
): number {
  const shrink = config.flashShrinkPerRoundMs * (round - 1);
  const duration = config.baseFlashOnMs - shrink;
  return Math.max(duration, config.minFlashOnMs);
}

/** OFF duration between flashes is constant per-difficulty. */
export function getFlashOffDuration(config: DifficultyConfig): number {
  return config.flashOffMs;
}

/** The next round number after completing the current one. */
export function getNextRound(currentRound: number): number {
  return currentRound + 1;
}
