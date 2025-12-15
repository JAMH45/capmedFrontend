// 🔑 Define tu API KEY aquí
const OPENROUTER_API_KEY = "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";

// 🌐 Endpoint de OpenRouter
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Opcional
const SITE_URL  = "https://mi-sitio-de-pruebas.com";
const SITE_NAME = "Prueba OpenRouter Frontend";

// ⏱️ Delay helper
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 🚀 Función genérica con 3 reintentos
async function consultarOpenRouter(prompt) {

    if (!prompt) throw new Error("Prompt vacío.");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY no definida.");

    const requestBody = {
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
    };

    const MAX_INTENTOS = 3;

    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        try {
            console.log(`🟡 Intento #${intento} → consultando...`);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": SITE_URL,
                    "X-Title": SITE_NAME
                },
                body: JSON.stringify(requestBody)
            });

            const rawText = await response.text();
           

            let data;
            try {
                data = JSON.parse(rawText);
            } catch (err) {
                throw new Error("No se pudo parsear JSON: " + err.message);
            }

            if (!response.ok) {
                throw new Error(data?.error?.message || `HTTP ${response.status}`);
            }

            const respuesta = data?.choices?.[0]?.message?.content;
            if (!respuesta) {
                throw new Error("Respuesta vacía del modelo.");
            }

            console.log("🟢 Respuesta obtenida:", respuesta);
            return respuesta; // <<--- EXITOSO

        } catch (error) {
            console.warn(`⚠️ Error intento #${intento}:`, error.message);

            if (intento === MAX_INTENTOS) {
                console.error("❌ Falló después de 3 intentos.");
                throw error;
            }

            console.log("⏳ Esperando 1 segundo antes de reintentar...");
            await delay(1000);
        }
    }
}
