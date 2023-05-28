const nav = document.querySelector(".nav");
const btnMenu = document.querySelector(".btn-menu");
const menu = document.querySelector(".menu");

function handleButtonClick(event) {
  if (event.type === "touchstart") event.preventDefault();
  event.stopPropagation();
  nav.classList.toggle("active");
  handleClickOutside(menu, () => {
    nav.classList.remove("active");
  });
  setAria();
}

function handleClickOutside(targetElement, callback) {
  const html = document.documentElement;
  function handleHTMLClick(event) {
    if (!targetElement.contains(event.target)) {
      targetElement.removeAttribute("data-target");
      html.removeEventListener("click", handleHTMLClick);
      html.removeEventListener("touchstart", handleHTMLClick);
      callback();
    }
  }
  if (!targetElement.hasAttribute("data-target")) {
    html.addEventListener("click", handleHTMLClick);
    html.addEventListener("touchstart", handleHTMLClick);
    targetElement.setAttribute("data-target", "");
  }
}

btnMenu.addEventListener("click", handleButtonClick);
btnMenu.addEventListener("touchstart", handleButtonClick);
// imagens

const imagens = document.querySelectorAll(".imagens");

const instagramPosts = [
  "https://www.instagram.com/p/ClQ95sQrAjd/",
  "https://www.instagram.com/p/ClHkoL8Lsct/",
  "https://www.instagram.com/p/ClHkUXfLIrl/",
  "https://www.instagram.com/p/ClDrHHjOh2F/",
  "https://www.instagram.com/p/ClDqkuaOCq6/",
  "https://www.instagram.com/p/ClDqHjROwJa/",
  "https://www.instagram.com/p/ClDpsO_uXoN/",
  "https://www.instagram.com/p/ClDolerO7dO/",
];

const imageDurations = [4000, 6000, 8000, 10000];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startSlideshow() {
  shuffleArray(instagramPosts);

  imagens.forEach((img, index) => {
    img.src = instagramPosts[index];
    setTimeout(() => {
      img.classList.add("active");
      setInterval(() => {
        img.classList.toggle("active");
      }, imageDurations[index] * 2);
    }, imageDurations[index]);
  });
}

// SECTION - PERGUNTAS FREQUENTES
document.addEventListener('DOMContentLoaded', function () {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const accordionItem = header.parentElement;
      accordionItem.classList.toggle('open');
    });
  });
});
// !SECTION - PERGUNTAS FREQUENTES