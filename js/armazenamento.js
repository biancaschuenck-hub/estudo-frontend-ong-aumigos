/* =====================================================================
   MÓDULO: armazenamento.js
   Responsabilidade única: falar com o localStorage (o "back-end"
   provisório do projeto) e restaurar a lista de cadastros na tela.
   Não lida com formulários, eventos de clique ou roteamento.
   Usa a Day.js (global, carregada via CDN) só para formatar datas.
   ===================================================================== */

var CHAVE_STORAGE = 'ongAumigosCadastros';

// GET: lê a string salva (se existir) e converte de volta para array
export function carregarCadastrosStorage() {
    var bruto = localStorage.getItem(CHAVE_STORAGE);
    return bruto ? JSON.parse(bruto) : [];
}

// SET: acrescenta o novo cadastro ao array existente e regrava tudo
// como string via JSON.stringify()
export function salvarCadastro(dados) {
    var cadastros = carregarCadastrosStorage();
    cadastros.push(dados);
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(cadastros));
}

export function limparCadastrosStorage() {
    localStorage.removeItem(CHAVE_STORAGE);
}

// Restaura a interface: lê o array salvo e reconstrói os cartões na
// tela — é o que faz o histórico "voltar" ao recarregar a página
export function renderizarListaCadastros() {
    var lista = document.getElementById('lista-cadastros');
    if (!lista) return; // não estamos na rota de cadastro, nada a fazer

    var cadastros = carregarCadastrosStorage();

    if (cadastros.length === 0) {
        lista.innerHTML = '<p>Nenhum cadastro salvo neste navegador ainda.</p>';
        return;
    }

    lista.innerHTML = cadastros.map(function (c) {
        var dataFormatada = dayjs(c.dataCadastro).format('DD/MM/YYYY [às] HH:mm');
        var tempoRelativo = dayjs(c.dataCadastro).fromNow();
        return `
            <article class="card">
                <h3>${c.nome}</h3>
                <span class="badge badge-info">${c.email}</span>
                <p>Telefone: ${c.telefone || 'não informado'}</p>
                <p>Cadastrado em ${dataFormatada} (${tempoRelativo})</p>
            </article>
        `;
    }).join('');
}
