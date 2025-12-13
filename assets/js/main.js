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
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        const txt = submitBtn.querySelector('.btn-text');
        if (txt) {
          submitBtn.dataset._orig = txt.textContent;
          txt.textContent = 'Sending...';
        } else {
          submitBtn.dataset._orig = submitBtn.textContent;
          submitBtn.textContent = 'Sending...';
        }
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
      }

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
      const endpoint = 'https://formsubmit.co/ajax/vishal@politcalresearchindia.com';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        // show inline success message instead of alert/redirect
        if (response.ok || response.type === 'opaque' || response.status === 0) {
          try { form.reset(); } catch (err) {}
          const msg = form.querySelector('.form-success');
          if (msg) {
            msg.textContent = 'Thank you — your submission has been received.';
            msg.style.display = 'block';
          } else {
            // fallback small alert if no placeholder exists
            alert('Thank you — your submission has been received.');
          }
        } else {
          // try to show inline error and keep user on page
          const msg = form.querySelector('.form-success');
          if (msg) {
            msg.textContent = 'Submission failed. Please try again or email us at vishal@politcalresearchindia.com';
            msg.style.display = 'block';
          } else {
            window.location.href = `mailto:vishal@politcalresearchindia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }
        }
      } catch (err) {
        // Network error -> show inline error and do not redirect to external page
        const msg = form.querySelector('.form-success');
        if (msg) {
          msg.textContent = 'Network error. Please try again or email us at vishal@politcalresearchindia.com';
          msg.style.display = 'block';
        } else {
          window.location.href = `mailto:vishal@politcalresearchindia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          const txt = submitBtn.querySelector('.btn-text');
          if (txt) {
            txt.textContent = submitBtn.dataset._orig || originalText || 'Submit';
          } else {
            submitBtn.textContent = submitBtn.dataset._orig || originalText || 'Submit';
          }
          try { delete submitBtn.dataset._orig; } catch(e){}
        }
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

/* Form submit handler: try AJAX to formsubmit.co, on success reset form and show inline message.
   If fetch is blocked (CORS) fallback to normal form submit so file uploads still work.
*/
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form.enquiry-form[action*="formsubmit.co"]').forEach(function(form){
    form.addEventListener('submit', function (e) {
      // prevent double handling
      if (form.dataset.submitting === '1') return;
      var action = form.getAttribute('action');
      if (!action || action.indexOf('formsubmit.co') === -1) return; // nothing to do

      e.preventDefault();
      form.dataset.submitting = '1';

      var fd = new FormData(form);

      // attempt fetch (may fail due to CORS) — if success clear and show inline success, otherwise fallback to normal submit
      fetch(action, {
        method: 'POST',
        body: fd,
        mode: 'cors'
      }).then(function (res) {
        // treat 200-299 as success; some hosts return 0/opaque on redirect — consider as success too
        if (res.ok || res.type === 'opaque' || res.status === 0) {
          try { form.reset(); } catch (err) {}
          var msg = form.querySelector('.form-success');
          if (msg) {
            msg.textContent = 'Thank you — your submission has been received.';
            msg.style.display = 'block';
          } else {
            alert('Thank you — your submission has been received.');
          }
          // clear submitting flag so user can submit again
          delete form.dataset.submitting;
        } else {
          // fallback: allow native submit (redirect will happen) — this keeps file upload working
          delete form.dataset.submitting;
          form.submit();
        }
      }).catch(function () {
        // network/CORS error — fallback to native submit
        delete form.dataset.submitting;
        form.submit();
      });
    });
  });
});

/* Simplified: remove slide-in popup. Only create sticky contact widget site-wide.
*/
(function(){
  function createContactFloating() {
    if (document.getElementById('contact-floating')) return;
    const el = document.createElement('div');
    el.id = 'contact-floating';
    el.className = 'contact-floating';
    el.innerHTML = `
      <div class="cf-item cf-email" title="Email">
        <a href="mailto:vishal@politcalresearchindia.com" aria-label="Email vishal@politcalresearchindia.com">📧</a>
        <div class="cf-detail">vishal@politcalresearchindia.com</div>
      </div>
      <div class="cf-item cf-phone" title="Call">
        <a href="tel:+918928050190" aria-label="Call +91-8928050190">📞</a>
        <div class="cf-detail">+91-8928050190</div>
      </div>
    `;
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createContactFloating);
  } else {
    createContactFloating();
  }
})();

/* ...existing code... */

document.addEventListener('DOMContentLoaded', function () {
  var submissionFrame = document.getElementById('submission-frame');

  // helper: show loader on form
  function setFormLoading(form, isLoading, label) {
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.classList.add('loading');
      var t = btn.querySelector('.btn-text');
      if (t) { btn.dataset._orig = t.textContent; t.textContent = label || 'Sending...'; }
    } else {
      btn.disabled = false;
      btn.classList.remove('loading');
      var t = btn.querySelector('.btn-text');
      if (t) { t.textContent = btn.dataset._orig || 'Submit'; delete btn.dataset._orig; }
    }
  }

  // handle iframe load (treat as successful native submit)
  if (submissionFrame) {
    submissionFrame.addEventListener('load', function () {
      var waitId = submissionFrame.dataset.waiting;
      if (!waitId) return;
      var form = document.querySelector('form.enquiry-form[data-submission-id="' + waitId + '"]');
      if (!form) { delete submissionFrame.dataset.waiting; return; }

      // success: reset and show inline/popup
      try { form.reset(); } catch (e) {}
      setFormLoading(form, false);
      var msg = form.querySelector('.form-success');
      if (msg) { msg.textContent = 'Thank you — your submission has been received.'; msg.style.display = 'block'; }
      // show slide popup if available
      if (window.__PRI_showSlidePopup) window.__PRI_showSlidePopup(msg ? msg.textContent : 'Thanks for submitting');
      delete submissionFrame.dataset.waiting;
      delete form.dataset.submissionId;
    }, true);
  }

  // main submit handler
  document.querySelectorAll('form.enquiry-form').forEach(function (form) {
    // ensure correct action (non-ajax)
    var action = form.getAttribute('action') || '';
    // prefer the normal endpoint (not /ajax)
    form.setAttribute('action', action.replace('/ajax/', '/'));

    // if the form has file inputs -> target iframe (native submit)
    var hasFile = !!form.querySelector('input[type="file"]');

    // always set target to iframe for reliability with uploads
    if (hasFile && submissionFrame) {
      form.setAttribute('target', 'submission-frame');
    }

    form.addEventListener('submit', function (e) {
      // prevent duplicate handling
      if (form.dataset.submitting === '1') return;
      form.dataset.submitting = '1';

      // basic required fields check (client-side)
      var required = form.querySelectorAll('[required]');
      for (var i = 0; i < required.length; i++) {
        if (!required[i].value || required[i].value.trim() === '') {
          required[i].focus();
          form.dataset.submitting = '';
          return e.preventDefault();
        }
      }

      // show loader
      setFormLoading(form, true, 'Sending...');

      if (hasFile && submissionFrame) {
        // native submit to iframe — do not preventDefault
        // mark form with id so iframe load can map response
        var id = 's' + Date.now();
        form.dataset.submissionId = id;
        submissionFrame.dataset.waiting = id;
        // allow native submit to proceed (files preserved)
        delete form.dataset.submitting;
        return; // native submit continues
      }

      // no files: use fetch to standard endpoint (CORS allowed)
      e.preventDefault();
      var fd = new FormData(form);
      // use form.action (ensure not /ajax/ unless you want it)
      fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      }).then(function (res) {
        if (res.ok || res.type === 'opaque' || res.status === 0) {
          try { form.reset(); } catch (e) {}
          var msg = form.querySelector('.form-success');
          if (msg) { msg.textContent = 'Thank you — your submission has been received.'; msg.style.display = 'block'; }
          console.log('Form submitted via fetch; no popup used.');
        } else {
          // fallback: show inline error and allow manual retry
          var msg = form.querySelector('.form-success');
          if (msg) { msg.textContent = 'Submission failed. Please try again or email vishal@politcalresearchindia.com'; msg.style.display = 'block'; }
        }
      }).catch(function () {
        var msg = form.querySelector('.form-success');
        if (msg) { msg.textContent = 'Network error. Please try again or email vishal@politcalresearchindia.com'; msg.style.display = 'block'; }
      }).finally(function () {
        setFormLoading(form, false);
        delete form.dataset.submitting;
      });
    });
  });
});