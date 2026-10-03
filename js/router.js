/* =====================================================================
   MÓDULO: router.js
   Responsabilidade única: ler o hash da URL e decidir o que fica
   visível em #app. Depende de templates.js (o que renderizar),
   armazenamento.js (restaurar o histórico salvo) e menu.js (fechar
   o menu mobile após navegar) — mas não sabe nada sobre validação
   de formulário ou sobre COMO os eventos dentro da rota funcionam.
   ===================================================================== */

import { renderInicio, renderProjetos, renderCadastro } from './templates.js';
import { renderizarListaCadastros } from './armazenamento.js';
import { fecharMenuMobile } from './menu.js';

var ROUTES = {
    inicio: renderInicio,
    projetos: renderProjetos,
    cadastro: renderCadastro
};

export function router() {
    var hash = window.location.hash.replace('#', '') || 'inicio';
    var partes = hash.split('/');
    var rota = partes[0];
    var sub = partes[1];

    var render = ROUTES[rota] || ROUTES.inicio;
    if (!ROUTES[rota]) {
        rota = 'inicio';
    }

    var app = document.getElementById('app');
    app.innerHTML = '';          // limpa o conteúdo anterior
    app.innerHTML = render();    // injeta o novo fragmento no DOM

    renderizarListaCadastros();  // restaura o histórico salvo no localStorage, se existir nesta rota
    atualizarLinkAtivo(rota);
    fecharMenuMobile();

    if (sub) {
        var alvo = document.getElementById(sub);
        if (alvo) {
            alvo.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        window.scrollTo(0, 0);
    }
}

// Destaca visualmente o item de menu correspondente à rota ativa
function atualizarLinkAtivo(rota) {
    document.querySelectorAll('nav > ul > li > a').forEach(function (link) {
        var linkRota = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', linkRota === rota);
    });
}
