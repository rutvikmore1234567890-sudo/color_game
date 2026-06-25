"use client";

import { motion } from "framer-motion";
import { Home, Play } from "lucide-react";
import { GameHud } from "@/components/game/game-hud";
import { StatusBanner } from "@/components/game/status-banner";
import { ColorGrid } from "@/components/game/color-grid";
import { CountdownOverlay } from "@/components/game/countdown-overlay";
import { LevelUpPopup } from "@/components/game/level-up-popup";
import { ScreenFlash } from "@/components/ui/screen-flash";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SettingsPanel } from "@/components/game/settings-panel";
import type { UseGameEngineReturn } from "@/hooks/use-game-engine";
import type { Difficulty, GameSettings } from "@/types/game";

interface PlayingScreenProps {
  engine: UseGameEngineReturn;
  settings: GameSettings;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleAnimations: () => void;
}

export function PlayingScreen({
  engine,
  settings,
  onDifficultyChange,
  onToggleSound,
  onToggleMusic,
  onToggleAnimations,
}: PlayingScreenProps) {
  const {
    status,
    sequence,
    playerInput,
    activeTile,
    flashTile,
    feedbackTile,
    countdown,
    stats,
    showLevelUp,
    handleTileClick,
    pauseGame,
    resumeGame,
    goHome,
  } = engine;

  const isInputEnabled = status === "player-turn";
  const isPaused = status === "paused";
  const isCountdown = status === "countdown";
  const showScreenFlash = status === "round-complete";

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 py-8 gap-8">
      <ScreenFlash active={showScreenFlash} />

      <GameHud
        stats={stats}
        sequenceLength={sequence.length}
        playerProgress={playerInput.length}
        onPause={pauseGame}
      />

      <StatusBanner status={status} />

      <div className="relative w-full flex items-center justify-center">
        <CountdownOverlay active={isCountdown} count={countdown} />
        <LevelUpPopup active={showLevelUp} round={stats.round} />

        <ColorGrid
          flashTile={flashTile}
          activeTile={activeTile}
          feedbackTile={feedbackTile}
          isInputEnabled={isInputEnabled}
          animationsEnabled={settings.animationsEnabled}
          onTileClick={handleTileClick}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-center">
        <MiniStat label="Combo" value={`${stats.comboMultiplier.toFixed(1)}x`} />
        <MiniStat
          label="Accuracy"
          value={`${
            stats.totalClicks === 0
              ? 100
              : Math.round((stats.correctClicks / stats.totalClicks) * 100)
          }%`}
        />
        <MiniStat label="Mistakes" value={stats.mistakes} />
        <MiniStat label="Perfect rounds" value={stats.perfectRounds} />
      </div>

      {isPaused && (
        <PauseOverlay
          settings={settings}
          onResume={resumeGame}
          onHome={goHome}
          onDifficultyChange={onDifficultyChange}
          onToggleSound={onToggleSound}
          onToggleMusic={onToggleMusic}
          onToggleAnimations={onToggleAnimations}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-panel rounded-xl px-3 py-2.5">
      <p className="font-display text-base sm:text-lg font-bold text-white tabular-nums">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">
        {label}
      </p>
    </div>
  );
}

function PauseOverlay({
  settings,
  onResume,
  onHome,
  onDifficultyChange,
  onToggleSound,
  onToggleMusic,
  onToggleAnimations,
}: {
  settings: GameSettings;
  onResume: () => void;
  onHome: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleAnimations: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <GlassCard className="p-6">
          <h2 className="font-display text-xl font-bold text-white mb-1 text-center">
            Paused
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-5">
            Difficulty can&apos;t change mid-run — settings here apply next game.
          </p>

          <SettingsPanel
            settings={settings}
            onDifficultyChange={onDifficultyChange}
            onToggleSound={onToggleSound}
            onToggleMusic={onToggleMusic}
            onToggleAnimations={onToggleAnimations}
            disabled
          />

          <div className="flex gap-3 mt-6">
            <Button className="flex-1" onClick={onResume} aria-label="Resume game">
              <Play className="w-4 h-4" />
              Resume
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onHome}
              aria-label="Quit to home"
            >
              <Home className="w-4 h-4" />
              Quit
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
