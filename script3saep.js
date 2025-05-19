  // Variáveis globais
  let currentSubject = "";
  let currentCategory = "";
  let userAnswers = {
      matematica: {
          '3saep': {},
          '3passe': {},
          '9passe': {}
      },
      natureza: {
          '3saep': {},
          '3passe': {},
          '9passe': {}
      },
      humanas: {
          '3saep': {},
          '3passe': {},
          '9passe': {}
      },
      linguagens: {
          '3saep': {},
          '3passe': {},
          '9passe': {}
      }
  };

  // Função para mostrar uma tela específica
  function showScreen(screenId) {
      const screens = document.querySelectorAll('.screen');
      screens.forEach(screen => {
          screen.classList.remove('active');
      });
      document.getElementById(screenId).classList.add('active');
  }

  // Função para selecionar matéria
  function selectSubject(subject) {
      currentSubject = subject;
      document.getElementById('subject-title').innerText = `Escolha a Categoria - ${getSubjectName(subject)}`;
      document.getElementById('category-title-3saep').innerText = `${getSubjectName(subject)} - 3º SAEP`;
      document.getElementById('category-title-3passe').innerText = `${getSubjectName(subject)} - 3º PASSE`;
      document.getElementById('category-title-9passe').innerText = `${getSubjectName(subject)} - 9º PASSE`;
      loadSavedAnswers();
      showScreen('category-screen');
  }

  // Função para selecionar categoria
  function selectCategory(category) {
      currentCategory = category;
      showQuestion(category, 1);
      showScreen(`${category}-screen`);
  }

  // Função para mostrar uma questão específica
  function showQuestion(category, pageNumber) {
      const pages = document.querySelectorAll(`#${category}-screen .question-page`);
      pages.forEach(page => {
          page.classList.remove('active');
      });
      const currentPage = document.getElementById(`${category}-page-${pageNumber}`);
      if (currentPage) {
          currentPage.classList.add('active');
      }
      const paginationButtons = document.querySelectorAll(`#${category}-screen .pagination .page-btn`);
      paginationButtons.forEach((btn, index) => {
          btn.classList.remove('active');
          if (index === pageNumber - 1) {
              btn.classList.add('active');
          }
      });
      restoreSelection(category, pageNumber);
  }

  // Função para ir para a próxima questão
  function nextQuestion(category) {
      const activeButton = document.querySelector(`#${category}-screen .pagination .page-btn.active`);
      if (activeButton) {
          const currentPage = parseInt(activeButton.textContent);
          const currentQuestion = userAnswers[currentSubject]?.[category]?.[currentPage];
          if (currentQuestion === undefined) {
              alert("Por favor, selecione uma resposta antes de avançar.");
              return;
          }
          if (currentPage < 5) {
              showQuestion(category, currentPage + 1);
          }
      }
  }

  // Função para selecionar uma opção de resposta
  function selectOption(category, questionNumber, optionIndex) {
      const optionsList = document.querySelectorAll(`#${category}-${questionNumber}-options .option-item`);
      optionsList.forEach(item => {
          item.classList.remove('selected');
      });
      if (optionsList[optionIndex]) {
          optionsList[optionIndex].classList.add('selected');
      }
      if (!userAnswers[currentSubject][category]) {
          userAnswers[currentSubject][category] = {};
      }
      userAnswers[currentSubject][category][questionNumber] = optionIndex;
      saveAnswers();
  }

  // Função para restaurar a seleção de uma questão
  function restoreSelection(category, questionNumber) {
      if (userAnswers[currentSubject] && 
          userAnswers[currentSubject][category] && 
          userAnswers[currentSubject][category][questionNumber] !== undefined) {
          const optionIndex = userAnswers[currentSubject][category][questionNumber];
          const optionsList = document.querySelectorAll(`#${category}-${questionNumber}-options .option-item`);
          optionsList.forEach((item, index) => {
              item.classList.remove('selected');
              if (index === optionIndex) {
                  item.classList.add('selected');
              }
          });
      }
  }

  // Função para salvar as respostas no localStorage
  function saveAnswers() {
      localStorage.setItem('quizConnectAnswers', JSON.stringify(userAnswers));
  }

  // Função para carregar respostas salvas
  function loadSavedAnswers() {
      const savedAnswers = localStorage.getItem('quizConnectAnswers');
      if (savedAnswers) {
          userAnswers = JSON.parse(savedAnswers);
      }
  }

  // Função auxiliar para obter o nome da matéria
  function getSubjectName(subject) {
      const subjects = {
          'matematica': 'Matemática',
          'natureza': 'Natureza',
          'humanas': 'Humanas',
          'linguagens': 'Linguagens'
      };
      return subjects[subject] || subject;
  }

  // Inicialização - carrega dados salvos
  window.onload = function() {
      loadSavedAnswers();
  };