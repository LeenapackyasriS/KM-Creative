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
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

/* ---------- enquiry form -> WhatsApp ---------- */
(function () {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '919876543210';   // country code + number, no + or spaces
  const status = document.getElementById('formStatus');
  const sendBtn = form.querySelector('.send-btn');

  const fields = {
    cfName:     { required: true,  check: v => v.length >= 2,                       msg: 'Please enter your name.' },
    cfPhone:    { required: true,  check: v => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s|-/g, '')) ||
                                              /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')),
                                                                                   msg: 'Enter a valid 10-digit mobile number.' },
    cfEmail:    { required: false, check: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), msg: 'Enter a valid email address.' },
    cfCategory: { required: true,  check: v => v !== '',                            msg: 'Please select a category.' },
    cfMessage:  { required: true,  check: v => v.length >= 5,                       msg: 'Please type your message.' }
  };

  function validate(id) {
    const el = document.getElementById(id);
    const rule = fields[id];
    const value = el.value.trim();
    const box = el.closest('.field');
    const out = box.querySelector('.field-error');

    const empty = value === '';
    let ok = true, message = '';

    if (empty && rule.required) { ok = false; message = rule.msg; }
    else if (!empty && !rule.check(value)) { ok = false; message = rule.msg; }

    box.classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', !ok);
    out.textContent = message;
    return ok;
  }

  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => validate(id));
    el.addEventListener('input', () => {
      if (el.closest('.field').classList.contains('invalid')) validate(id);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.hidden = true;
    status.classList.remove('error');

    const results = Object.keys(fields).map(validate);
    if (results.includes(false)) {
      const firstBad = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
      if (firstBad) firstBad.focus();
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.add('error');
      status.hidden = false;
      return;
    }

    const get = id => document.getElementById(id).value.trim();
    const lines = [
      'Hello KM Creative Tailor & Academy,',
      '',
      'Name: ' + get('cfName'),
      'Phone: ' + get('cfPhone'),
      get('cfEmail') ? 'Email: ' + get('cfEmail') : null,
      'Category: ' + get('cfCategory'),
      'Message: ' + get('cfMessage')
    ].filter(l => l !== null);

    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

    sendBtn.disabled = true;
    window.open(url, '_blank', 'noopener');

    status.textContent = 'Thank you! WhatsApp has opened with your message. Please press Send there to complete your enquiry.';
    status.hidden = false;
    form.reset();
    Object.keys(fields).forEach(id => {
      const el = document.getElementById(id);
      el.closest('.field').classList.remove('invalid');
      el.removeAttribute('aria-invalid');
    });
    setTimeout(() => { sendBtn.disabled = false; }, 2500);
  });
})();

/* ---------- footer year ---------- */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();