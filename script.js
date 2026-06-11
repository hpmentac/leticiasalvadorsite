// Menu mobile
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Fecha o menu ao clicar em um link (mobile)
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// Ano atual no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Garante apenas um item do FAQ aberto por vez
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => { if (other !== item) other.open = false; });
    }
  });
});

// ===== Scroll Reveal (reveal on scroll) =====
// Marca os elementos que vão animar ao entrar na viewport
const revealSelectors = [
  '.section-head',
  '.about-head', '.about-text', '.about-media',
  '.strip-col',
  '.feature-title', '.feature-text', '.feature-media',
  '.how-text',
  '.steps-title', '.step', '.steps-cta',
  '.cta-button-wrap',
  '.ba-card',
  '.gallery-grid img',
  '.faq-item',
  '.cta-inner'
];

const revealEls = document.querySelectorAll(revealSelectors.join(','));
revealEls.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  }, {
    rootMargin: '0px 0px -100px 0px', // dispara quando entra 100px na viewport
    threshold: 0
  });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: se o navegador não suportar, mostra tudo
  revealEls.forEach(el => el.classList.add('active'));
}
