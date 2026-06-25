# Color Memory Challenge

A polished, browser-only color memory game built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. No backend, no database, no auth, no localStorage — everything lives in memory for the duration of the page session and resets on refresh.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## How it's organized

```
app/                   Next.js App Router entry (layout, page, global styles)
components/
  ui/                  Generic primitives: Button, GlassCard, ToggleSwitch,
                       AnimatedBackground, AnimatedCounter, ProgressBar,
                       Confetti, ScreenFlash
  game/                Game-specific pieces: ColorTile, ColorGrid, GameHud,
                       StatusBanner, CountdownOverlay, LevelUpPopup,
                       SettingsPanel
  screens/             Top-level screens: HomeScreen, PlayingScreen,
                       GameOverScreen
hooks/                 useGameEngine (the state machine), useSound,
                       useGameTimer, useGameSettings, useKeyboardInput
lib/                   SoundEngine (Web Audio API) + small utils
utils/                 Pure game-logic functions: sequence generation,
                       scoring, round progression, click validation
constants/             Color definitions, difficulty configs, timing/scoring
                       constants
types/                 Shared TypeScript types
animations/            Shared Framer Motion variants
```

## Game rules

- Five tiles (Red, Blue, Green, Yellow, Purple). Each round shows a sequence
  one tile at a time, then you repeat it back by clicking or pressing keys
  1–5.
- Round 1 starts at sequence length 3 (4 on Insane difficulty); each
  completed round adds one more step, with no maximum.
- A correct click scores points, scaled by your combo multiplier and the
  difficulty's score multiplier. Completing a round adds a round bonus
  (round × 25); a mistake-free round also earns a perfect-round bonus.
- One wrong click ends the run and shows the Game Over screen with your
  reached round, accuracy, mistakes, time, and a side-by-side comparison of
  the correct vs. your sequence. Reaching round 10+ triggers a confetti
  celebration.

## Difficulty

| Difficulty | Starting length | Flash behavior |
|---|---|---|
| Easy | 3 | Slow, constant 750ms flashes |
| Normal | 3 | Classic, constant 600ms flashes |
| Hard | 3 | Starts at 600ms, shrinks 18ms/round down to a 280ms floor |
| Insane | 4 | Starts at 500ms, shrinks 28ms/round down to a 160ms floor |

## Sound

All sounds (sequence tones, correct/wrong clicks, round-complete arpeggio,
victory fanfare, game-over tones, countdown ticks, ambient music) are
generated live with the Web Audio API in `lib/sound-engine.ts` — there are
no audio files. Sound effects and ambient music can be toggled
independently in Settings.

## Accessibility

- Tiles are real `<button>` elements with `aria-label`/`aria-pressed`, so
  they're reachable via Tab and triggerable with Enter/Space natively.
- Keys 1–5 also trigger tiles directly (see `hooks/use-keyboard-input.ts`).
- Visible focus rings are defined globally in `app/globals.css`.
- Status changes (Watch carefully / Your turn / Correct / Wrong) are
  announced via an `aria-live="polite"` region in `StatusBanner`.
- `prefers-reduced-motion` is respected both globally (CSS) and in the
  particle/parallax background, which skips motion entirely when set.

## Notes on the sandboxed build check

This project was scaffolded and built in a network-restricted sandbox that
couldn't reach `fonts.googleapis.com`, so the production build was verified
using a temporary system-font stand-in for `app/layout.tsx`, then the real
Google Fonts (Orbitron + Rubik) version was restored for delivery. On a
normal machine with internet access, `next/font/google` will fetch and
self-host these fonts automatically — no extra setup needed.
