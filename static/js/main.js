"use strict";

/* One source of truth for every celebration card and its detail dialog. */
const EVENT_DETAILS = {
  engagement: { title: "Engagement", host: "CELEBRATING TOGETHER", cardDate: "29 NOV 2026", date: "29 November 2026", time: "9:00 AM", venue: "Veehaaraa Events and Retreats", address: "Veehaaraa Events and Retreats", mapUrl: "https://www.google.com/maps/place/Veehaaraa+Events+and+Retreats/@16.5594976,81.4991704,17z/data=!3m1!4b1!4m6!3m5!1s0x3a36330057d34909:0x1eb6f5b36a604ed1!8m2!3d16.5594925!4d81.5017453!16s%2Fg%2F11ms8d0s7d?entry=ttu&g_ep=EgoyMDI2MTEwOS4wIKXMDSoASAFQAw%3D%3D" },
  sangeet: { title: "Sangeet", host: "CELEBRATING TOGETHER", cardDate: "29 NOV 2026", date: "29 November 2026", time: "7:00 PM", venue: "Veehaaraa Events and Retreats", address: "Veehaaraa Events and Retreats", mapUrl: "https://www.google.com/maps/place/Veehaaraa+Events+and+Retreats/@16.5594976,81.4991704,17z/data=!3m1!4b1!4m6!3m5!1s0x3a36330057d34909:0x1eb6f5b36a604ed1!8m2!3d16.5594925!4d81.5017453!16s%2Fg%2F11ms8d0s7d?entry=ttu&g_ep=EgoyMDI2MTEwOS4wIKXMDSoASAFQAw%3D%3D" },
  "rahul-haldi": { title: "Rahul's Haldi", host: "RAHUL'S CELEBRATION", cardDate: "09 DEC 2026", date: "9 December 2026", time: "12:00 PM", venue: "SHUBHAM CONVENTION", address: "SHUBHAM CONVENTION", mapUrl: "https://www.google.com/maps/place/shubham+convention+nalgonda/data=!4m2!3m1!1s0x3bcb29d629c7359b:0x7d6a1486907598e2?sa=X&ved=1t:242&ictx=111" },
  "brunda-haldi": { title: "Brunda's Haldi", host: "BRUNDA'S CELEBRATION", cardDate: "09 DEC 2026", date: "9 December 2026", time: "9:00 AM", venue: "Brunda's Home", address: "Brunda's Home", mapUrl: "" },
  wedding: { title: "Wedding Ceremony", host: "THE WEDDING CEREMONY", cardDate: "10 DEC 2026", date: "10 December 2026", time: "8:00 PM", venue: "KOTLA FUNCTION HALL", address: "KOTLA FUNCTION HALL, Undi Road, Bhimavaram, Andhra Pradesh 534199, India.", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kotla+Function+Hall+Bhimavaram&query_place_id=ChIJU5M-8vYyNjoRDWOxPvJt3bQ" },
  reception: { title: "Reception", host: "A CELEBRATION WITH FAMILY", cardDate: "13 DEC 2026", date: "13 December 2026", time: "7:00 PM", venue: "MNR CONVENTION HALL", address: "MNR CONVENTION HALL", mapUrl: "https://www.google.com/maps/place/MNR+CONVENTION+HAll+A%2FC/@17.0968137,79.2531181,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb292d65993c17:0xa91f9caf9a741493!8m2!3d17.0968086!4d79.255693!16s%2Fg%2F11c6rrl0tc?entry=ttu&g_ep=EgoyMDI2MTEwOS4wIKXMDSoASAFQAw%3D%3D" }
};

const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const mapSearchUrl = (address) => address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "";

function initialisePalaceEntrance() {
  const section = select(".welcome-section");
  const button = select("#open-doors");
  if (!section || !button) return;
  const revealCopy = () => {
    if (section.classList.contains("hero-text-revealing")) return;
    section.classList.add("hero-text-revealing");
    button.setAttribute("tabindex", "-1");
    if (!reduceMotion()) window.setTimeout(() => section.classList.add("hero-text-finished"), 4500);
    else section.classList.add("hero-text-finished");
  };
  button.addEventListener("click", () => {
    if (section.classList.contains("doors-opening")) return;
    section.classList.add("doors-opening", "doors-open");
    button.disabled = true;
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "The palace doors are opening");
    if (reduceMotion()) { revealCopy(); return; }
    const leftDoor = select(".door-panel--left", section);
    const fallback = window.setTimeout(revealCopy, 3200);
    leftDoor?.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;
      window.clearTimeout(fallback);
      revealCopy();
    }, { once: true });
  });
}

function initialiseWeddingCountdown() {
  const countdown = select("[data-wedding-countdown]");
  if (!countdown) return;
  const fields = {
    days: select("[data-countdown-days]", countdown),
    hours: select("[data-countdown-hours]", countdown),
    minutes: select("[data-countdown-minutes]", countdown),
    seconds: select("[data-countdown-seconds]", countdown)
  };
  const completeMessage = select("[data-countdown-complete]", countdown);
  const targetTime = new Date("2026-12-10T20:00:00+05:30").getTime();
  let timerId = null;
  const setValue = (field, value) => {
    if (!field || field.textContent === value) return;
    field.textContent = value;
    field.classList.remove("is-updating");
    void field.offsetWidth;
    field.classList.add("is-updating");
  };
  const update = () => {
    const remaining = Math.max(0, targetTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor(totalSeconds % 86400 / 3600),
      minutes: Math.floor(totalSeconds % 3600 / 60),
      seconds: totalSeconds % 60
    };
    setValue(fields.days, String(values.days).padStart(3, "0"));
    setValue(fields.hours, String(values.hours).padStart(2, "0"));
    setValue(fields.minutes, String(values.minutes).padStart(2, "0"));
    setValue(fields.seconds, String(values.seconds).padStart(2, "0"));
    if (remaining === 0) {
      countdown.classList.add("is-complete");
      completeMessage?.removeAttribute("hidden");
      if (timerId !== null) window.clearInterval(timerId);
      timerId = null;
    }
  };
  update();
  if (!countdown.classList.contains("is-complete")) timerId = window.setInterval(update, 1000);
}

function initialiseInvitationEnvelope() {
  const envelope = select("#invitation-envelope");
  const stage = select(".envelope-stage");
  const card = select("#invitation-card");
  const closeButton = select(".invitation-card-close");
  if (!envelope || !stage || !card) return;
  let state = "closed";
  // Both state transitions use the same 3.5-second choreographed timeline.
  const duration = () => reduceMotion() ? 0 : 3500;
  const setCardOrigin = () => {
    const bounds = envelope.getBoundingClientRect();
    stage.style.setProperty("--card-origin-x", `${bounds.left + bounds.width / 2 - window.innerWidth / 2}px`);
    stage.style.setProperty("--card-origin-y", `${bounds.top + bounds.height / 2 - window.innerHeight / 2}px`);
  };
  const label = (open) => {
    envelope.setAttribute("aria-expanded", String(open));
    envelope.setAttribute("aria-label", open ? "Close the wedding invitation envelope" : "Open the wedding invitation envelope");
  };
  const open = () => {
    if (state !== "closed") return;
    state = "opening"; envelope.disabled = true;
    setCardOrigin();
    stage.classList.add("is-open"); envelope.classList.add("is-open");
    card.setAttribute("aria-hidden", "false"); label(true);
    window.setTimeout(() => { state = "open"; envelope.disabled = false; closeButton?.focus(); }, duration());
  };
  const close = () => {
    if (state !== "open") return;
    state = "closing"; envelope.disabled = true; stage.classList.add("is-closing");
    window.setTimeout(() => {
      stage.classList.remove("is-open", "is-closing"); envelope.classList.remove("is-open");
      card.setAttribute("aria-hidden", "true"); label(false); envelope.disabled = false; state = "closed"; envelope.focus();
    }, duration());
  };
  envelope.addEventListener("click", () => state === "closed" ? open() : close());
  closeButton?.addEventListener("click", (event) => { event.stopPropagation(); close(); });
  card.addEventListener("click", (event) => { if (event.target !== closeButton && !closeButton?.contains(event.target)) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && state === "open") close(); });
}

function initialiseMobileNavigation() {
  const menuButton = select(".menu-toggle");
  const navigation = select("#primary-navigation");
  if (!menuButton || !navigation) return;
  const closeMenu = () => { navigation.classList.remove("is-open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-label", "Open navigation menu"); };
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
  selectAll('a[href^="#"]', navigation).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); }, { passive: true });
}

function populateEventCards() {
  selectAll(".celebration-card[data-event]").forEach((card) => {
    const details = EVENT_DETAILS[card.dataset.event];
    if (!details) return;
    select("[data-event-host]", card).textContent = details.host;
    select("[data-event-title]", card).textContent = details.title;
    select("[data-event-card-date]", card).textContent = details.cardDate;
  });
}

function initialiseEventDetails() {
  const dialog = select("#event-dialog");
  if (!dialog) return;
  const fields = { title: select("#event-dialog-title", dialog), date: select("[data-event-date]", dialog), time: select("[data-event-time]", dialog), venue: select("[data-event-venue]", dialog), address: select("[data-event-address]", dialog), map: select("[data-event-map]", dialog) };
  const close = () => dialog.open && typeof dialog.close === "function" ? dialog.close() : dialog.removeAttribute("open");
  const open = (eventId) => {
    const details = EVENT_DETAILS[eventId];
    if (!details) return;
    fields.title.textContent = details.title;
    fields.date.textContent = details.date || "To be announced";
    fields.time.textContent = details.time || "To be announced";
    fields.venue.textContent = details.venue || "To be announced";
    fields.address.textContent = details.address || "To be announced";
    const mapUrl = details.mapUrl || mapSearchUrl(details.address);
    fields.map.hidden = !mapUrl;
    if (mapUrl) fields.map.href = mapUrl;
    if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
    else if (!dialog.open) dialog.setAttribute("open", "");
  };
  selectAll("[data-event-open]").forEach((button) => button.addEventListener("click", () => open(button.dataset.eventOpen)));
  select(".dialog-close", dialog)?.addEventListener("click", close);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
}

function initialiseScratchReveal() {
  const experience = select("[data-scratch-experience]");
  const frame = select("[data-scratch-frame]");
  const canvas = select("[data-scratch-canvas]");
  const revealButton = select("[data-scratch-reveal]");
  const status = select("[data-scratch-status]");
  const instruction = select("[data-scratch-instruction]");
  if (!experience || !frame || !canvas) return;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  let drawing = false; let revealed = false; let lastPoint = null;
  const drawLayer = (pixelRatio) => {
    const { width, height } = canvas;
    const wash = context.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, "#d8b76f"); wash.addColorStop(.5, "#f6e7bd"); wash.addColorStop(1, "#b9873f");
    context.globalCompositeOperation = "source-over"; context.fillStyle = wash; context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(90, 42, 28, .17)";
    for (let x = 0; x < width; x += 17 * pixelRatio) for (let y = (x / pixelRatio) % 34; y < height; y += 31 * pixelRatio) context.fillRect(x, y, pixelRatio, pixelRatio);
    context.strokeStyle = "rgba(91, 41, 27, .36)"; context.lineWidth = Math.max(1, pixelRatio); context.strokeRect(10 * pixelRatio, 10 * pixelRatio, width - 20 * pixelRatio, height - 20 * pixelRatio);
    context.fillStyle = "#5d2622"; context.font = `italic ${Math.round(Math.min(width / 12, 34 * pixelRatio))}px Georgia`; context.textAlign = "center";
    context.fillText("Scratch Here to Reveal", width / 2, height / 2 + 3 * pixelRatio);
  };
  const resize = () => {
    if (revealed) return;
    const bounds = frame.getBoundingClientRect(); const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio)); canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
    canvas.style.width = `${bounds.width}px`; canvas.style.height = `${bounds.height}px`; drawLayer(pixelRatio);
  };
  const point = (event) => {
    const bounds = canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * canvas.width / bounds.width, y: (event.clientY - bounds.top) * canvas.height / bounds.height };
  };
  const scratch = (next) => {
    const radius = Math.max(18, Math.min(canvas.width, canvas.height) / 13);
    context.globalCompositeOperation = "destination-out"; context.lineWidth = radius * 2; context.lineCap = "round";
    context.beginPath(); context.moveTo(lastPoint?.x ?? next.x, lastPoint?.y ?? next.y); context.lineTo(next.x, next.y); context.stroke();
    context.beginPath(); context.arc(next.x, next.y, radius, 0, Math.PI * 2); context.fill(); lastPoint = next;
  };
  const coverage = () => {
    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height); const step = Math.max(4, Math.floor(Math.min(width, height) / 55));
    let clear = 0; let total = 0;
    for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) { total += 1; if (data[(y * width + x) * 4 + 3] < 100) clear += 1; }
    return clear / total;
  };
  const reveal = () => {
    if (revealed) return;
    revealed = true; canvas.classList.add("is-revealed"); canvas.style.pointerEvents = "none"; instruction?.setAttribute("hidden", ""); revealButton?.setAttribute("hidden", ""); experience.classList.add("is-revealed");
    if (status) status.textContent = "The memory has been revealed.";
  };
  canvas.addEventListener("pointerdown", (event) => { if (revealed) return; drawing = true; lastPoint = point(event); canvas.setPointerCapture?.(event.pointerId); event.preventDefault(); scratch(lastPoint); });
  canvas.addEventListener("pointermove", (event) => { if (!drawing || revealed) return; event.preventDefault(); scratch(point(event)); if (coverage() >= .45) reveal(); }, { passive: false });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => canvas.addEventListener(type, () => { drawing = false; lastPoint = null; }));
  revealButton?.addEventListener("click", reveal);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(frame); else window.addEventListener("resize", resize, { passive: true });
  resize();
}

function initialiseScrollReveals() {
  const targets = [".section-heading", ".invitation-layout", ".story-milestone", ".celebration-card", ".scratch-experience", ".venue-layout", ".closing-section > *"];
  const elements = [...new Set(targets.flatMap((selector) => selectAll(selector)))];
  if (reduceMotion() || !("IntersectionObserver" in window)) return;
  elements.forEach((element, index) => { element.classList.add("reveal-on-scroll"); if (element.matches(".story-milestone, .celebration-card")) element.style.transitionDelay = `${Math.min(index % 6, 5) * 65}ms`; });
  const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); current.unobserve(entry.target); } }), { threshold: .12, rootMargin: "0px 0px -35px 0px" });
  elements.forEach((element) => observer.observe(element));
}

function initialiseActiveNavigation() {
  const links = selectAll(".nav-link");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const sections = links.map((link) => select(link.getAttribute("href"))).filter(Boolean); const bySection = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { links.forEach((link) => link.classList.remove("is-active")); bySection.get(entry.target.id)?.classList.add("is-active"); } }), { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

function initialiseImageFallbacks() {
  selectAll("img").forEach((image) => image.addEventListener("error", () => { image.classList.add("image-not-ready"); image.setAttribute("aria-hidden", "true"); image.alt = ""; }, { once: true }));
}

document.addEventListener("DOMContentLoaded", () => {
  populateEventCards(); initialisePalaceEntrance(); initialiseWeddingCountdown(); initialiseInvitationEnvelope(); initialiseMobileNavigation(); initialiseEventDetails(); initialiseScratchReveal(); initialiseScrollReveals(); initialiseActiveNavigation(); initialiseImageFallbacks();
});
