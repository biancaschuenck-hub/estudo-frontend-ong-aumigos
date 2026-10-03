import { defineConfig } from 'vite';

// index.html fica em html/, nao na raiz do projeto, entao apontamos
// a "root" do Vite para la. As imagens referenciadas estaticamente no
// HTML (ex: logotipo no header) sao detectadas e otimizadas automaticamente;
// as imagens referenciadas dinamicamente via string em templates.js
// (projetosData) nao sao analisadas pelo bundler, por isso ficam em
// html/public/imagens — o Vite copia esse conteudo para a build sem
// processar, preservando o caminho "/imagens/..." usado em tempo de execucao.
export default defineConfig({
  root: 'html',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
