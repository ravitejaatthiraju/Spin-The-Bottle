import { forwardRef } from 'react';

// The bottle rotates via a directly-mutated CSS transform (see App.jsx),
// not React state, so a 60fps spin never triggers a React re-render.
const Bottle = forwardRef(function Bottle({ pressed, spinning }, ref) {
  return (
    <div className="bottle-layer">
      <div className="bottle-shadow" aria-hidden="true" />
      <div
        ref={ref}
        className={`bottle-rotor ${pressed ? 'is-pressed' : ''} ${
          spinning ? 'is-spinning' : ''
        }`}
      >
        <svg
          viewBox="0 0 200 420"
          className="bottle-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7a3f14" />
              <stop offset="35%" stopColor="#b6641f" />
              <stop offset="55%" stopColor="#c9752a" />
              <stop offset="100%" stopColor="#5a2e0f" />
            </linearGradient>
            <linearGradient id="glassNeck" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6b380f" />
              <stop offset="50%" stopColor="#b06022" />
              <stop offset="100%" stopColor="#4f280c" />
            </linearGradient>
            <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a6b3d" />
              <stop offset="50%" stopColor="#d7b46e" />
              <stop offset="100%" stopColor="#6f5228" />
            </linearGradient>
            <linearGradient id="labelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2e7d0" />
              <stop offset="100%" stopColor="#e2d3ae" />
            </linearGradient>
          </defs>

          {/* body */}
          <path
            d="M60,150
               C60,120 62,105 70,90
               L70,50
               C70,44 74,40 80,40
               L120,40
               C126,40 130,44 130,50
               L130,90
               C138,105 140,120 140,150
               L146,190
               C150,230 150,270 148,320
               C146,370 140,398 130,408
               C122,414 78,414 70,408
               C60,398 54,370 52,320
               C50,270 50,230 54,190
               Z"
            fill="url(#glassBody)"
            stroke="#3c1e08"
            strokeWidth="2"
          />

          {/* neck */}
          <rect x="82" y="18" width="36" height="30" rx="6" fill="url(#glassNeck)" stroke="#3c1e08" strokeWidth="2" />

          {/* cap */}
          <rect x="78" y="2" width="44" height="20" rx="5" fill="url(#capGrad)" stroke="#4a3a1c" strokeWidth="1.5" />
          <rect x="78" y="8" width="44" height="3" fill="#00000022" />

          {/* label */}
          <rect x="62" y="220" width="76" height="86" rx="6" fill="url(#labelGrad)" opacity="0.92" />
          <line x1="74" y1="244" x2="126" y2="244" stroke="#a67c3d" strokeWidth="2" />
          <line x1="74" y1="256" x2="118" y2="256" stroke="#c9a15a" strokeWidth="1.5" opacity="0.7" />
          <line x1="74" y1="266" x2="122" y2="266" stroke="#c9a15a" strokeWidth="1.5" opacity="0.7" />

          {/* tip indicator - the bottle's neck end marks the "pointing" direction */}
          <circle cx="100" cy="10" r="3.2" fill="#f4dca3" opacity="0.9" />

          {/* glass highlight / reflection */}
          <path
            d="M74,60 L74,380 C74,392 78,400 84,404"
            stroke="#f4dca3"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.28"
            fill="none"
          />
          <path
            d="M118,70 L120,180"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.18"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
});

export default Bottle;
