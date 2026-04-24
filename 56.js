
function opentab(tabName) {

  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach(content => content.classList.remove("active-tab"));


  const tabLinks = document.querySelectorAll(".tab-link");
  tabLinks.forEach(link => link.classList.remove("active-link"));

  document.getElementById(tabName).classList.add("active-tab");


  event.currentTarget.classList.add("active-link");
}


const wrapper = document.querySelector('.card-wrapper');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let currentIndex = 0;
const cardWidth = 420; // 400px card + 20px gap
const visibleCards = 3;

nextBtn.addEventListener('click', () => {
  const totalCards = document.querySelectorAll('.card-item').length;
  if (currentIndex < totalCards - visibleCards) {
    currentIndex++;
    wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }
});


//----- for animation--------

const hiddenElements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
}, { threshold: 0.1 }); // triggers when 10% is visible

hiddenElements.forEach((el) => observer.observe(el));

hiddenElements.forEach((el) => {
  if (el.getBoundingClientRect().top < window.innerHeight) {
    el.classList.add('show');
  }
});
