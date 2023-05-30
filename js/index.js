//ANCHOR - Função do carrosel de imagens
var images = [
  "foto1.svg", "foto2.svg", "foto3.svg", "foto4.svg",
  "foto5.svg", "foto6.svg", "foto7.svg", "foto8.svg",
  "foto9.svg", "foto10.svg", "foto11.svg", "foto12.svg",
  "foto13.svg", "foto14.svg", "foto15.svg", "foto16.svg",
  "foto17.svg", "foto18.svg", "foto19.svg", "foto20.svg",
  "foto21.svg", "foto22.svg", "foto23.svg", "foto24.svg",
  "foto25.svg", "foto26.svg", "foto27.svg", "foto28.svg",
  "foto29.svg", "foto30.svg", "foto31.svg", "foto32.svg",
  "foto33.svg", "foto34.svg", "foto35.svg", "foto36.svg",
  "foto37.svg", "foto38.svg", "foto39.svg"
];
var intervals = [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];

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
  }, 18000);
}
// STUB - Melhorar o carrosel de imagens
function stopSlideshow() {
  clearInterval(intervalId);
}

startSlideshow();

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
