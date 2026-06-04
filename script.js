/* ============================================================
   THE BALAJI GROUP — script.js
   Navbar · Scroll Reveal · Counters · Slider · FAQ · Forms
   ============================================================ */

'use strict';

/* ---------- Navbar scroll behaviour ---------- */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 400);
});

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const spans     = navToggle ? navToggle.querySelectorAll('span') : [];

navToggle && navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  spans[0] && (spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '');
  spans[1] && (spans[1].style.opacity  = open ? '0' : '1');
  spans[2] && (spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '');
});

/* Close menu when a link is clicked */
navLinks && navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger siblings inside the same parent
      const siblings = e.target.parentElement
        ? [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'))
        : [];
      const idx = siblings.indexOf(e.target);
      const delay = idx >= 0 ? idx * 80 : 0;

      setTimeout(() => {
        e.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Animated counters ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ---------- Testimonials slider ---------- */
const track  = document.getElementById('testimonialsTrack');
const dotsEl = document.getElementById('sliderDots');

if (track && dotsEl) {
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  // Show 2 cards at a time on desktop
  let perView = window.innerWidth < 700 ? 1 : 2;
  let current = 0;
  const maxIdx = total - perView;

  // Build dots
  for (let i = 0; i <= maxIdx; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx));
    const offset = current * (100 / perView);
    track.style.transform = `translateX(-${offset}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Auto-play
  let autoplay = setInterval(() => goTo(current < maxIdx ? current + 1 : 0), 4500);

  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current < maxIdx ? current + 1 : 0), 4500);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => {
    perView = window.innerWidth < 700 ? 1 : 2;
    goTo(0);
  });
}

/* ---------- FAQ accordion ---------- */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

  // Open if was closed
  if (!isOpen) item.classList.add('open');
}

// Expose to inline onclick
window.toggleFaq = toggleFaq;

/* ---------- Toast notification ---------- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---------- Form handlers ---------- */
function handleBooking(e) {
  e.preventDefault();
  showToast('✅ Site visit booked! We\'ll call you within 24 hours.');
  e.target.reset();
}

function handleContact(e) {
  e.preventDefault();
  showToast('✅ Message sent! Our team will respond shortly.');
  e.target.reset();
}

// Expose to inline onsubmit
window.handleBooking = handleBooking;
window.handleContact = handleContact;

/* ---------- Property search button ---------- */
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const props = document.getElementById('properties');
    if (props) {
      props.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => showToast('🔍 Showing all matching properties below'), 600);
    }
  });
}

/* ---------- Gallery placeholder click ---------- */
document.querySelectorAll('.gallery-placeholder').forEach((el, i) => {
  el.addEventListener('click', () => {
    showToast(`📸 Gallery Image ${i + 1} — Replace with your property photo`);
  });
});

/* ---------- Active nav link highlight on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => activeObserver.observe(s));

/* ---------- Stagger reveal for hero ---------- */
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  setTimeout(() => heroContent.classList.add('visible'), 200);
}

/* ---------- Parallax hero ---------- */
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
  }
}, { passive: true });

/* ---------- Smooth-scroll for in-page anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 0;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Prop card enquiry shortcut ---------- */
document.querySelectorAll('.prop-card').forEach(card => {
  const link = card.querySelector('.btn-sm-gold');
  const title = card.querySelector('.prop-title');
  if (link && title) {
    link.addEventListener('click', e => {
      // allow scroll to contact naturally; just show a toast
      showToast(`📩 Enquiring about: ${title.textContent}`);
    });
  }
});

/* ---------- About badge animation ---------- */
const badge = document.querySelector('.about-badge-float');
if (badge) {
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'scale(1.15) rotate(-8deg)';
    badge.style.transition = 'transform 0.3s ease';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = '';
  });
}
