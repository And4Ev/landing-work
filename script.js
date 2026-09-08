/* ==========================================================
   HOJAS CAYENDO
   ========================================================== */

const LEAF_COLORS = ["#FF5A36", "#00C2B8", "#E1431F", "#0E1F2B"];

function leafSVG(color) {
  return `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2C7 6 3 12 3 17c0 4.5 4.2 7 10 7s10-2.5 10-7c0-5-4-11-10-15z" fill="${color}" opacity="0.85"/>
    <path d="M13 2 L13 24" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
  </svg>`;
}

function createLeaves() {
  const layer = document.getElementById("leavesLayer");
  if (!layer) return;

  const count = window.innerWidth < 700 ? 9 : 16;

  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";

    const left = Math.random() * 100;
    const fallDuration = 14 + Math.random() * 12;
    const fallDelay = Math.random() * -fallDuration;
    const swayDuration = 3 + Math.random() * 3;
    const scale = 0.6 + Math.random() * 0.9;
    const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];

    leaf.style.left = `${left}%`;
    leaf.style.animationDuration = `${fallDuration}s`;
    leaf.style.animationDelay = `${fallDelay}s`;
    leaf.style.opacity = 0.55 + Math.random() * 0.35;

    const sway = document.createElement("span");
    sway.className = "leaf__sway";
    sway.style.animationDuration = `${swayDuration}s`;
    sway.style.animationDelay = `${fallDelay}s`;
    sway.style.transform = `scale(${scale})`;
    sway.innerHTML = leafSVG(color);

    leaf.appendChild(sway);
    layer.appendChild(leaf);
  }
}

createLeaves();

/* ==========================================================
   MENU MÓVIL
   ========================================================== */

const burger = document.getElementById("navBurger");
if (burger) {
  burger.addEventListener("click", () => {
    const links = document.querySelector(".nav__links");
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    if (links) {
      links.style.display = open ? "none" : "flex";
      links.style.position = "absolute";
      links.style.top = "72px";
      links.style.left = "0";
      links.style.right = "0";
      links.style.flexDirection = "column";
      links.style.gap = "0";
      links.style.background = "var(--cream)";
      links.style.padding = "0.5rem 1.5rem 1rem";
      Array.from(links.children).forEach((a) => (a.style.padding = "0.7rem 0"));
    }
  });
}

/* ==========================================================
   FORMULARIO
   ========================================================== */

const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = document.getElementById("formNote");
    note.textContent = "¡Gracias! He recibido tu consulta y te contactaré muy pronto.";
    form.reset();
  });
}

/* ==========================================================
   SLIDER DE PORTFOLIO (adaptado de voyage-slider)
   ========================================================== */

const wrap = (n, max) => (n + max) % max;
const lerp = (a, b, t) => a + (b - a) * t;

class Raf {
  constructor() {
    this.rafId = 0;
    this.raf = this.raf.bind(this);
    this.callbacks = [];
    this.start();
  }
  start() { this.raf(); }
  stop() { cancelAnimationFrame(this.rafId); }
  raf() {
    this.callbacks.forEach(({ callback, id }) => callback({ id }));
    this.rafId = requestAnimationFrame(this.raf);
  }
  add(callback, id) { this.callbacks.push({ callback, id: id || String(Math.random()) }); }
  remove(id) { this.callbacks = this.callbacks.filter((c) => c.id !== id); }
}

class Vec2 {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  set(x, y) { this.x = x; this.y = y; }
  lerp(v, t) { this.x = lerp(this.x, v.x, t); this.y = lerp(this.y, v.y, t); }
}
const vec2 = (x = 0, y = 0) => new Vec2(x, y);

const raf = new Raf();

function tilt(node, options) {
  let { trigger, target } = resolveOptions(node, options);
  let lerpAmount = 0.06;
  const rotDeg = { current: vec2(), target: vec2() };
  const bgPos = { current: vec2(), target: vec2() };
  let rafId;

  function ticker({ id }) {
    rafId = id;
    rotDeg.current.lerp(rotDeg.target, lerpAmount);
    bgPos.current.lerp(bgPos.target, lerpAmount);
    for (const el of target) {
      el.style.setProperty("--rotX", rotDeg.current.y.toFixed(2) + "deg");
      el.style.setProperty("--rotY", rotDeg.current.x.toFixed(2) + "deg");
      el.style.setProperty("--bgPosX", bgPos.current.x.toFixed(2) + "%");
      el.style.setProperty("--bgPosY", bgPos.current.y.toFixed(2) + "%");
    }
  }

  const onMouseMove = ({ offsetX, offsetY }) => {
    lerpAmount = 0.1;
    for (const el of target) {
      const ox = (offsetX - el.clientWidth * 0.5) / (Math.PI * 3);
      const oy = -(offsetY - el.clientHeight * 0.5) / (Math.PI * 4);
      rotDeg.target.set(ox, oy);
      bgPos.target.set(-ox * 0.3, oy * 0.3);
    }
  };
  const onMouseLeave = () => {
    lerpAmount = 0.06;
    rotDeg.target.set(0, 0);
    bgPos.target.set(0, 0);
  };

  trigger.addEventListener("mousemove", onMouseMove);
  trigger.addEventListener("mouseleave", onMouseLeave);
  raf.add(ticker);

  return {
    destroy() {
      trigger.removeEventListener("mousemove", onMouseMove);
      trigger.removeEventListener("mouseleave", onMouseLeave);
      raf.remove(rafId);
    }
  };
}

function resolveOptions(node, options) {
  return {
    trigger: options?.trigger ?? node,
    target: options?.target ? (Array.isArray(options.target) ? options.target : [options.target]) : [node]
  };
}

function initSlider() {
  const sliderEl = document.querySelector(".portfolio .slider");
  if (!sliderEl) return;

  const loader = sliderEl.querySelector(".loader");
  const slides = [...sliderEl.querySelectorAll(".slide")];
  const slidesInfo = [...sliderEl.querySelectorAll(".slide-info")];
  const buttons = {
    prev: sliderEl.querySelector(".slider--btn__prev"),
    next: sliderEl.querySelector(".slider--btn__next")
  };

  if (loader) {
    loader.style.opacity = 0;
    loader.style.pointerEvents = "none";
  }

  slides.forEach((slide, i) => {
    const slideInner = slide.querySelector(".slide__inner");
    const slideInfoInner = slidesInfo[i]?.querySelector(".slide-info__inner");
    tilt(slide, { target: [slideInner, slideInfoInner].filter(Boolean) });
  });

  buttons.prev?.addEventListener("click", change(sliderEl, -1));
  buttons.next?.addEventListener("click", change(sliderEl, 1));
}

function change(sliderEl, direction) {
  return () => {
    let current = {
      slide: sliderEl.querySelector(".slide[data-current]"),
      slideInfo: sliderEl.querySelector(".slide-info[data-current]"),
      slideBg: sliderEl.querySelector(".slide__bg[data-current]")
    };
    let previous = {
      slide: sliderEl.querySelector(".slide[data-previous]"),
      slideInfo: sliderEl.querySelector(".slide-info[data-previous]"),
      slideBg: sliderEl.querySelector(".slide__bg[data-previous]")
    };
    let next = {
      slide: sliderEl.querySelector(".slide[data-next]"),
      slideInfo: sliderEl.querySelector(".slide-info[data-next]"),
      slideBg: sliderEl.querySelector(".slide__bg[data-next]")
    };

    Object.values(current).forEach((el) => el.removeAttribute("data-current"));
    Object.values(previous).forEach((el) => el.removeAttribute("data-previous"));
    Object.values(next).forEach((el) => el.removeAttribute("data-next"));

    if (direction === 1) {
      const temp = current;
      current = next; next = previous; previous = temp;
      current.slide.style.zIndex = "20";
      previous.slide.style.zIndex = "30";
      next.slide.style.zIndex = "10";
    } else {
      const temp = current;
      current = previous; previous = next; next = temp;
      current.slide.style.zIndex = "20";
      previous.slide.style.zIndex = "10";
      next.slide.style.zIndex = "30";
    }

    Object.values(current).forEach((el) => el.setAttribute("data-current", ""));
    Object.values(previous).forEach((el) => el.setAttribute("data-previous", ""));
    Object.values(next).forEach((el) => el.setAttribute("data-next", ""));
  };
}

// Comprobación de carga de imágenes sin dependencias externas
// (evita el import de esm.sh, que los navegadores bloquean al abrir
// el HTML directamente con doble clic, vía protocolo file://)
function trackImageLoad(img, onDone) {
  if (img.complete && img.naturalWidth !== 0) {
    onDone();
    return;
  }
  const finish = () => {
    img.removeEventListener("load", finish);
    img.removeEventListener("error", finish);
    onDone();
  };
  img.addEventListener("load", finish);
  img.addEventListener("error", finish);
}

function setupSliderLoader() {
  const loaderText = document.querySelector(".loader__text");
  const sliderEl = document.querySelector(".portfolio .slider");
  if (!sliderEl) return;

  const images = [...sliderEl.querySelectorAll("img")];
  const totalImages = images.length;

  if (totalImages === 0) { initSlider(); return; }

  let loadedImages = 0;
  const progress = { current: 0, target: 0 };

  images.forEach((image) => {
    trackImageLoad(image, () => {
      loadedImages++;
      progress.target = loadedImages / totalImages;
    });
  });

  raf.add(({ id }) => {
    progress.current = lerp(progress.current, progress.target, 0.06);
    const progressPercent = Math.round(progress.current * 100);
    if (loaderText) loaderText.textContent = `${progressPercent}%`;

    if (progressPercent >= 100) {
      initSlider();
      raf.remove(id);
    }
  });

  // red de seguridad por si alguna imagen tarda demasiado en resolver
  setTimeout(() => {
    if (progress.current < 1) initSlider();
  }, 4000);
}

setupSliderLoader();
