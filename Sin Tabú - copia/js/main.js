/**
 * SIN TABÚ (EDUSEX) - MOTOR INTERACTIVO JAVASCRIPT
 * Interactividad moderna, buscador en tiempo real, quizzes y flip-cards
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Barra de progreso de lectura
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  }

  // 2. Header shadow & Scroll-to-top button
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      if (header) header.classList.remove('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Menú móvil (Drawer)
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const icon = mobileToggle.querySelector('span') || mobileToggle;
      if (mobileDrawer.classList.contains('open')) {
        icon.textContent = '✕';
      } else {
        icon.textContent = '☰';
      }
    });

    // Cerrar al clickear fuera o en un link
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        const icon = mobileToggle.querySelector('span') || mobileToggle;
        icon.textContent = '☰';
      }
    });
  }

  // 4. Buscador y Filtros en Tiempo Real (Para Home / Lista de Temas)
  const searchInput = document.getElementById('topic-search-input');
  const filterPills = document.querySelectorAll('.filter-pill');
  const topicCards = document.querySelectorAll('.topic-card');

  if (searchInput || filterPills.length > 0) {
    let currentCategory = 'all';

    function filterTopics() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

      topicCards.forEach(card => {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const desc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
        const tags = card.getAttribute('data-category') || '';

        const matchesCategory = currentCategory === 'all' || tags.includes(currentCategory);
        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterTopics);
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-filter') || 'all';
        filterTopics();
      });
    });
  }

  // 5. Flip Cards Interactivas (Mitos y Verdades)
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // Filtro de Mitos por categoría si existe
  const mythFilters = document.querySelectorAll('.myth-filter-pill');
  if (mythFilters.length > 0) {
    mythFilters.forEach(pill => {
      pill.addEventListener('click', () => {
        mythFilters.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter') || 'all';

        flipCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Sistema de Pestañas Interactivas (Tabs)
  const tabContainers = document.querySelectorAll('.tabs-container');
  tabContainers.forEach(container => {
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabPanes = container.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = container.querySelector(`#${targetId}`);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  });

  // 7. Mini Quiz Interactivo ("¿Cuánto sabes?")
  const quizBoxes = document.querySelectorAll('.interactive-quiz');
  quizBoxes.forEach(quiz => {
    const questions = JSON.parse(quiz.getAttribute('data-quiz-data') || '[]');
    if (!questions || questions.length === 0) return;

    let currentIndex = 0;
    let score = 0;

    const progressEl = quiz.querySelector('.quiz-progress-pill');
    const questionEl = quiz.querySelector('.quiz-question');
    const optionsContainer = quiz.querySelector('.quiz-options');
    const feedbackEl = quiz.querySelector('.quiz-feedback');
    const nextBtn = quiz.querySelector('.quiz-next-btn');

    function renderQuestion() {
      if (currentIndex >= questions.length) {
        // Pantalla final del quiz
        questionEl.innerHTML = `🎉 ¡Completaste el Quiz!`;
        progressEl.textContent = `Resultado final`;
        optionsContainer.innerHTML = `
          <div style="text-align: center; padding: 1.5rem 0;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${score >= questions.length / 2 ? '🌟' : '💡'}</div>
            <h4 style="font-size: 1.35rem; color: var(--primary); margin-bottom: 0.5rem;">
              Acertaste ${score} de ${questions.length} preguntas
            </h4>
            <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 450px; margin: 0 auto 1.5rem;">
              ${score === questions.length ? '¡Excelente! Tienes conocimientos muy sólidos y claros sobre educación y salud integral.' : '¡Buen trabajo! La educación es un proceso continuo. Explora nuestros temas para seguir aprendiendo sin mitos.'}
            </p>
            <button class="btn btn-primary btn-restart-quiz">🔄 Intentar de nuevo</button>
          </div>
        `;
        feedbackEl.className = 'quiz-feedback';
        feedbackEl.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        const restartBtn = quiz.querySelector('.btn-restart-quiz');
        if (restartBtn) {
          restartBtn.addEventListener('click', () => {
            currentIndex = 0;
            score = 0;
            if (nextBtn) nextBtn.style.display = 'inline-flex';
            renderQuestion();
          });
        }
        return;
      }

      const q = questions[currentIndex];
      progressEl.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
      questionEl.textContent = q.question;
      feedbackEl.className = 'quiz-feedback';
      feedbackEl.style.display = 'none';
      if (nextBtn) {
        nextBtn.style.display = 'none';
        nextBtn.textContent = currentIndex === questions.length - 1 ? 'Ver Resultado' : 'Siguiente Pregunta →';
      }

      optionsContainer.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span style="opacity: 0.6; font-size: 0.85rem;">${String.fromCharCode(65 + idx)}.</span> ${opt.text}`;
        btn.addEventListener('click', () => handleOptionClick(btn, opt, q));
        optionsContainer.appendChild(btn);
      });
    }

    function handleOptionClick(selectedBtn, chosenOpt, currentQ) {
      const allBtns = optionsContainer.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(btn => btn.disabled = true);

      if (chosenOpt.correct) {
        selectedBtn.classList.add('correct');
        feedbackEl.className = 'quiz-feedback success show';
        feedbackEl.innerHTML = `<strong>✅ ¡Correcto!</strong> ${currentQ.explanation || 'Excelente respuesta.'}`;
        score++;
      } else {
        selectedBtn.classList.add('incorrect');
        feedbackEl.className = 'quiz-feedback danger show';
        feedbackEl.innerHTML = `<strong>❌ No exactamente.</strong> ${currentQ.explanation || 'Revisa la información para aprender más.'}`;
        // Marcar la correcta
        currentQ.options.forEach((opt, idx) => {
          if (opt.correct && allBtns[idx]) {
            allBtns[idx].classList.add('correct');
          }
        });
      }

      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex++;
        renderQuestion();
      });
    }

    // Iniciar el quiz
    renderQuestion();
  });
});
