const bottle = document.getElementById("bottle");
const spinButton = document.getElementById("spinButton");
const statusText = document.getElementById("status");
const gameArea = document.getElementById("gameArea");

let currentAngle = 0;
let spinning = false;

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function spinBottle() {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = true;
  statusText.textContent = "Spinning...";

  /*
   * Reset the landing-spark effect so it can replay
   * on this spin too.
   */
  gameArea.classList.remove("is-landed");
  void gameArea.offsetWidth; // force reflow so the animation can restart

  /*
   * Random number of complete rotations.
   * Minimum: 5 rotations
   * Maximum: 9 rotations
   */
  const rotations = Math.floor(randomNumber(5, 10));

  /*
   * Random final direction.
   * This makes the bottle stop at a different position
   * every time.
   */
  const randomAngle = Math.floor(Math.random() * 360);
  const totalRotation =
    rotations * 360 + randomAngle;
  currentAngle += totalRotation;

  /*
   * Random duration makes each spin feel slightly different.
   */
  const duration = randomNumber(3.5, 5.5);
  bottle.style.transition =
    `transform ${duration}s cubic-bezier(0.12, 0.65, 0.18, 1)`;
  bottle.style.transform =
    `rotate(${currentAngle}deg)`;

  /*
   * Small vibration on supported mobile devices.
   */
  if ("vibrate" in navigator) {
    navigator.vibrate(25);
  }

  /*
   * Wait until the animation finishes.
   */
  setTimeout(() => {
    spinning = false;
    spinButton.disabled = false;
    statusText.textContent =
      "The bottle has chosen!";
    gameArea.classList.add("is-landed");

    if ("vibrate" in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
  }, duration * 1000);
}

spinButton.addEventListener("click", spinBottle);

/*
 * Allow tapping the bottle itself to spin.
 */
bottle.addEventListener("pointerdown", () => {
  spinBottle();
});
