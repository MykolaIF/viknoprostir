const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-year]");
const heroImage = document.querySelector("[data-random-hero]");
const backToTop = document.querySelector("[data-back-to-top]");

year.textContent = new Date().getFullYear();

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  backToTop?.classList.toggle("is-visible", window.scrollY > 360);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const probeImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const randomizeHeroImage = async () => {
  if (!heroImage) return;

  const candidates = Array.from({ length: 10 }, (_, index) => `assets/hero-vikno-prostir${index}.jpg`);
  const availableImages = (await Promise.all(candidates.map(probeImage))).filter(Boolean);

  if (!availableImages.length) return;

  const currentSrc = heroImage.getAttribute("src");
  const choices = availableImages.length > 1 ? availableImages.filter((src) => src !== currentSrc) : availableImages;
  const nextSrc = choices[Math.floor(Math.random() * choices.length)];

  heroImage.src = nextSrc;
};

randomizeHeroImage();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  header.classList.toggle("nav-active", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
});

nav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;

  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  header.classList.remove("nav-active");
  document.body.classList.remove("nav-open");
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
