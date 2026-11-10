// A galeria começa ao entrar na tela e prepara somente a próxima foto.
const imagens = document.querySelectorAll(".grid-item .imagens");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const descriptions = [
  "Material do curso de exportação da Novo Tempo Café",
  "Três participantes reunidos em um ambiente de trabalho",
  "Participantes em um estande de feira de café",
  "Grupo reunido ao ar livre em uma propriedade rural",
  "Utensílios para preparo de café em exposição",
  "Xícara de café com a marca Novo Tempo Café",
  "Frutos de café espalhados em um terreiro coberto",
  "Frutos de café vermelhos e verdes após a colheita",
  "Xícara da Novo Tempo Café ao lado de um livro aberto",
  "Participantes assistindo a uma apresentação em sala de aula",
  "Grupo reunido com a bandeira do Brasil em uma visita",
  "Dois participantes ao lado de uma lavoura de café",
  "Participantes na entrada da feira em Manizales",
  "Dois participantes apresentando pacotes de café",
  "Participantes em uma feira de café",
  "Grupo de visitantes reunido em uma feira",
  "Produtor segurando uma peneira com frutos de café",
  "Visita a um terreiro de secagem de café",
  "Dois participantes em um espaço dedicado a cafés especiais",
  "Dois participantes diante da bandeira do Brasil",
  "Três participantes reunidos em uma feira",
  "Dois visitantes em uma lavoura de café",
  "Grupo de participantes dentro de um ônibus",
  "Grupo de produtores em visita a Manizales, Caldas",
  "Participante diante do Expominas na Semana Internacional do Café",
  "Visitante na entrada do Expominas",
  "Três participantes reunidos em um evento de café",
  "Grupo reunido com uma xícara de café",
  "Três participantes com credenciais de um evento",
  "Grupo reunido em um estande de feira",
  "Grupo com a bandeira do Brasil em uma visita técnica",
  "Boné com a marca Novo Tempo Café",
  "Grupo reunido em uma cafeteria",
  "Dois participantes diante do Expominas",
  "Grupo com a bandeira do Brasil ao ar livre",
  "Dois participantes na Semana Internacional do Café",
  "Dois participantes reunidos em um evento",
  "Três participantes em um estande de feira",
  "Grupo com a bandeira do Brasil em uma feira de café"
];
let currentIndex = 0;
let slot = 0;
let nextImage;
let ready = false;

function preloadNext() {
  ready = false;
  nextImage = new Image();
  nextImage.onload = () => { ready = true; };
  nextImage.onerror = () => {
    currentIndex = (currentIndex + 1) % descriptions.length;
    nextImage = null;
  };
  nextImage.src = `images/imagensIndex/instagramPosts/foto${currentIndex + 1}.webp`;
}

function tick() {
  if (reducedMotion.matches) return;
  if (!document.hidden) {
    if (ready) {
      imagens[slot].src = nextImage.src;
      imagens[slot].alt = descriptions[currentIndex];
      slot = (slot + 1) % imagens.length;
      currentIndex = (currentIndex + 1) % descriptions.length;
      preloadNext();
    } else if (!nextImage) {
      preloadNext();
    }
  }
  setTimeout(tick, 2000);
}

if (imagens.length && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      preloadNext();
      setTimeout(tick, 2000);
    }
  });
  observer.observe(imagens[0]);
}
