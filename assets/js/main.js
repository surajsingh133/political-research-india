// ===== ENHANCED HEADER FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });

  // Mobile menu toggle with animation
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking on links (mobile UX)
    navLinks.forEach(link => {
      link.addEventListener('click', (ev) => {
        // always close the mobile menu
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        // unified smooth-scroll handler (registered below) will perform scrolling for same-page anchors
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  // Active navigation highlighting
  function setActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);
  setActiveNav(); // Initial call
});

// ===== PAGE LOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const pageLoader = document.getElementById("page-loader");
    if (pageLoader) {
      pageLoader.style.opacity = "0";
      setTimeout(() => {
        pageLoader.style.display = "none";
      }, 800);
    }
  }, 1800);
});

// ===== SWIPER SLIDER INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper
  var swiper = new Swiper(".mySwiper", {
    effect: "fade",
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: { 
      el: ".swiper-pagination",
      clickable: true
    },
    on: {
      init: function() {
        console.log('Swiper initialized successfully');
      }
    }
  });
});

// ===== SMOOTH REVEAL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  // Observe all reveal elements
  document.querySelectorAll(".reveal, .service-card, .portfolio-card, .stat-card, .visual-card, .partner-card, .team-card")
    .forEach((el) => revealObserver.observe(el));
});

// ===== ANIMATED COUNTERS FOR STATS =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', function() {
  animateCounters();
});

// ===== FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.enquiry-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Simple form validation
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff4444';
        } else {
          input.style.borderColor = '#e0e0e0';
        }
      });

      if (!isValid) {
        alert('Please fill in all required fields.');
        return;
      }

      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Build email payload
      const formData = new FormData(form);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const service = formData.get('service') || '';
      const message = formData.get('message') || '';

      const subject = `Website Enquiry: ${service || 'General'} - ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`;

      // Try to submit via formsubmit.co (no account required) and fallback to mailto if it fails
      const endpoint = 'https://formsubmit.co/ajax/vishal@politicalresearchindia.com';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();
        if (response.ok) {
          alert('Thank you for your enquiry! We will get back to you soon.');
          form.reset();
        } else {
          // Fallback to opening user's email client
          window.location.href = `mailto:vishal@politicalresearchindia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
      } catch (err) {
        // Network error -> fallback to mailto
        window.location.href = `mailto:vishal@politicalresearchindia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Campaign slides rotation (cycle portfolio campaign slides one by one)
  const campaignSlides = document.querySelectorAll('.campaign-slide');
  const workSection = document.getElementById('work');
  if (campaignSlides.length && workSection) {
    let current = 0;
    let rotationInterval = null;

    // utility to set highlighted slide
    function highlightSlide(index) {
      campaignSlides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.classList.toggle('dimmed', i !== index);
      });
      current = index;
    }

    // attach hover handlers to pause rotation and highlight hovered
    campaignSlides.forEach((s, i) => {
      s.addEventListener('mouseenter', () => {
        pauseRotation();
        highlightSlide(i);
      });
      s.addEventListener('mouseleave', () => {
        resumeRotation();
      });
    });

    // rotation control
    function rotateOnce() {
      const next = (current + 1) % campaignSlides.length;
      highlightSlide(next);
    }
    function startRotation() {
      if (rotationInterval) return; // already running
      rotationInterval = setInterval(rotateOnce, 5000);
    }
    function pauseRotation() {
      if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
      }
    }
    function resumeRotation() {
      if (!rotationInterval) startRotation();
    }

    // Intersection observer to start/stop rotation only when #work is visible
    const workObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // start rotation when section is visible
          highlightSlide(current);
          startRotation();
        } else {
          // pause rotation when section is not visible
          pauseRotation();
        }
      });
    }, { threshold: 0.25 });

    workObserver.observe(workSection);

    // initialize state (if section already in view, startRotation will be triggered by observer)
    highlightSlide(0);
  }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
// Unified smooth scroll for same-page anchors with header offset and mobile nav close
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // If href is just '#' or empty, ignore
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return; // no in-page target, let default behavior (e.g., links to other pages)

      e.preventDefault();

      const headerEl = document.querySelector('.header');
      const offset = headerEl ? headerEl.offsetHeight + 12 : 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile nav if open
      const nav = document.querySelector('.header-nav');
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      if (nav && nav.classList.contains('active')) nav.classList.remove('active');
      if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) mobileMenuBtn.classList.remove('active');
    });
  });
});

// ===== PARALLAX EFFECT FOR HERO =====
document.addEventListener('DOMContentLoaded', function() {
  const hero = document.querySelector(".hero-slider");
  if (hero) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const parallaxElements = document.querySelectorAll(".slide-bg");
          
          parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px) scale(1.05)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    });
  }
});

// ===== IMAGE LOADING HANDLER =====
function handleImageLoading() {
  const images = document.querySelectorAll('.slide-bg, .portfolio-image');
  
  images.forEach(img => {
    // Add loading class
    img.classList.add('loading');
    
    // Check if image is already loaded
    const bgImage = img.style.backgroundImage;
    if (bgImage) {
      const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
      const tempImage = new Image();
      
      tempImage.onload = function() {
        img.classList.remove('loading');
      };
      
      tempImage.onerror = function() {
        img.classList.remove('loading');
        console.warn('Failed to load image:', imageUrl);
      };
      
      tempImage.src = imageUrl;
    }
  });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', function() {
  handleImageLoading();
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', function() {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    const nav = document.querySelector('.header-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    }
  }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
});

// Add loading state for better UX
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('loaded');
});

console.log('Political Research India - Website initialized successfully');