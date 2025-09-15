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
  menuBtn.classList.add('open'); // hamburger turns into X
  navMenu.classList.add('active'); // for menu link animations
});

navClose.addEventListener('click', () => {
  navOverlay.classList.remove('active');
  menuBtn.classList.remove('open'); // revert X to hamburger
  navMenu.classList.remove('active');
});

// Close menu when clicking any link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navOverlay.classList.remove('active');
    menuBtn.classList.remove('open');
    navMenu.classList.remove('active');
  });
});

// =======================
// Floating elements parallax effect for hero section
// =======================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.floating-element');
  
  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + (index * 0.1);
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
});

// =======================
// Smooth scrolling for anchor links
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

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

// =======================
// Back to top button
// =======================
const backToTopBtn = document.getElementById('back-to-top');

// Show/hide button on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

// Smooth scroll to top on click
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});