// bottlePhysics.js
// A velocity-integrated spin model: acceleration -> constant fast spin ->
// eased deceleration -> a few tiny settling wobbles -> stop.
// Rotation is integrated frame-by-frame (rAF) rather than played back from a
// single CSS transition, so every spin's motion is genuinely computed, not
// just parameterized.

const randRange = (min, max) => min + Math.random() * (max - min);

// Fractions of total spin duration spent in each phase.
const ACCEL_FRAC = 0.05;
const FAST_FRAC = 0.4;
const DECEL_FRAC = 0.4;
const SETTLE_FRAC = 0.15;

// Instantaneous angular velocity as a fraction of vMax, for progress p in [0, 1)
// across the acceleration/fast/deceleration span (settle is handled separately).
function velocityShape(p) {
  const accelEnd = ACCEL_FRAC;
  const fastEnd = ACCEL_FRAC + FAST_FRAC;
  const decelEnd = ACCEL_FRAC + FAST_FRAC + DECEL_FRAC;

  if (p < accelEnd) {
    const u = p / accelEnd;
    return u * u; // ease-in: torque builds as the hand releases the bottle
  }
  if (p < fastEnd) {
    return 1; // full momentum, friction not yet dominant
  }
  if (p < decelEnd) {
    const u = (p - fastEnd) / DECEL_FRAC;
    const eased = 1 - u; // linear base
    return eased * eased * eased; // cubic ease-out: friction dominates
  }
  return 0;
}

// Precompute the vMax multiplier so the integral of velocityShape() over the
// accel+fast+decel span produces (approximately) the target rotation.
function solveVMax(targetDegrees, totalSeconds) {
  const accelT = totalSeconds * ACCEL_FRAC;
  const fastT = totalSeconds * FAST_FRAC;
  const decelT = totalSeconds * DECEL_FRAC;
  // area under u^2 (0..1) = 1/3, under constant 1 = 1, under (1-u)^3 = 1/4
  const areaSeconds = accelT / 3 + fastT + decelT / 4;
  return targetDegrees / areaSeconds;
}

/**
 * Runs one full spin. Returns a controller with a cancel() method.
 *
 * @param {Object} opts
 * @param {(angleDeg: number, phase: string, velocityFrac: number) => void} opts.onFrame
 * @param {(phase: string) => void} [opts.onPhaseChange]
 * @param {(finalAngleDeg: number) => void} opts.onComplete
 */
export function runSpin({ onFrame, onPhaseChange, onComplete }) {
  const rotations = Math.round(randRange(5, 12)); // full turns, spec section 7
  const finalAngle = randRange(0, 360);
  const targetDegrees = rotations * 360 + finalAngle;
  const totalMs = randRange(3500, 6000);
  const totalSeconds = totalMs / 1000;

  const vMax = solveVMax(targetDegrees, totalSeconds);

  const accelEnd = ACCEL_FRAC;
  const fastEnd = ACCEL_FRAC + FAST_FRAC;
  const decelEnd = ACCEL_FRAC + FAST_FRAC + DECEL_FRAC;

  let cancelled = false;
  let rafId = null;
  let accumulatedAngle = 0;
  let lastPhase = null;
  let start = null;
  let lastFrameTime = null;

  // Settle phase: a few small decaying oscillations around the resting angle,
  // like a real bottle rocking to a stop rather than snapping still.
  const settleDurationMs = totalMs * SETTLE_FRAC;
  const settleWobbles = randRange(2, 4);
  const settleAmplitudeStart = randRange(4, 9); // degrees

  const setPhase = (phase) => {
    if (phase !== lastPhase) {
      lastPhase = phase;
      onPhaseChange && onPhaseChange(phase);
    }
  };

  function frame(now) {
    if (cancelled) return;
    if (start === null) {
      start = now;
      lastFrameTime = now;
    }
    const elapsedMs = now - start;
    const dt = Math.max(0, (now - lastFrameTime) / 1000); // seconds
    lastFrameTime = now;

    if (elapsedMs < totalMs) {
      const p = elapsedMs / totalMs;
      const velocityFrac = velocityShape(p);
      const instVelocity = vMax * velocityFrac; // deg/s
      accumulatedAngle += instVelocity * dt;

      let phase = 'accelerate';
      if (p >= decelEnd) phase = 'decelerate';
      else if (p >= fastEnd) phase = 'decelerate';
      else if (p >= accelEnd) phase = 'fast';
      setPhase(phase);

      onFrame(accumulatedAngle, phase, velocityFrac);
      rafId = requestAnimationFrame(frame);
      return;
    }

    // Settle phase: damped sine wobble layered on top of the resting angle.
    const settleElapsed = elapsedMs - totalMs;
    if (settleElapsed < settleDurationMs) {
      setPhase('settle');
      const su = settleElapsed / settleDurationMs;
      const damping = Math.pow(1 - su, 2);
      const wobble =
        Math.sin(su * settleWobbles * Math.PI * 2) *
        settleAmplitudeStart *
        damping;
      onFrame(accumulatedAngle + wobble, 'settle', damping);
      rafId = requestAnimationFrame(frame);
      return;
    }

    // Fully stopped.
    setPhase('stopped');
    onFrame(accumulatedAngle, 'stopped', 0);
    const normalizedFinal = ((accumulatedAngle % 360) + 360) % 360;
    onComplete(normalizedFinal);
  }

  rafId = requestAnimationFrame(frame);

  return {
    cancel() {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
