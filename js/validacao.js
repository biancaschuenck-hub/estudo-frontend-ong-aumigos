/* =====================================================================
   MÓDULO: validacao.js
   Responsabilidade única: regras de consistência do formulário e a
   manipulação do DOM que reflete visualmente o resultado. Não sabe
   nada sobre localStorage, roteamento ou o que acontece depois que um
   campo é válido — só valida e sinaliza. Usa a Day.js (global) só
   para calcular a idade a partir da data de nascimento.
   ===================================================================== */

var regrasValidacao = {
    nome: {
        obrigatorio: true,
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(\s[A-Za-zÀ-ÖØ-öø-ÿ]{2,})+$/,
        mensagem: "Informe nome e sobrenome, apenas letras."
    },
    email: {
        obrigatorio: true,
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mensagem: "Informe um e-mail válido (ex: nome@dominio.com)."
    },
    telefone: {
        obrigatorio: false,
        regex: /^\d{2}-\d{5}-\d{4}$/,
        mensagem: "Use o formato 99-91234-5678."
    },
    idade: {
        obrigatorio: false,
        min: 18,
        max: 120,
        mensagem: "A idade deve estar entre 18 e 120 anos."
    },
    nascimento: {
        obrigatorio: false,
        mensagem: "A data de nascimento não pode ser no futuro."
    }
};

// Manipulação condicional do DOM: alterna as classes de estilo do
// campo e injeta/remove a mensagem de erro no <span> correspondente
export function aplicarResultadoNoDOM(input, valido, mensagem) {
    var msgEl = document.getElementById('msg-' + input.id);

    input.classList.remove('campo-valido', 'campo-invalido');
    if (msgEl) {
        msgEl.textContent = '';
        msgEl.classList.remove('visible');
    }

    if (valido === null) return; // campo opcional vazio: sem marcação

    if (valido) {
        input.classList.add('campo-valido');
    } else {
        input.classList.add('campo-invalido');
        if (msgEl) {
            msgEl.textContent = mensagem;
            msgEl.classList.add('visible');
        }
    }
}

// Avalia UM campo contra sua regra e devolve true/false, já
// manipulando o DOM (classe do input + texto da mensagem de erro)
export function validarCampo(input) {
    var regra = regrasValidacao[input.name];
    if (!regra) return true;

    var valor = input.value.trim();
    var valido = true;
    var mensagem = "";

    if (regra.obrigatorio && valor === "") {
        valido = false;
        mensagem = "Este campo é obrigatório.";
    } else if (valor !== "" && regra.regex && !regra.regex.test(valor)) {
        valido = false;
        mensagem = regra.mensagem;
    } else if (valor !== "" && regra.min !== undefined && Number(valor) < regra.min) {
        valido = false;
        mensagem = regra.mensagem;
    } else if (valor !== "" && regra.max !== undefined && Number(valor) > regra.max) {
        valido = false;
        mensagem = regra.mensagem;
    } else if (input.name === "nascimento" && valor !== "") {
        var dataNascimento = dayjs(valor);
        if (dataNascimento.isAfter(dayjs())) {
            valido = false;
            mensagem = "A data de nascimento não pode ser no futuro.";
        } else if (dayjs().diff(dataNascimento, 'year') < 18) {
            valido = false;
            mensagem = "É necessário ter 18 anos ou mais para se cadastrar.";
        }
    }

    var opcionalVazio = !regra.obrigatorio && valor === "";

    aplicarResultadoNoDOM(input, opcionalVazio ? null : valido, mensagem);
    return opcionalVazio ? true : valido;
}
