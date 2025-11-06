const countriesData = {
  ussr: { name: "СРСР", desc: "Союз Радянських Соціалістичних Республік зазнав одних із найважчих втрат під час Другої світової війни.",
    military: "8 668 000+", civil: "17 000 000+", anthem: "audio/ussr.mp3" },
  germany: { name: "Німеччина", desc: "Третій Рейх — головна агресорська держава, яка розв'язала війну, також зазнала величезних втрат.",
    military: "5 533 000+", civil: "2 000 000+", anthem: "audio/germany.mp3" },
  poland: { name: "Польща", desc: "Польща стала першою жертвою вторгнення, і понесла значні людські втрати серед цивільного населення.",
    military: "240 000+", civil: "5 700 000+", anthem: "audio/poland.mp3" },
  france: { name: "Франція", desc: "Франція зазнала втрат під час німецької окупації та бойових дій Спротиву.",
    military: "217 000+", civil: "350 000+", anthem: "audio/france.mp3" },
  uk: { name: "Британія", desc: "Велика Британія понесла значні втрати через бомбардування та військові дії.",
    military: "383 000+", civil: "67 000+", anthem: "audio/uk.mp3" },
  usa: { name: "США", desc: "Сполучені Штати зазнали втрат у війні на всіх фронтах, особливо в Європі та Тихоокеанському регіоні.",
    military: "416 000+", civil: "6 000+", anthem: "audio/usa.mp3" },
  japan: { name: "Японія", desc: "Японія понесла величезні втрати внаслідок війни на Тихому океані та атомних бомбардувань.",
    military: "2 120 000+", civil: "580 000+", anthem: "audio/japan.mp3" },
  italy: { name: "Італія", desc: "Італія зазнала великих втрат через внутрішні бої та вторгнення союзників.",
    military: "301 000+", civil: "145 000+", anthem: "audio/italy.mp3" }
};

const panel = document.getElementById("infoPanel");
const overlay = document.getElementById("overlay");
const countryButtons = document.querySelectorAll(".country-btn");
const themeToggle = document.querySelector(".theme-toggle");
const muteBtn = document.querySelector(".mute-toggle");

let currentAudio = null;
let soundEnabled = true;
let isButtonLocked = false;

// Функція плавного затухання
function fadeOutAudio(audio, duration = 2000) {
  if (!audio) return;
  const fadeInterval = 50;
  const fadeStep = audio.volume / (duration / fadeInterval);
  const fade = setInterval(() => {
    if (audio.volume > fadeStep) {
      audio.volume -= fadeStep;
    } else {
      clearInterval(fade);
      audio.pause();
      audio.currentTime = 0;
    }
  }, fadeInterval);
}

// Відкрити інформацію
countryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (isButtonLocked) return; // Prevent spam clicking
    isButtonLocked = true;
    
    const id = btn.dataset.country;
    const data = countriesData[id];
    if (!data) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Update panel content
    document.getElementById("countryName").textContent = data.name;
    document.getElementById("countryDesc").textContent = data.desc;
    document.getElementById("militaryLosses").textContent = data.military;
    document.getElementById("civilLosses").textContent = data.civil;

    panel.classList.add("active");
    overlay.classList.add("active");

    if (soundEnabled && data.anthem) {
      currentAudio = new Audio(data.anthem);
      currentAudio.volume = 1;
      currentAudio.play();
    }

    // Unlock button after animation completes
    setTimeout(() => {
      isButtonLocked = false;
    }, 500);
  });
});

// Закрити вікно
overlay.addEventListener("click", () => {
  panel.classList.remove("active");
  overlay.classList.remove("active");
  if (currentAudio) fadeOutAudio(currentAudio, 800);
});

// Перемикач теми
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  }
});

// Перемикач звуку
muteBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  muteBtn.textContent = soundEnabled ? "🔊" : "🔇";
  if (!soundEnabled && currentAudio) fadeOutAudio(currentAudio, 800);
});
