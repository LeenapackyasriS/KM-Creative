/* ---------- mobile menu ---------- */
const nav = document.getElementById('navbar');
const burger = document.getElementById('hamburger');
const links = document.getElementById('navLinks');

if (burger && links) {
  const icon = burger.querySelector('i');
  const closeMenu = () => {
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    icon.className = 'fa-solid fa-bars';
  };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 992) closeMenu(); });
}

/* ---------- navbar shadow ---------- */
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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

/* ---------- footer year ---------- */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

/* ---------- photo fallback: until you add the new photos, show the main lehenga image ---------- */
(function () {
  const FALLBACK = 'images/lehenga.jpeg';
  document.querySelectorAll('.lh-card img, .lh-look-item img').forEach(img => {
    const swap = () => {
      if (img.dataset.fb) return;
      img.dataset.fb = '1';
      img.src = FALLBACK;
    };
    img.addEventListener('error', swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });
})();

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.lh-faq-item').forEach(item => {
  const btn = item.querySelector('.lh-faq-q');
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

/* ---------- lookbook lightbox ---------- */
(function () {
  const items = [...document.querySelectorAll('.lh-look-item')];
  const lb = document.getElementById('lhLb');
  if (!items.length || !lb) return;

  const lbImg = lb.querySelector('.lh-lb-img');
  const lbCount = lb.querySelector('.lh-lb-count');
  const closeBt = lb.querySelector('.lh-lb-close');
  let current = 0, opener = null;

  function show(i) {
    current = (i + items.length) % items.length;
    const img = items[current].querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCount.textContent = (current + 1) + ' / ' + items.length;
  }
  function open(i) {
    opener = items[i];
    show(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lh-lock');
    closeBt.focus();
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('lh-lock');
    lbImg.src = '';
    if (opener) opener.focus();
  }

  items.forEach((it, i) => it.addEventListener('click', () => open(i)));
  lb.querySelector('.lh-lb-next').addEventListener('click', () => show(current + 1));
  lb.querySelector('.lh-lb-prev').addEventListener('click', () => show(current - 1));
  closeBt.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'Tab') {
      const f = [...lb.querySelectorAll('button')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  let startX = 0;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();