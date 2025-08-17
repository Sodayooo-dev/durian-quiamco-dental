// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavClose = document.querySelector('.mobile-nav-close');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const body = document.body;

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    body.classList.toggle('mobile-menu-open');
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    body.classList.remove('mobile-menu-open');
}

// Event listeners
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileNavClose.addEventListener('click', closeMobileMenu);

// Close menu when clicking on overlay
mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
        closeMobileMenu();
    }
});

// Close menu when clicking on nav items
mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileMenu);
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simple fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .feature-card, .hero-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(38, 154, 144, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, rgba(38, 154, 144, 1) 0%, rgba(68, 147, 140, 1) 100%)';
        header.style.backdropFilter = 'none';
    }
});