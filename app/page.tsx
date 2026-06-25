"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { HomeScreen } from "@/components/screens/home-screen";
import { PlayingScreen } from "@/components/screens/playing-screen";
import { GameOverScreen } from "@/components/screens/game-over-screen";
import { useGameEngine } from "@/hooks/use-game-engine";
import { useGameSettings } from "@/hooks/use-game-settings";
import { useSound } from "@/hooks/use-sound";
import { screenTransition } from "@/animations/variants";

/**
 * Root page: owns settings + sound + the game engine, and decides which
 * top-level screen to render based on the engine's current status. Every
 * screen is otherwise "dumb" and just receives data + callbacks.
 */
export default function Home() {
  const { settings, setDifficulty, toggleSound, toggleMusic, toggleAnimations } =
    useGameSettings();

  const sound = useSound(settings.soundEnabled, settings.musicEnabled);

  const engine = useGameEngine({
    difficulty: settings.difficulty,
    sound,
  });

  const isPlayingPhase = engine.status !== "home" && engine.status !== "game-over";

  return (
    <main className="relative flex-1 flex flex-col">
      <AnimatedBackground animationsEnabled={settings.animationsEnabled} />

      <AnimatePresence mode="wait">
        {engine.status === "home" && (
          <motion.div key="home" {...screenTransition}>
            <HomeScreen
              settings={settings}
              onStart={engine.startGame}
              onDifficultyChange={setDifficulty}
              onToggleSound={toggleSound}
              onToggleMusic={toggleMusic}
              onToggleAnimations={toggleAnimations}
            />
          </motion.div>
        )}

        {isPlayingPhase && (
          <motion.div key="playing" {...screenTransition}>
            <PlayingScreen
              engine={engine}
              settings={settings}
              onDifficultyChange={setDifficulty}
              onToggleSound={toggleSound}
              onToggleMusic={toggleMusic}
              onToggleAnimations={toggleAnimations}
            />
          </motion.div>
        )}

        {engine.status === "game-over" && engine.gameOverSummary && (
          <motion.div key="game-over" {...screenTransition}>
            <GameOverScreen
              summary={engine.gameOverSummary}
              onPlayAgain={engine.playAgain}
              onHome={engine.goHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
