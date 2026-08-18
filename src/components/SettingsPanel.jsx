export default function SettingsPanel({
  open,
  onClose,
  soundOn,
  onToggleSound,
  vibrationOn,
  onToggleVibration,
  theme,
  onToggleTheme,
}) {
  if (!open) return null;

  return (
    <div className="settings-backdrop" onClick={onClose}>
      <div
        className="settings-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Settings"
      >
        <div className="settings-title">Settings</div>

        <SettingsRow label="Sound" icon="🔊">
          <Toggle checked={soundOn} onChange={onToggleSound} />
        </SettingsRow>

        <SettingsRow label="Vibration" icon="📳">
          <Toggle checked={vibrationOn} onChange={onToggleVibration} />
        </SettingsRow>

        <SettingsRow label="Theme" icon="🌙">
          <button className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </SettingsRow>

        <button className="settings-close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

function SettingsRow({ label, icon, children }) {
  return (
    <div className="settings-row">
      <span className="settings-row-label">
        <span className="settings-row-icon" aria-hidden="true">
          {icon}
        </span>
        {label}
      </span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle ${checked ? 'is-on' : ''}`}
      onClick={onChange}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
