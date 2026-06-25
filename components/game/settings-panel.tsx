"use client";

import { Music, Sparkles, Volume2 } from "lucide-react";
import { DIFFICULTY_CONFIGS } from "@/constants/colors";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { cn } from "@/lib/utils";
import type { Difficulty, GameSettings } from "@/types/game";

interface SettingsPanelProps {
  settings: GameSettings;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleAnimations: () => void;
  disabled?: boolean;
}

export function SettingsPanel({
  settings,
  onDifficultyChange,
  onToggleSound,
  onToggleMusic,
  onToggleAnimations,
  disabled = false,
}: SettingsPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
          Difficulty
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(DIFFICULTY_CONFIGS).map((config) => (
            <button
              key={config.id}
              type="button"
              disabled={disabled}
              onClick={() => onDifficultyChange(config.id)}
              aria-pressed={settings.difficulty === config.id}
              className={cn(
                "rounded-xl px-3 py-2.5 text-left transition-all duration-200 border cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
                settings.difficulty === config.id
                  ? "bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/20 border-fuchsia-400/50 text-white"
                  : "bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.06]"
              )}
            >
              <span className="font-display text-sm font-bold block">
                {config.label}
              </span>
              <span className="text-[11px] text-zinc-400 leading-snug block mt-0.5">
                {config.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SettingRow
          icon={<Volume2 className="w-4 h-4 text-cyan-300" />}
          label="Sound effects"
          checked={settings.soundEnabled}
          onChange={onToggleSound}
        />
        <SettingRow
          icon={<Music className="w-4 h-4 text-fuchsia-300" />}
          label="Ambient music"
          checked={settings.musicEnabled}
          onChange={onToggleMusic}
        />
        <SettingRow
          icon={<Sparkles className="w-4 h-4 text-amber-300" />}
          label="Animations"
          checked={settings.animationsEnabled}
          onChange={onToggleAnimations}
        />
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-zinc-200">
        {icon}
        {label}
      </span>
      <ToggleSwitch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
