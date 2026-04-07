// ==========================================
// CONTROLADOR PRINCIPAL (Orquestador y Estado)
// ==========================================

const state = {
    preguntas: [],
    preguntasEscritas: [],
    preguntaActualIndex: 0,
    respuestasCorrectas: 0,
    faseEscrita: false 
};

// (Shuffle)
function obtenerAleatorias(array, cantidad) {
    const mezclado = [...array].sort(() => 0.5 - Math.random());
    return mezclado.slice(0, cantidad);
}

async function initApp() {
    if (checkHasPlayedToday()) {
        const resultadoPrevio = getTodayResults();
        showBlockedScreen(resultadoPrevio);
        return;
    }

    const data = await fetchPreguntas();
    
    if (data && data.preguntas && data.preguntas.length > 0) {
        // 20 aleatorias para la Fase 1
        state.preguntas = obtenerAleatorias(data.preguntas, 20);
        
        //  5 aleatorias para la Fase Escrita
        if (data.preguntasEscritas && data.preguntasEscritas.length > 0) {
            state.preguntasEscritas = obtenerAleatorias(data.preguntasEscritas, 5);
        }
        
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

// ---- MANEJO DEL DESAFÍO ESCRITO ---- //
function handleWrittenSubmit(respuestaUsuario, pregunta) {
    const respuestaLimpia = respuestaUsuario.toLowerCase().trim();

    const isCorrect = pregunta.respuestasValidas.some(valida => {
        return respuestaLimpia.includes(valida.toLowerCase());
    });

    if (isCorrect) {
        state.respuestasCorrectas++; 
    }

    uiElements.feedbackTitle.textContent = isCorrect ? '¡Impecable! 🎉' : 'Casi... 😅';
    uiElements.feedbackTitle.style.color = isCorrect ? 'var(--success)' : 'var(--error)';
    uiElements.feedbackText.textContent = pregunta.explicacion;
    uiElements.feedbackContainer.classList.remove('hidden');
}

// ---- FLUJO Y NAVEGACIÓN ---- //
function handleNextQuestion() {
    uiElements.feedbackContainer.classList.add('hidden');

    if (state.faseEscrita) {
        state.preguntaActualIndex++;
        // Verificamos si quedan preguntas de la Fase Escrita
        if (state.preguntaActualIndex < state.preguntasEscritas.length) {
            renderWrittenQuestion(state.preguntasEscritas[state.preguntaActualIndex], state.preguntaActualIndex, state.preguntasEscritas.length);
        } else {
            finalizarJuego();
        }
        return;
    }

    // Flujo normal Fase 1
    state.preguntaActualIndex++;

    if (state.preguntaActualIndex < state.preguntas.length) {
        renderQuestion(state.preguntas[state.preguntaActualIndex], state.preguntaActualIndex, state.preguntas.length);
    } else {
        // Pasamos a Fase 2 si sacó 75% o más en la Fase 1
        const porcentaje = (state.respuestasCorrectas / state.preguntas.length) * 100;
        
        if (porcentaje >= 75 && state.preguntasEscritas.length > 0) {
            state.faseEscrita = true;
            state.preguntaActualIndex = 0; // Reseteamos el índice para la fase escrita
            renderWrittenQuestion(state.preguntasEscritas[0], 0, state.preguntasEscritas.length);
        } else {
            finalizarJuego();
        }
    }
}

function finalizarJuego() {
    let totalJugadas = state.preguntas.length;
    if (state.faseEscrita) {
        totalJugadas += state.preguntasEscritas.length; 
    }

    const porcentaje = (state.respuestasCorrectas / totalJugadas) * 100;
    const superoPrueba = porcentaje >= 75;
    
    saveDailyAttempt(state.respuestasCorrectas, totalJugadas, superoPrueba);
    showSummary(state.respuestasCorrectas, totalJugadas);
}

document.addEventListener('DOMContentLoaded', initApp);
uiElements.nextBtn.addEventListener('click', handleNextQuestion);