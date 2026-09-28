function setMenuOpen(isOpen) {
  const menu = document.getElementById('sidemenu');
  const toggle = document.querySelector('.menu-toggle');
  const icon = toggle.querySelector('i');

  menu.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation`);
  toggle.title = `${isOpen ? 'Close' : 'Open'} navigation`;
  icon.classList.toggle('fa-bars', !isOpen);
  icon.classList.toggle('fa-xmark', isOpen);
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
  const themeIcon = themeToggle.querySelector('i');

  function applyTheme(theme, savePreference = false) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeToggle.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;
    themeIcon.classList.toggle('fa-sun', isDark);
    themeIcon.classList.toggle('fa-moon', !isDark);

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
