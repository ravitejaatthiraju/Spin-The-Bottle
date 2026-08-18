// haptics.js
// Thin, safe wrapper around the Vibration API. Silently no-ops on browsers
// or platforms (iOS Safari, desktop) that don't support it.

function supported() {
  return typeof navigator !== 'undefined' && !!navigator.vibrate;
}

export function vibrate(pattern) {
  if (!supported()) return;
  try {
    navigator.vibrate(pattern);
  } catch (e) {
    // ignore - never let haptics break the app
  }
}

export const hapticTap = () => vibrate(15);
export const hapticSettle = () => vibrate(10);
export const hapticStop = () => vibrate([0, 25, 40, 15]);
