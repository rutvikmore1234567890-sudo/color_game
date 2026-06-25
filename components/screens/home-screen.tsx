"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, MousePointerClick, Settings, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SettingsPanel } from "@/components/game/settings-panel";
import { fadeInUp, staggerContainer } from "@/animations/variants";
import type { Difficulty, GameSettings } from "@/types/game";

interface HomeScreenProps {
  settings: GameSettings;
  onStart: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleAnimations: () => void;
}

export function HomeScreen({
  settings,
  onStart,
  onDifficultyChange,
  onToggleSound,
  onToggleMusic,
  onToggleAnimations,
}: HomeScreenProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[100dvh] px-4 py-10 gap-8 text-center relative"
    >
      <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3">
        <span className="font-display text-xs sm:text-sm tracking-[0.3em] text-cyan-300 uppercase">
          Five Tiles. One Sequence. No Limit.
        </span>
        <h1
          className="font-display text-5xl sm:text-7xl font-black text-white leading-[1.05]"
          style={{
            textShadow:
              "0 0 50px rgba(168,85,247,0.6), 0 0 100px rgba(56,232,224,0.3)",
          }}
        >
          Color Memory
          <br />
          <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Challenge
          </span>
        </h1>
        <p className="text-zinc-400 max-w-md text-sm sm:text-base mt-1">
          Watch the tiles light up, then repeat the pattern back. Every round
          adds one more step — how far can your memory carry you?
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={onStart} aria-label="Start game">
          Start Game
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp} className="w-full max-w-3xl">
        <GlassCard className="p-5 sm:p-7">
          <h2 className="font-display text-sm uppercase tracking-wider text-zinc-300 mb-4">
            How to play
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <HowToCard
              icon={<Eye className="w-5 h-5 text-cyan-300" />}
              title="Watch"
              description="A sequence of colors lights up, one tile at a time."
            />
            <HowToCard
              icon={<MousePointerClick className="w-5 h-5 text-fuchsia-300" />}
              title="Repeat"
              description="Click — or press keys 1-5 — to play the sequence back in order."
            />
            <HowToCard
              icon={<TrendingUp className="w-5 h-5 text-amber-300" />}
              title="Climb"
              description="Each round adds one more color. One mistake ends the run."
            />
          </div>
        </GlassCard>
      </motion.div>

      {showSettings && (
        <SettingsOverlay onClose={() => setShowSettings(false)}>
          <SettingsPanel
            settings={settings}
            onDifficultyChange={onDifficultyChange}
            onToggleSound={onToggleSound}
            onToggleMusic={onToggleMusic}
            onToggleAnimations={onToggleAnimations}
          />
        </SettingsOverlay>
      )}
    </motion.div>
  );
}

function HowToCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-display text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function SettingsOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        <GlassCard className="p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-display text-lg font-bold text-white mb-5">
            Settings
          </h2>
          {children}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
