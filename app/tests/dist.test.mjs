import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

test('o artefato do Pages preserva SEO, resolve assets e fica abaixo de 400 KB gzip', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /name="description"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /rel="canonical"/);
  assert.doesNotMatch(html, /user-scalable=no|maximum-scale=1/);
  const business = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(business['@type'], 'LocalBusiness');
  assert.equal(business.email, 'novotempocafe@hotmail.com');
  for (const [, asset] of html.matchAll(/(?:src|href)="\/NovoTempoCafe-Corretora-de-cafe\/([^"#]+)"/g)) {
    assert.ok(existsSync(`dist/${asset}`), `Asset ausente: ${asset}`);
  }
  const files = readdirSync('dist', { recursive: true, withFileTypes: true })
    .filter(file => file.isFile() && !file.parentPath.replaceAll('\\', '/').includes('/images'));
  const sizes = files.map(file => ({ file: `${file.parentPath}/${file.name}`, gzip: gzipSync(readFileSync(`${file.parentPath}/${file.name}`)).length }));
  const total = sizes.reduce((sum, file) => sum + file.gzip, 0);
  console.log(JSON.stringify({ files: sizes, totalGzipBytes: total, totalGzipKB: total / 1000 }));
  assert.ok(total < 400_000, `${total} bytes gzip excede o limite`);
});
