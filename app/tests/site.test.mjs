import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

test('a página preserva conteúdo, destinos e imagens da Novo Tempo', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.tsx');
    const html = renderToStaticMarkup(createElement(App));
    for (const id of ['inicio', 'servicos', 'quem-somos', 'diretores', 'galeria', 'perguntas', 'contato']) {
      assert.ok(html.includes(`id="${id}"`), `Região ausente: ${id}`);
    }
    for (const text of ['Giovani Gomes', 'Bruno Sathler', 'II Coríntios 5:17', 'março e abril', 'novotempocafe@hotmail.com', 'Av. Felipe Nacif, 34']) {
      assert.ok(html.includes(text), `Conteúdo ausente: ${text}`);
    }
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/aria-expanded=/g) || []).length, 4);
    assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 8);
    assert.ok(html.includes('https://wa.me/553333314530'));
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /alt="[^"]+"/);
      const src = image[0].match(/src="([^"]+)"/)[1];
      assert.ok(existsSync(`public/${src.replace(/^.*?images\//, 'images/')}`), src);
    }
  } finally {
    await server.close();
  }
});
