# Novo Tempo Café

Site institucional em React 19, TypeScript, Vite e Astryx. A direção aprovada está em `../DIRECAO.md`.

- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Conteúdo e imagens: `npm test`
- SEO, assets e orçamento de 400 KB gzip: `npm run check:dist` (após o build)
- Preview: `npm run preview`

O workflow `../.github/workflows/pages.yml` publica `app/dist` no GitHub Pages em push na `main`. O caminho base é `/NovoTempoCafe-Corretora-de-cafe/`.

O tema fica em `src/themes/novo-tempo/novoTempoTheme.ts`. Após alterá-lo, rode `npx astryx theme build src/themes/novo-tempo/novoTempoTheme.ts`. Fontes Google e mapa precisam de conexão no navegador; as fotos são locais.
