// sound.js
// Small, dependency-free sound engine built on the Web Audio API. Every
// effect is synthesized on the fly, so there are no binary assets to ship
// or load. Audio context is created lazily on first user interaction, in
// line with autoplay restrictions and the "no sound before interaction"
// requirement.

let ctx = null;
let whooshNodes = null; // { noise, filter, gain } kept alive across a spin

function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

function makeNoiseBuffer(audioCtx, seconds = 2) {
  const buffer = audioCtx.createBuffer(
    1,
    audioCtx.sampleRate * seconds,
    audioCtx.sampleRate
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function playTap(enabled) {
  if (!enabled) return;
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(160, audioCtx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}

export function startWhoosh(enabled) {
  if (!enabled) return;
  const audioCtx = getCtx();
  stopWhoosh();

  const noise = audioCtx.createBufferSource();
  noise.buffer = makeNoiseBuffer(audioCtx, 6);
  noise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 500;
  filter.Q.value = 0.7;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.0001;

  noise.connect(filter).connect(gain).connect(audioCtx.destination);
  noise.start();

  whooshNodes = { noise, filter, gain };
}

// velocityFrac: 0..1, how fast the bottle is currently spinning.
export function updateWhoosh(velocityFrac) {
  if (!whooshNodes || !ctx) return;
  const v = Math.max(0, Math.min(1, velocityFrac));
  const targetGain = 0.001 + v * 0.08;
  const targetFreq = 300 + v * 900;
  const t = ctx.currentTime;
  whooshNodes.gain.gain.setTargetAtTime(targetGain, t, 0.05);
  whooshNodes.filter.frequency.setTargetAtTime(targetFreq, t, 0.08);
}

export function stopWhoosh() {
  if (whooshNodes && ctx) {
    const t = ctx.currentTime;
    whooshNodes.gain.gain.setTargetAtTime(0.0001, t, 0.12);
    const nodes = whooshNodes;
    setTimeout(() => {
      try {
        nodes.noise.stop();
      } catch (e) {
        // already stopped
      }
    }, 400);
  }
  whooshNodes = null;
}

export function playStop(enabled) {
  if (!enabled) return;
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.28, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.32);
}
