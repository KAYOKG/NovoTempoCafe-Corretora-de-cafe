const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function page(reduced = false) {
  const timers = [];
  const preloads = [];
  const listeners = {};
  const images = Array.from({length: 8}, () => ({src: 'initial.webp', alt: ''}));
  const context = {
    SmoothScroll: function () {},
    document: {
      readyState: 'loading', hidden: false,
      querySelectorAll: () => images,
      addEventListener: (name, fn) => { listeners[name] = fn; },
    },
    window: {matchMedia: () => ({matches: reduced})},
    Image: function () { preloads.push(this); },
    IntersectionObserver: class {
      constructor(fn) { this.fn = fn; }
      observe(target) { this.fn([{isIntersecting: true, target}]); }
      disconnect() {}
    },
    setTimeout: (fn, delay) => { timers.push({fn, delay}); return timers.length; },
    clearTimeout() {},
  };
  vm.runInNewContext(fs.readFileSync('js/index.js', 'utf8'), context);
  return {timers, preloads, listeners, images};
}

const p = page();
assert.equal(p.preloads.length, 1, 'Precarregar somente a próxima foto');
assert.equal(p.images[0].src, 'initial.webp', 'Não trocar fotos antes de carregar a próxima');
assert.equal(p.timers[0].delay, 2000);
p.timers.shift().fn();
assert.equal(p.images[0].src, 'initial.webp', 'Rede lenta mantém a imagem atual');
p.preloads[0].onload();
p.timers.shift().fn();
assert.match(p.images[0].src, /foto1\.webp$/);
assert.equal(p.images[0].alt, 'Material do curso de exportação da Novo Tempo Café');
assert.equal(p.preloads.length, 2, 'Preparar somente uma nova foto por troca');
assert.equal(page(true).preloads.length, 0, 'Movimento reduzido mantém galeria estática');
console.log('Carrossel: próxima foto, rede lenta e movimento reduzido OK');
