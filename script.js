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

// ===== Carrossel da Galeria (arrastar + bolinhas + setas + autoplay) =====
(function () {
  const track = document.getElementById('galeriaTrack');
  const dotsBox = document.getElementById('galeriaDots');
  if (!track || !dotsBox) return;

  const slides = Array.from(track.querySelectorAll('.gc-slide'));
  const prevBtn = document.querySelector('.gc-prev');
  const nextBtn = document.querySelector('.gc-next');
  let current = 0;
  let autoplayTimer = null;

  // Cria as bolinhas (uma por foto)
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gc-dot' + (i === 0 ? ' active' : '');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Ir para a foto ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  // Centraliza a foto de índice i
  function goTo(i) {
    current = Math.max(0, Math.min(i, slides.length - 1));
    const slide = slides[current];
    const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
    updateDots();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Descobre qual foto está mais centralizada (ao arrastar/rolar)
  function syncFromScroll() {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    slides.forEach((s, i) => {
      const sc = s.offsetLeft + s.clientWidth / 2;
      const dist = Math.abs(sc - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    current = best;
    updateDots();
  }

  let scrollRaf;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(syncFromScroll);
  });

  // Setas
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });

  // Arrastar com o mouse/dedo
  let isDown = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', (e) => {
    isDown = true; moved = false;
    startX = e.pageX; startScroll = track.scrollLeft;
    track.classList.add('dragging');
    stopAutoplay();
  });
  track.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });
  function endDrag() {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    goTo(current);       // encaixa na foto mais próxima
    restartAutoplay();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  // Evita "clicar" sem querer ao arrastar
  track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); } }, true);

  // Autoplay
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function startAutoplay() {
    if (prefersReduced) return;
    autoplayTimer = setInterval(() => {
      const next = (current + 1) % slides.length; // volta ao início no fim
      goTo(next);
    }, 3500);
  }
  function stopAutoplay() { clearInterval(autoplayTimer); }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  // Pausa ao passar o mouse, retoma ao sair
  const carousel = document.getElementById('galeriaCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
})();
