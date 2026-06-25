import type { ColorId, DifficultyConfig, Difficulty } from "@/types/game";

/**
 * Visual + audio identity for each tile.
 * `hex` drives glows/shadows (computed at runtime), the rest drives Tailwind
 * classes and the oscillator frequency used for that tile's tone.
 */
export interface ColorDefinition {
  id: ColorId;
  label: string;
  /** Base hex used for box-shadow glow colors. */
  hex: string;
  /** Tailwind gradient classes for the resting tile. */
  idleClass: string;
  /** Tailwind gradient classes for the lit/active tile. */
  activeClass: string;
  /** Oscillator frequency (Hz) for this tile's tone. */
  frequency: number;
  /** Keyboard key that triggers this tile. */
  key: string;
}

export const COLOR_DEFINITIONS: Record<ColorId, ColorDefinition> = {
  red: {
    id: "red",
    label: "Red",
    hex: "#fb4141",
    idleClass: "from-rose-700/40 to-rose-950/60",
    activeClass: "from-rose-400 to-rose-600",
    frequency: 261.63, // C4
    key: "1",
  },
  blue: {
    id: "blue",
    label: "Blue",
    hex: "#3b82f6",
    idleClass: "from-blue-700/40 to-blue-950/60",
    activeClass: "from-blue-400 to-blue-600",
    frequency: 329.63, // E4
    key: "2",
  },
  green: {
    id: "green",
    label: "Green",
    hex: "#22d3a8",
    idleClass: "from-emerald-700/40 to-emerald-950/60",
    activeClass: "from-emerald-400 to-emerald-600",
    frequency: 392.0, // G4
    key: "3",
  },
  yellow: {
    id: "yellow",
    label: "Yellow",
    hex: "#fbbf24",
    idleClass: "from-amber-600/40 to-amber-950/60",
    activeClass: "from-amber-300 to-amber-500",
    frequency: 493.88, // B4
    key: "4",
  },
  purple: {
    id: "purple",
    label: "Purple",
    hex: "#a855f7",
    idleClass: "from-purple-700/40 to-purple-950/60",
    activeClass: "from-purple-400 to-purple-600",
    frequency: 587.33, // D5
    key: "5",
  },
};

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "Easy",
    description: "Slow, generous flashes. Great for learning the grid.",
    startingLength: 3,
    baseFlashOnMs: 750,
    flashOffMs: 300,
    minFlashOnMs: 750,
    flashShrinkPerRoundMs: 0,
    scoreMultiplier: 0.75,
  },
  normal: {
    id: "normal",
    label: "Normal",
    description: "The classic pace. Flashes hold steady every round.",
    startingLength: 3,
    baseFlashOnMs: 600,
    flashOffMs: 250,
    minFlashOnMs: 600,
    flashShrinkPerRoundMs: 0,
    scoreMultiplier: 1,
  },
  hard: {
    id: "hard",
    label: "Hard",
    description: "Flashes get shorter as you climb. Stay sharp.",
    startingLength: 3,
    baseFlashOnMs: 600,
    flashOffMs: 220,
    minFlashOnMs: 280,
    flashShrinkPerRoundMs: 18,
    scoreMultiplier: 1.5,
  },
  insane: {
    id: "insane",
    label: "Insane",
    description: "Brutal shrink rate. Only for the fastest memory.",
    startingLength: 4,
    baseFlashOnMs: 500,
    flashOffMs: 160,
    minFlashOnMs: 160,
    flashShrinkPerRoundMs: 28,
    scoreMultiplier: 2,
  },
};

export const POINTS_PER_CORRECT_CLICK = 10;
export const ROUND_BONUS_MULTIPLIER = 25;
export const PRE_ROUND_DELAY_MS = 800;
export const COUNTDOWN_SECONDS = 3;
export const MAX_COMBO_MULTIPLIER = 5;
export const CONFETTI_TRIGGER_ROUND = 10;
