// Função para gerar questões
    function gerarQuestoes(materia) {
      if (materia === "matematica") {
        return [
          {
            pergunta: "Qual comando SQL retorna apenas o nome e o preço dos produtos com preço acima de R$ 100,00?",  
            alternativas: [
              "SELECT PRODUTO FROM NOME, PRECO WHERE PRECO > 100;",
              "SELECT NOME, PRECO WHERE PRECO > 100 FROM PRODUTO;",
              "SELECT NOME, PRECO FROM PRODUTO WHERE PRECO > 100; *",
              "SELECT NOME, PRECO FROM PRODUTO ALL;"
            ]
          },
          {
            pergunta: "Qual expressão condicional define corretamente se o acesso é permitido apenas a maiores de idade?",
            alternativas: ["if idade = 18", "if idade < 18", "if idade <= 17", "if idade >= 18"]
          },
          {
            pergunta: "Qual expressão Python retorna 'Fechado' quando a hora atual está fora do horário de funcionamento (11h às 22h)?",
            alternativas: ["if hora_atual >= 11 or hora_atual <= 22: return 'Fechado'",
              "if hora_atual < 11 or hora_atual > 22: return 'Fechado'",
              "if hora_atual == 11 and hora_atual == 22: return 'Fechado'",
              "if hora_atual < 11 and hora_atual > 22: return 'Fechado'"]
          },
          {
            pergunta: "O que ocorre ao declarar um atributo como private em uma classe?",
            alternativas: ["O atributo não pode ser acessado por outras classes diretamente",
              "O atributo se torna acessível apenas dentro da classe que o declarou", 
              "O atributo se torna público automaticamente",
              "O atributo pode ser alterado por qualquer instância"]
          },
          {
            pergunta: "Qual ferramenta é mais adequada para quebrar um projeto ERP em partes menores e gerenciáveis?",
            alternativas: ["Mapeamento de stakeholders", "Estrutura Analítica do Projeto (EAP)",
              "Método SMART", "Metodologia Scrum"]
          },
          {
            pergunta: "Qual estrutura de dados é ideal para armazenar e acessar 100 nomes diretamente pelo índice?",
            alternativas: ["Fila circular", "Árvore binária", "Vetor", "Pilha"]
          },
          {
            pergunta: "Em um ADC de 9 bits com faixa de 0 a 5V, qual valor de tensão corresponde aproximadamente ao valor digital 460?",
            alternativas: ["1,25V", "2,51V", "3,10V", " 2,26V"]
          },
          {
            pergunta: "Qual comando SQL retorna os nomes dos clientes em ordem alfabética reversa?",
            alternativas: ["SELECT NOME FROM CLIENTES ORDER BY NOME DESC;",
              "SELECT NOME FROM CLIENTES CLASSIFICAR POR NOME DESC;",
              "SELECT NOME FROM CLIENTES AGRUPAR POR NOME DESC;",
              "SELECT NOME, ORDER BY NOME FROM CLIENTES;"]
          }
        ];
        }
    }

    // Gabarito das respostas corretas
    const gabarito = {
      matematica: ["c", "d", "b", "a", "b", "c", "d", "a"],
      ciencias: ["a", "b", "c", "d", "a", "c", "b", "a"],
      historia: ["c", "c", "a", "d", "a", "b", "b", "a"],
      portugues: ["c", "d", "a", "b", "c", "a", "b", "d"]
    };
    
    const materias = {
      matematica: gerarQuestoes("matematica"),
      ciencias: gerarQuestoes("ciencias"),
      historia: gerarQuestoes("historia"),
      portugues: gerarQuestoes("portugues")
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
      provaContainer.style.display = "flex";
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

      const imagemHTML = questao.imagem ? `<img class="questao-imagem" src="${questao.imagem}" alt="Imagem da questão">` : '';

      questaoAtual.innerHTML = `
        <h3>Questão ${indiceQuestao + 1}</h3>
        <p>${questao.pergunta}</p>
        ${imagemHTML}
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