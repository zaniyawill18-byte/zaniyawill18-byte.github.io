const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

const hero = document.querySelector('.home-hero');
if (hero && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    hero.style.setProperty('--my', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  });
}

const scrollCursor = document.querySelector('.scroll-cursor');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
if (hero && scrollCursor && finePointer.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointerenter', () => scrollCursor.classList.add('is-visible'));
  hero.addEventListener('pointermove', (event) => {
    scrollCursor.style.left = `${event.clientX}px`;
    scrollCursor.style.top = `${event.clientY}px`;
  });
  hero.addEventListener('pointerleave', () => scrollCursor.classList.remove('is-visible'));
}
