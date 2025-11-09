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

const viewCounter = document.getElementById("viewCounter");
const viewedCountries = new Set();

function updateViewCounter() {
  const total = 8;
  viewCounter.textContent = `${viewedCountries.size}/${total}`;
  if (viewedCountries.size === total) {
    viewCounter.classList.add("complete");
    // запуск повного дощу конфетті при завершенні
    startConfettiRain();
  } else {
    viewCounter.classList.remove("complete");
  }
}

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

    // track unique view
    if (!viewedCountries.has(id)) {
      viewedCountries.add(id);
      updateViewCounter();
    }

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

// Конфетті — canvas поверх усієї сторінки
(function() {
  const colors = ["#f94144","#f3722c","#f9c74f","#90be6d","#43aa8b","#577590","#277da1","#f72585"];
  let canvas, ctx, w, h;
  let particles = [];
  let animating = false;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 30;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnBurst(x, y, count = 20) {
    ensureCanvas();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(2, 9);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.7 - rand(1,4),
        size: rand(6, 14),
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: rand(0, Math.PI * 2),
        drot: rand(-0.2, 0.2),
        life: rand(700, 1400),
        born: performance.now()
      });
    }
    startAnim();
  }

  function spawnRain(total = 200, duration = 1200) {
    ensureCanvas();
    const start = performance.now();
    const interval = 10;
    let spawned = 0;
    const max = total;
    const spawnLoop = setInterval(() => {
      const now = performance.now();
      if (now - start > duration || spawned >= max) {
        clearInterval(spawnLoop);
        return;
      }
      const x = rand(0, window.innerWidth);
      const y = -10;
      const speed = rand(1.5, 4.5);
      particles.push({
        x, y,
        vx: rand(-1.5, 1.5),
        vy: speed,
        size: rand(6, 12),
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: rand(0, Math.PI * 2),
        drot: rand(-0.3, 0.3),
        life: rand(2200, 3600),
        born: performance.now()
      });
      spawned++;
    }, interval);
    startAnim();
  }

  function startConfettiRain() {
    // невеликий попередній вибух + дощ
    const rect = viewCounter.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 36);
    setTimeout(() => spawnRain(300, 1400), 150);
  }

  function startAnim() {
    if (animating) return;
    animating = true;
    requestAnimationFrame(tick);
  }

  function tick(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const toKeep = [];
    for (let p of particles) {
      const age = now - p.born;
      if (age > p.life) continue;
      // physics
      p.vy += 0.06; // gravity
      p.vx *= 0.999;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.drot;
      // fade near end
      const alpha = 1 - age / p.life;
      // draw as rotated rectangle
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      ctx.restore();
      // keep if on screen roughly
      if (p.y < window.innerHeight + 50 && p.x > -50 && p.x < window.innerWidth + 50) {
        toKeep.push(p);
      }
    }
    particles = toKeep;
    if (particles.length > 0) {
      requestAnimationFrame(tick);
    } else {
      animating = false;
      // optional remove canvas after idle
      setTimeout(() => {
        if (!animating && canvas) {
          // keep canvas for reuse to avoid re-creating if user continues
        }
      }, 800);
    }
  }

  // Expose small burst to outer scope (used on each unique view)
  window._confettiSpawnBurst = (x, y, count) => {
    spawnBurst(x, y, count);
  };
  window._confettiStartRain = startConfettiRain;

})();

// Виклики: при додаванні у viewedCountries — вибух у позиції лічильника
// Ми додаємо виклик у місці, де додається унікальний перегляд:
(function patchUpdate() {
  // знаходимо оригінальну updateViewCounter — вона вже змінена вище, тому просто викликатимемо ефект при додаванні перегляду
  const originalAdd = viewedCountries.add;
  viewedCountries.add = function(val) {
    const res = originalAdd.call(this, val);
    // маленький вибух поруч з лічильником
    const rect = viewCounter.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (window._confettiSpawnBurst) window._confettiSpawnBurst(cx, cy, 16);
    return res;
  };
})();

// Зручні виклики з інших частин коду:
function startConfettiRain() {
  if (window._confettiStartRain) window._confettiStartRain();
}
