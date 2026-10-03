/* =====================================================================
   MÓDULO: menu.js
   Responsabilidade única: o menu de navegação fixo (hambúrguer no
   mobile + dropdown "Projetos"), que faz parte da casca da SPA e
   nunca é recriado pelo roteador. Depende só de templates.js, para
   não reescrever a lista de projetos que já existe lá.
   ===================================================================== */

import { projetosData } from './templates.js';

export function inicializarMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('nav ul');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    }

    var dropdownLink = document.querySelector('.has-dropdown > a');
    if (dropdownLink) {
        dropdownLink.addEventListener('click', function (event) {
            if (window.innerWidth <= 767) {
                event.preventDefault();
                dropdownLink.parentElement.classList.toggle('open');
            }
        });
    }

    popularDropdownProjetos();
}

// Reaproveita projetosData (de templates.js) para gerar os itens do
// submenu, evitando manter a mesma lista escrita duas vezes
function popularDropdownProjetos() {
    var dropdown = document.querySelector('.has-dropdown .dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = projetosData.map(function (projeto) {
        return `<li><a href="#projetos/${projeto.id}">${projeto.label}</a></li>`;
    }).join('');
}

export function fecharMenuMobile() {
    var menu = document.querySelector('nav ul');
    var toggle = document.querySelector('.menu-toggle');
    if (menu && menu.classList.contains('nav-open')) {
        menu.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
}
