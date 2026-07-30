const steps = document.querySelectorAll(".step");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const buttonArea = document.getElementById("buttonArea");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const dateNextButton = document.getElementById("dateNextButton");
const dateMessage = document.getElementById("dateMessage");
const foodButtons = document.querySelectorAll(".food-button");
const resultDate = document.getElementById("resultDate");
const resultTime = document.getElementById("resultTime");
const resultFood = document.getElementById("resultFood");
const restartButton = document.getElementById("restartButton");
const heartContainer = document.getElementById("heartContainer");

const answers = {
  date: "",
  time: "",
  food: ""
};

function showStep(stepNumber) {
  steps.forEach((step) => step.classList.remove("active"));
  document.getElementById(`step${stepNumber}`).classList.add("active");
}

function moveNoButton() {
  const areaRect = buttonArea.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();

  const maxX = Math.max(0, areaRect.width - buttonRect.width);
  const maxY = Math.max(0, areaRect.height - buttonRect.height);

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;
  noButton.style.transform = "none";
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function createHearts() {
  const hearts = ["💖", "💕", "💗", "💘", "🌸"];

  for (let index = 0; index < 24; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${16 + Math.random() * 22}px`;
    heart.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    heart.style.animationDelay = `${Math.random() * 1.2}s`;

    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }
}

yesButton.addEventListener("click", () => {
  showStep(2);
});

noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

dateNextButton.addEventListener("click", () => {
  if (!dateInput.value || !timeInput.value) {
    dateMessage.textContent = "날짜와 시간을 모두 선택해 줘!";
    return;
  }

  const selectedDate = new Date(`${dateInput.value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    dateMessage.textContent = "오늘 이후의 날짜를 선택해 줘!";
    return;
  }

  answers.date = dateInput.value;
  answers.time = timeInput.value;
  dateMessage.textContent = "";
  showStep(3);
});

foodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answers.food = button.dataset.food;

    resultDate.textContent = formatDate(answers.date);
    resultTime.textContent = answers.time;
    resultFood.textContent = answers.food;

    showStep(4);
    createHearts();
  });
});

restartButton.addEventListener("click", () => {
  answers.date = "";
  answers.time = "";
  answers.food = "";

  dateInput.value = "";
  timeInput.value = "";
  dateMessage.textContent = "";

  noButton.removeAttribute("style");
  showStep(1);
});
