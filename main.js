let countdown;
let remainingTime = 0;
let totalTime = 0;
let isPaused = false;

const input = document.getElementById("secondsInput");
const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const progressBar = document.getElementById("progressBar");
const alarmSound = document.getElementById("alarmSound");
const circle = document.getElementById("circleProgress");
const svgText = document.getElementById("svgText");
const circleLength = 2 * Math.PI * 60;

// Dark mode
const toggle = document.getElementById("darkModeSwitch");
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", toggle.checked);
});
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  toggle.checked = true;
  document.body.classList.add("dark-mode");
}

function updateDisplay(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  display.textContent = `${mins}:${secs}`;
  svgText.textContent = `${mins}:${secs}`;
}

function updateProgress() {
  const percent = totalTime === 0 ? 0 : ((totalTime - remainingTime) / totalTime) * 100;
  progressBar.style.width = `${percent}%`;

  const offset = circleLength * (1 - percent / 100);
  circle.style.strokeDashoffset = offset;

  if (percent >= 80) circle.setAttribute("stroke", "#dc3545");
  else if (percent >= 50) circle.setAttribute("stroke", "#ffc107");
  else circle.setAttribute("stroke", "#0d6efd");
}

function startCountdown() {
  if (countdown) clearInterval(countdown);

  if (!isPaused) {
    const userSeconds = parseInt(input.value, 10);
    if (isNaN(userSeconds) || userSeconds <= 0) {
      alert("Inserisci un numero di secondi valido.");
      return;
    }
    remainingTime = userSeconds;
    totalTime = userSeconds;
    circle.style.strokeDasharray = circleLength;
    localStorage.setItem("lastCountdown", userSeconds);
  }

  countdown = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(countdown);
      updateDisplay(0);
      updateProgress();
      alarmSound.play();
      const modal = new bootstrap.Modal(document.getElementById("endModal"));
      modal.show();
      return;
    }
    remainingTime--;
    updateDisplay(remainingTime);
    updateProgress();
  }, 1000);

  isPaused = false;
}

function pauseCountdown() {
  clearInterval(countdown);
  isPaused = true;
}

function resetCountdown() {
  clearInterval(countdown);
  remainingTime = 0;
  totalTime = 0;
  input.value = "";
  updateDisplay(0);
  updateProgress();
  circle.style.strokeDashoffset = circleLength;
  isPaused = false;
}

startBtn.addEventListener("click", startCountdown);
pauseBtn.addEventListener("click", pauseCountdown);
resetBtn.addEventListener("click", resetCountdown);

// Carica ultimo valore
const last = localStorage.getItem("lastCountdown");
if (last) {
  input.value = last;
  remainingTime = parseInt(last, 10);
  totalTime = remainingTime;
  updateDisplay(remainingTime);
  updateProgress();
} else {
  updateDisplay(0);
}
