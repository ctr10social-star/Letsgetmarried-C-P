(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = prefersReduced.matches;

  /* ---------------------------------------------------------------
     Single cached scroll value, read once per animation frame.
     Never read layout inside the scroll event itself.
  --------------------------------------------------------------- */
  let lastScrollY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    ticking = true;
  }, { passive: true });

  let wavePhase = 0;
  const waveEls = Array.from(document.querySelectorAll('.sway'));

  const parallaxEls = Array.from(document.querySelectorAll('.parallax-layer')).map(el => ({
    el,
    rate: parseFloat(el.dataset.rate || '0.5')
  }));

  const progressRail = document.querySelector('.progress-rail');
  const docHeight = () => Math.max(document.body.scrollHeight - window.innerHeight, 1);

  function frame() {
    if (ticking) {
      wavePhase += 0.02;
      waveEls.forEach((el, i) => {
        if (!reducedMotion) {
          const amp = 4;
          const deg = Math.sin(wavePhase + i * 0.35) * amp;
          el.style.transform = `rotate(${deg}deg)`;
        }
      });

      if (!reducedMotion) {
        parallaxEls.forEach(({ el, rate }) => {
          const offset = lastScrollY * rate * 0.08;
          el.style.transform = `translateY(${-offset}px)`;
        });
      }

      const railProgress = Math.min(lastScrollY / docHeight(), 1);
      if (progressRail) {
        progressRail.style.setProperty('--rail-fill', (railProgress * 100) + '%');
      }

      ticking = false;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------------------------------------------------------------
     IntersectionObserver reveals — staggered children get a CSS
     custom property index so transition-delay fans out.
  --------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal, .event-card, .wreath-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.3 });
  revealTargets.forEach(t => io.observe(t));

  /* ---------------------------------------------------------------
     Seal intro — tapping the seal smoothly scrolls to the countdown
     hero. Content stays fully reachable by scrolling past it too,
     so nothing is gated behind the tap for keyboard/no-JS visitors.
  --------------------------------------------------------------- */
  const sealBtn = document.getElementById('seal-btn');
  const countdownSection = document.getElementById('scene-countdown');
  if (sealBtn && countdownSection) {
    sealBtn.addEventListener('click', () => {
      countdownSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     Live countdown to the Muhurtam — 4 December 2026, 8:00 a.m. IST
     (02:30 UTC), matching the calendar links below.
  --------------------------------------------------------------- */
  const MUHURTAM_UTC = Date.UTC(2026, 11, 4, 2, 30, 0);
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');

  function updateCountdown() {
    if (!daysEl) return;
    const diff = MUHURTAM_UTC - Date.now();
    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minsEl.textContent = '0';
      return;
    }
    const totalMinutes = Math.floor(diff / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const mins = totalMinutes % 60;
    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours);
    minsEl.textContent = String(mins);
  }
  updateCountdown();
  setInterval(updateCountdown, 30000);

  /* ---------------------------------------------------------------
     Mute / unmute — audio always starts muted per brief.
     Drop a licensed track at assets/wedding-music.mp3 to enable it.
  --------------------------------------------------------------- */
  const audio = document.getElementById('bg-audio');
  const muteBtn = document.getElementById('mute-toggle');
  const muteLabel = document.getElementById('mute-label');
  let muted = true;
  audio.muted = true;

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    audio.muted = muted;
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteLabel.textContent = muted ? 'Sound off' : 'Sound on';
    if (!muted) {
      audio.play().catch(() => { /* file may not exist yet — fails silently */ });
    }
  });

  /* ---- Reduced-motion toggle (manual override, in addition to OS setting) ---- */
  const motionBtn = document.getElementById('motion-toggle');
  function applyReducedMotion(state) {
    reducedMotion = state;
    document.body.classList.toggle('reduced-motion', state);
    motionBtn.setAttribute('aria-pressed', String(state));
  }
  applyReducedMotion(reducedMotion);
  motionBtn.addEventListener('click', () => applyReducedMotion(!reducedMotion));
  prefersReduced.addEventListener('change', (e) => applyReducedMotion(e.matches));

})();
