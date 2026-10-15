const nav = document.getElementById('navbar');
const burger = document.getElementById('hamburger');
const links = document.getElementById('navLinks');
const icon = burger.querySelector('i');

/* ---------- mobile menu ---------- */
function closeMenu() {
  links.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  icon.className = 'fa-solid fa-bars';
}

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 992) closeMenu(); });

/* ---------- navbar shadow on scroll ---------- */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---------- active link on scroll ---------- */
const navAnchors = links.querySelectorAll('a:not(.btn)');
const sections = [...navAnchors]
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  navAnchors.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current.id)
  );
});

/* ---------- counters ---------- */
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 1500, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- mobile slider: one card, auto-scroll, dots ---------- */
function mobileSlider(selector, delay = 3000) {
  const track = document.querySelector(selector);
  if (!track) return;

  const cards = [...track.children];
  const mq = window.matchMedia('(max-width: 760px)');
  let index = 0, timer = null, visible = false;

  /* dots */
  const dots = document.createElement('div');
  dots.className = 'slider-dots';
  cards.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show card ' + (i + 1));
    b.addEventListener('click', () => { goTo(i); start(); });
    dots.appendChild(b);
  });
  track.insertAdjacentElement('afterend', dots);
  const dotBtns = [...dots.children];

  function setActive(i) {
    dotBtns.forEach((d, n) => d.classList.toggle('active', n === i));
  }

  function goTo(i) {
    index = (i + cards.length) % cards.length;
    setActive(index);
    track.scrollTo({
      left: cards[index].offsetLeft - cards[0].offsetLeft,
      behavior: 'smooth'
    });
  }

  /* keep the dots in sync when the user swipes */
  track.addEventListener('scroll', () => {
    const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    index = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    setActive(index);
  }, { passive: true });

  /* auto-scroll */
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (mq.matches && visible) timer = setInterval(() => goTo(index + 1), delay);
  }

  /* run only while the slider is on screen */
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    start();
  }, { threshold: 0.2 }).observe(track);

  /* pause only while the finger is on it */
  track.addEventListener('touchstart', stop, { passive: true });
  track.addEventListener('touchend', start, { passive: true });

  mq.addEventListener('change', () => { track.scrollLeft = 0; index = 0; setActive(0); start(); });

  setActive(0);
}

mobileSlider('.service-grid');
mobileSlider('.course-grid');

/* ---------- mobile slider: one card, auto-scroll, dots ---------- */
function mobileSlider(selector, delay = 3000) {
  const track = document.querySelector(selector);
  if (!track) return null;

  const mq = window.matchMedia('(max-width: 760px)');
  const dots = document.createElement('div');
  dots.className = 'slider-dots';
  track.insertAdjacentElement('afterend', dots);

  let cards = [], index = 0, timer = null, visible = false;
  const getCards = () => [...track.children].filter(c => !c.hidden);

  function setActive(i) {
    [...dots.children].forEach((d, n) => d.classList.toggle('active', n === i));
  }

  function goTo(i) {
    if (!cards.length) return;
    index = (i + cards.length) % cards.length;
    setActive(index);
    track.scrollTo({
      left: cards[index].offsetLeft - cards[0].offsetLeft,
      behavior: 'smooth'
    });
  }

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (mq.matches && visible && cards.length > 1) {
      timer = setInterval(() => goTo(index + 1), delay);
    }
  }

  function build() {
    cards = getCards();
    dots.innerHTML = '';
    cards.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show item ' + (i + 1));
      b.addEventListener('click', () => { goTo(i); start(); });
      dots.appendChild(b);
    });
    index = 0;
    track.scrollLeft = 0;
    setActive(0);
  }

  /* keep dots in sync when the user swipes */
  track.addEventListener('scroll', () => {
    if (cards.length < 2) return;
    const step = cards[1].offsetLeft - cards[0].offsetLeft || track.clientWidth;
    index = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    setActive(index);
  }, { passive: true });

  /* run only while on screen; pause only while the finger is down */
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    start();
  }, { threshold: 0.2 }).observe(track);

  track.addEventListener('touchstart', stop, { passive: true });
  track.addEventListener('touchend', start, { passive: true });
  mq.addEventListener('change', () => { build(); start(); });

  build();
  return { refresh() { build(); start(); } };
}

mobileSlider('.service-grid');
mobileSlider('.course-grid');

/* ---------- gallery: filter tabs + lightbox ---------- */
(function () {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  const items = [...grid.children];
  const tabs = document.querySelectorAll('.gallery-tab');
  const slider = mobileSlider('.gallery-grid');

  /* tabs */
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const f = tab.dataset.filter;
    items.forEach(it => {
      it.hidden = !(f === 'all' || it.dataset.cat.split(' ').includes(f));
    });
    if (slider) slider.refresh();
  }));

  /* lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('.lb-img');
  const lbCount = lb.querySelector('.lb-count');
  let list = [], current = 0;

  function show(i) {
    current = (i + list.length) % list.length;
    const img = list[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCount.textContent = (current + 1) + ' / ' + list.length;
  }
  function open(item) {
    list = items.filter(it => !it.hidden);
    show(list.indexOf(item));
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lb-open');
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('lb-open');
  }

  items.forEach(it => it.addEventListener('click', () => open(it)));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  /* swipe on phones */
  let startX = 0;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
})();

/* ============ TESTIMONIALS: auto-scroll (3 on desktop, 1 on mobile) ============ */
(function () {
  const track = document.getElementById('tTrack');
  const dotsBox = document.getElementById('tDots');
  if (!track) return;

  const cards = track.querySelectorAll('.t-card');
  let index = 0, timer = null;

  const isMobile = () => window.innerWidth <= 760;
  const perView  = () => (isMobile() ? 1 : 3);
  const maxIndex = () => Math.max(0, cards.length - perView());
  const step     = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].offsetWidth + gap;
  };

  // dots (one per card, shown on mobile only)
  cards.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    b.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.appendChild(b);
  });
  const dots = dotsBox.querySelectorAll('button');

  function setActive(i) {
    dots.forEach((d, n) => d.classList.toggle('active', n === i));
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    track.scrollTo({ left: index * step(), behavior: 'smooth' });
    setActive(index);
  }

  function next() { goTo(index >= maxIndex() ? 0 : index + 1); }

  function start()   { stop(); timer = setInterval(next, 3500); }
  function stop()    { clearInterval(timer); }
  function restart() { start(); }

  // keep the dots in sync when the user swipes by hand
  track.addEventListener('scroll', () => {
    index = Math.round(track.scrollLeft / step());
    setActive(Math.min(index, maxIndex()));
  }, { passive: true });

  // pause while hovering or touching
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  track.addEventListener('touchstart', stop, { passive: true });
  track.addEventListener('touchend', start, { passive: true });

  window.addEventListener('resize', () => goTo(0));

  setActive(0);
  start();
})();