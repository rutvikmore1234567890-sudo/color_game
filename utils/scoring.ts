import {
  MAX_COMBO_MULTIPLIER,
  POINTS_PER_CORRECT_CLICK,
  ROUND_BONUS_MULTIPLIER,
} from "@/constants/colors";

/**
 * Points awarded for a single correct tile click, scaled by the current
 * combo multiplier and the active difficulty's score multiplier.
 */
export function calculateClickScore(
  comboMultiplier: number,
  difficultyMultiplier: number
): number {
  return Math.round(
    POINTS_PER_CORRECT_CLICK * comboMultiplier * difficultyMultiplier
  );
}

/**
 * Bonus awarded for fully completing a round, scaled with round number so
 * later, harder rounds matter more.
 */
export function calculateRoundBonus(
  round: number,
  difficultyMultiplier: number
): number {
  return Math.round(round * ROUND_BONUS_MULTIPLIER * difficultyMultiplier);
}

/**
 * Extra bonus for a "perfect" round: the round was finished with zero
 * mistakes anywhere in the run so far counted toward this round.
 */
export function calculatePerfectRoundBonus(
  round: number,
  difficultyMultiplier: number
): number {
  return Math.round(round * 10 * difficultyMultiplier);
}

/**
 * Grows the combo multiplier by a fixed step on every correct click,
 * capped at MAX_COMBO_MULTIPLIER.
 */
export function incrementCombo(current: number): number {
  const next = current + 0.1;
  return Math.min(Number(next.toFixed(2)), MAX_COMBO_MULTIPLIER);
}

/** Combo resets to 1x the instant a mistake happens. */
export function resetCombo(): number {
  return 1;
}

/** Accuracy as a 0-100 percentage, safe against divide-by-zero. */
export function calculateAccuracy(
  correctClicks: number,
  totalClicks: number
): number {
  if (totalClicks === 0) return 100;
  return Math.round((correctClicks / totalClicks) * 100);
}
