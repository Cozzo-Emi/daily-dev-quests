// ==========================================
// CAPA DE SERVICIO (Manejo de Datos)
// ==========================================

/**
 * Obtiene las preguntas desde el archivo JSON local.
 */
async function fetchPreguntas() {
    try {
        // En un entorno real con servidor, acá iría la URL de tu API o de Netlify Functions
        const response = await fetch('data/preguntas.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar el archivo de preguntas');
        }
        
        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Falla crítica en el servicio:", error);
        // Retornamos un array vacío para que la app no explote si falla la carga
        return [];
    }
}