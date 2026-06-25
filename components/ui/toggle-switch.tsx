"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer",
        checked ? "bg-gradient-to-r from-fuchsia-500 to-cyan-400" : "bg-white/15"
      )}
    >
      <motion.span
        className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 26 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
