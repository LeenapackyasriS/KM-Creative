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

/* ---------- footer year ---------- */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

/* ==========================================================
   GALLERY: filter + counts + deep links + lightbox
   ========================================================== */
(function () {
  const grid  = document.getElementById('glGrid');
  const tabs  = [...document.querySelectorAll('.gl-tab')];
  const count = document.getElementById('glCount');
  if (!grid) return;

  const items = [...grid.querySelectorAll('.gl-item')];
  const cats  = el => el.dataset.cat.split(' ');

  /* ---- live count badge on every tab ---- */
  tabs.forEach(tab => {
    const f = tab.dataset.filter;
    const n = f === 'all' ? items.length : items.filter(it => cats(it).includes(f)).length;
    const badge = document.createElement('em');
    badge.textContent = n;
    tab.appendChild(badge);
  });

  /* ---- filtering ---- */
  function applyFilter(f, updateHash) {
    let shown = 0;
    items.forEach(it => {
      const match = f === 'all' || cats(it).includes(f);
      it.hidden = !match;
      if (match) {
        shown++;
        it.style.animationDelay = Math.min(shown * 40, 400) + 'ms';
        it.style.animationName = 'none';            // restart the entrance animation
        void it.offsetWidth;
        it.style.animationName = '';
      }
    });

    tabs.forEach(t => {
      const on = t.dataset.filter === f;
      t.classList.toggle('active', on);
      t.setAttribute('aria-pressed', on);
      if (on) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });

    count.innerHTML = 'Showing <b>' + shown + '</b> ' + (shown === 1 ? 'design' : 'designs');
    if (updateHash) history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
  }

  tabs.forEach(t => t.addEventListener('click', () => applyFilter(t.dataset.filter, true)));

  /* deep link: gallery.html#blouse opens that filter */
  const fromHash = () => {
    const h = location.hash.replace('#', '');
    return tabs.some(t => t.dataset.filter === h) ? h : 'all';
  };
  window.addEventListener('hashchange', () => applyFilter(fromHash(), false));
  applyFilter(fromHash(), false);

  /* ---- lightbox ---- */
  const lb      = document.getElementById('glLb');
  const lbImg   = lb.querySelector('.gl-lb-img');
  const lbTitle = lb.querySelector('.gl-lb-title');
  const lbTag   = lb.querySelector('.gl-lb-tag');
  const lbCount = lb.querySelector('.gl-lb-count');
  const closeBt = lb.querySelector('.gl-lb-close');
  let list = [], current = 0, opener = null;

  function show(i) {
    current = (i + list.length) % list.length;
    const it  = list[current];
    const img = it.querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = it.dataset.title;
    lbTag.textContent   = it.querySelector('.gl-tag').textContent;
    lbCount.textContent = (current + 1) + ' / ' + list.length;
  }

  function open(item) {
    list = items.filter(it => !it.hidden);
    opener = item.querySelector('.gl-open');
    show(list.indexOf(item));
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gl-lock');
    closeBt.focus();
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('gl-lock');
    lbImg.src = '';
    if (opener) opener.focus();
  }

  items.forEach(it => it.querySelector('.gl-open').addEventListener('click', () => open(it)));
  lb.querySelector('.gl-lb-next').addEventListener('click', () => show(current + 1));
  lb.querySelector('.gl-lb-prev').addEventListener('click', () => show(current - 1));
  closeBt.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'Tab') {                              // keep focus inside the dialog
      const f = [...lb.querySelectorAll('button')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* swipe on phones */
  let startX = 0;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();