const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

year.textContent = new Date().getFullYear();

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const service = data.get("service");
  const message = data.get("message") || "Без коментаря";

  const subject = encodeURIComponent(`Заявка з сайту: ${service}`);
  const body = encodeURIComponent(
    `Ім’я: ${name}\nТелефон: ${phone}\nПослуга: ${service}\nКоментар: ${message}`
  );

  formStatus.textContent = "Готово, відкриваю поштовий клієнт для відправки заявки.";
  window.location.href = `mailto:viknoprostir@example.com?subject=${subject}&body=${body}`;
  form.reset();
});
