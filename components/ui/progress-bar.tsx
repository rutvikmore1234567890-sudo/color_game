"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  gradientClassName?: string;
}

export function ProgressBar({
  value,
  className,
  gradientClassName = "from-fuchsia-500 via-purple-500 to-cyan-400",
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "h-2 w-full rounded-full bg-white/10 overflow-hidden",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full bg-gradient-to-r", gradientClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
