document.addEventListener("DOMContentLoaded", function () {
  initCookiePopup();
  initPhoneInput();
  initFormHandling();
  initMobileMenu();
  initScrollEffects();
  initAnimations();
  initHeroSlider();

  function initCookiePopup() {
    const cookiePopup = document.getElementById("cookie-popup");
    const acceptBtn = document.getElementById("accept-cookies");
    const declineBtn = document.getElementById("decline-cookies");

    if (!cookiePopup || !acceptBtn || !declineBtn) return;

    if (!localStorage.getItem("cookieChoice")) {
      setTimeout(function () {
        cookiePopup.classList.add("show");
      }, 5000);
    }

    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookieChoice", "accepted");
      cookiePopup.classList.remove("show");
    });

    declineBtn.addEventListener("click", function () {
      localStorage.removeItem("cookieChoice");

      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }

      cookiePopup.classList.remove("show");

      setTimeout(function () {
        window.location.reload();
      }, 500);
    });
  }

  function initPhoneInput() {
    const phoneInput = document.getElementById("phone");
    if (phoneInput && window.intlTelInput) {
      const iti = window.intlTelInput(phoneInput, {
        initialCountry: "gb",
        preferredCountries: ["gb", "us", "de", "fr"],
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });

      window.phoneInputInstance = iti;
    }
  }

  function initFormHandling() {
    const contactForm = document.getElementById("contact-form");
    const successModal = document.getElementById("success-modal");
    const modalCloseBtn = document.getElementById("modal-close");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: window.phoneInputInstance
          ? window.phoneInputInstance.getNumber()
          : document.getElementById("phone").value,
        service: document.getElementById("service").value,
        message: document.getElementById("message").value,
      };

      if (!formData.name || !formData.email || !formData.phone) {
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return;
      }

      if (
        window.phoneInputInstance &&
        !window.phoneInputInstance.isValidNumber()
      ) {
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(function () {
        contactForm.reset();
        if (window.phoneInputInstance) {
          window.phoneInputInstance.setCountry("gb");
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (successModal) {
          successModal.classList.add("show");
          successModal.setAttribute("aria-hidden", "false");
        }
      }, 1000);
    });

    if (modalCloseBtn && successModal) {
      modalCloseBtn.addEventListener("click", function () {
        successModal.classList.remove("show");
        successModal.setAttribute("aria-hidden", "true");
      });

      successModal.addEventListener("click", function (e) {
        if (e.target === successModal) {
          successModal.classList.remove("show");
          successModal.setAttribute("aria-hidden", "true");
        }
      });
    }
  }

  function initMobileMenu() {
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });

    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".header")) {
        navMenu.classList.remove("active");
        mobileToggle.classList.remove("active");
      }
    });
  }
  function initScrollEffects() {
    window.addEventListener("scroll", function () {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const header = document.querySelector(".header");

      if (header) {
        if (scrollTop > 100) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    });

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("loaded");
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      ".benefit-card, .blog-card, .faq-item"
    );
    elementsToAnimate.forEach(function (element) {
      element.classList.add("loading");
      observer.observe(element);
    });
  }

  function initAnimations() {
    function animateCounters() {
      const statElements = document.querySelectorAll(".stat h3");

      statElements.forEach(function (element) {
        const countTo = element.textContent;
        const countNum = parseInt(countTo.replace(/\D/g, ""));
        let current = 0;
        const increment = countNum / 100;
        const timer = setInterval(function () {
          current += increment;
          if (current >= countNum) {
            element.textContent = countTo;
            clearInterval(timer);
          } else {
            element.textContent =
              Math.floor(current) + (countTo.includes("+") ? "+" : "");
          }
        }, 20);
      });
    }

    const aboutSection = document.querySelector(".about");
    if (aboutSection) {
      const aboutObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              aboutObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      aboutObserver.observe(aboutSection);
    }
  }

  const faqItems = document.querySelectorAll(".faq-item h3");
  faqItems.forEach(function (faqItem) {
    faqItem.addEventListener("click", function () {
      const item = this.parentElement;

      document.querySelectorAll(".faq-item").forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      item.classList.toggle("active");
    });
  });

  function initHeroSlider() {
    const heroSlides = document.querySelectorAll(".hero-slide");
    const heroDots = document.querySelectorAll(".hero-dot");

    if (!heroSlides.length) return;

    let currentSlide = 0;
    let slideInterval;

    function showHeroSlide(index) {
      heroSlides.forEach((slide) => slide.classList.remove("active"));
      heroDots.forEach((dot) => dot.classList.remove("active"));

      heroSlides[index].classList.add("active");
      heroDots[index].classList.add("active");
    }

    function nextHeroSlide() {
      currentSlide = (currentSlide + 1) % heroSlides.length;
      showHeroSlide(currentSlide);
    }

    heroDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        showHeroSlide(currentSlide);
        resetHeroInterval();
      });
    });

    function startHeroInterval() {
      slideInterval = setInterval(nextHeroSlide, 6000);
    }

    function resetHeroInterval() {
      clearInterval(slideInterval);
      startHeroInterval();
    }

    startHeroInterval();

    const heroSlider = document.querySelector(".hero-slider");
    if (heroSlider) {
      heroSlider.addEventListener("mouseenter", () => {
        clearInterval(slideInterval);
      });

      heroSlider.addEventListener("mouseleave", () => {
        startHeroInterval();
      });
    }
  }
});
