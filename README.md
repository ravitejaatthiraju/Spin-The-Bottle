# Spin the Bottle

A mobile-first virtual bottle spinner. Tap the bottle, it spins with real
momentum and friction, and stops on a genuinely random direction. No Truth,
no Dare, no players — just the spin.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (same Wi-Fi network) or in a mobile
device emulator. For an installable build:

```bash
npm run build
npm run preview
```

## How the spin works

`src/utils/bottlePhysics.js` integrates an angular velocity curve frame by
frame with `requestAnimationFrame`:

1. **Accelerate** — velocity ramps up as if released by a hand.
2. **Fast rotation** — holds near-peak angular velocity.
3. **Decelerate** — cubic ease-out, friction taking over.
4. **Settle** — a few small damped oscillations before it truly stops.

Rotation count (5–12 turns) and final resting angle are randomized on every
call, so the target degrees — and therefore the peak velocity needed to
reach them in the randomized duration — differ each spin. The bottle's
rotation is written directly to the DOM node's `transform` via a ref, so a
60fps spin never triggers a React re-render.

## Design

Speakeasy-bar palette: dark walnut table, brass ring, amber glass bottle.
The brass compass ring around the bottle is the signature element — its tick
marks give the stopping direction real visual meaning, and the nearest tick
glows briefly when the bottle settles.

Sound effects (tap, spin whoosh, stop thud) are synthesized live with the
Web Audio API — no audio files to ship. Haptics use the Vibration API where
supported and no-op silently elsewhere (e.g. iOS Safari).
