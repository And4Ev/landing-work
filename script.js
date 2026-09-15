/* ==========================================================
   HOJAS CAYENDO
   ========================================================== */

const LEAF_COLORS = ["#FF5A36", "#00C2B8", "#E1431F", "#0E1F2B"];
/*
function leafSVG(color) {
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${color}" stroke-width="1.4" stroke-linecap="round" opacity="0.9">
      <line x1="10" y1="1" x2="10" y2="19" />
      <line x1="1" y1="10" x2="19" y2="10" />
      <line x1="3.5" y1="3.5" x2="16.5" y2="16.5" />
      <line x1="16.5" y1="3.5" x2="3.5" y2="16.5" />
      <line x1="10" y1="1" x2="7.5" y2="3.5" />
      <line x1="10" y1="1" x2="12.5" y2="3.5" />
      <line x1="10" y1="19" x2="7.5" y2="16.5" />
      <line x1="10" y1="19" x2="12.5" y2="16.5" />
      <line x1="1" y1="10" x2="3.5" y2="7.5" />
      <line x1="1" y1="10" x2="3.5" y2="12.5" />
      <line x1="19" y1="10" x2="16.5" y2="7.5" />
      <line x1="19" y1="10" x2="16.5" y2="12.5" />
    </g>
  </svg>`;
}
*/
function leafSVG(color) {
  return `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2C7 6 3 12 3 17c0 4.5 4.2 7 10 7s10-2.5 10-7c0-5-4-11-10-15z" fill="${color}" opacity="0.85"/>
    <path d="M13 2 L13 24" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
  </svg>`;
}

function createLeaves() {
  const layer = document.getElementById("leavesLayer");
  if (!layer) return;

  // Altura real del contenedor (el hero), no de toda la ventana
  const containerHeight = layer.offsetHeight;
  const fallStart = -60;                    // px, empieza justo encima del hero
  const fallEnd = containerHeight + 60;      // px, termina justo debajo del hero

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
    leaf.style.setProperty("--fall-start", `${fallStart}px`);
    leaf.style.setProperty("--fall-end", `${fallEnd}px`);

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
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const note = document.getElementById("formNote");

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    note.textContent = "";

    try {
      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        note.textContent = "¡Gracias! He recibido tu consulta y te contactaré muy pronto.";
        form.reset();
      } else {
        note.textContent = "No se pudo enviar. Inténtalo de nuevo o escríbeme directamente por email.";
      }
    } catch (error) {
      note.textContent = "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

/* ==========================================================
   SLIDER DE PORTFOLIO (adaptado de voyage-slider)
   ========================================================== */

   function initPortfolioPanels() {
    const cards = document.querySelectorAll(".portfolio-panels .card");
    if (!cards.length) return;
  
    const setActive = (card) => {
      cards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    };
  
    cards.forEach((card) => {
      card.addEventListener("click", () => setActive(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActive(card);
        }
      });
    });
  }
  
  initPortfolioPanels();
 
