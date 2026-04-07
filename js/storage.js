// ==========================================
// CAPA DE PERSISTENCIA (LocalStorage)
// ==========================================

const STORAGE_KEY = 'dailyDevQuestsProgress';

/**
 * Obtiene la fecha actual en formato texto (ej: "07/04/2026")
 */
function getTodayString() {
    const today = new Date();
    // Usamos el formato local de Argentina para estandarizar
    return today.toLocaleDateString('es-AR'); 
}

/**
 * Guarda el intento en el LocalStorage
 */
function saveDailyAttempt(aciertos, total, superoPrueba) {
    const data = {
        lastDate: getTodayString(),
        score: aciertos,
        total: total,
        passed: superoPrueba
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Revisa si el usuario ya jugó el día de hoy
 */
function checkHasPlayedToday() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false; // Nunca jugó
    
    const data = JSON.parse(stored);
    return data.lastDate === getTodayString();
}

/**
 * Obtiene los resultados del intento de hoy
 */
function getTodayResults() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
}