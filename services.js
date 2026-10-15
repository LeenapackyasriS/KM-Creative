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

/* ---------- navbar shadow on scroll ---------- */
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

/* ---------- FAQ accordion ---------- */
(function () {
  const items = [...document.querySelectorAll('.faq-item')];
  const toggleAll = document.getElementById('faqToggle');
  if (!items.length) return;

  const setOpen = (item, open) => {
    item.classList.toggle('open', open);
    item.querySelector('.faq-q').setAttribute('aria-expanded', open);
  };

  const syncButton = () => {
    if (!toggleAll) return;
    const allOpen = items.every(i => i.classList.contains('open'));
    toggleAll.firstChild.textContent = allOpen ? 'Collapse All ' : 'View All FAQs ';
  };

  items.forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      setOpen(item, !item.classList.contains('open'));
      syncButton();
    });
  });

  if (toggleAll) {
    toggleAll.addEventListener('click', () => {
      const allOpen = items.every(i => i.classList.contains('open'));
      items.forEach(i => setOpen(i, !allOpen));
      syncButton();
    });
  }
})();

/* ---------- footer year ---------- */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();