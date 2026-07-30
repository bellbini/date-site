const steps = document.querySelectorAll(".step");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const buttonArea = document.getElementById("buttonArea");
const surpriseNextButton = document.getElementById("surpriseNextButton");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const dateNextButton = document.getElementById("dateNextButton");
const dateMessage = document.getElementById("dateMessage");
const foodButtons = document.querySelectorAll(".food-button");
const resultDate = document.getElementById("resultDate");
const resultTime = document.getElementById("resultTime");
const resultFood = document.getElementById("resultFood");
const captureArea = document.getElementById("captureArea");
const shareButton = document.getElementById("shareButton");
const shareMessage = document.getElementById("shareMessage");
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function moveNoButton() {
  const areaRect = buttonArea.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();

  const maxX = Math.max(0, areaRect.width - buttonRect.width);
  const maxY = Math.max(0, areaRect.height - buttonRect.height);

  noButton.style.left = `${Math.random() * maxX}px`;
  noButton.style.top = `${Math.random() * maxY}px`;
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

function downloadImage(blob) {
  const imageUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = "데이트-약속.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(imageUrl);
}

async function captureAndShare() {
  shareButton.disabled = true;
  shareButton.textContent = "이미지 만드는 중... 💕";
  shareMessage.textContent = "";

  try {
    const canvas = await html2canvas(captureArea, {
      scale: 2,
      backgroundColor: "#fffafd",
      useCORS: true
    });

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((createdBlob) => {
        if (createdBlob) {
          resolve(createdBlob);
        } else {
          reject(new Error("이미지 생성에 실패했습니다."));
        }
      }, "image/png");
    });

    const file = new File([blob], "데이트-약속.png", {
      type: "image/png"
    });

    const canShareFile =
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] });

    if (canShareFile) {
      await navigator.share({
        title: "데이트 약속",
        text: "우리 약속이야 💖",
        files: [file]
      });
      shareMessage.textContent = "전송 화면을 열었어! 💌";
    } else {
      downloadImage(blob);
      shareMessage.textContent =
        "이미지를 저장했어. 카톡이나 DM으로 보내면 돼! 💌";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
      shareMessage.textContent =
        "이미지 만들기에 실패했어. 다시 한 번 눌러 줘!";
    }
  } finally {
    shareButton.disabled = false;
    shareButton.textContent = "캡처해서 보내기 📤";
  }
}

/* 오늘보다 이전 날짜를 선택하지 못하도록 설정 */
const today = new Date();
const localToday = new Date(
  today.getTime() - today.getTimezoneOffset() * 60 * 1000
)
  .toISOString()
  .split("T")[0];
dateInput.min = localToday;

yesButton.addEventListener("click", () => {
  showStep(2);
});

surpriseNextButton.addEventListener("click", () => {
  showStep(3);
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
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  if (selectedDate < todayAtMidnight) {
    dateMessage.textContent = "오늘 이후의 날짜를 선택해 줘!";
    return;
  }

  answers.date = dateInput.value;
  answers.time = timeInput.value;
  dateMessage.textContent = "";
  showStep(4);
});

foodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answers.food = button.dataset.food;

    resultDate.textContent = formatDate(answers.date);
    resultTime.textContent = answers.time;
    resultFood.textContent = answers.food;

    showStep(5);
    createHearts();
  });
});

shareButton.addEventListener("click", captureAndShare);

restartButton.addEventListener("click", () => {
  answers.date = "";
  answers.time = "";
  answers.food = "";

  dateInput.value = "";
  timeInput.value = "";
  dateMessage.textContent = "";
  shareMessage.textContent = "";

  noButton.removeAttribute("style");
  showStep(1);
});
