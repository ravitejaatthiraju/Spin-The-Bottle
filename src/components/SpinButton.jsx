export default function SpinButton({ onSpin, disabled }) {
  return (
    <button
      type="button"
      className="spin-button"
      onClick={onSpin}
      disabled={disabled}
      aria-label="Spin the bottle"
    >
      {disabled ? 'SPINNING' : 'SPIN'}
    </button>
  );
}
