// =============================================
// CUSTOM CURSOR
// =============================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }

  animateRing();

  // Scale ring on hover over interactive elements
  document.querySelectorAll('a, button, .skill-card, .project-card, .social-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.8)';
      cursorRing.style.borderColor = 'rgba(56,189,248,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.borderColor = 'rgba(56,189,248,0.5)';
    });
  });
}

// =============================================
// NAVBAR — SCROLL EFFECT & MOBILE MENU
// =============================================
const header = document.getElementById('header');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const spans = menuBtn.querySelectorAll('span');
  if (navLinks.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = menuBtn.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
        link.style.color = '#38bdf8';
      }
    }
  });
}

window.addEventListener('scroll', setActiveNav);

// =============================================
// TYPING EFFECT
// =============================================
const typingEl = document.getElementById('typing');
const words = [
  'Java Full Stack Developer',
  'Java Developer',
  'Backend Developer',
  'Web Developer',
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  } else {
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typingTimeout = setTimeout(typeEffect, 1500);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingTimeout = setTimeout(typeEffect, 400);
    return;
  }

  typingTimeout = setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

// =============================================
// PROJECT IMAGE GALLERY
// =============================================
const galleryState = {};

function initGalleries() {
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    if (!track) return;

    const id = track.id;
    const images = track.querySelectorAll('img');
    const totalImages = images.length;

    if (totalImages === 0) return;

    galleryState[id] = { current: 0, total: totalImages };

    // Build dots
    const dotsContainer = document.getElementById('dots-' + id);
    if (dotsContainer) {
      for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(id, i));
        dotsContainer.appendChild(dot);
      }
    }
  });
}

function slide(galleryId, direction) {
  const state = galleryState[galleryId];
  if (!state) return;

  state.current = (state.current + direction + state.total) % state.total;
  updateGallery(galleryId);
}

function goToSlide(galleryId, index) {
  const state = galleryState[galleryId];
  if (!state) return;

  state.current = index;
  updateGallery(galleryId);
}

function updateGallery(galleryId) {
  const state = galleryState[galleryId];
  const track = document.getElementById(galleryId);
  const dotsContainer = document.getElementById('dots-' + galleryId);

  if (track) {
    track.style.transform = `translateX(-${state.current * 100}%)`;
  }

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === state.current);
    });
  }
}

// Auto-slide galleries
function autoSlideGalleries() {
  Object.keys(galleryState).forEach(id => {
    slide(id, 1);
  });
}

let autoSlideInterval = setInterval(autoSlideGalleries, 3500);

// Pause auto-slide on hover
document.querySelectorAll('.project-gallery').forEach(gallery => {
  gallery.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  gallery.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(autoSlideGalleries, 3500);
  });
});

initGalleries();

// =============================================
// SKILL BAR ANIMATION ON SCROLL
// =============================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => fill.classList.add('animate'));
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// =============================================
// SCROLL-TRIGGERED FADE IN
// =============================================
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function setupFadeIn(selector) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    fadeObserver.observe(el);
  });
}

setupFadeIn('.skill-card');
setupFadeIn('.project-card');
setupFadeIn('.contact-item');
setupFadeIn('.timeline-content');

setupFadeIn('.education-card');
setupFadeIn('.hobby-card');

// =============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});