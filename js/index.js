// ANCHOR - Função do Menu da pagina
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

// NOTE - Função de animação do accordion
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

// NOTE - PERGUNTAS FREQUENTES
document.addEventListener('DOMContentLoaded', function () {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const accordionItem = header.parentElement;
      accordionItem.classList.toggle('open');
    });
  });
});

// ANCHOR - Biblioteca de suavização do Scroll (smooth-scroll@16.1.3)
const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 200
});


// var image = document.getElementById("myImage");
// var zoom = 1;
// var timer;

// window.addEventListener("scroll", function () {
//   clearTimeout(timer);
//   timer = setTimeout(function () {
//     var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     var imageTop = image.getBoundingClientRect().top + scrollTop;
//     var windowHeight = window.innerHeight;
//     var imageHeight = image.offsetHeight;

//     if (imageTop < scrollTop + windowHeight / 2 && imageTop + imageHeight > scrollTop + windowHeight / 2) {
//       var zoomLevel = (scrollTop + windowHeight / 2 - imageTop) / (imageHeight / 2);
//       zoom = 1 + zoomLevel;
//       image.style.position = "fixed";
//       image.style.top = "50%";
//       image.style.left = "50%";
//       image.style.transform = "translate(-50%, -50%) scale(" + zoom + ")";
//     } else {
//       image.style.position = "static";
//       image.style.transform = "none";
//     }
//   }, 50);
// });