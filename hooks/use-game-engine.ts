"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONFETTI_TRIGGER_ROUND,
  COUNTDOWN_SECONDS,
  DIFFICULTY_CONFIGS,
  PRE_ROUND_DELAY_MS,
} from "@/constants/colors";
import { useGameTimer } from "@/hooks/use-game-timer";
import type { UseSoundReturn } from "@/hooks/use-sound";
import {
  getFlashOffDuration,
  getFlashOnDuration,
} from "@/utils/round-progression";
import {
  calculateAccuracy,
  calculateClickScore,
  calculatePerfectRoundBonus,
  calculateRoundBonus,
  incrementCombo,
  resetCombo,
} from "@/utils/scoring";
import {
  extendSequence,
  generateSequence,
  getSequenceLengthForRound,
} from "@/utils/sequence";
import { validateClick } from "@/utils/validation";
import type {
  ColorId,
  ColorSequence,
  Difficulty,
  GameOverSummary,
  GameStatus,
  SessionStats,
} from "@/types/game";
import { COLOR_DEFINITIONS } from "@/constants/colors";

const INITIAL_STATS: SessionStats = {
  round: 1,
  bestRound: 1,
  score: 0,
  mistakes: 0,
  correctClicks: 0,
  totalClicks: 0,
  comboMultiplier: 1,
  bestCombo: 1,
  perfectRounds: 0,
  elapsedMs: 0,
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UseGameEngineArgs {
  difficulty: Difficulty;
  sound: UseSoundReturn;
}

/**
 * Owns the entire Color Memory Challenge state machine: sequence
 * generation/playback, player input validation, scoring, round
 * progression, pause/resume, and game-over summary construction.
 *
 * Screens stay dumb — they read `status` + derived values and call the
 * handful of action functions this hook returns.
 */
export function useGameEngine({ difficulty, sound }: UseGameEngineArgs) {
  const [status, setStatus] = useState<GameStatus>("home");
  const [sequence, setSequence] = useState<ColorSequence>([]);
  const [playerInput, setPlayerInput] = useState<ColorSequence>([]);
  const [activeTile, setActiveTile] = useState<ColorId | null>(null);
  const [flashTile, setFlashTile] = useState<ColorId | null>(null);
  const [feedbackTile, setFeedbackTile] = useState<{
    color: ColorId;
    correct: boolean;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);
  const [stats, setStats] = useState<SessionStats>(INITIAL_STATS);
  const [gameOverSummary, setGameOverSummary] =
    useState<GameOverSummary | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const statsRef = useRef(stats);
  const sequenceRef = useRef(sequence);
  const difficultyRef = useRef(difficulty);
  const playbackTokenRef = useRef(0);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const isRunning =
    status === "playing-sequence" ||
    status === "player-turn" ||
    status === "correct-feedback" ||
    status === "wrong-feedback" ||
    status === "round-complete" ||
    status === "countdown";

  const { elapsedMs, reset: resetTimer } = useGameTimer(isRunning);

  /** Plays the current sequence tile-by-tile, then opens player turn. */
  const playSequence = useCallback(
    async (seq: ColorSequence, round: number) => {
      const token = ++playbackTokenRef.current;
      const config = DIFFICULTY_CONFIGS[difficultyRef.current];
      const onMs = getFlashOnDuration(round, config);
      const offMs = getFlashOffDuration(config);

      setStatus("playing-sequence");
      setPlayerInput([]);

      for (const color of seq) {
        if (playbackTokenRef.current !== token) return;
        setFlashTile(color);
        sound.playSequenceTone(COLOR_DEFINITIONS[color].frequency, onMs / 1000);
        await wait(onMs);
        if (playbackTokenRef.current !== token) return;
        setFlashTile(null);
        await wait(offMs);
      }

      if (playbackTokenRef.current !== token) return;
      await wait(PRE_ROUND_DELAY_MS);
      if (playbackTokenRef.current !== token) return;
      setStatus("player-turn");
    },
    [sound]
  );

  /** Kicks off the pre-round countdown, then plays the sequence. */
  const beginRound = useCallback(
    async (seq: ColorSequence, round: number) => {
      const token = ++playbackTokenRef.current;
      setStatus("countdown");
      setCountdown(COUNTDOWN_SECONDS);

      for (let i = COUNTDOWN_SECONDS; i >= 1; i--) {
        if (playbackTokenRef.current !== token) return;
        setCountdown(i);
        sound.playCountdownTick(i === 1);
        await wait(700);
      }

      if (playbackTokenRef.current !== token) return;
      await playSequence(seq, round);
    },
    [playSequence, sound]
  );

  /** Starts a brand-new run from round 1. */
  const startGame = useCallback(() => {
    const config = DIFFICULTY_CONFIGS[difficultyRef.current];
    const length = getSequenceLengthForRound(1, config.startingLength);
    const newSequence = generateSequence(length);

    setStats((prev) => ({
      ...INITIAL_STATS,
      bestRound: prev.bestRound,
    }));
    setGameOverSummary(null);
    setSequence(newSequence);
    setPlayerInput([]);
    setActiveTile(null);
    setFlashTile(null);
    setFeedbackTile(null);
    resetTimer();
    void beginRound(newSequence, 1);
  }, [beginRound, resetTimer]);

  /** Advances to the next round, extending the existing sequence. */
  const advanceRound = useCallback(() => {
    const nextRound = statsRef.current.round + 1;
    const newSequence = extendSequence(sequenceRef.current);
    setSequence(newSequence);
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 1400);
    void beginRound(newSequence, nextRound);
  }, [beginRound]);

  /** Ends the run, freezing a summary snapshot for the Game Over screen. */
  const endGame = useCallback(
    (finalPlayerInput: ColorSequence) => {
      playbackTokenRef.current++; // cancel any in-flight playback/countdown
      const current = statsRef.current;
      const accuracy = calculateAccuracy(
        current.correctClicks,
        current.totalClicks
      );

      setStats((prev) => ({
        ...prev,
        bestRound: Math.max(prev.bestRound, prev.round),
      }));

      setGameOverSummary({
        reachedRound: current.round,
        correctSequence: sequenceRef.current,
        playerSequence: finalPlayerInput,
        finalScore: current.score,
        bestRound: Math.max(current.bestRound, current.round),
        accuracy,
        mistakes: current.mistakes,
        elapsedMs,
      });

      sound.playGameOver();
      setStatus("game-over");
    },
    [elapsedMs, sound]
  );

  /** Handles a single tile press during the player's turn. */
  const handleTileClick = useCallback(
    (color: ColorId) => {
      if (status !== "player-turn") return;

      const nextPlayerInput = [...playerInput, color];
      setPlayerInput(nextPlayerInput);
      setActiveTile(color);
      setTimeout(() => setActiveTile(null), 180);

      const result = validateClick(nextPlayerInput, sequenceRef.current);
      const config = DIFFICULTY_CONFIGS[difficultyRef.current];

      if (result.status === "wrong") {
        sound.playWrongClick();
        setFeedbackTile({ color, correct: false });
        setStats((prev) => ({
          ...prev,
          mistakes: prev.mistakes + 1,
          totalClicks: prev.totalClicks + 1,
          comboMultiplier: resetCombo(),
        }));
        setStatus("wrong-feedback");
        setTimeout(() => {
          setFeedbackTile(null);
          endGame(nextPlayerInput);
        }, 900);
        return;
      }

      // Correct click (progress or complete)
      const pointsEarned = calculateClickScore(
        statsRef.current.comboMultiplier,
        config.scoreMultiplier
      );
      sound.playCorrectClick(COLOR_DEFINITIONS[color].frequency);
      setFeedbackTile({ color, correct: true });
      setTimeout(() => setFeedbackTile(null), 220);

      setStats((prev) => {
        const nextCombo = incrementCombo(prev.comboMultiplier);
        return {
          ...prev,
          score: prev.score + pointsEarned,
          correctClicks: prev.correctClicks + 1,
          totalClicks: prev.totalClicks + 1,
          comboMultiplier: nextCombo,
          bestCombo: Math.max(prev.bestCombo, nextCombo),
        };
      });

      if (result.status === "correct-complete") {
        const isPerfect = statsRef.current.mistakes === 0;
        const roundBonus = calculateRoundBonus(
          statsRef.current.round,
          config.scoreMultiplier
        );
        const perfectBonus = isPerfect
          ? calculatePerfectRoundBonus(
              statsRef.current.round,
              config.scoreMultiplier
            )
          : 0;

        sound.playRoundComplete();
        if (statsRef.current.round + 1 >= CONFETTI_TRIGGER_ROUND) {
          sound.playVictoryFanfare();
        }

        setStatus("round-complete");
        setStats((prev) => ({
          ...prev,
          score: prev.score + roundBonus + perfectBonus,
          round: prev.round + 1,
          bestRound: Math.max(prev.bestRound, prev.round + 1),
          perfectRounds: isPerfect ? prev.perfectRounds + 1 : prev.perfectRounds,
        }));

        setTimeout(() => {
          advanceRound();
        }, 1100);
      }
    },
    [status, playerInput, sound, endGame, advanceRound]
  );

  /** Pauses an in-progress run; cancels any pending sequence/countdown timers. */
  const pauseGame = useCallback(() => {
    if (status === "home" || status === "game-over" || status === "paused") {
      return;
    }
    playbackTokenRef.current++; // invalidate any in-flight async loops
    setStatus("paused");
  }, [status]);

  /** Resumes from pause by re-playing the current sequence from the top. */
  const resumeGame = useCallback(() => {
    if (status !== "paused") return;
    void playSequence(sequenceRef.current, statsRef.current.round);
  }, [status, playSequence]);

  /** Returns to the home screen, fully resetting state. */
  const goHome = useCallback(() => {
    playbackTokenRef.current++;
    setStatus("home");
    setSequence([]);
    setPlayerInput([]);
    setActiveTile(null);
    setFlashTile(null);
    setFeedbackTile(null);
    setGameOverSummary(null);
    resetTimer();
  }, [resetTimer]);

  /** Restarts a fresh run immediately from the Game Over screen. */
  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    status,
    sequence,
    playerInput,
    activeTile,
    flashTile,
    feedbackTile,
    countdown,
    stats: { ...stats, elapsedMs },
    gameOverSummary,
    showLevelUp,
    startGame,
    handleTileClick,
    pauseGame,
    resumeGame,
    goHome,
    playAgain,
  };
}

export type UseGameEngineReturn = ReturnType<typeof useGameEngine>;
