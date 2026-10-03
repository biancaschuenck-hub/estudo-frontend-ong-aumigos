/* =====================================================================
   MÓDULO: app.js — ponto de entrada da aplicação
   Único responsável por IMPORTAR os demais módulos e orquestrar a
   ordem de inicialização. É o único arquivo referenciado diretamente
   pelo HTML (<script type="module" src="app.js">) — o navegador
   resolve o resto da árvore de imports sozinho.
   ===================================================================== */

import { router } from './router.js';
import { inicializarMenu } from './menu.js';
import { configurarDelegacaoDeEventos, configurarAtalhosTeclado } from './eventos.js';

// Configuração da biblioteca externa Day.js (carregada globalmente via
// <script> comum no HTML, antes deste módulo — por isso "dayjs" e
// "dayjs_plugin_relativeTime" já existem aqui, mesmo sem import/export,
// pois módulos ES6 ainda enxergam os globais do window)
//
// Se o CDN do Day.js falhar (sem internet, CDN fora do ar, bloqueio de
// rede), "dayjs" nunca chega a existir. Sem essa checagem, a linha
// abaixo lançava um erro não tratado logo no início do arquivo e
// interrompia TUDO: nenhuma rota, nenhum evento e nenhum menu chegava
// a ser inicializado, resultando numa página em branco sem explicação.
if (typeof dayjs === 'undefined') {
    window.addEventListener('DOMContentLoaded', function () {
        var app = document.getElementById('app');
        if (app) {
            app.innerHTML = '<div class="alert alert-warning" role="alert">' +
                '<strong>Não foi possível carregar um recurso externo necessário.</strong> ' +
                'Verifique sua conexão com a internet e recarregue a página.' +
                '</div>';
        }
    });
} else {
    dayjs.extend(dayjs_plugin_relativeTime);
    dayjs.locale('pt-br');

    window.addEventListener('hashchange', router);

    window.addEventListener('DOMContentLoaded', function () {
        configurarDelegacaoDeEventos();
        configurarAtalhosTeclado();
        inicializarMenu();
        router(); // renderiza a rota inicial
    });
}
