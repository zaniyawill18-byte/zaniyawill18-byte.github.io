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

const prototypeTriggers = [...document.querySelectorAll('.prototype-screen-trigger')];
if (prototypeTriggers.length) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'prototype-lightbox';
  lightbox.setAttribute('aria-label', 'Final prototype screen gallery');
  lightbox.innerHTML = `
    <button class="prototype-lightbox-close" type="button">Close</button>
    <div class="prototype-lightbox-stage">
      <button class="prototype-lightbox-nav prototype-lightbox-prev" type="button" aria-label="Previous screen">←</button>
      <button class="prototype-lightbox-image" type="button" aria-label="View next screen"><img alt=""></button>
      <button class="prototype-lightbox-nav prototype-lightbox-next" type="button" aria-label="Next screen">→</button>
    </div>
    <div class="prototype-lightbox-meta"><span class="prototype-lightbox-count"></span><strong class="prototype-lightbox-title"></strong><span class="prototype-lightbox-hint">Click image for next</span></div>`;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector('.prototype-lightbox-image img');
  const lightboxTitle = lightbox.querySelector('.prototype-lightbox-title');
  const lightboxCount = lightbox.querySelector('.prototype-lightbox-count');
  let currentScreen = 0;

  const showScreen = (index) => {
    currentScreen = (index + prototypeTriggers.length) % prototypeTriggers.length;
    const trigger = prototypeTriggers[currentScreen];
    const source = trigger.querySelector('img');
    lightboxImage.src = source.currentSrc || source.src;
    lightboxImage.alt = source.alt;
    lightboxTitle.textContent = trigger.closest('figure').querySelector('figcaption strong').textContent;
    lightboxCount.textContent = `${String(currentScreen + 1).padStart(2, '0')} / ${String(prototypeTriggers.length).padStart(2, '0')}`;
  };

  const openLightbox = (index) => {
    showScreen(index);
    document.body.style.overflow = 'hidden';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  };

  const closeLightbox = () => {
    if (typeof lightbox.close === 'function') lightbox.close();
    else {
      lightbox.removeAttribute('open');
      document.body.style.overflow = '';
      prototypeTriggers[currentScreen].focus();
    }
  };

  prototypeTriggers.forEach((trigger, index) => trigger.addEventListener('click', () => openLightbox(index)));
  lightbox.querySelector('.prototype-lightbox-image').addEventListener('click', () => showScreen(currentScreen + 1));
  lightbox.querySelector('.prototype-lightbox-next').addEventListener('click', () => showScreen(currentScreen + 1));
  lightbox.querySelector('.prototype-lightbox-prev').addEventListener('click', () => showScreen(currentScreen - 1));
  lightbox.querySelector('.prototype-lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') showScreen(currentScreen + 1);
    if (event.key === 'ArrowLeft') showScreen(currentScreen - 1);
  });
  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';
    prototypeTriggers[currentScreen].focus();
  });
}
