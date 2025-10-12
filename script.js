const countriesData = {
  ussr: {
    name: "СРСР",
    desc: "Союз Радянських Соціалістичних Республік зазнав одних із найважчих втрат під час Другої світової війни.",
    military: "8 668 000+",
    civil: "16 000 000+"
  },
  germany: {
    name: "Німеччина",
    desc: "Третій Рейх — головна агресорська держава, яка розв'язала війну, також зазнала величезних втрат.",
    military: "5 533 000+",
    civil: "1 440 000+"
  },
  poland: {
    name: "Польща",
    desc: "Польща стала першою жертвою вторгнення, і понесла значні людські втрати серед цивільного населення.",
    military: "425 000+",
    civil: "5 600 000+"
  },
  france: {
    name: "Франція",
    desc: "Франція зазнала втрат під час німецької окупації та бойових дій Спротиву.",
    military: "253 000+",
    civil: "420 000+"
  },
  uk: {
    name:"Британія", 
    desc:"Велика Британія зазнала втрат у повітряних та морських боях, а також під час бомбардувань.", 
    military:"383 000+", 
    civil:"67 000+",
  },
  usa: {
    name:"США", 
    desc:"США втратили військовий склад та цивільних переважно внаслідок бойових дій у Тихоокеанському театрі.", 
    military:"407 000+", 
    civil:"6 000+" 
  },
  japan: {
    name:"Японія", 
    desc:"Японія понесла великі втрати серед цивільного населення та військових під час війни на Тихому океані.", 
    military:"2 120 000+", 
    civil:"580 000+" 
  },
  italy: { 
    name:"Італія", 
    desc:"Італія зазнала втрат під час воєнних кампаній та повстань після змін режиму.", 
    military:"301 000+", 
    civil:"153 000+" 
  }
};

const panel = document.getElementById("infoPanel");
const overlay = document.getElementById("overlay");
const nameEl = document.getElementById("countryName");
const descEl = document.getElementById("countryDesc");
const milEl = document.getElementById("militaryLosses");
const civEl = document.getElementById("civilLosses");
const themeToggle = document.querySelector(".theme-toggle");

document.querySelectorAll(".country-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const c = countriesData[btn.dataset.country];
    if (!c) return;
    nameEl.textContent = c.name;
    descEl.textContent = c.desc;
    milEl.textContent = c.military;
    civEl.textContent = c.civil;
    panel.classList.add("active");
    overlay.classList.add("active");
  });
});

overlay.addEventListener("click", () => {
  panel.classList.remove("active");
  overlay.classList.remove("active");
});

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", current === "dark" ? "light" : "dark");
  themeToggle.textContent = current === "dark" ? "🌙" : "☀️";
});