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
var images = [
  "foto1.jpeg", "foto2.jpeg", "foto3.jpeg", "foto4.jpeg",
  "foto5.jpeg", "foto6.jpeg", "foto7.jpeg", "foto8.jpeg",
  "foto9.jpeg", "foto10.jpeg", "foto11.jpeg", "foto12.jpeg",
  "foto13.jpeg", "foto14.jpeg", "foto15.jpeg", "foto16.jpeg",
  "foto17.jpeg", "foto18.jpeg", "foto19.jpeg", "foto20.jpeg",
  "foto21.jpeg", "foto22.jpeg", "foto23.jpeg", "foto24.jpeg",
  "foto25.jpeg", "foto26.jpeg", "foto27.jpeg", "foto28.jpeg",
  "foto29.jpeg", "foto30.jpeg", "foto31.jpeg", "foto32.jpeg",
  "foto33.jpeg", "foto34.jpeg", "foto35.jpeg", "foto36.jpeg",
  "foto37.jpeg", "foto38.jpeg", "foto39.jpeg", "foto40.jpeg",
  "foto41.jpeg", "foto42.jpeg",
];
var intervals = [2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];

function startSlideshow() {
  intervalId = setInterval(function () {
    var imagens = document.querySelectorAll(".grid-item .imagens");
    for (var i = 0; i < imagens.length; i++) {
      var randomIndex = Math.floor(Math.random() * images.length);
      var randomImage = "images/instagramPosts/" + images[randomIndex];
      imagens[i].src = randomImage;
      setTimeout((function (index) {
        return function () {
          var randomIndex = Math.floor(Math.random() * images.length);
          var randomImage = "images/instagramPosts/" + images[randomIndex];
          imagens[index].src = randomImage;
        }
      })(i), intervals[i]);
    }
  }, 12000);
}



function stopSlideshow() {
  clearInterval(intervalId);
}

startSlideshow();
