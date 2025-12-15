// Historial global, inicializado con las reglas

/*async function consultarGemini(textoUsuario, intentos = 3, delayMs = 1500) {
  const apiKey = "AIzaSyBx5DA_vRH8MJ3GHSVwPteBcJO_G_BMmTU";
  
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Seguimos guardando el mensaje en el historial local
  historialChat.push({
    role: "user",
    parts: [{ text: textoUsuario }],
  });

  const MAX_HISTORIAL = 20;
  if (historialChat.length > MAX_HISTORIAL) {
    historialChat.splice(1, historialChat.length - MAX_HISTORIAL);
  }

  for (let i = 0; i < intentos; i++) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🔴 AQUÍ ES EL CAMBIO IMPORTANTE:
        // Ya no mandamos historialChat, solo el texto actual del usuario
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: textoUsuario }],
            },
          ],
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      const data = await res.json();
      const respuesta =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No hubo respuesta del modelo.";

      // Seguimos guardando la respuesta en el historial local
      historialChat.push({
        role: "model",
        parts: [{ text: respuesta }],
      });

      return respuesta;
    } catch (error) {
      console.error(`Error intento ${i + 1}:`, error.message);

      if (
        i < intentos - 1 &&
        (error.message.includes("503") ||
          error.message.includes("500") ||
          error.message.includes("429") ||
          error.message.includes("overloaded") ||
          error.message.includes("UNAVAILABLE"))
      ) {
        const wait = delayMs * (i + 1);
        console.warn(`Reintentando en ${wait}ms...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      return "Gemini está sobrecargado o no disponible, intenta de nuevo más tarde.";
    }
  }
}*/


function cambiarTexto(textoUsuario, tipo) {
  let textoU = `${tipo} ${textoUsuario}`;
  return textoU;
}



function obtenerObjecionAleatoria() {
  if (objeciones.length === 0) {
    return null;
  }
  const elegido = objeciones[0];
  objeciones.splice(0, 1);
  return elegido;
}

