import { COLOR_IDS } from "@/types/game";
import type { ColorId, ColorSequence } from "@/types/game";

/**
 * Generates a single random color, uniformly distributed across the five
 * tile ids.
 */
export function getRandomColor(): ColorId {
  const index = Math.floor(Math.random() * COLOR_IDS.length);
  return COLOR_IDS[index];
}

/**
 * Generates a brand new sequence of the given length. Used at the very
 * start of a run (round 1).
 */
export function generateSequence(length: number): ColorSequence {
  return Array.from({ length }, () => getRandomColor());
}

/**
 * Extends an existing sequence by exactly one random color. This is the
 * classic "Simon" growth pattern: each round keeps everything from before
 * and appends one new step, rather than regenerating from scratch.
 */
export function extendSequence(sequence: ColorSequence): ColorSequence {
  return [...sequence, getRandomColor()];
}

/**
 * Sequence length for a given round number, based on the difficulty's
 * starting length. Round 1 -> startingLength, each round after adds 1.
 */
export function getSequenceLengthForRound(
  round: number,
  startingLength: number
): number {
  return startingLength + (round - 1);
}
