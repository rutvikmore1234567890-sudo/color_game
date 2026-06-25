import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/** Reusable glassmorphism surface used for every panel in the game. */
export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}
