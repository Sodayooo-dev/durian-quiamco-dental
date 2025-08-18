// =======================
// Header scroll effect
// =======================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// =======================
// Fullscreen nav menu
// =======================
const menuBtn = document.querySelector('.menu-btn');
const navOverlay = document.querySelector('.nav-overlay');
const navClose = document.querySelector('.nav-close');
const navMenu = document.querySelector('.nav-menu');

menuBtn.addEventListener('click', () => {
  navOverlay.classList.add('active');
  navMenu.classList.add('active');  // trigger slide-in animation
});

navClose.addEventListener('click', () => {
  navOverlay.classList.remove('active');
  navMenu.classList.remove('active'); // reset animation
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navOverlay.classList.remove('active');
    navMenu.classList.remove('active');
  });
});


// =======================
// Hero slider autoplay
// =======================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx === i) slide.classList.add('active');
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

setInterval(nextSlide, 5000);

// =======================
// Staggered fade-in animations for sections
// =======================

// Helper function for staggered fade-in
function staggerFadeIn(cards, delay = 150) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in');
    }, index * delay);
  });
}

// Helper function to remove fade-in
function removeFadeIn(cards) {
  cards.forEach(card => card.classList.remove('fade-in'));
}

// Intersection Observer options
const observerOptions = { threshold: 0.1 };

// Generic observer for any section
function createObserver(cards) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        staggerFadeIn(cards);
      } else {
        removeFadeIn(cards);
      }
    });
  }, observerOptions);

  cards.forEach(card => observer.observe(card));
}

// Apply to Services, Features, and Doctors
const serviceCards = document.querySelectorAll('.services-grid .service-card');
const featureCards = document.querySelectorAll('.features-grid .feature-card');
const doctorCards = document.querySelectorAll('.doctor-grid .doctor-card');

createObserver(serviceCards);
createObserver(featureCards);
createObserver(doctorCards);
