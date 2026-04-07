// ==========================================
// CAPA DE PRESENTACIÓN (UI)
// ==========================================

const uiElements = {
    questionCard: document.getElementById('question-card'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar'),
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackText: document.getElementById('feedback-text'),
    nextBtn: document.getElementById('next-btn')
};

function renderQuestion(pregunta, indexActual, totalPreguntas) {
    uiElements.questionText.textContent = pregunta.texto;
    uiElements.optionsContainer.innerHTML = '';
    
    uiElements.progressText.textContent = `${indexActual + 1}/${totalPreguntas}`;
    uiElements.progressBar.value = indexActual + 1;
    uiElements.progressBar.max = totalPreguntas;

    pregunta.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opcion;
        btn.dataset.index = index;
        
        btn.addEventListener('click', (e) => handleOptionSelect(e, pregunta));
        
        uiElements.optionsContainer.appendChild(btn);
    });
}

function showFeedback(isCorrect, explicacion, opcionesNodos, indiceElegido, indiceCorrecto) {
    Array.from(opcionesNodos).forEach(btn => btn.disabled = true);

    opcionesNodos[indiceCorrecto].classList.add('correct');
    
    if (!isCorrect) {
        opcionesNodos[indiceElegido].classList.add('incorrect');
    }

    uiElements.feedbackTitle.textContent = isCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😅';
    uiElements.feedbackTitle.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    uiElements.feedbackText.textContent = explicacion;
    uiElements.feedbackContainer.classList.remove('hidden');
}

function showSummary(aciertos, total) {
    const porcentaje = (aciertos / total) * 100;
    const superoPrueba = porcentaje >= 75;

    uiElements.questionCard.innerHTML = `
        <h2 style="text-align: center;">¡Misiones del día completadas! 🚀</h2>
        <div style="text-align: center; margin: 20px 0; font-size: 1.2rem;">
            <p>Tu puntuación: <strong>${aciertos} de ${total}</strong> (${porcentaje}%)</p>
            <p style="color: ${superoPrueba ? 'var(--success)' : 'var(--error)'}; font-weight: bold;">
                ${superoPrueba ? '¡Excelente! Has superado el desafío escrito. 🔓' : 'Sigue practicando, ¡mañana habrá más misiones! 🔒'}
            </p>
        </div>
    `;
    uiElements.feedbackContainer.classList.add('hidden');
}

function showBlockedScreen(resultadoPrevio) {
    document.querySelector('header').classList.add('hidden');
    
    uiElements.questionCard.innerHTML = `
        <h2 style="text-align: center; color: var(--text-main);">⏳ ¡Misiones en enfriamiento!</h2>
        <div style="text-align: center; margin: 30px 0; font-size: 1.1rem;">
            <p>Ya completaste las misiones del día.</p>
            <p style="margin-top: 15px;">Tu puntuación de hoy fue: <br>
                <strong style="font-size: 1.5rem; color: var(--primary);">${resultadoPrevio.score} de ${resultadoPrevio.total}</strong>
            </p>
            <p style="margin-top: 25px; font-size: 0.95rem; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 15px;">
                Vuelve mañana para nuevos desafíos de código. ☕
            </p>
        </div>
    `;
    uiElements.feedbackContainer.classList.add('hidden');
}

/**
 * LA FUNCIÓN QUE FALTABA: Dibuja la pregunta escrita y su campo de texto
 */
function renderWrittenQuestion(pregunta) {
    uiElements.questionText.textContent = "🔥 Desafío Bonus: " + pregunta.texto;
    
    // Inyectamos un input y un botón en lugar de las opciones múltiples
    uiElements.optionsContainer.innerHTML = `
        <input type="text" id="written-input" class="written-input" placeholder="Escribe tu respuesta aquí..." autocomplete="off">
        <button id="submit-written-btn" class="option-btn" style="background-color: var(--primary); color: white; text-align: center; font-weight: bold;">Validar Respuesta</button>
    `;

    // Actualizamos la barra para indicar que estamos en la fase final
    uiElements.progressText.textContent = "Fase Escrita";
    uiElements.progressBar.value = uiElements.progressBar.max;

    // Conectamos el botón de enviar
    document.getElementById('submit-written-btn').addEventListener('click', () => {
        const inputElement = document.getElementById('written-input');
        const respuestaUsuario = inputElement.value;
        
        // Deshabilitamos para que no hagan doble clic
        inputElement.disabled = true;
        document.getElementById('submit-written-btn').disabled = true;
        
        // Le avisamos al Orquestador
        handleWrittenSubmit(respuestaUsuario, pregunta); 
    });
}