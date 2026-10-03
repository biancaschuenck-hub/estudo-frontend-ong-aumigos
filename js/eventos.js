/* =====================================================================
   MÓDULO: eventos.js
   Responsabilidade única: ligar os eventos de interação do usuário
   (clique, input, submit, tecla Esc) à lógica correspondente, usando
   delegação no contêiner #app. Depende de validacao.js (para checar
   os campos) e armazenamento.js (para persistir/limpar cadastros) —
   mas nenhum desses módulos depende de eventos.js de volta.
   ===================================================================== */

import { validarCampo, aplicarResultadoNoDOM } from './validacao.js';
import { salvarCadastro, limparCadastrosStorage, renderizarListaCadastros } from './armazenamento.js';

// Guarda qual elemento tinha o foco antes de abrir o modal, para devolver
// o foco a ele quando o modal fechar (requisito de navegação por teclado:
// sem isso, o foco "se perde" em algum lugar da página depois de fechar)
var elementoQueAbriuModal = null;

var SELETOR_FOCAVEL = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function abrirModal(detailsBtn) {
    var modalTitle = document.getElementById('modal-title');
    var modalText = document.getElementById('modal-text');
    var modalOverlay = document.getElementById('modal-overlay');
    if (!modalTitle || !modalText || !modalOverlay) return;

    elementoQueAbriuModal = detailsBtn;
    modalTitle.textContent = detailsBtn.dataset.title;
    modalText.textContent = detailsBtn.dataset.text;
    modalOverlay.classList.add('open');

    // Move o foco para dentro do modal. Sem isso, um usuário de teclado
    // que abre o modal com Enter continua com o foco "preso" no botão
    // que está agora escondido atrás da sobreposição, e o Tab seguinte
    // não leva a lugar nenhum dentro do diálogo recém-aberto.
    var fechar = document.getElementById('modal-close');
    if (fechar) fechar.focus();
}

function fecharModal() {
    var modalOverlay = document.getElementById('modal-overlay');
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');

    // Devolve o foco para o botão "Ver detalhes" que abriu o modal,
    // em vez de deixar o usuário de teclado "perdido" na página
    if (elementoQueAbriuModal) {
        elementoQueAbriuModal.focus();
        elementoQueAbriuModal = null;
    }
}

export function configurarDelegacaoDeEventos() {
    var app = document.getElementById('app');

    // Validação em tempo real: reage a cada tecla digitada em um
    // campo do formulário de cadastro
    app.addEventListener('input', function (event) {
        if (event.target.matches('#form-cadastro input')) {
            validarCampo(event.target);
        }
    });

    app.addEventListener('click', function (event) {
        // Clique em "Ver detalhes" de QUALQUER cartão de projeto,
        // mesmo os gerados depois deste listener existir
        var detailsBtn = event.target.closest('.card-details-btn');
        if (detailsBtn && detailsBtn.id !== 'limpar-cadastros') {
            abrirModal(detailsBtn);
            return;
        }

        // Clique no X de fechar o modal
        if (event.target.closest('#modal-close')) {
            fecharModal();
            return;
        }

        // Clique fora da caixa do modal (na própria sobreposição escura)
        if (event.target.id === 'modal-overlay') {
            fecharModal();
            return;
        }

        // Botão "Limpar histórico" do localStorage
        if (event.target.closest('#limpar-cadastros')) {
            limparCadastrosStorage();
            renderizarListaCadastros();
        }
    });

    // Submissão do formulário de cadastro — delegada da mesma forma
    app.addEventListener('submit', function (event) {
        var form = event.target.closest('#form-cadastro');
        if (!form) return;

        event.preventDefault(); // bloqueia o recarregamento padrão do navegador

        var campos = form.querySelectorAll('input');
        var formularioValido = true;

        campos.forEach(function (campo) {
            if (!validarCampo(campo)) {
                formularioValido = false;
            }
        });

        if (!formularioValido) {
            var primeiroInvalido = form.querySelector('.campo-invalido');
            if (primeiroInvalido) primeiroInvalido.focus();
            return; // interrompe o envio até os dados ficarem consistentes
        }

        var dados = {
            nome: form.nome.value.trim(),
            email: form.email.value.trim(),
            telefone: form.telefone.value.trim(),
            nascimento: form.nascimento.value,
            idade: form.idade.value,
            dataCadastro: new Date().toISOString()
        };

        var toast = document.getElementById('toast');

        // O localStorage pode falhar (modo anônimo com restrições, cota
        // esgotada, navegador bloqueando o acesso). Sem esse try/catch,
        // uma falha aqui interrompia a função inteira silenciosamente:
        // nada era avisado ao usuário e o restante do código (toast,
        // reset do formulário) nunca era executado.
        try {
            salvarCadastro(dados);
        } catch (erro) {
            console.error('Falha ao salvar cadastro no localStorage:', erro);
            if (toast) {
                toast.textContent = 'Não foi possível salvar seu cadastro neste navegador. Tente novamente.';
                toast.classList.add('show', 'toast-erro');
                setTimeout(function () {
                    toast.classList.remove('show', 'toast-erro');
                    toast.textContent = 'Cadastro enviado com sucesso!';
                }, 4000);
            }
            return; // mantém os dados digitados no formulário, sem resetar
        }

        renderizarListaCadastros();

        if (toast) {
            toast.classList.add('show');
            setTimeout(function () {
                toast.classList.remove('show');
            }, 3000);
        }

        form.reset();
        campos.forEach(function (campo) {
            aplicarResultadoNoDOM(campo, null, '');
        });
    });
}

// Fecha o modal com a tecla Esc e retém o foco (Tab/Shift+Tab) dentro
// dele enquanto estiver aberto — sem isso, o Tab escapava para o resto
// da página "por trás" da sobreposição, confundindo quem navega só
// pelo teclado ou usa leitor de tela
export function configurarAtalhosTeclado() {
    document.addEventListener('keydown', function (event) {
        var modalOverlay = document.getElementById('modal-overlay');
        var modalAberto = modalOverlay && modalOverlay.classList.contains('open');

        if (event.key === 'Escape' && modalAberto) {
            fecharModal();
            return;
        }

        if (event.key === 'Tab' && modalAberto) {
            var modal = modalOverlay.querySelector('.modal');
            var focaveis = modal.querySelectorAll(SELETOR_FOCAVEL);
            if (focaveis.length === 0) return;

            var primeiro = focaveis[0];
            var ultimo = focaveis[focaveis.length - 1];

            if (event.shiftKey && document.activeElement === primeiro) {
                event.preventDefault();
                ultimo.focus();
            } else if (!event.shiftKey && document.activeElement === ultimo) {
                event.preventDefault();
                primeiro.focus();
            }
        }
    });
}
