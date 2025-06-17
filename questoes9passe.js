// Variáveis globais
const audioAcerto = new Audio('success-sound.mp3');
let confettiActive = false;

const gabarito = {
    matematica: ["a", "a", "c", "d", "c", "d", "b", "b"],
    ciencias: ["a", "b", "c", "d", "a", "b", "c", "d"],
    historia: ["b", "c", "d", "a", "c", "d", "b", "a"],
    portugues: ["c", "d", "a", "b", "c", "d", "a", "b"]
};

// Elementos DOM
const provaContainer = document.getElementById("provaContainer");
const questaoAtual = document.getElementById("questaoAtual");
const provaTitulo = document.getElementById("provaTitulo");
const btnAnterior = document.getElementById("btnAnterior");
const btnProxima = document.getElementById("btnProxima");
const btnFinalizar = document.getElementById("btnFinalizar");
const questaoAtualNum = document.getElementById("questaoAtualNum");
const totalQuestoes = document.getElementById("totalQuestoes");
const resultadoContainer = document.getElementById("resultadoContainer");
const questaoContainer = document.querySelector(".questao-container");
const navegacao = document.querySelector(".navegacao");
const acertosTotal = document.getElementById("acertosTotal");
const totalQuestoesResultado = document.getElementById("totalQuestoesResultado");
const resultadoDetalhes = document.getElementById("resultadoDetalhes");

// Variáveis de estado
let questoesAtuais = [];
let indiceQuestao = 0;
let materiaAtual = '';
let respostas = {};

// Banco de questões
const materias = {
    matematica: [
        {
            pergunta: "Dois triângulos são semelhantes. O menor triângulo tem lados de 3 cm, 4 cm e 5 cm. O maior triângulo é uma ampliação com razão 2. Quais são os lados do triângulo maior?",
            imagem: "semelhanca-triangulos-sem.png",
            alternativas: [
                "6 cm, 8 cm e 10 cm", 
                "225 cm, 6 cm e 8 cm", 
                "9 cm, 12 cm e 15 cm", 
                "2 cm, 4 cm e 6 cm"
            ]
        },
        {
            pergunta: "Uma sacola tem 3 bolas vermelhas e 2 bolas azuis. Qual a probabilidade de tirar uma bola vermelha?",
            alternativas: ["3/5", "1/3", "2/3", "4/5"]
        },
        {
            pergunta: "Qual a raiz quadrada de 9?",
            alternativas: ["90", "81", "3", "1"]
        },
        {
            pergunta: "Quanto é 11 elevado ao quadrado?",
            alternativas: ["110", "91", "100", "121"]
        },
        {
            pergunta: "Se um triângulo menor tem lados 3 cm, 4 cm e 5 cm, e outro triângulo semelhante tem lado maior de 15 cm, qual é a razão de semelhança?",
            alternativas: ["1", "4", "3", "2"]
        },
        {
            pergunta: "Em um pote tem 5 bolachas de chocolate, 3 bolachas de leite e 2 bolachas de morango, Qual a chance de pegar uma bolacha que não é de morango?",
            alternativas: ["5/10", "2/10", "6/10", "8/10"]
        },
        {
            pergunta: "Descubra o Valor de X em: x + 4 = 7",
            alternativas: ["1", "4", "3", "7"]
        },
        {
            pergunta: "Se X=3, Descubra o resultado da equação: 2x + 10 = ?",
            alternativas: ["14", "16", "12", "121"]
        }
    ],
    ciencias: [
        {
            pergunta: "O que foi um dos motivos que causou a Primeira Guerra Mundial?",
            alternativas: [
                "A criação de alianças entre países",
                "O crescimento dos países europeus",
                "O assassinato do arquiduque austríaco",
                "A construção do Muro de Berlim"
            ]
        },
        {
            pergunta: "O que deu início à Segunda Guerra Mundial?",
            alternativas: [
                "A criação da ONU",
                "A independência dos EUA",
                "A invasão da Polônia pela Alemanha",
                "A construção do Muro de Berlim"
            ]
        },
        {
            pergunta: "Qual dos acontecimentos seguintes não teve relação com a Guerra Fria?",
            alternativas: [
                "Guerra Civil Espanhola",
                "Guerra da Coreia",
                "Revolução Cubana",
                "Guerra do Afeganistão"
            ]
        },
        {
            pergunta: "Durante a Guerra Fria, qual país recebeu intervenção dos EUA que NÃO resultou em violência?",
            alternativas: [
                "Afeganistão",
                "Coreia do Sul",
                "Vietnã",
                "Alemanha Ocidental"
            ]
        }, 
        {   
            pergunta: "Selecione a alternativa que apresenta uma fase da Primeira Guerra Mundial.",
            imagem: "Foto1aGuerra.png",
            alternativas: [
                "Guerra de Trincheiras",
                "Corrida Nuclear",
                "Guerra-relâmpago",
                "Derrota do Eixo"
            ]
        },
        {
            pergunta: "O ataque a ______ ocorreu em 7 de dezembro de 1941, quando o Japão bombardeou uma base naval dos ___  no Havaí. O ataque surpresa matou cerca de 2.400 pessoas e destruiu navios e aviões americanos. Como consequência, os EUA entraram na ________ complete com as palavras faltando",
            imagem: "FotoPearlHarbor.png",
            alternativas: [
                "Berlin, Alemanha, Guerra Fria",
                "Pearl Harbor, EUA, Segunda Guerra Mundial",
                "A invasão da Polônia pela AlemanhaPearl Harbor, alemães, Segunda Guerra Mundial",
                "America, EUA, Primeira Guerra Mundial"
            ]
        },
        {
            pergunta: "Dentre os conflitos que ocorreram por conta da disputa ideológica durante a Guerra Fria podemos citar:",
            imagem: "ChargeHumanas.png",
            alternativas: [
                "Revolução Francesa",
                "Revolução Cubana",
                "Guerra Russo-Japonesa",
                "Guerra Hispano-Americana"
            ]
        },
        {
            pergunta: "Leia o excerto abaixo e assinale a alternativa que preencha corretamente a lacuna. Um exemplo de bloco econômico é o _________________________, criado a partir do Tratado de Assunção e assinado em 1991 entre Paraguai, Argentina, Uruguai e Brasil.",
            alternativas: [
                "Mercado Comum do Sul (Mercosul)",
                "Mercado Comum da América Latina (Mercoal)",
                "Acordo de Livre Comércio da América do Norte (Nafta)",
                "Organização das Nações Unidas (ONU)"
            ]
        }
    ],
    portugues: [
        {
            pergunta: "O verbo é uma classe de palavras que ditam ações, com base nisso, leia a frase: Ana pinta um desenho. Qual é o verbo da frase?",
            alternativas: ["Ana", "Desenho", "Pinta", "Um"]
        },
        {
            pergunta: "O verbo é uma classe de palavras que ditam ações, com base nisso, leia a frase: Lucas chutou uma bola ontem. Qual palavra mostra a ação?",
            alternativas: ["Lucas", "Bola", "A", "Chutou"]
        },
        {
            pergunta: "O sujeito é quem faz uma ação, e o adjetivo é uma palavra que descreve o sujeito, com base nisso, leia a frase: O cachorro pequeno corre no quintal. Qual o sujeito e o adjetivo da frase?",
            alternativas: [
                "Cachorro e Pequeno",
                "Cachorro e Quintal",
                "Pequeno e Quintal",
                "Quintal e Pequeno"
            ]
        },
        {
            pergunta: "O sujeito é quem faz uma ação, e o adjetivo é uma palavra que descreve o sujeito, com base nisso, leia a frase: A menina alegre canta uma música. Qual o sujeito e o adjetivo da frase?",
            alternativas: [
                "Música e Alegre",
                "Menina e Alegre",
                "Menina e Música",
                "Alegre e Menina"
            ]
        }, 
        {   
            pergunta: "Leia o exemplo com atenção: O cachorro está debaixo da cadeira. A palavra 'debaixo' mostra a posição do cachorro. Essa palavra é chamada de preposição. Agora complete a frase: O caderno está ______ mochila.",
            alternativas: ["Para", "Com", "Na", "De"]
        },
        {
            pergunta: "I. Ele é especialista _____ comunicação e marketing. II. Comprei a passagem de ônibus _____ 20 reais. III. Estamos _____ 5 km de Manaus. As preposições que preenchem corretamente as lacunas são:",
            alternativas: [
                "em, por, a",
                "de, por, há",
                "de, a, em",
                "em, a, desde"
            ]
        },
        {
            pergunta: "Lucas queria brincar, mas começou a chover. A palavra 'mas' junta duas ideias diferentes: Essa palavrinha é chamada de conjunção. Agora complete a frase: Ana estava com sono, ______ continuou estudando.",
            alternativas: ["E", "Porém", "Porque", "Ou"]
        },
        {
            pergunta: "Pedro precisa escolher um lápis ou uma borracha. A palavra 'uma' junta duas coisas parecidas. Essa palavrinha é uma conjunção. Agora complete a frase: Joana gosta de maçã ______ banana.",
            alternativas: ["Também", "Mas", "Porque", "E"]
        }
    ],
    historia: [
        {
            pergunta: "Leia o período abaixo: O planeta __________ é conhecido pelos seus anéis, grandes estruturas cósmicas, formadas por fragmentos de gelo e rocha. Qual o nome do planeta que completa corretamente a frase acima?",
            alternativas: ["Saturno", "Júpiter", "Marte", "Vênus"]
        },
        {
            pergunta: "O movimento terrestre que a Terra realiza em torno do Sol e que dura aproximadamente um ano civil é chamado de:",
            alternativas: ["Transição", "Translação", "Precessão", "Rotação"]
        },
        {
            pergunta: "Qual cientista propôs o primeiro modelo atômico que ficou conhecido como 'bola de bilhar'?",
            alternativas: ["Isaac Newton", "Demócrito", "John Dalton", "Ernest Rutherford"]
        },
        {
            pergunta: "Classifique as afirmações abaixo sobre os modelos como Verdadeira (V) ou Falsa (F), e escolha a alternativa correta. I. O Modelo Atômico de Rutherford sugere que o átomo se assemelha a um pequeno sistema planetário. II. O Modelo Atômico de Bohr ficou conhecido como 'modelo pudim de ameixa' ou 'pudim com passas' em decorrência da forma que as cargas positivas e negativas são organizadas. III. No Modelo Atômico de Dalton, o núcleo é formado pelos prótons e nêutrons e os elétrons orbitam ao seu redor da mesma forma que os planetas giram em torno do Sol.",
            imagem: "ModelosAtomicos.png",
            alternativas: ["V, V, V,", "F, V, F", "F, F, F", "V, F, F"]
        }, 
        {   
            pergunta: "Considerando que cristas são os pontos mais altos da onda e vales os pontos mais baixos da onda, analise a onda representada abaixo, e assinale a alternativa correta sobre o número de cristas e vales",
            imagem: "CristaVale.png",
            alternativas: ["5 e 6", "6 e 10", "10 e 5", "6 e 5"]
        },
        {
            pergunta: "O neodarwinismo explica a evolução através da seleção natural, mas também leva em conta a variabilidade genética, as mutações e a seleção natural, fatores que contribuem para a diversidade dentro de uma população. Assinale a alternativa que NÃO contém um mecanismo de evolução biológica segundo a teoria do neodarwinismo.",
            alternativas: ["Mutação", "Deriva genética", "Mimetismo", "Seleção natural"]
        },
        {
            pergunta: "João tem olhos castanhos. O pai dele também tem olhos castanhos, mas a mãe tem olhos azuis. A cor dos olhos é passada dos pais para os filhos por meio dos genes, que são como 'instruções' que o corpo segue. O que são os genes?",
            alternativas: [
                "São células do corpo que ajudam a digerir a comida.",
                "São instruções dentro do corpo que definem características como cor dos olhos ou do cabelo.",
                "São células que causam doenças.",
                "São alimentos que precisamos comer para nos desenvolvermos"
            ]
        },
        {
            pergunta: "Maria tem cabelo cacheado, assim como sua avó. Mesmo que a mãe de Maria tenha cabelo liso, Maria herdou o tipo de cabelo da avó. Isso acontece porque algumas características podem 'pular' uma geração e aparecer nos netos. O que significa herdar uma característica na genética?",
            alternativas: [
                "É quando uma característica do corpo é passada dos pais ou avós para os filhos.",
                "É quando temos a mesma característica que nossos amigos.",
                "É quando recebemos algo de outra pessoa sem querer.",
                "É quando mudamos nosso corpo com exercícios."
            ]
        }
    ]
};

// ========== SISTEMA DE LOCALSTORAGE ========== //
function salvarResultado(materia, acertos, totalQuestoes) {
    try {
        const resultados = JSON.parse(localStorage.getItem('quizResults')) || {};
        
        resultados[materia] = {
            acertos,
            totalQuestoes,
            data: new Date().toISOString(),
            porcentagem: Math.round((acertos / totalQuestoes) * 100)
        };
        
        localStorage.setItem('quizResults', JSON.stringify(resultados));
        console.log('Resultado salvo com sucesso:', resultados);
    } catch (error) {
        console.error('Erro ao salvar resultado:', error);
    }
}

function carregarHistorico() {
    try {
        return JSON.parse(localStorage.getItem('quizResults')) || {};
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        return {};
    }
}

function limparHistorico() {
    if (confirm('Tem certeza que deseja limpar todo seu histórico de resultados?')) {
        localStorage.removeItem('quizResults');
        alert('Histórico limpo com sucesso!');
        
        if (resultadoContainer.style.display === "block") {
            mostrarHistorico();
        }
    }
}

function mostrarHistorico() {
    const historico = carregarHistorico();
    let html = '<div class="historico-container"><h3>📊 Seu Histórico</h3>';
    
    if (Object.keys(historico).length === 0) {
        html += '<p>Nenhum resultado salvo ainda.</p>';
    } else {
        html += '<ul class="lista-historico">';
        
        for (const [materia, resultado] of Object.entries(historico)) {
            const data = new Date(resultado.data).toLocaleDateString();
            html += `
                <li>
                    <strong>${materia.toUpperCase()}</strong>
                    <div class="progresso">
                        <div class="barra-progresso" style="width: ${resultado.porcentagem}%"></div>
                        <span>${resultado.acertos}/${resultado.totalQuestoes} (${resultado.porcentagem}%)</span>
                    </div>
                    <small>${data}</small>
                </li>
            `;
        }
        
        html += '</ul>';
    }
    
    html += '<button onclick="limparHistorico()" class="btn-limpar">Limpar Histórico</button></div>';
    resultadoDetalhes.innerHTML = html;
}

// ========== FUNÇÕES PRINCIPAIS ========== //
function selecionarMateria(materia, titulo) {
    materiaAtual = materia;
    questoesAtuais = materias[materia];
    indiceQuestao = 0;
    respostas = {};
    
    provaTitulo.textContent = `Prova de ${titulo}`;
    totalQuestoes.textContent = questoesAtuais.length;
    totalQuestoesResultado.textContent = questoesAtuais.length;
    
    resultadoContainer.style.display = "none";
    questaoContainer.style.display = "block";
    navegacao.style.display = "flex";
    
    mostrarQuestao();
    provaContainer.style.display = "block";
    document.body.style.overflow = "hidden";
}

function fecharProva() {
    provaContainer.style.display = "none";
    document.body.style.overflow = "auto";
}

function mostrarQuestao() {
    const questao = questoesAtuais[indiceQuestao];
    let alternativasHTML = '';
    
    questao.alternativas.forEach((alternativa, index) => {
        const letra = String.fromCharCode(97 + index);
        const selecionada = respostas[indiceQuestao] === letra ? 'selecionada' : '';
        
        alternativasHTML += `
            <div class="alternativa ${selecionada}" onclick="selecionarAlternativa('${letra}')">
                <div class="alternativa-letra">${letra})</div>
                <div class="alternativa-texto">${alternativa}</div>
            </div>
        `;
    });
    
    const imagemHTML = questao.imagem 
        ? `<div class="questao-imagem-container"><img src="${questao.imagem}" alt="Imagem da questão" class="questao-imagem"></div>`
        : '';
    
    questaoAtual.innerHTML = `
        <h3>Questão ${indiceQuestao + 1}</h3>
        ${imagemHTML}
        <p>${questao.pergunta}</p>
        <div class="alternativas">
            ${alternativasHTML}
        </div>
    `;
    
    questaoAtualNum.textContent = indiceQuestao + 1;
    btnAnterior.disabled = indiceQuestao === 0;
    
    if (indiceQuestao === questoesAtuais.length - 1) {
        btnProxima.style.display = "none";
        btnFinalizar.style.display = "block";
    } else {
        btnProxima.style.display = "block";
        btnFinalizar.style.display = "none";
    }
}

function selecionarAlternativa(letra) {
    respostas[indiceQuestao] = letra;
    
    const alternativas = document.querySelectorAll('.alternativa');
    alternativas.forEach(alt => {
        alt.classList.remove('selecionada');
        if (alt.querySelector('.alternativa-letra').textContent.startsWith(letra)) {
            alt.classList.add('selecionada');
        }
    });
}

function mostrarResultados() {
    questaoContainer.style.display = "none";
    navegacao.style.display = "none";
    
    const respostasMaterias = gabarito[materiaAtual];
    let acertos = 0;
    let detalhesHTML = '';
    
    for (let i = 0; i < questoesAtuais.length; i++) {
        const respostaUsuario = respostas[i] || "-";
        const respostaCorreta = respostasMaterias[i];
        const correto = respostaUsuario === respostaCorreta;
        
        if (correto) acertos++;
        
        detalhesHTML += `
            <div class="resultado-item">
                <div>Questão ${i + 1}:</div>
                <div class="resultado-resposta ${correto ? 'correto' : 'incorreto'}">
                    ${respostaUsuario.toUpperCase() || "-"} | 
                    ${respostaCorreta.toUpperCase()} | 
                    ${correto ? '✅' : '❌'}
                </div>
            </div>
        `;
    }
    
    // Adiciona botões de histórico e novo teste
    detalhesHTML += `
        <div class="botoes-resultado">
            <button onclick="tentarNovamente()" class="btn-tentar">Tentar Novamente</button>
            <button onclick="mostrarHistorico()" class="btn-historico">Ver Histórico</button>
            <button onclick="fecharProva()" class="btn-voltar">Voltar</button>
        </div>
    `;
    
    acertosTotal.textContent = acertos;
    totalQuestoesResultado.textContent = questoesAtuais.length;
    resultadoDetalhes.innerHTML = detalhesHTML;
    resultadoContainer.style.display = "block";
    
    // Salva no localStorage
    salvarResultado(materiaAtual, acertos, questoesAtuais.length);
    
    if (questoesAtuais.length === 8 && acertos >= 6) {
        mostrarFeedbackPositivo();
    }
}

function mostrarFeedbackPositivo() {
    const mensagensAntigas = document.querySelectorAll('.mensagem-parabens');
    mensagensAntigas.forEach(msg => msg.remove());
    
    const mensagemParabens = document.createElement('div');
    mensagemParabens.className = 'mensagem-parabens';
    mensagemParabens.innerHTML = `
        <h2>🎉 Parabéns! 🎉</h2>
        <p>Você acertou ${acertosTotal.textContent} de ${totalQuestoesResultado.textContent} questões!</p>
        <p>Continue assim!</p>
    `;
    
    resultadoContainer.insertBefore(mensagemParabens, resultadoContainer.firstChild);
    
    if(audioAcerto) {
        audioAcerto.currentTime = 0;
        audioAcerto.play();
    }
    
    if (!confettiActive) {
        confettiActive = true;
        criarConfete();
        setTimeout(() => { confettiActive = false; }, 5000);
    }
}

function criarConfete() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 1 + 's';
        confetti.style.zIndex = '10000';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function tentarNovamente() {
    respostas = {};
    indiceQuestao = 0;
    resultadoContainer.style.display = "none";
    questaoContainer.style.display = "block";
    navegacao.style.display = "flex";
    mostrarQuestao();
}

// Event listeners
btnAnterior.addEventListener("click", () => {
    if (indiceQuestao > 0) {
        indiceQuestao--;
        mostrarQuestao();
    }
});

btnProxima.addEventListener("click", () => {
    if (indiceQuestao < questoesAtuais.length - 1) {
        indiceQuestao++;
        mostrarQuestao();
    }
});

btnFinalizar.addEventListener("click", mostrarResultados);

// Inicialização do leitor de tela
if ('speechSynthesis' in window) {
    document.addEventListener('DOMContentLoaded', () => {
        window.screenReader = new ScreenReader();
    });
} else {
    document.getElementById('accessibilityBtn').style.display = 'none';
}