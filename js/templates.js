/* =====================================================================
   MÓDULO: templates.js
   Responsabilidade única: dados e "moldes" de HTML de cada rota.
   Não sabe nada sobre roteamento, eventos, validação ou localStorage.
   ===================================================================== */

export var projetosData = [
    {
        id: "projeto1",
        label: "Projeto 1",
        titulo: "Feira de adoção em Maricá",
        descricao: "A feira de adoção em maricá aconteceu em Agosto de 2026 no estacionamento do Boulevard de Maricá e ocoreu 20 adoções responsáveis.",
        imagem: "/imagens/foto_ação_humanitaria.jpg",
        alt: "foto de ação humanitário de um filhote de cachorro.",
        status: "Concluído",
        largura: 547,
        altura: 365
    },
    {
        id: "projeto2",
        label: "Projeto 2",
        titulo: "Feira de adoção em Niterói",
        descricao: "A feira de adoção em Niterói aconteceu em Setembro de 2026 no parque principal e resultou em 15 adoções responsáveis.",
        imagem: "/imagens/foto_projeto2.jpg",
        alt: "Casal sorridente deitado na grama de um parque, ao lado de um cão da raça golden retriever, durante um piquenique.",
        status: "Concluído",
        largura: 700,
        altura: 392
    },
    {
        id: "projeto3",
        label: "Projeto 3",
        titulo: "Feira de adoção em São Gonçalo",
        descricao: "A feira de adoção em São Gonçalo aconteceu em Outubro de 2026 no centro comercial e resultou em 12 adoções responsáveis.",
        imagem: "/imagens/foto_projeto3.jpg",
        alt: "Casal sorridente tirando uma selfie enquanto segura um cão poodle de porte pequeno.",
        status: "Concluído",
        largura: 700,
        altura: 467
    },
    {
        id: "projeto4",
        label: "Projeto 4",
        titulo: "Feira de adoção em Duque de Caxias",
        descricao: "A feira de adoção em Duque de Caxias aconteceu em Novembro de 2026 no shopping center e resultou em 18 adoções responsáveis.",
        imagem: "/imagens/foto_projeto4.jpg",
        alt: "Casal de idosos sorrindo enquanto acolhe um gato de pelagem longa e alaranjada nos braços.",
        status: "Concluído",
        largura: 700,
        altura: 467
    }
];

// Privada ao módulo: só quem está dentro deste arquivo usa criarCardProjeto()
function criarCardProjeto(projeto) {
    // WebP é o formato primário (menor peso); o navegador só recorre ao
    // JPEG original se não souber decodificar WebP (ex: navegadores bem
    // antigos) — <picture> faz essa escolha sozinho, sem JavaScript extra.
    var imagemWebp = projeto.imagem.replace(/\.jpe?g$/i, '.webp');

    return `
        <article class="card" id="${projeto.id}">
            <h2>${projeto.titulo}</h2>
            <span class="badge badge-success">${projeto.status}</span>
            <p>${projeto.descricao}</p>
            <picture>
                <source srcset="${imagemWebp}" type="image/webp">
                <img src="${projeto.imagem}" alt="${projeto.alt}" loading="lazy" width="${projeto.largura}" height="${projeto.altura}">
            </picture>
            <button class="card-details-btn" data-title="${projeto.titulo}" data-text="${projeto.descricao}">Ver detalhes</button>
        </article>
    `;
}

export function renderInicio() {
    return `
        <div class="alert alert-info" role="status">
            <strong>Aviso:</strong> Estamos com inscrições abertas para novos voluntários. Cadastre-se na página de <a href="#cadastro">Cadastro</a>!
        </div>

        <h2>Ong Aumigos - organização sem fins lucrativos.</h2>
        <p>A Ong Aumigos é uma organização sem fins lucrativos situada no estado do Rio de Janeiro que vem ajudar os animais perdidos e abandonados.</p>
    `;
}

export function renderProjetos() {
    var cardsHtml = projetosData.map(criarCardProjeto).join('');

    return `
        <div class="container">
            ${cardsHtml}
        </div>

        <div class="modal-overlay" id="modal-overlay">
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button class="modal-close" id="modal-close" aria-label="Fechar">&times;</button>
                <h2 id="modal-title"></h2>
                <p id="modal-text"></p>
            </div>
        </div>
    `;
}

export function renderCadastro() {
    return `
        <form id="form-cadastro" novalidate>
        <h2>Cadastre-se aqui!</h2>
        <p>Cadastro para doação e voluntariado.</p>
        <fieldset>
        <legend>Informações Pessoais</legend>

        <label for="nome">Nome Completo:</label>
        <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" required>
        <span class="field-message" id="msg-nome"></span>

        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" placeholder="seuemail@exemplo.com" required>
        <span class="field-message" id="msg-email"></span>

        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" name="telefone" placeholder="11-91234-5678"
               pattern="[0-9]{2}-[0-9]{5}-[0-9]{4}">
        <span class="field-message" id="msg-telefone"></span>

        <label for="nascimento">Data de Nascimento:</label>
        <input type="date" id="nascimento" name="nascimento">
        <span class="field-message" id="msg-nascimento"></span>

        <label for="idade">Idade:</label>
        <input type="number" id="idade" name="idade"
               min="18" max="120">
        <span class="field-message" id="msg-idade"></span>
        </fieldset>
        <button type="submit">Enviar</button>
        </form>

        <div class="toast" id="toast" role="status">Cadastro enviado com sucesso!</div>

        <h2>Cadastros realizados neste navegador</h2>
        <button type="button" class="card-details-btn" id="limpar-cadastros">Limpar histórico</button>
        <div class="container" id="lista-cadastros"></div>
    `;
}
