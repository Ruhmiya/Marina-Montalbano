if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
// ── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.faisais-card, .fil-box, .tl-item, .metier-card, .pourquoi-item, .tag, .apprend-box, .exp-card, .section-title, .section-eyebrow, .comp-title'
);
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children];
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 90);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

// ── TIMELINE CASCADE AVEC CLIGNOTEMENT FINAL ─────────────
const tlDots = document.querySelectorAll('.tl-dot');
const tlItems = document.querySelectorAll('.tl-item');
let currentDot = -1;
let blinkInterval = null;

// CSS pour le clignotement
const blinkStyle = document.createElement('style');
blinkStyle.textContent = `
  @keyframes dotBlink {
    0%,100% { background: var(--gold2); box-shadow: 0 0 0 8px rgba(160,120,32,0.25); transform: scale(1.3); }
    50%      { background: var(--gold);  box-shadow: 0 0 0 4px rgba(201,168,76,0.15); transform: scale(1.1); }
  }
  .tl-dot.blinking { animation: dotBlink 1.2s ease infinite; }
`;
document.head.appendChild(blinkStyle);

function activateDot(index) {
  // Stopper tout clignotement précédent
  if (blinkInterval) clearInterval(blinkInterval);
  tlDots.forEach(d => d.classList.remove('active', 'done', 'blinking'));

  // Allumer en cascade avec délai
  tlDots.forEach((d, i) => {
    setTimeout(() => {
      if (i < index) {
        d.classList.add('done');
      } else if (i === index) {
        d.classList.add('active');
        // Si c'est la dernière puce → clignoter indéfiniment
        if (index === tlDots.length - 1) {
          setTimeout(() => d.classList.add('blinking'), 400);
        }
      }
    }, i * 350);
  });
}

tlItems.forEach((item, index) => {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && index > currentDot) {
      currentDot = index;
      activateDot(index);
    }
  }, { threshold: 0.5 }).observe(item);
});
}
