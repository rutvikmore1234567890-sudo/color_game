/**
 * Core type definitions for Color Memory Challenge.
 * Centralizing these keeps every hook, component, and util speaking
 * the same shape of data.
 */

/** The five playable tile identifiers. */
export type ColorId = "red" | "blue" | "green" | "yellow" | "purple";

/** A full sequence the player must reproduce. */
export type ColorSequence = ColorId[];

/** Top-level game state machine. */
export type GameStatus =
  | "home"
  | "countdown"
  | "playing-sequence"
  | "player-turn"
  | "correct-feedback"
  | "wrong-feedback"
  | "round-complete"
  | "paused"
  | "game-over";

/** Difficulty presets that change pacing and flash timing. */
export type Difficulty = "easy" | "normal" | "hard" | "insane";

/** Per-difficulty timing/scoring configuration. */
export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  description: string;
  /** Starting sequence length for round 1. */
  startingLength: number;
  /** Base ON duration (ms) for a flashed tile. */
  baseFlashOnMs: number;
  /** OFF duration (ms) between flashes. */
  flashOffMs: number;
  /** Minimum flash duration hard mode can shrink to. */
  minFlashOnMs: number;
  /** How much ms is shaved off the flash per round (hard/insane only). */
  flashShrinkPerRoundMs: number;
  /** Score multiplier applied to all points earned. */
  scoreMultiplier: number;
}

/** A single tile's live visual/interaction state. */
export interface TileState {
  id: ColorId;
  isLit: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isDisabled: boolean;
}

/** Statistics tracked across a single play session (one run, until Game Over). */
export interface SessionStats {
  round: number;
  bestRound: number;
  score: number;
  mistakes: number;
  correctClicks: number;
  totalClicks: number;
  comboMultiplier: number;
  bestCombo: number;
  perfectRounds: number;
  elapsedMs: number;
}

/** Snapshot frozen at the moment of game over, used by the summary screen. */
export interface GameOverSummary {
  reachedRound: number;
  correctSequence: ColorSequence;
  playerSequence: ColorSequence;
  finalScore: number;
  bestRound: number;
  accuracy: number;
  mistakes: number;
  elapsedMs: number;
}

/** Persisted (session-only, in-memory) settings the player can toggle. */
export interface GameSettings {
  difficulty: Difficulty;
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
}

export const COLOR_IDS: readonly ColorId[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
] as const;
