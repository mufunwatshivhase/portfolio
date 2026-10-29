function setMenuOpen(isOpen) {
  const menu = document.getElementById('sidemenu');
  const toggle = document.querySelector('.menu-toggle');
  const icon = toggle.querySelector('.material-symbols-rounded');

  menu.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation`);
  toggle.title = `${isOpen ? 'Close' : 'Open'} navigation`;
  icon.textContent = isOpen ? 'close' : 'menu';
}

function openmenu() {
  setMenuOpen(true);
}

function closemenu() {
  setMenuOpen(false);
}

function togglemenu() {
  const menu = document.getElementById('sidemenu');
  setMenuOpen(!menu.classList.contains('open'));
}

document.querySelectorAll('#sidemenu a').forEach((link) => {
  link.addEventListener('click', closemenu);
});

const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  const themeIcon = themeToggle.querySelector('.material-symbols-rounded');

  function applyTheme(theme, savePreference = false) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeToggle.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;
    themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';

    if (savePreference) {
      try {
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
      } catch {}
    }
  }

  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
}

function opentab(tabName, tabLink) {
  const tabContents = document.querySelectorAll('.tab-content');
  const tabLinks = document.querySelectorAll('.tab-link');
  const selectedTab = document.getElementById(tabName);

  if (!selectedTab || !tabLink) return;

  tabContents.forEach((content) => content.classList.remove('active-tab'));
  tabLinks.forEach((link) => {
    link.classList.remove('active-link');
    link.setAttribute('aria-selected', 'false');
  });

  selectedTab.classList.add('active-tab');
  tabLink.classList.add('active-link');
  tabLink.setAttribute('aria-selected', 'true');
}

function sendEmail() {
  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:mufunwatshivhase@gmail.com?subject=${subject}&body=${body}`;
}

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();
  document.getElementById('form-status').textContent = 'Opening your email app with the message details.';
  sendEmail();
});

const carousel = document.querySelector('.SlideContainer');
const carouselTrack = document.querySelector('.card-wrapper');
const carouselList = document.querySelector('.card-list');
const carouselCards = document.querySelectorAll('.card-item');
const nextButton = document.querySelector('.next');
const previousButton = document.querySelector('.prev');
let currentIndex = 0;

function updateCarousel() {
  if (!carousel || !carouselTrack || !carouselList || carouselCards.length === 0) return;

  const cardStyle = window.getComputedStyle(carouselList);
  const gap = parseFloat(cardStyle.columnGap) || 0;
  const cardWidth = carouselCards[0].getBoundingClientRect().width + gap;
  const maxOffset = Math.max(0, carouselList.scrollWidth - carousel.clientWidth);
  const maxIndex = Math.ceil(maxOffset / cardWidth);

  currentIndex = Math.min(currentIndex, maxIndex);
  carouselTrack.style.transform = `translateX(-${Math.min(currentIndex * cardWidth, maxOffset)}px)`;
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex >= maxIndex;
}

if (carousel && carouselTrack && nextButton && previousButton) {
  nextButton.addEventListener('click', () => {
    currentIndex += 1;
    updateCarousel();
  });

  previousButton.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

const hiddenElements = document.querySelectorAll('.hidden');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  hiddenElements.forEach((element) => observer.observe(element));
} else {
  hiddenElements.forEach((element) => element.classList.add('show'));
}

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ---------- Animation helpers ---------- */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar + nav state
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const siteNav = document.querySelector('.site-nav');

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress})`;
      if (siteNav) siteNav.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Staggered reveal for groups of items
  const groups = [
    '.skills-grid > .skill-group',
    '.card-list > .card-item',
    '#experience > ul > li',
    '.education-table tbody tr',
    '.footer-grid > *'
  ];
  const items = [];
  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal-item');
      el.style.setProperty('--i', index);
      items.push(el);
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Slider cards sit off-screen sideways, so reveal them all when the slider scrolls into view
  const sliderCards = [...document.querySelectorAll('.card-list > .card-item')];
  items.filter((el) => !sliderCards.includes(el)).forEach((el) => revealObserver.observe(el));

  const slider = document.querySelector('.SlideContainer');
  if (slider) {
    const sliderObserver = new IntersectionObserver((entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        sliderCards.forEach((el) => el.classList.add('is-in'));
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    sliderObserver.observe(slider);
  }

  // Items inside the hidden Experience tab: reveal when the tab opens
  document.querySelectorAll('.tab-link').forEach((tab) => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        document.querySelectorAll('.tab-content.active-tab .reveal-item').forEach((el) => el.classList.add('is-in'));
      }, 30);
    });
  });
})();
