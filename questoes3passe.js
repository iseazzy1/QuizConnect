const gabarito = {
    matematica: ["a", "a", "c", "d", "c", "d", "b", "b"],
    ciencias: ["a", "b", "c", "d", "a", "b", "c", "d"],
    historia: ["b", "c", "d", "a", "c", "d", "b", "a"],
    portugues: ["c", "d", "a", "b", "c", "d", "a", "b"]
};

const materias = {
    matematica: gerarQuestoes("Matemática"),
    ciencias: gerarQuestoes("Ciências da Natureza"),
    historia: gerarQuestoes("Ciências Humanas"),
    portugues: gerarQuestoes("Linguagens")
};

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

let questoesAtuais = [];
let indiceQuestao = 0;
let materiaAtual = '';
let respostas = {};

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

btnFinalizar.addEventListener("click", () => {
    mostrarResultados();
});

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
                    Sua resposta: ${respostaUsuario.toUpperCase() || "-"} | 
                    Correta: ${respostaCorreta.toUpperCase()} | 
                    ${correto ? 'ACERTO' : 'ERRO'}
                </div>
            </div>
        `;
    }
    
    acertosTotal.textContent = acertos;
    resultadoDetalhes.innerHTML = detalhesHTML;
    resultadoContainer.style.display = "block";
}

function tentarNovamente() {
    respostas = {};
    indiceQuestao = 0;
    resultadoContainer.style.display = "none";
    questaoContainer.style.display = "block";
    navegacao.style.display = "flex";
    mostrarQuestao();
}
 function gerarQuestoes(materia) {
    if (materia.toLowerCase() === "matemática" || materia.toLowerCase() === "matematica") {
        return [
            {
      pergunta: `Dois triângulos são semelhantes. O menor triângulo tem lados de 3 cm, 4 cm e 5 cm.
O maior triângulo é uma ampliação com razão 2. Quais são os lados do triângulo maior?`,
imagem: "semelhanca-triangulos-sem.png",
       pergunta: ` A função f(x) = 2x + 3 representa uma reta.\n
      Qual é o valor de f(4)?`,
      alternativas: [
        "11", 
        "10", 
        "8", 
        "12"
      ]
    },
    {
      pergunta: `Considere a função f(x) = x².\n
      Qual é o valor de f(3)?`,
      alternativas: ["9", "6", "1", "12"]
    },
    {
      pergunta: `A função f(x) = 2 elevado a X, mostra como um número dobra.\n
      Qual é o valor de f(3)?`,
      alternativas: ["6", "9", "8", "12"]
    },
    {
      pergunta: `A função é: f(x) = 4x + 6 \n
      Quanto é f(5)?`,
      alternativas: ["20", "32", "28", "26"]
    },
    {
        pergunta: `Carlos e seus 3 amigos pediram uma pizza grande com 8 fatias.\n
        Todos querem comer a mesma quantidade de fatias.\n
        Ninguém pode comer mais do que o outro.\n
        Quantas fatias cada pessoa vai comer?`,
        alternativas: [
          "3", 
          "4", 
          "2", 
          "1"
        ]
      },
      {
        pergunta: `Ana tem um plano de celular pré-pago com R$ 50,00 de crédito no mês.\n
        Ela usa o celular para:\n
        📞 Fazer ligações: R$ 0,50 por minuto\n
        🌐 Usar internet: R$ 1,00 por dia de uso\n
        No mês, ela\n
        - Falou 30 minutos ao telefone\n
        - Usou internet em 20 dias\n
        Quanto Ana gastou no total?`,
        alternativas: ["20 reais", "25 reais", "40 reais", "35 reais"]
      },
      {
        pergunta: `Marcos vai comprar sucos para uma pequena festa na escola.
        Ele precisa comprar 10 garrafas de suco.
        No mercado, os preços são
        - Suco de laranja: R$ 4,00 por garrafa
        - Suco de uva: R$ 3,50 por garrafa
        Ele decidiu comprar:
        - 6 garrafas de suco de laranja
        - 4 garrafas de suco de uva
        Quanto o Marcos vai gastar no total?`,
        alternativas: ["30", "38", "32", "34"]
      },
      {
        pergunta: `Pedro quer comprar um tênis que custa R$ 180,00.
        Ele juntou o seguinte dinheiro em três semanas:
        Semana 1: R$ 50,00
        Semana 2: R$ 65,00
        Semana 3: R$ 40,00
        Pedro já pode comprar o tênis?
        Se não, quanto ainda falta para ele conseguir?`,
        alternativas: ["Já pode comprar o tênis",
        "faltam 25 reais",
        "faltam 50 reais",
        "faltam 35 reais"]
      }
  ];
} else if (materia === "Ciências Humanas") {
  return [
    {
      pergunta: `A Lei Áurea citada acima fala sobre:`,
      imagem: "LeiAurea.png",
      alternativas: [
        "Aumento dos impostos no Brasil",
        "Abolição da escravatura",
        "Declaração da independência do Brasil",
        "Morte de Dom Pedro II"
      ]
    },
    {
      pergunta: `______  foi o segundo e último imperador do Brasil, governando de 1831 a 1889. assumiu o trono ainda criança após a abdicação do pai, sendo declarado maior de idade aos 15 anos para iniciar seu reinado. Durante seu governo, melhorou a educação, ciência e infraestrutura, além de acabar escravidão com a Lei Áurea. mas acabou deposto em 1889 com a Proclamação da República, passando o restante da vida na Europa.
Complete com o nome desta figura histórica.`,
imagem: "DomPedro2.png", 
      alternativas: [
        "Napoleão Bonaparte",
        "Albert Einstein",
        "Dom Pedro II",
        "Pedro Alvares Cabral"
      ]
    },
    {
      pergunta: `Na América Latina, existem diferentes formas de liderança política. O patrimonialismo acontece quando um governante usa o dinheiro público como se fosse dele.\n
Qual dessas situações é um exemplo de patrimonialismo?`,
      alternativas: [
        "Um presidente que faz discursos para ouvir o povo.",
        "Um líder que decide tudo sozinho.",
        "Um grupo que luta por direitos no trabalho.",
        "Um governante que usa dinheiro público para ajudar amigos e familiares."
      ]
    },
    {
      pergunta: `John Locke foi um filósofo do século XVII, defensor do empirismo e do liberalismo político. Acreditava que o governo deve existir para garantir que os cidadãos possuam direitos a vida, liberdade e propriedade. Suas ideias influenciaram a democracia moderna.
Qual é a principal função do Estado, segundo John Locke?`,
imagem: "JohnLocke.png",
      alternativas: [
        "Garantir a liberdade e o direito à propriedade com base nas leis.",
        "Exercer controle absoluto sobre a sociedade para evitar conflitos.",
        "Eliminar completamente o egoísmo humano por meio da educação.",
        "Substituir a propriedade privada pela propriedade coletiva."
      ]
    }, 
    {   
      pergunta: ` A Revolução Industrial teve início na Inglaterra, no final do século XVIII, e marcou uma grande transformação na forma de produção, trocando o trabalho manual pelo uso de máquinas. Esse processo trouxe grandes mudanças sociais, econômicas e tecnológicas, como a chegada das fábricas, o crescimento das cidades e o aumento da produção em escala.
Qual foi uma das principais consequências da Revolução Industrial?`,
      imagem: "RevolucaoIndustrial.png",
        alternativas: [
          "Parou o comércio entre países",
          "A volta do trabalho artesanal",
          "O crescimento da produção e o surgimento de indústrias",
          "A diminuição no uso de máquinas na indústria"
        ]
      },
      {
        pergunta: ` Linha do Tempo - Qual das alternativas passa a ordem dos acontecimentos do Séc XX de forma correta`,
        imagem:  "LinhaDoTempo.png",
        alternativas: [
          "Primeira Guerra Mundial - Guerra Fria - Revolução Russa - Segunda Guerra Mundial",
          "Guerra Fria - Revolução Russa - Segunda Guerra Mundial - Primeira Guerra Mundial",
          "Revolução Russa - Primeira Guerra Mundial - Segunda Guerra Mundial - Guerra Fria",
          "Primeira Guerra Mundial - Revolução Russa - Segunda Guerra Mundial - Guerra Fria"
        ]
      },
      {
        pergunta: `Imagine que alguns países são como times de futebol. Sozinhos, é mais difícil competir com os times mais fortes. Então, eles se juntam para formar uma equipe mais forte. Isso acontece com os países em grupos chamados blocos econômicos. Assim, eles conseguem trocar produtos, viajar e crescer juntos de forma mais facil.\n
        O que é um bloco econômico?`,
        alternativas: [
          "Um grupo de países que não se relacionam.",
          "Um grupo de países que se unem para facilitar o comércio e se desenvolverem .",
          "Um país sozinho que quer dominar os outros.",
          " Um aglomerado de países que não se ajudam."
        ]
      },
      {
        pergunta: `Hoje em dia, é comum usar roupas feitas em outros países, comer comidas de fora e assistir filmes de várias partes do mundo. Isso acontece por causa da globalização, que é quando os países ficam mais conectados e trocam produtos, ideias e culturas com mais facilidade.\n
        De acordo com o texto, o que é globalização?`,
        imagem:  "global.jpg",
        alternativas: [
          "Quando os países se juntam para trocarem produtos, informações e culturas.",
          "Quando os países ficam mais fechados e não trocam nada.",
          "Quando as pessoas viajam apenas dentro do seu próprio país.",
          "Quando todos os países falam a mesma língua."
        ]
      }
  ];
} else if (materia === "Linguagens") {
  return [
    {
      pergunta: `As redes sociais são usadas para compartilhar informações e opiniões. Algumas postagens podem influenciar o que as pessoas pensam e fazem.\n
    Qual dessas opções mostra um exemplo disso?`,
      alternativas: [
        "Uma foto de um cachorro brincando no parque.",
        "Um bilhete lembrando de comprar pão no mercado.",
        "Uma mensagem dizendo: 'Vote no candidato X para um futuro melhor!'",
        "Um livro de matemática com exercícios para estudar."
      ]
    },
    {
      pergunta: `As letras de músicas transmitem mensagens e podem influenciar a forma como pensamos e sentimos.\n
Qual dessas músicas transmite uma mensagem de motivação e superação?`,
      alternativas: [
        "Uma canção infantil ensinando o alfabeto.",
        "Uma música instrumental, sem letra.",
        "Uma canção que descreve apenas um dia chuvoso sem emoções.",
        "Uma música que fala sobre nunca desistir dos sonhos."
      ]
    },
    {
      pergunta: `Regência verbal é a relação entre um verbo e as palavras que o acompanham, especialmente o complemento. Ela mostra como o verbo exige ou se liga a outros termos da frase. Ex: Lucia gosta de música clássica.\n
Observe a frase abaixo:\n
"Pedro assistiu ___ filme ontem."\n
Qual palavra completa corretamente a frase, de acordo com a regência verbal do verbo "assistir"?`,
      alternativas: [
        "Ao",
        "A",
        "No",
        "Com o"
      ]
    },
    {
      pergunta: `Na tirinha, o personagem diz: "Ai ai... Eu não consigo encontrar uma dieta que eu goste!"\n
O verbo gostar exige a preposição, mas na frase ele aparece sem a preposição, o que está gramaticalmente incorreto.\n
Na fala "uma dieta que eu goste", qual é a preposição que estará de acordo com a regência verbal?`,
imagem: "tirinhaLinguagem.png",
      alternativas: [
        "Na",
        "De",
        "A",
        "Ao"
      ]
    }, 
    {   
      pergunta: ` Descubra a pessoa pela biografia \n
_____ , nasceu em 5 de fevereiro de 1992, em Mogi das Cruzes, São Paulo. Ele é um dos jogadores de futebol mais famosos do mundo, conhecido por sua habilidade, velocidade e criatividade em campo. Começou sua carreira no Santos Futebol Clube, onde se destacou e conquistou títulos importantes.
Jogou em equipes na Espanha, França e Arábia Saudita  e também defendeu o escudo de sua seleção. Fora dos campos, ____ é uma figura midiática e muito influente nas redes sociais.`,
        alternativas: [
          "Lebron James",
          "Lionel Messi",
          "Neymar Junior",
          "Tom Brady"
        ]
      },
      {
        pergunta: ` Em inglês, “Você está esperando alguma carta?” seria:`, 
        alternativas: [
          "Have you been waiting for a chart?",
          "Are you attending any lecture?",
          "Are you staying for the lecture?",
          "Are you expecting a letter?"
        ]
      },
      {
        pergunta: `Escolha a alternativa que preenche a frase abaixo corretamente:\n
        She is ___________________ girl I know.`,
        alternativas: [
          "The most beautiful",
          "More beautiful than",
          "As beautiful as",
          "Less beautiful than"
        ]
      },
      {
        pergunta: `Mary is 10 years old. Jean is 10 years old.\n
        Mary is _________________ Jean.`,
        alternativas: [
          "Younger than",
          "As young as",
          "The youngest",
          "Less young than"
        ]
      }
  ];
 } else  {
  return [
    {
      pergunta: `Pense em um campo com grama, gafanhotos e sapos. A grama serve de alimento para o gafanhoto, e o gafanhoto serve de alimento para o sapo. Isso é uma cadeia alimentar: uma sequência de quem caça quem na natureza.\n
Na cadeia alimentar, o que acontece com a energia?`,
      alternativas: [
        "Ela é passada de um ser vivo para outro.",
        "Ela desaparece no ar.",
        "Ela só existe nas plantas.",
        "Ela só aparece durante a noite."
      ]
    },
    {
      pergunta: ` Imagine um rio limpo onde vivem peixes, plantas aquáticas e outros animais. Um dia, lixo é jogado no rio e a água fica suja. Os peixes começam a morrer e o ambiente muda.\n
 O que pode acontecer quando o ser humano joga lixo na natureza?`,
      alternativas: [
        "As plantas comem o lixo e ficam mais fortes.",
        "O ambiente fica poluído e os seres vivos podem ser prejudicados.",
        "Nada, pois não afeta os animais.",
        "A água fica colorida e bonita."
      ]
    },
    {
      pergunta: `Observe a imagem do ecossistema da lagoa. Ela mostra animais como peixes, patos, sapos, insetos, plantas aquáticas e outros seres vivos que vivem juntos e interagem na água e ao redor dela.
 Com base na imagem, o que podemos dizer sobre o ecossistema da lagoa?`,
 imagem:  "EcoSistema.png",
      alternativas: [
        "É formado apenas por animais que não precisam um do outro.",
        "É um lugar com os mesmos animais que se ajudam.",
        "É um lugar onde vivem diferentes seres vivos que dependem uns dos outros.",
        "É um espaço com pouca biodiversidade."
      ]
    },
    {
      pergunta: ` A química orgânica é a parte da química que estuda os compostos que contêm carbono. Esses compostos estão presentes em alimentos, combustíveis, plásticos e até no nosso corpo.\n
O átomo de carbono é especial pois pode se ligar com vários átomos, formando cadeias e moléculas variadas.\n
O que caracteriza os compostos estudados na química orgânica?`,
      alternativas: [
        "São todos formados apenas por metais e gases nobres.",
        "São moléculas simples encontradas apenas em laboratórios.",
        "São compostos que não se relacionam com seres vivos nem com o meio ambiente.",
        "São formados principalmente por átomos de carbono e costumam formar cadeias com outros elementos",
      ]
    }, 
    {   
      pergunta: `Observe a imagem acima e a classifique como:\n
Simples (sem ramificações) ou Ramificada (com um pedaço saindo para o lado),\n
Aberta (como uma linha) ou Fechada (como um anel ou círculo).\n
Essa cadeia carbônica é:`,
      imagem:  "CadeiaCarbonica.png",
        alternativas: [
          "Aberta, Simples",
          "Aberta, ramificada",
          "Fechada, ramificada",
          "Fechada, Simples"
        ]
      },
      {
        pergunta: `Observe a imagem acima e a classifique como:\n
Aberta (como uma linha) ou Fechada (como um anel ou círculo).\n
Saturada (com ligações simples) ou Insaturada (com ligações duplas ou triplas).\n
Essa cadeia carbônica é:`,
        imagem:  "CadeiaCarbonicafechada.png",
        alternativas: [
          "Aberta, Saturada",
          "Fechada, Insaturada",
          "Aberta, Insaturada",
          "Fechada, Saturada"
        ]
      },
      {
        pergunta: `Os principais fenômenos de ondas são:\n
Reflexão: a onda bate e volta (como o eco).\n
Refração: a onda muda de direção e velocidade.\n
Difração: a onda contorna obstáculos.\n
Interferência: duas ondas se encontram.\n
O que acontece com uma onda quando ela muda de meio e muda sua velocidade?`, 
        alternativas: [
          "Reflexão",
          "Difração",
          "Refração",
          "Interferência"
        ]
      },
      {
        pergunta: `As ondas podem se mover de diferentes formas. Algumas precisam de um meio (como água ou ar), outras não.\n
Ondas mecânicas: precisam de um meio (como o som).\n
Ondas eletromagnéticas: não precisam de um meio (como luz, raio-X).\n
Qual das alternativas está correta sobre as ondas?`,
        alternativas: [
          "O som é uma onda que pode viajar no vácuo",
          "A luz precisa de um meio material para se propagar.",
          "As ondas na água não se propagam.",
          "O som é uma onda mecânica e não se propaga no vácuo."
        ]
      }
  ];
}
  }