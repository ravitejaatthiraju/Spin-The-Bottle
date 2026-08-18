import { useCallback, useEffect, useRef, useState } from 'react';
import Bottle from './components/Bottle.jsx';
import SpinButton from './components/SpinButton.jsx';
import SoundButton from './components/SoundButton.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import { runSpin } from './utils/bottlePhysics.js';
import { playTap, playStop, startWhoosh, updateWhoosh, stopWhoosh } from './utils/sound.js';
import { hapticTap, hapticSettle, hapticStop } from './utils/haptics.js';

const TICK_COUNT = 24; // one every 15 degrees

export default function App() {
  const bottleRef = useRef(null);
  const currentAngleRef = useRef(0);
  const spinControllerRef = useRef(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [statusText, setStatusText] = useState('TAP TO SPIN');
  const [litTick, setLitTick] = useState(null);
  const [hasSpunOnce, setHasSpunOnce] = useState(false);

  const [soundOn, setSoundOn] = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    return () => {
      spinControllerRef.current && spinControllerRef.current.cancel();
      stopWhoosh();
    };
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setHasSpunOnce(true);
    setLitTick(null);
    setStatusText('SPINNING\u2026');
    setPressed(true);
    setTimeout(() => setPressed(false), 160);

    playTap(soundOn);
    if (vibrationOn) hapticTap();
    startWhoosh(soundOn);

    const startAngle = currentAngleRef.current;

    spinControllerRef.current = runSpin({
      onFrame: (angle, _phase, velocityFrac) => {
        const total = startAngle + angle;
        currentAngleRef.current = total;
        if (bottleRef.current) {
          bottleRef.current.style.transform = `rotate(${total}deg)`;
        }
        updateWhoosh(velocityFrac);
      },
      onPhaseChange: (phase) => {
        if (phase === 'settle') {
          stopWhoosh();
          if (vibrationOn) hapticSettle();
        }
      },
      onComplete: (finalAngle) => {
        setIsSpinning(false);
        setStatusText('STOPPED');
        playStop(soundOn);
        if (vibrationOn) hapticStop();
        const tickIndex = Math.round(finalAngle / 15) % TICK_COUNT;
        setLitTick(tickIndex);
      },
    });
  }, [isSpinning, soundOn, vibrationOn]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (!isSpinning) setPressed(true);
    handleSpin();
  };

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = i * (360 / TICK_COUNT);
    const isCardinal = i % 6 === 0;
    return (
      <div
        key={i}
        className={`ring-tick ${isCardinal ? 'is-cardinal' : ''} ${
          litTick === i ? 'is-lit' : ''
        }`}
        style={{ transform: `rotate(${angle}deg)` }}
      />
    );
  });

  return (
    <div className="app-root">
      <div className="table-surface">
        <div className="vignette" />

        <button
          type="button"
          className="icon-button settings-button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.4.6a8 8 0 0 0-1.7-1L15 3h-4l-.3 2.7a8 8 0 0 0-1.7 1l-2.4-.6-2 3.4L6.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.4-.6a8 8 0 0 0 1.7 1L11 21h4l.3-2.7a8 8 0 0 0 1.7-1l2.4.6 2-3.4-2-1.5Z"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <SoundButton enabled={soundOn} onToggle={() => setSoundOn((v) => !v)} />

        <div className="stage">
          <div className="compass-ring" aria-hidden="true">
            {ticks}
          </div>

          <div
            className="tap-zone"
            onPointerDown={handlePointerDown}
            role="button"
            tabIndex={0}
            aria-label="Tap to spin the bottle"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSpin();
              }
            }}
          >
            <Bottle ref={bottleRef} pressed={pressed} spinning={isSpinning} />
          </div>

          <div className={`status-text ${isSpinning ? 'is-spinning' : ''}`}>
            {statusText}
          </div>
          {!isSpinning && (
            <div className="status-sub">
              {hasSpunOnce ? 'Tap to spin again' : ''}
            </div>
          )}
        </div>

        <SpinButton onSpin={handleSpin} disabled={isSpinning} />
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((v) => !v)}
        vibrationOn={vibrationOn}
        onToggleVibration={() => setVibrationOn((v) => !v)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
    </div>
  );
}
