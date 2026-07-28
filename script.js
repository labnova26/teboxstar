document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Live "together for" counter ---------------- */
  const START_DATE = new Date('2025-04-23T00:00:00');

  const elYears  = document.getElementById('c-years');
  const elMonths = document.getElementById('c-months');
  const elDays   = document.getElementById('c-days');
  const elHms    = document.getElementById('c-hms');

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCounter(){
    const now = new Date();
    if (now < START_DATE) return;

    let years = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days = now.getDate() - START_DATE.getDate();
    let hours = now.getHours() - START_DATE.getHours();
    let mins = now.getMinutes() - START_DATE.getMinutes();
    let secs = now.getSeconds() - START_DATE.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    elYears.textContent = years;
    elMonths.textContent = months;
    elDays.textContent = days;
    elHms.textContent = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  /* ---------------- Ambient petals ---------------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const field = document.getElementById('petalField');
    const PETAL_COUNT = 16;
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const left = Math.random() * 100;
      const duration = 10 + Math.random() * 10;
      const delay = Math.random() * 14;
      const size = 6 + Math.random() * 6;
      const hueShift = Math.random() > 0.5 ? 'rose' : 'gold';
      p.style.left = left + 'vw';
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = -delay + 's';
      p.style.width = size + 'px';
      p.style.height = (size * 1.1) + 'px';
      if (hueShift === 'gold') p.style.background = 'var(--gold)';
      field.appendChild(p);
    }
  }

  /* ---------------- Timeline reveal on scroll ---------------- */
  const tlItems = document.querySelectorAll('.tl-item');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    tlItems.forEach(item => io.observe(item));
  } else {
    tlItems.forEach(item => item.classList.add('in-view'));
  }

  /* ---------------- Gallery lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.g-item[data-full]').forEach(btn => {
    btn.addEventListener('click', () => {
      lightboxImg.src = btn.getAttribute('data-full');
      lightboxImg.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
      lightbox.classList.add('open');
    });
  });

  function closeLightbox(){
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------------- Envelope open / close ---------------- */
  const envelopes = document.querySelectorAll('.envelope');
  envelopes.forEach(env => {
    const toggle = () => {
      const isOpen = env.classList.contains('open');
      envelopes.forEach(e => e.classList.remove('open'));
      if (!isOpen) env.classList.add('open');
    };
    env.addEventListener('click', toggle);
    env.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

});
