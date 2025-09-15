// =======================
// About Page JavaScript
// =======================

document.addEventListener('DOMContentLoaded', () => {
  
  // =======================
  // Staggered Fade-in Animations
  // =======================
  
  function staggerFadeIn(cards, delay = 150) {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * delay);
    });
  }

  function removeFadeIn(cards) {
    cards.forEach(card => card.classList.remove('fade-in'));
  }

  const observerOptions = { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

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

  // Apply animations to different sections
  const valueCards = document.querySelectorAll('.value-card');
  const teamCards = document.querySelectorAll('.team-card');

  createObserver(valueCards);
  createObserver(teamCards);

  // =======================
  // Smooth Scrolling for Anchor Links
  // =======================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =======================
  // Header Scroll Effect
  // =======================
  
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(38, 154, 144, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.backgroundColor = 'var(--teal)';
      header.style.backdropFilter = 'none';
    }
  });

  // =======================
  // Enhanced Card Interactions
  // =======================
  
  // Remove the parallax effect that was causing overlap issues
  // Cards will now only use their standard fade-in animations
  
  // =======================
  // Story Section Animation
  // =======================
  
  const storyImage = document.querySelector('.story-image img');
  const storyText = document.querySelector('.story-text');
  
  if (storyImage && storyText) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          storyImage.style.transform = 'scale(1)';
          storyImage.style.opacity = '1';
          storyText.style.transform = 'translateX(0)';
          storyText.style.opacity = '1';
        }
      });
    }, { threshold: 0.3 });

    storyObserver.observe(document.querySelector('.story-section'));
    
    // Initial state for story elements
    storyImage.style.transform = 'scale(0.9)';
    storyImage.style.opacity = '0';
    storyImage.style.transition = 'all 0.8s ease-out';
    
    storyText.style.transform = 'translateX(-20px)';
    storyText.style.opacity = '0';
    storyText.style.transition = 'all 0.8s ease-out 0.2s';
  }

  // =======================
  // Mission & Vision Cards Animation
  // =======================
  
  const mvCards = document.querySelectorAll('.mv-card');
  
  mvCards.forEach((card, index) => {
    card.style.transform = 'translateY(30px)';
    card.style.opacity = '0';
    card.style.transition = `all 0.6s ease-out ${index * 0.2}s`;
  });

  const mvObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mvCards.forEach(card => {
          card.style.transform = 'translateY(0)';
          card.style.opacity = '1';
        });
      }
    });
  }, { threshold: 0.2 });

  if (document.querySelector('.mission-vision')) {
    mvObserver.observe(document.querySelector('.mission-vision'));
  }

  // =======================
  // Mobile Menu Toggle (if needed for consistency)
  // =======================
  
  // This can be expanded if you add a mobile hamburger menu later
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      // Mobile-specific adjustments
      document.querySelectorAll('.nav-links').forEach(nav => {
        nav.style.display = 'none';
      });
    } else {
      // Desktop view
      document.querySelectorAll('.nav-links').forEach(nav => {
        nav.style.display = 'flex';
      });
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call

  // =======================
  // Performance Optimization
  // =======================
  
  // Throttle scroll events for better performance
  let ticking = false;
  
  function updateOnScroll() {
    // Your scroll-based animations here
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);

  // =======================
  // Accessibility Enhancements
  // =======================
  
  // Add focus management for keyboard navigation
  const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--teal)';
      element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
      element.style.outline = 'none';
    });
  });

  // =======================
  // Loading Animation Complete
  // =======================
  
  // Add a class to body when page is fully loaded
  window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
  });

});