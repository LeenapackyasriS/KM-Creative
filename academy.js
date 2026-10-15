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

/* ---------- stats count-up ---------- */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / 1500, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.ac-count').forEach(c => countObserver.observe(c));

/* ---------- photo fallbacks: use the image named in data-fb until the real photo exists ---------- */
(function () {
  const DEFAULT = 'images/academy/basic-tailoring.jpg';
  document.querySelectorAll('img[data-fb]').forEach(img => {
    const fallback = img.dataset.fb || DEFAULT;
    const swap = () => {
      if (img.dataset.fbDone) return;
      img.dataset.fbDone = '1';
      img.src = fallback;
    };
    img.addEventListener('error', swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });
})();

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.ac-faq-item').forEach(item => {
  const btn = item.querySelector('.ac-faq-q');
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

/* ---------- footer year ---------- */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();