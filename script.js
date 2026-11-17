const pages = [...document.querySelectorAll("main > .page-section")];
const progressBar = document.getElementById("progressBar");
const pageNumber = document.getElementById("pageNumber");
const pageTotal = document.getElementById("pageTotal");
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const envelope = document.getElementById("envelope");
const letterSection = document.getElementById("letter");
let currentPage = 0;

pageTotal.textContent = String(pages.length).padStart(2, "0");

function updateNavigation() {
  pages.forEach((page, index) => page.classList.toggle("active", index === currentPage));
  pageNumber.textContent = String(currentPage + 1).padStart(2, "0");
  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;
  progressBar.style.width = `${((currentPage + 1) / pages.length) * 100}%`;
  pages[currentPage].scrollTop = 0;
}

function goToPage(index) {
  if (index < 0 || index >= pages.length || index === currentPage) return;
  currentPage = index;
  updateNavigation();
  window.scrollTo(0, 0);
}
prevButton.addEventListener("click", () => goToPage(currentPage - 1));
nextButton.addEventListener("click", () => goToPage(currentPage + 1));

// All in-journal links become page turns rather than long scrolling jumps.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    const targetPage = pages.indexOf(target.closest(".page-section") || target);
    if (targetPage >= 0) {
      event.preventDefault();
      goToPage(targetPage);
    }
  });
});

// Keyboard navigation for a book-like reading experience.
document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight" || event.key === "PageDown") goToPage(currentPage + 1);
  if (event.key === "ArrowLeft" || event.key === "PageUp") goToPage(currentPage - 1);
});

// Gentle reveal effects within the currently displayed page.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Interactive memory notes.
document.querySelectorAll(".memory-card").forEach(card => {
  card.addEventListener("click", () => {
    const isOpen = card.getAttribute("aria-expanded") === "true";
    card.setAttribute("aria-expanded", String(!isOpen));
  });
});

// The letter remains sealed until the reader deliberately clicks.
document.getElementById("unsealLetter").addEventListener("click", event => {
  envelope.classList.add("open");
  letterSection.classList.add("unfolded");
  event.currentTarget.textContent = "THE LETTER IS OPEN";
  event.currentTarget.disabled = true;
  document.getElementById("letterHint").textContent = "TAKE YOUR TIME. THESE WORDS ARE FOR YOU.";
});

// Decorative mark only; no audio is played.
document.getElementById("soundToggle").addEventListener("click", event => {
  event.currentTarget.textContent = event.currentTarget.textContent === "✳" ? "✦" : "✳";
  event.currentTarget.title = "A little sparkle for the journal";
});

updateNavigation();
