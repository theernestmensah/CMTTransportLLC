/* ============================================================
   CMT Transportation, LLC — Main Script
   ============================================================ */

'use strict';

/* ── 1. Preloader ─────────────────────────────────────────── */
(function hidePreloader() {
  function dismiss() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }
  // Hide 1.8s after DOM is ready (fast path)
  document.addEventListener('DOMContentLoaded', () => setTimeout(dismiss, 1800));
  // Absolute fallback: hide at most 3s after script runs
  setTimeout(dismiss, 3000);
  // Also on window load
  window.addEventListener('load', () => setTimeout(dismiss, 500));
})();

/* ── 2. AOS Init ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    delay: 0,
  });

  initNavbar();
  initTypedEffect();
  initParallax();
  init3DTilt();
  initCounters();
  initBookingModal();
  initSwiperTestimonials();
  initMobileMenu();
  initScrollTop();
  initMagneticButtons();
});

/* ── 3. Navbar Scroll ─────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight active section link
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('#mainNav .nav-link[href^="#"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`#mainNav .nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

/* ── 4. Mobile Full-Screen Menu ───────────────────────────── */
function initMobileMenu() {
  const toggler = document.getElementById('navToggler');
  const collapse = document.getElementById('navCollapse');
  const closeBtn = document.getElementById('mobileCloseBtn');
  if (!toggler || !collapse) return;

  toggler.addEventListener('click', () => {
    collapse.classList.toggle('show');
    document.body.style.overflow = collapse.classList.contains('show') ? 'hidden' : '';
  });
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      collapse.classList.remove('show');
      document.body.style.overflow = '';
    });
  }
  collapse.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      collapse.classList.remove('show');
      document.body.style.overflow = '';
    });
  });
}

/* ── 5. Typed Effect (Hero) ───────────────────────────────── */
function initTypedEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = ['Safe. Reliable. Personable.', 'Caring for You, Every Mile.', 'Your Comfort is Our Priority.', 'Trusted by Thousands.'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const cur = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = cur.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === cur.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = cur.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
}

/* ── 6. Parallax Hero ─────────────────────────────────────── */
function initParallax() {
  const bg = document.querySelector('.hero-parallax-bg');
  if (!bg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const yPos = window.scrollY * 0.4;
        bg.style.transform = `translateY(${yPos}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── 7. 3D Tilt on Service Cards ──────────────────────────── */
function init3DTilt() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ── 8. Animated Counters ─────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const isDecimal = String(target).includes('.');
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const value = target * ease;
        el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── 9. Swiper Testimonials ───────────────────────────────── */
function initSwiperTestimonials() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('#testimonialSwiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      640:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

/* ── 10. Booking Modal Multi-Step ─────────────────────────── */
function initBookingModal() {
  let currentStep = 1;
  const totalSteps = 3;

  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextBtns = document.querySelectorAll('[data-next]');
  const prevBtns = document.querySelectorAll('[data-prev]');
  const submitBtn = document.getElementById('submitBooking');

  function goToStep(n) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
    });
    progressSteps.forEach((p, i) => {
      p.classList.remove('active', 'done');
      if (i + 1 < n) p.classList.add('done');
      if (i + 1 === n) p.classList.add('active');
    });
    currentStep = n;
    if (submitBtn) submitBtn.style.display = n === totalSteps ? 'inline-flex' : 'none';
    const nextBtnEl = document.getElementById('modalNextBtn');
    if (nextBtnEl) nextBtnEl.style.display = n < totalSteps ? 'inline-flex' : 'none';
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        if (currentStep === 2) computeQuote();
        goToStep(currentStep + 1);
      }
    });
  });
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  });

  // Reset modal on open
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.addEventListener('show.bs.modal', () => goToStep(1));
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Booking…';
      submitBtn.disabled = true;
      setTimeout(() => {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
        showToast(`🎉 Booking Confirmed! We'll contact you shortly.`, 'success');
        submitBtn.innerHTML = '✦ Confirm Booking';
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  goToStep(1);
}

/* ── 11. Instant Quote Calculator ─────────────────────────── */
function computeQuote() {
  const serviceType = document.getElementById('serviceType')?.value || 'wheelchair';
  const tripType    = document.getElementById('tripType')?.value || 'oneway';
  const distance    = parseFloat(document.getElementById('tripDistance')?.value) || 10;
  const passengers  = parseInt(document.getElementById('passengers')?.value) || 1;

  const baseFees = { wheelchair: 45, senior: 35, longdistance: 55, medical: 50 };
  const base = baseFees[serviceType] || 40;
  const perMile = serviceType === 'longdistance' ? 2.10 : 1.75;
  const roundFactor = tripType === 'roundtrip' ? 1.85 : 1;
  const total = (base + distance * perMile) * roundFactor * (1 + (passengers - 1) * 0.15);

  const el = document.getElementById('quoteAmount');
  const breakdown = document.getElementById('quoteBreakdown');
  if (el) {
    el.innerHTML = `<span>$</span>${total.toFixed(2)}`;
    if (breakdown) {
      breakdown.innerHTML = `
        <small class="text-muted d-block mt-1">Base fee: $${base} &bull; ~${distance} miles &bull; ${tripType === 'roundtrip' ? 'Round Trip' : 'One Way'}</small>
        <small class="text-muted">Real price may vary. Final quote by phone.</small>
      `;
    }
  }
}

/* ── 12. Toast Notification ───────────────────────────────── */
function showToast(message, type = 'info') {
  const colors = { success: 'linear-gradient(135deg,#002147,#003070)', info: 'linear-gradient(135deg,#003070,#002147)' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; top:90px; right:24px; z-index:99999;
    background:${colors[type]}; color:#fff;
    padding:16px 24px; border-radius:12px;
    font-family:'Montserrat',sans-serif; font-size:0.88rem; font-weight:600;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    border-left:4px solid #D4AF37;
    animation:slideInToast 0.4s ease;
    max-width:340px; line-height:1.5;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  const style = document.createElement('style');
  style.textContent = `@keyframes slideInToast{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`;
  document.head.appendChild(style);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ── 13. Scroll To Top ────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 14. Magnetic Button Effect ───────────────────────────── */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary-cmt, .btn-outline-cmt, .nav-cta-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s ease';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ── 15. GSAP Hero Entrance (if available) ────────────────── */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin();
  const tl = gsap.timeline({ delay: 2.1 });
  tl.from('.hero-eyebrow',  { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
    .from('.hero-title',    { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .from('.hero-typed',    { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from('.hero-stats .hero-stat', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('.hero-actions',  { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.2')
    .from('.hero-image-card', { opacity: 0, x: 60, duration: 0.9, ease: 'power3.out' }, '-=0.8');
});
