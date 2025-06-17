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

 // Classe para gerenciar a acessibilidade de leitura de tela
    class ScreenReader {
      constructor() {
        this.synth = window.speechSynthesis;
        this.isReading = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.queue = [];
        this.currentIndex = 0;
        this.speed = 1;
        this.volume = 1;
        this.voice = null;
        
        this.initializeVoices();
        this.bindEvents();
      }
      
      initializeVoices() {
        // Aguarda as vozes carregarem
        const setVoice = () => {
          const voices = this.synth.getVoices();
          // Tenta encontrar uma voz em português
          this.voice = voices.find(voice => 
            voice.lang.startsWith('pt') || 
            voice.name.toLowerCase().includes('portuguese')
          ) || voices[0];
        };
        
        if (this.synth.getVoices().length > 0) {
          setVoice();
        } else {
          this.synth.addEventListener('voiceschanged', setVoice);
        }
      }
      
      bindEvents() {
        const btn = document.getElementById('accessibilityBtn');
        const controls = document.getElementById('accessibilityControls');
        const speedControl = document.getElementById('speedControl');
        const volumeControl = document.getElementById('volumeControl');
        const speedValue = document.getElementById('speedValue');
        const volumeValue = document.getElementById('volumeValue');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const skipBtn = document.getElementById('skipBtn');
        
        // Botão principal
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleReading();
        });
        
        // Mostrar/esconder controles
        btn.addEventListener('mouseenter', () => {
          if (this.isReading) {
            controls.classList.add('show');
          }
        });
        
        controls.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!controls.matches(':hover')) {
              controls.classList.remove('show');
            }
          }, 300);
        });
        
        // Controles de velocidade e volume
        speedControl.addEventListener('input', (e) => {
          this.speed = parseFloat(e.target.value);
          speedValue.textContent = this.speed + 'x';
          if (this.currentUtterance) {
            this.currentUtterance.rate = this.speed;
          }
        });
        
        volumeControl.addEventListener('input', (e) => {
          this.volume = parseFloat(e.target.value);
          volumeValue.textContent = Math.round(this.volume * 100) + '%';
          if (this.currentUtterance) {
            this.currentUtterance.volume = this.volume;
          }
        });
        
        // Botões de controle
        pauseBtn.addEventListener('click', () => this.togglePause());
        stopBtn.addEventListener('click', () => this.stopReading());
        skipBtn.addEventListener('click', () => this.skipCurrent());
        
        // Fechar controles ao clicar fora
        document.addEventListener('click', (e) => {
          if (!btn.contains(e.target) && !controls.contains(e.target)) {
            controls.classList.remove('show');
          }
        });
      }
      
      getReadableContent() {
        const content = [];
        
        // Conteúdo específico para a página de provas SAEP
        content.push({ text: 'Página: ' + document.title, element: null });
        content.push({ text: 'Site Quiz Connect', element: '.logo' });
        content.push({ text: 'Menu de navegação com opções: Início e Cadastro', element: 'nav' });
        content.push({ text: 'Título: Prova SAEP', element: 'h1' });
        
        // Card de matéria
        const card = document.querySelector('.card');
        if (card) {
          content.push({ 
            text: 'Card de prova: SAEP. Clique em COMEÇAR para iniciar a prova', 
            element: '.card' 
          });
        }
        
        // Se a prova estiver aberta
        const provaContainer = document.getElementById('provaContainer');
        if (provaContainer && provaContainer.style.display === 'block') {
          content.push({ text: 'Prova aberta: ' + document.getElementById('provaTitulo').textContent, element: '#provaTitulo' });
          content.push({ text: 'Questão atual: ' + document.getElementById('questaoAtualNum').textContent + ' de ' + document.getElementById('totalQuestoes').textContent, element: '#progressoIndicador' });
          content.push({ text: 'Conteúdo da questão: ' + document.getElementById('questaoAtual').textContent, element: '#questaoAtual' });
          
          const btnAnterior = document.getElementById('btnAnterior');
          const btnProxima = document.getElementById('btnProxima');
          
          if (btnAnterior.disabled) {
            content.push({ text: 'Botão Anterior desativado', element: '#btnAnterior' });
          } else {
            content.push({ text: 'Botão Anterior para voltar à questão anterior', element: '#btnAnterior' });
          }
          
          content.push({ text: 'Botão Próxima para avançar para a próxima questão', element: '#btnProxima' });
        }
        
        // Se os resultados estiverem visíveis
        const resultadoContainer = document.getElementById('resultadoContainer');
        if (resultadoContainer && resultadoContainer.style.display === 'block') {
          content.push({ 
            text: 'Resultados: Você acertou ' + document.getElementById('acertosTotal').textContent + ' de ' + document.getElementById('totalQuestoesResultado').textContent + ' questões', 
            element: '.resultado-pontuacao' 
          });
          content.push({ text: 'Detalhes dos resultados: ' + document.getElementById('resultadoDetalhes').textContent, element: '#resultadoDetalhes' });
          content.push({ text: 'Botão Voltar ao Início para retornar à seleção de matérias', element: '.btn-finalizar' });
          content.push({ text: 'Botão Tentar Novamente para refazer a prova', element: '.btn-tentar-novamente' });
        }
        
        content.push({ text: 'Página desenvolvida com recursos de acessibilidade', element: null });
        content.push({ text: 'Use os controles de velocidade e volume para personalizar a leitura', element: null });
        
        return content;
      }
      
      toggleReading() {
        if (this.isReading) {
          this.stopReading();
        } else {
          this.startReading();
        }
      }
      
      startReading() {
        this.queue = this.getReadableContent();
        this.currentIndex = 0;
        this.isReading = true;
        this.isPaused = false;
        
        const btn = document.getElementById('accessibilityBtn');
        const controls = document.getElementById('accessibilityControls');
        
        btn.classList.add('active');
        btn.innerHTML = '🔊';
        btn.title = 'Leitura ativa - Clique para parar';
        controls.classList.add('show');
        
        this.readNext();
      }
      
      readNext() {
        if (this.currentIndex >= this.queue.length) {
          this.stopReading();
          return;
        }
        
        const currentItem = this.queue[this.currentIndex];
        const text = currentItem.text;
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Configurações da voz
        if (this.voice) {
          this.currentUtterance.voice = this.voice;
        }
        this.currentUtterance.rate = this.speed;
        this.currentUtterance.volume = this.volume;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.lang = 'pt-BR';
        
        // Destacar elemento ANTES de começar a falar
        this.highlightCurrentElement();
        
        // Eventos
        this.currentUtterance.onend = () => {
          this.currentIndex++;
          if (this.isReading && !this.isPaused) {
            setTimeout(() => this.readNext(), 500);
          }
        };
        
        this.currentUtterance.onerror = (e) => {
          console.warn('Erro na síntese de voz:', e);
          this.currentIndex++;
          if (this.isReading) {
            this.readNext();
          }
        };
        
        this.synth.speak(this.currentUtterance);
      }
      
      highlightCurrentElement() {
        // Remove highlight anterior
        document.querySelectorAll('.reading-highlight').forEach(el => {
          el.classList.remove('reading-highlight');
        });
        
        // Pega o elemento atual baseado no seletor
        const currentItem = this.queue[this.currentIndex];
        if (currentItem && currentItem.element) {
          const element = document.querySelector(currentItem.element);
          if (element) {
            element.classList.add('reading-highlight');
            
            // Rola a página para mostrar o elemento destacado
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
      }
      
      togglePause() {
        const pauseBtn = document.getElementById('pauseBtn');
        const btn = document.getElementById('accessibilityBtn');
        
        if (this.isPaused) {
          this.synth.resume();
          this.isPaused = false;
          pauseBtn.innerHTML = '⏸️ Pausar';
          btn.classList.remove('paused');
          btn.classList.add('active');
        } else {
          this.synth.pause();
          this.isPaused = true;
          pauseBtn.innerHTML = '▶️ Continuar';
          btn.classList.remove('active');
          btn.classList.add('paused');
        }
      }
      
      stopReading() {
        this.synth.cancel();
        this.isReading = false;
        this.isPaused = false;
        this.currentIndex = 0;
        
        const btn = document.getElementById('accessibilityBtn');
        const controls = document.getElementById('accessibilityControls');
        const pauseBtn = document.getElementById('pauseBtn');
        
        btn.classList.remove('active', 'paused');
        btn.innerHTML = '🔊';
        btn.title = 'Ativar leitura de tela';
        controls.classList.remove('show');
        pauseBtn.innerHTML = '⏸️ Pausar';
        
        // Remove highlights
        document.querySelectorAll('.reading-highlight').forEach(el => {
          el.classList.remove('reading-highlight');
        });
      }
      
      skipCurrent() {
        if (this.isReading) {
          this.synth.cancel();
          this.currentIndex++;
          if (this.currentIndex < this.queue.length) {
            setTimeout(() => this.readNext(), 200);
          } else {
            this.stopReading();
          }
        }
      }
    }
    
    document.addEventListener("DOMContentLoaded", function () {
      // Inicializa o leitor de tela
      const screenReader = new ScreenReader();
    });

// Variáveis de estado
let questoesAtuais = [];
let indiceQuestao = 0;
let materiaAtual = '';
let respostas = {};

// Banco de questões (mantenha todo o conteúdo das matérias que você já tem)
const materias = {
    matematica: [
        {
            pergunta: "A função f(x) = 2x + 3 representa uma reta. Qual é o valor de f(4)?",
            alternativas: ["11", "10", "8", "12"]
        },
        {
            pergunta: "Considere a função f(x) = x². Qual é o valor de f(3)?",
            alternativas: ["9", "6", "1", "12"]
        },
        {
            pergunta: "A função f(x) = 2 elevado a X, mostra como um número dobra. Qual é o valor de f(3)?",
            alternativas: ["6", "9", "8", "12"]
        },
        {
            pergunta: "A função é: f(x) = 4x + 6. Quanto é f(5)?",
            alternativas: ["20", "32", "28", "26"]
        },
        {
            pergunta: "Carlos e seus 3 amigos pediram uma pizza grande com 8 fatias. Todos querem comer a mesma quantidade de fatias. Ninguém pode comer mais do que o outro. Quantas fatias cada pessoa vai comer?",
            alternativas: ["3", "4", "2", "1"]
        },
        {
            pergunta: "Ana tem um plano de celular pré-pago com R$ 50,00 de crédito no mês. Ela usa o celular para: Fazer ligações: R$ 0,50 por minuto. Usar internet: R$ 1,00 por dia de uso. No mês, ela falou 30 minutos ao telefone e usou internet em 20 dias. Quanto Ana gastou no total?",
            alternativas: ["20 reais", "25 reais", "40 reais", "35 reais"]
        },
        {
            pergunta: "Marcos vai comprar sucos para uma pequena festa na escola. Ele precisa comprar 10 garrafas de suco. No mercado, os preços são: Suco de laranja: R$ 4,00 por garrafa, Suco de uva: R$ 3,50 por garrafa. Ele decidiu comprar: 6 garrafas de suco de laranja e 4 garrafas de suco de uva. Quanto o Marcos vai gastar no total?",
            alternativas: ["30", "38", "32", "34"]
        },
        {
            pergunta: "Pedro quer comprar um tênis que custa R$ 180,00. Ele juntou o seguinte dinheiro em três semanas: Semana 1: R$ 50,00, Semana 2: R$ 65,00, Semana 3: R$ 40,00. Pedro já pode comprar o tênis? Se não, quanto ainda falta para ele conseguir?",
            alternativas: ["Já pode comprar o tênis", "faltam 25 reais", "faltam 50 reais", "faltam 35 reais"]
        }
    ],
    ciencias: [
         {
            pergunta: "Pense em um campo com grama, gafanhotos e sapos. A grama serve de alimento para o gafanhoto, e o gafanhoto serve de alimento para o sapo. Isso é uma cadeia alimentar: uma sequência de quem caça quem na natureza. Na cadeia alimentar, o que acontece com a energia?",
            alternativas: [
                "Ela é passada de um ser vivo para outro.",
                "Ela desaparece no ar.",
                "Ela só existe nas plantas.",
                "Ela só aparece durante a noite."
            ]
        },
        {
            pergunta: "Imagine um rio limpo onde vivem peixes, plantas aquáticas e outros animais. Um dia, lixo é jogado no rio e a água fica suja. Os peixes começam a morrer e o ambiente muda. O que pode acontecer quando o ser humano joga lixo na natureza?",
            alternativas: [
                "As plantas comem o lixo e ficam mais fortes.",
                "O ambiente fica poluído e os seres vivos podem ser prejudicados.",
                "Nada, pois não afeta os animais.",
                "A água fica colorida e bonita."
            ]
        },
        {
            pergunta: "Observe a imagem do ecossistema da lagoa. Ela mostra animais como peixes, patos, sapos, insetos, plantas aquáticas e outros seres vivos que vivem juntos e interagem na água e ao redor dela. Com base na imagem, o que podemos dizer sobre o ecossistema da lagoa?",
             imagem:  "EcoSistema.png",
            alternativas: [
                "É formado apenas por animais que não precisam um do outro.",
                "É um lugar com os mesmos animais que se ajudam.",
                "É um lugar onde vivem diferentes seres vivos que dependem uns dos outros.",
                "É um espaço com pouca biodiversidade."
            ]
        },
        {
            pergunta: "A química orgânica é a parte da química que estuda os compostos que contêm carbono. Esses compostos estão presentes em alimentos, combustíveis, plásticos e até no nosso corpo. O átomo de carbono é especial pois pode se ligar com vários átomos, formando cadeias e moléculas variadas. O que caracteriza os compostos estudados na química orgânica?",
            alternativas: [
                "São todos formados apenas por metais e gases nobres.",
                "São moléculas simples encontradas apenas em laboratórios.",
                "São compostos que não se relacionam com seres vivos nem com o meio ambiente.",
                "São formados principalmente por átomos de carbono e costumam formar cadeias com outros elementos"
            ]
        },
        {
            pergunta: "Observe a imagem acima e a classifique como: Simples (sem ramificações) ou Ramificada (com um pedaço saindo para o lado), Aberta (como uma linha) ou Fechada (como um anel ou círculo). Essa cadeia carbônica é:",
            imagem:  "CadeiaCarbonica.png",
            alternativas: [
                "Aberta, Simples",
                "Aberta, ramificada",
                "Fechada, ramificada",
                "Fechada, Simples"
            ]
        },
        {
            pergunta: "Observe a imagem acima e a classifique como: Aberta (como uma linha) ou Fechada (como um anel ou círculo). Saturada (com ligações simples) ou Insaturada (com ligações duplas ou triplas). Essa cadeia carbônica é:",
            imagem:  "CadeiaCarbonicafechada.png",
            alternativas: [
                "Aberta, Saturada",
                "Fechada, Insaturada",
                "Aberta, Insaturada",
                "Fechada, Saturada"
            ]
        },
        {
            pergunta: "Os principais fenômenos de ondas são: Reflexão: a onda bate e volta (como o eco). Refração: a onda muda de direção e velocidade. Difração: a onda contorna obstáculos. Interferência: duas ondas se encontram. O que acontece com uma onda quando ela muda de meio e muda sua velocidade?",
            alternativas: [
                "Reflexão",
                "Difração",
                "Refração",
                "Interferência"
            ]
        },
        {
            pergunta: "As ondas podem se mover de diferentes formas. Algumas precisam de um meio (como água ou ar), outras não. Ondas mecânicas: precisam de um meio (como o som). Ondas eletromagnéticas: não precisam de um meio (como luz, raio-X). Qual das alternativas está correta sobre as ondas?",
            alternativas: [
                "O som é uma onda que pode viajar no vácuo",
                "A luz precisa de um meio material para se propagar.",
                "As ondas na água não se propagam.",
                "O som é uma onda mecânica e não se propaga no vácuo."
            ]
        },
    ],
    historia: [
         {
            pergunta: "A Lei Áurea citada acima fala sobre:",
            imagem: "LeiAurea.png",
            alternativas: [
                "Aumento dos impostos no Brasil",
                "Abolição da escravatura",
                "Declaração da independência do Brasil",
                "Morte de Dom Pedro II"
            ]
        },
        {
            pergunta: "______ foi o segundo e último imperador do Brasil, governando de 1831 a 1889. assumiu o trono ainda criança após a abdicação do pai, sendo declarado maior de idade aos 15 anos para iniciar seu reinado. Durante seu governo, melhorou a educação, ciência e infraestrutura, além de acabar escravidão com a Lei Áurea. mas acabou deposto em 1889 com a Proclamação da República, passando o restante da vida na Europa. Complete com o nome desta figura histórica.",
            imagem: "DomPedro2.png", 
            alternativas: [
                "Napoleão Bonaparte",
                "Albert Einstein",
                "Dom Pedro II",
                "Pedro Alvares Cabral"
            ]
        },
        {
            pergunta: "Na América Latina, existem diferentes formas de liderança política. O patrimonialismo acontece quando um governante usa o dinheiro público como se fosse dele. Qual dessas situações é um exemplo de patrimonialismo?",
            alternativas: [
                "Um presidente que faz discursos para ouvir o povo.",
                "Um líder que decide tudo sozinho.",
                "Um grupo que luta por direitos no trabalho.",
                "Um governante que usa dinheiro público para ajudar amigos e familiares."
            ]
        },
        {
            pergunta: "John Locke foi um filósofo do século XVII, defensor do empirismo e do liberalismo político. Acreditava que o governo deve existir para garantir que os cidadãos possuam direitos a vida, liberdade e propriedade. Suas ideias influenciaram a democracia moderna. Qual é a principal função do Estado, segundo John Locke?",
            imagem: "JohnLocke.png",
            alternativas: [
                "Garantir a liberdade e o direito à propriedade com base nas leis.",
                "Exercer controle absoluto sobre a sociedade para evitar conflitos.",
                "Eliminar completamente o egoísmo humano por meio da educação.",
                "Substituir a propriedade privada pela propriedade coletiva."
            ]
        }, 
        {   
            pergunta: "A Revolução Industrial teve início na Inglaterra, no final do século XVIII, e marcou uma grande transformação na forma de produção, trocando o trabalho manual pelo uso de máquinas. Esse processo trouxe grandes mudanças sociais, econômicas e tecnológicas, como a chegada das fábricas, o crescimento das cidades e o aumento da produção em escala. Qual foi uma das principais consequências da Revolução Industrial?",
            imagem: "RevolucaoIndustrial.png",
            alternativas: [
                "Parou o comércio entre países",
                "A volta do trabalho artesanal",
                "O crescimento da produção e o surgimento de indústrias",
                "A diminuição no uso de máquinas na indústria"
            ]
        },
        {
            pergunta: "Linha do Tempo - Qual das alternativas passa a ordem dos acontecimentos do Séc XX de forma correta",
            imagem: "LinhaDoTempo.png",
            alternativas: [
                "Primeira Guerra Mundial - Guerra Fria - Revolução Russa - Segunda Guerra Mundial",
                "Guerra Fria - Revolução Russa - Segunda Guerra Mundial - Primeira Guerra Mundial",
                "Revolução Russa - Primeira Guerra Mundial - Segunda Guerra Mundial - Guerra Fria",
                "Primeira Guerra Mundial - Revolução Russa - Segunda Guerra Mundial - Guerra Fria"
            ]
        },
        {
            pergunta: "Imagine que alguns países são como times de futebol. Sozinhos, é mais difícil competir com os times mais fortes. Então, eles se juntam para formar uma equipe mais forte. Isso acontece com os países em grupos chamados blocos econômicos. Assim, eles conseguem trocar produtos, viajar e crescer juntos de forma mais facil. O que é um bloco econômico?",
            alternativas: [
                "Um grupo de países que não se relacionam.",
                "Um grupo de países que se unem para facilitar o comércio e se desenvolverem.",
                "Um país sozinho que quer dominar os outros.",
                "Um aglomerado de países que não se ajudam."
            ]
        },
        {
            pergunta: "Hoje em dia, é comum usar roupas feitas em outros países, comer comidas de fora e assistir filmes de várias partes do mundo. Isso acontece por causa da globalização, que é quando os países ficam mais conectados e trocam produtos, ideias e culturas com mais facilidade. De acordo com o texto, o que é globalização?",
            imagem: "global.jpg",
            alternativas: [
                "Quando os países se juntam para trocarem produtos, informações e culturas.",
                "Quando os países ficam mais fechados e não trocam nada.",
                "Quando as pessoas viajam apenas dentro do seu próprio país.",
                "Quando todos os países falam a mesma língua."
            ]
        }
    ],
    portugues: [
        {
            pergunta: "As redes sociais são usadas para compartilhar informações e opiniões. Algumas postagens podem influenciar o que as pessoas pensam e fazem. Qual dessas opções mostra um exemplo disso?",
            alternativas: [
                "Uma foto de um cachorro brincando no parque.",
                "Um bilhete lembrando de comprar pão no mercado.",
                "Uma mensagem dizendo: 'Vote no candidato X para um futuro melhor!'",
                "Um livro de matemática com exercícios para estudar."
            ]
        },
        {
            pergunta: "As letras de músicas transmitem mensagens e podem influenciar a forma como pensamos e sentimos. Qual dessas músicas transmite uma mensagem de motivação e superação?",
            alternativas: [
                "Uma canção infantil ensinando o alfabeto.",
                "Uma música instrumental, sem letra.",
                "Uma canção que descreve apenas um dia chuvoso sem emoções.",
                "Uma música que fala sobre nunca desistir dos sonhos."
            ]
        },
        {
            pergunta: "Regência verbal é a relação entre um verbo e as palavras que o acompanham, especialmente o complemento. Ela mostra como o verbo exige ou se liga a outros termos da frase. Ex: Lucia gosta de música clássica. Observe a frase abaixo: 'Pedro assistiu ___ filme ontem.' Qual palavra completa corretamente a frase, de acordo com a regência verbal do verbo 'assistir'?",
            alternativas: [
                "Ao",
                "A",
                "No",
                "Com o"
            ]
        },
        {
            pergunta: "Na tirinha, o personagem diz: 'Ai ai... Eu não consigo encontrar uma dieta que eu goste!' O verbo gostar exige a preposição, mas na frase ele aparece sem a preposição, o que está gramaticalmente incorreto. Na fala 'uma dieta que eu goste', qual é a preposição que estará de acordo com a regência verbal?",
            imagem: "tirinhaLinguagem.png",
            alternativas: [
                "Na",
                "De",
                "A",
                "Ao"
            ]
        }, 
        {   
            pergunta: "Descubra a pessoa pela biografia: _____, nasceu em 5 de fevereiro de 1992, em Mogi das Cruzes, São Paulo. Ele é um dos jogadores de futebol mais famosos do mundo, conhecido por sua habilidade, velocidade e criatividade em campo. Começou sua carreira no Santos Futebol Clube, onde se destacou e conquistou títulos importantes. Jogou em equipes na Espanha, França e Arábia Saudita e também defendeu o escudo de sua seleção. Fora dos campos, ____ é uma figura midiática e muito influente nas redes sociais.",
            alternativas: [
                "Lebron James",
                "Lionel Messi",
                "Neymar Junior",
                "Tom Brady"
            ]
        },
        {
            pergunta: "Em inglês, 'Você está esperando alguma carta?' seria:",
            alternativas: [
                "Have you been waiting for a chart?",
                "Are you attending any lecture?",
                "Are you staying for the lecture?",
                "Are you expecting a letter?"
            ]
        },
        {
            pergunta: "Escolha a alternativa que preenche a frase abaixo corretamente: She is ___________________ girl I know.",
            alternativas: [
                "The most beautiful",
                "More beautiful than",
                "As beautiful as",
                "Less beautiful than"
            ]
        },
        {
            pergunta: "Mary is 10 years old. Jean is 10 years old. Mary is _________________ Jean.",
            alternativas: [
                "Younger than",
                "As young as",
                "The youngest",
                "Less young than"
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
document.addEventListener('DOMContentLoaded', () => {
    if ('speechSynthesis' in window) {
        window.screenReader = new ScreenReader();
        
        // Fecha os controles ao clicar fora
        document.addEventListener('click', (e) => {
            const accessibilityControls = document.getElementById('accessibilityControls');
            const accessibilityBtn = document.getElementById('accessibilityBtn');
            
            if (accessibilityControls && accessibilityBtn && 
                !accessibilityControls.contains(e.target) && 
                e.target !== accessibilityBtn) {
                accessibilityControls.classList.remove('show');
            }
        });
    } else {
        const accessibilityBtn = document.getElementById('accessibilityBtn');
        if (accessibilityBtn) {
            accessibilityBtn.style.display = 'none';
        }
    }
});