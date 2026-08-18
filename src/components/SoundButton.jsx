export default function SoundButton({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className="icon-button sound-button"
      onClick={onToggle}
      aria-label={enabled ? 'Mute sound' : 'Unmute sound'}
      aria-pressed={!enabled}
    >
      {enabled ? (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
          <path d="M16.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
          <path d="M19 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" opacity="0.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
          <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
