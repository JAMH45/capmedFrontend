// ========================================
// GROQ API - Parafraseo de Objeciones
// ========================================


//const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Parafrasea una objeción médica manteniendo el significado
 * @param {string} textoOriginal - Objeción original
 * @param {number} intentos - Número de reintentos
 * @returns {Promise<string>} - Objeción parafraseada
 */
async function parafrasearObjecionGroq(textoOriginal, intentos = 3) {
  if (!textoOriginal || textoOriginal.trim() === "") {
    console.warn("⚠️ Texto vacío para parafrasear");
    return textoOriginal;
  }

  const prompt = `Reescribe esta objeción médica como si fuera un doctor escéptico y ocupado hablando. Debe sonar natural, directo y sin rodeos.

REGLAS ESTRICTAS:
- Máximo 50 palabras
- Usa SIEMPRE "medicamento" o "medicina", NUNCA "drogas"
- Tono coloquial mexicano pero profesional
- Sé directo, sin redundancias ni repeticiones
- Muestra escepticismo sutil
- Palabras clave: "mira", "oye", "la verdad", "no me convence"
- NO repitas ideas (ejemplo MAL: "sin problema o si hay problema")
- Mantén el significado exacto
- Solo la objeción, sin comillas ni explicaciones
- Si te piden que saludes saluda si no no lo hagas. 
Objeción original:
"${textoOriginal}"

Objeción parafraseada:`;

  for (let i = 0; i < intentos; i++) {
    try {
      console.log(`🔄 Parafraseando (intento ${i + 1}/${intentos})...`);

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Eres un doctor mexicano escéptico y ocupado. Hablas directo, sin rodeos, de forma coloquial pero profesional. Usas 'medicamento' o 'medicina', NUNCA 'drogas'. Evitas redundancias. Eres breve y vas al punto. Muestras escepticismo sutil pero natural.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.85,
          max_tokens: 70,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      let parafraseada = data?.choices?.[0]?.message?.content?.trim();

      if (!parafraseada || parafraseada === "") {
        throw new Error("Respuesta vacía de Groq");
      }

      // Limpiar comillas, formato extra y posibles prefijos
      parafraseada = parafraseada
        .replace(/^["']|["']$/g, "")
        .replace(/^Objeción parafraseada:\s*/i, "")
        .replace(/^\*\*/g, "")
        .replace(/\*\*$/g, "")
        .trim();

      console.log("✅ Parafraseo exitoso");
      console.log("Original:", textoOriginal);
      console.log("Parafraseada:", parafraseada);

      return parafraseada;
    } catch (error) {
      console.error(`❌ Error en intento ${i + 1}:`, error.message);

      if (i === intentos - 1) {
        console.warn("⚠️ Usando objeción original por fallos en parafraseo");
        return textoOriginal;
      }

      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }

  return textoOriginal;
}

/**
 * Genera retroalimentación breve y accionable (positiva o negativa) según calificación,
 * y SIEMPRE relacionada al texto que mandes.
 *
 * - score: número 0..100 (si mandas 0..10 también lo convierto)
 * - umbralPositivo: por defecto 75 (>= positivo, < negativo)
 * - retorna SOLO la retroalimentación (sin comillas, sin explicaciones)
 */
async function generarRetroalimentacionGroq(
  textoOriginal,
  score,
  intentos = 3,
  umbralPositivo = 75
) {
  // Normaliza a string sí o sí
  if (textoOriginal == null) textoOriginal = "";
  if (typeof textoOriginal !== "string") {
    try { textoOriginal = JSON.stringify(textoOriginal); }
    catch { textoOriginal = String(textoOriginal); }
  }

  if (textoOriginal.trim() === "") {
    console.warn("⚠️ Texto vacío para retroalimentación");
    return "No me dijiste nada útil. Dime tu respuesta y te digo qué ajustar.";
  }

  let cal = Number(score);
  if (!Number.isFinite(cal)) cal = 0;
  if (cal >= 0 && cal <= 10) cal = cal * 10;
  cal = Math.max(0, Math.min(100, cal));

  const esPositiva = cal >= umbralPositivo;

  const prompt = `
Actúa como doctor mexicano escéptico y ocupado dando retroalimentación a un agente sobre su respuesta.

TEXTO DEL AGENTE:
"${textoOriginal}"

TIPO DE RETRO:
${esPositiva ? "POSITIVA" : "NEGATIVA"}

REGLAS ESTRICTAS:
- Máximo 60 palabras
- Español mexicano profesional, directo, sin rodeos
- Habla COMO doctor (usa frases tipo: "mira", "oye", "la verdad", "no me convence" si cabe)
- NO menciones "calificación", "score", "puntos", "72/100" ni nada parecido
- Debe referirse a algo concreto del texto (1 acierto o 1 falla específica)
- POSITIVA: 1 acierto + 1 mejora puntual
- NEGATIVA: 1 falla clave + 2 mejoras concretas
- Solo la retro, sin títulos, sin listas, sin comillas, sin explicar reglas

Retroalimentación:`.trim();

  for (let i = 0; i < intentos; i++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Eres un doctor mexicano escéptico y ocupado. Das retroalimentación breve y accionable sobre lo que te dijo un agente. Jamás mencionas calificaciones, puntajes ni números. Hablas directo, sin rodeos, sin listas, sin títulos. Siempre te basas SOLO en el texto recibido.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.55,
          max_tokens: 95,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      let feedback = data?.choices?.[0]?.message?.content?.trim();
      if (!feedback) throw new Error("Respuesta vacía de Groq");

      feedback = feedback
        .replace(/^["']|["']$/g, "")
        .replace(/^Retroalimentación:\s*/i, "")
        .trim();

      // Si el modelo se pasa de listo y menciona calificación, reintenta
      if (/(calificaci[oó]n|score|puntos|\d+\/100)/i.test(feedback)) {
        throw new Error("Incluyó calificación/score (no permitido)");
      }

      return feedback;
    } catch (error) {
      console.error(`❌ Error en intento ${i + 1}:`, error.message);

      if (i === intentos - 1) {
        return esPositiva
          ? "Mira, se entiende tu idea y vas al punto. Solo amárralo mejor: dime el beneficio principal del medicamento y en qué paciente aplica, para que no suene genérico."
          : "La verdad no me convence: tu mensaje se siente vago y no me queda claro el valor del medicamento. Aterriza en un beneficio específico y menciona para qué tipo de paciente aplica; luego cierra con una pregunta directa para avanzar.";
      }

      await new Promise((r) => setTimeout(r, 900 * (i + 1)));
    }
  }
}


/**
 * Parafrasea múltiples objeciones en paralelo
 * @param {Array<string>} textos - Array de objeciones
 * @returns {Promise<Array<string>>} - Array de objeciones parafraseadas
 */
async function parafrasearVariasObjeciones(textos) {
  const promesas = textos.map((texto) => parafrasearObjecionGroq(texto));
  return await Promise.all(promesas);
}
