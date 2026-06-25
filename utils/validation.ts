import type { ColorId, ColorSequence } from "@/types/game";

export type ClickValidationResult =
  | { status: "correct-progress" } // correct so far, sequence not finished
  | { status: "correct-complete" } // correct and matches full sequence length
  | { status: "wrong" };

/**
 * Validates the player's latest click against the expected sequence.
 * `playerSequenceSoFar` should already include the just-clicked color as
 * its last element.
 */
export function validateClick(
  playerSequenceSoFar: ColorSequence,
  targetSequence: ColorSequence
): ClickValidationResult {
  const index = playerSequenceSoFar.length - 1;
  const clicked = playerSequenceSoFar[index];
  const expected = targetSequence[index];

  if (clicked !== expected) {
    return { status: "wrong" };
  }

  if (playerSequenceSoFar.length === targetSequence.length) {
    return { status: "correct-complete" };
  }

  return { status: "correct-progress" };
}

/** Quick equality check, mostly useful for tests/debug. */
export function sequencesMatch(a: ColorSequence, b: ColorId[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((color, i) => color === b[i]);
}
