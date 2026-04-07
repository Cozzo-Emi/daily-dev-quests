// ==========================================
// CONTROLADOR PRINCIPAL (Orquestador y Estado)
// ==========================================

const state = {
    preguntas: [],
    preguntasEscritas: [], // Nueva lista para la fase 2
    preguntaActualIndex: 0,
    respuestasCorrectas: 0,
    faseEscrita: false // Bandera para saber en qué parte del juego estamos
};

async function initApp() {
    // 1. Consultamos si ya jugó hoy
    if (checkHasPlayedToday()) {
        const resultadoPrevio = getTodayResults();
        showBlockedScreen(resultadoPrevio);
        return;
    }

    // 2. Buscamos los datos (ahora el JSON trae todo el objeto)
    const data = await fetchPreguntas();
    
    // Validamos que exista la propiedad 'preguntas' y tenga elementos
    if (data && data.preguntas && data.preguntas.length > 0) {
        state.preguntas = data.preguntas;
        state.preguntasEscritas = data.preguntasEscritas || [];
        
        renderQuestion(state.preguntas[state.preguntaActualIndex], state.preguntaActualIndex, state.preguntas.length);
    } else {
        document.getElementById('question-text').textContent = "Error al cargar las misiones de hoy.";
    }
}

// ---- MANEJO DE OPCIONES MÚLTIPLES ---- //
function handleOptionSelect(evento, preguntaActual) {
    const botonClickeado = evento.target;
    const indiceElegido = parseInt(botonClickeado.dataset.index);
    const indiceCorrecto = preguntaActual.respuestaCorrecta;
    
    const isCorrect = (indiceElegido === indiceCorrecto);

    if (isCorrect) {
        state.respuestasCorrectas++;
    }

    const opcionesNodos = uiElements.optionsContainer.children;
    showFeedback(isCorrect, preguntaActual.explicacion, opcionesNodos, indiceElegido, indiceCorrecto);
}

// ---- MANEJO DEL DESAFÍO ESCRITO (RF4: Tolerancia) ---- //
function handleWrittenSubmit(respuestaUsuario, pregunta) {
    // 1. Normalizamos: Pasamos todo a minúsculas y quitamos espacios al inicio y final
    const respuestaLimpia = respuestaUsuario.toLowerCase().trim();

    // 2. Tolerancia: Chequeamos si lo que escribió INCLUYE alguna de las respuestas válidas
    const isCorrect = pregunta.respuestasValidas.some(valida => {
        return respuestaLimpia.includes(valida.toLowerCase());
    });

    if (isCorrect) {
        state.respuestasCorrectas++; // Sumamos un punto extra
    }

    // 3. Mostramos feedback
    uiElements.feedbackTitle.textContent = isCorrect ? '¡Impecable! 🎉' : 'Casi... 😅';
    uiElements.feedbackTitle.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    uiElements.feedbackText.textContent = pregunta.explicacion;
    uiElements.feedbackContainer.classList.remove('hidden');
}

// ---- FLUJO Y NAVEGACIÓN ---- //
function handleNextQuestion() {
    uiElements.feedbackContainer.classList.add('hidden');

    // Si ya estábamos en la fase escrita y dimos "Siguiente", terminamos el juego
    if (state.faseEscrita) {
        finalizarJuego();
        return;
    }

    // Si estábamos en opción múltiple, avanzamos de índice
    state.preguntaActualIndex++;

    if (state.preguntaActualIndex < state.preguntas.length) {
        // Sigue habiendo preguntas múltiples
        renderQuestion(state.preguntas[state.preguntaActualIndex], state.preguntaActualIndex, state.preguntas.length);
    } else {
        // Llegamos al final de la Fase 1. Evaluamos si desbloquea la Fase 2 (RF3)
        const porcentaje = (state.respuestasCorrectas / state.preguntas.length) * 100;
        
        if (porcentaje >= 75 && state.preguntasEscritas.length > 0) {
            state.faseEscrita = true;
            // Mostramos la primera pregunta escrita (para este MVP asumimos que hay 1)
            renderWrittenQuestion(state.preguntasEscritas[0]);
        } else {
            // No le alcanzó el puntaje, termina acá.
            finalizarJuego();
        }
    }
}

function finalizarJuego() {
    // Calculamos el total de preguntas jugadas
    let totalJugadas = state.preguntas.length;
    if (state.faseEscrita) {
        totalJugadas += 1; // Sumamos la escrita al total
    }

    const porcentaje = (state.respuestasCorrectas / totalJugadas) * 100;
    const superoPrueba = porcentaje >= 75;
    
    // Guardamos en LocalStorage
    saveDailyAttempt(state.respuestasCorrectas, totalJugadas, superoPrueba);
    showSummary(state.respuestasCorrectas, totalJugadas);
}

// Event Listeners Globales
document.addEventListener('DOMContentLoaded', initApp);
uiElements.nextBtn.addEventListener('click', handleNextQuestion);