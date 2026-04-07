# 🚀 Daily Dev Quests - Plataforma Gamificada de Aprendizaje

Una aplicación web diseñada para reforzar buenas prácticas de programación mediante desafíos diarios. Construida con **Arquitectura MVC** y **Vanilla JavaScript**, esta plataforma evalúa conocimientos técnicos con un sistema de intentos diarios, persistencia de datos y un extenso banco de preguntas rotativas.

🎮 **[¡Pon a prueba tus conocimientos aquí!](https://daily-dev-quests.netlify.app/)**

## 🛠️ Stack Tecnológico y Características
* **Frontend:** HTML5 Semántico, CSS3 (Diseño responsivo y UI Gamificada), Vanilla JS (ES6+).
* **Arquitectura:** Patrón MVC (Modelo-Vista-Controlador) para una base de código escalable y mantenible, consumiendo datos desde un archivo JSON local.
* **Generación Dinámica (Algoritmo Fisher-Yates):** El sistema selecciona aleatoriamente 20 preguntas de opción múltiple y 5 desafíos escritos diarios desde un banco de más de 180 preguntas, asegurando una experiencia de aprendizaje única cada día.
* **Persistencia de Datos:** Uso de `localStorage` para implementar un sistema de "enfriamiento" (cooldown) de 24 horas, guardando el puntaje y bloqueando nuevos intentos hasta el día siguiente para fomentar el hábito constante.
* **Validación Tolerante:** Algoritmos de normalización de strings que evalúan las respuestas escritas de forma flexible, ignorando diferencias de mayúsculas, minúsculas y espacios periféricos.
* **CI/CD:** Despliegue automático y continuo integrado directamente con Netlify.

## 👨‍💻 Sobre el Autor
Soy estudiante avanzado de desarrollo de software con base técnica en **Soporte IT** (Certificación Profesional de Soporte de TI de Google). Aplico mis conocimientos técnicos coordinando talleres de tecnología e impulsando el aprendizaje mediante proyectos interactivos.

---
*Explora mi código y conectemos en [LinkedIn](https://www.linkedin.com/in/emi-cozzolino/).*
