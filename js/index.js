//ANCHOR - Função do carrossel de imagens
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
var currentIndex = 0;
var imageChangeInterval = 2000;
var imagens = document.querySelectorAll(".grid-item .imagens");

function updateImage(index) {
  currentIndex = (currentIndex + 1) % images.length;
  var nextImage = "images/imagensIndex/instagramPosts/" + images[currentIndex];
  imagens[index].src = nextImage;
}

function startSlideshow(index) {
  if (index >= imagens.length) {
    index = 0;
  }
  updateImage(index);
  setTimeout(function () {
    startSlideshow(index + 1);
  }, imageChangeInterval);
}

function stopSlideshow() {
  clearTimeout(timeoutId);
}

startSlideshow(0);


// ANCHOR - Biblioteca de suavização do Scroll (smooth-scroll@16.1.3)
const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 200
});

// ANCHOR - Função para bloquear o usuario para inspecionar a pagina
var message = "";
function clickIE() { if (document.all) { (message); return false; } }
function clickNS(e) {
  if
    (document.layers || (document.getElementById && !document.all)) {
    if (e.which == 2 || e.which == 3) { (message); return false; }
  }
}
if (document.layers) { document.captureEvents(Event.MOUSEDOWN); document.onmousedown = clickNS; }
else { document.onmouseup = clickNS; document.oncontextmenu = clickIE; }

document.oncontextmenu = new Function("return false")

// NOTE - F12
document.onkeypress = function (event) {
  if (e.ctrlKey &&
    (e.keyCode === 123)) {
    // alert('not allowed');
    return false;
  }
};

// NOTE - CTRL + u
document.onkeydown = function (e) {
  if (e.ctrlKey &&
    (e.keyCode === 85)) {
    // alert('not allowed');
    return false;
  }
};
