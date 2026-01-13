const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");
const scopeEl = document.getElementById("scope-boton");
let objeciones;
console.log("Tipo recibido:", tipo);
let saludo;
let doctorIa;
let vozIa;
let instruccion;
let historialChat;
let interrupcionesActivas;
let coaching = true;
let primerRespuesta;
let indiceObjeccionActual = 0;
actividades = JSON.parse(localStorage.getItem("actividades")) || {};
console.log(actividades);
const dataFromLS = getRoleplayDataFromLocalStorage();
const data = dataFromLS;
const listaObjecciones = Object.values(data.docpack.objecciones);

objeciones = data.docpack.objecciones;


/**
 * Obtiene la objeción actual y la parafrasea antes de usarla
 * @param {boolean} forzarParafraseo - Si true, siempre parafrasea
 * @returns {Promise<Object>} - Objeto con objeción parafraseada
 */
async function obtenerObjecionParafraseada(forzarParafraseo = true) {
  const objOriginal = obtenerObjeccionActual();
  
  if (!objOriginal) {
    console.error("❌ No hay objeción actual");
    return null;
  }

  // Crear copia para no modificar el original
  const objParafraseada = { ...objOriginal };

  // Parafrasear si se requiere
  if (forzarParafraseo) {
    try {
      console.log("🔄 Parafraseando objeción:", objOriginal.titulo);
      
      const textoParafraseado = await parafrasearObjecionGroq(objOriginal.objeccion);
      
      objParafraseada.objecionParafraseada = textoParafraseado;
      objParafraseada.usandoParafraseada = true;
      
    } catch (error) {
      console.error("❌ Error al parafrasear:", error);
      objParafraseada.objecionParafraseada = objOriginal.objecion;
      objParafraseada.usandoParafraseada = false;
    }
  } else {
    objParafraseada.objecionParafraseada = objOriginal.objecion;
    objParafraseada.usandoParafraseada = false;
  }

  return objParafraseada;
}

console.log(objeciones);
/*
(async () => {
  try {
    console.log(objeciones);

    let titulosConcatenados = "";
    let contTitulos = 1;

    for (const key of Object.keys(objeciones)) {
      const titulo = contTitulos + "." + (objeciones[key].titulo || " ");
      contTitulos++;
      titulosConcatenados += titulo + " ";
    }

    titulosConcatenados = titulosConcatenados.trim();
    console.log(titulosConcatenados);

    // Llamada a la IA
    let nuevasObjs = await consultarIa(titulosConcatenados);

    // Extraer bloques entre corchetes
    const gruposNuevos = nuevasObjs.match(/\[[^\]]*]/g) || [];
    console.log("🧩 Nuevas objecciones en bruto:", gruposNuevos);

    // Reemplazos
    const keys = Object.keys(objeciones);

    keys.forEach((key, idx) => {
      const grupo = gruposNuevos[idx] || "";

      if (!grupo) return;

      const textoNuevo = grupo.replace(/^\[/, "").replace(/]$/, "").trim();

      if (textoNuevo.length > 0) {
        objeciones[key].objeccion = textoNuevo;
      }
    });

    console.log("✅ Objecciones finales con texto IA:", objeciones);

  } catch (error) {
    console.warn("⚠️ Ocurrió un error. Se mantienen las objecciones originales:", error);
    // Aquí NO hacemos nada porque ya queremos dejar objeciones tal como están.
  }
})();
console.log(objeciones);
*/
async function consultarIa() {
  let prompt = `Regresame un saludo, eres el doctor Jose Smith y te vengo a ofrecer un medicamento. Pide que te presente el medicamento de una forma seria. SOlo regresa el texto que te pedi nada mas.`;
  let respuesta = await consultarOpenRouter(prompt);
  return respuesta;
}

if (tipo == "doctor") {
  primerRespuesta =
    "Saluda, eres una agente de ventas que viene a ofrecer casec a un doctor. da una breve pero buena presentacion del producto.";
  doctorIa = "Marianne_Chair_Sitting_public";
  vozIa = "28f7220adbc144eeba42d70e1e969b29";
  document.getElementById("nombreIa").innerText =
    "Agente de Ventas - Estefani López";

  document.getElementById("nombreUsuario").innerText = "Tu - Doctor";
  document.getElementById("tituloIa").innerText =
    "Agente de Ventas - Estefani López";
  document.getElementById("tituloUse").innerText = "Tu - Doctor";

  agregarClase("indicat", "hidden");
  historialChat = [
    {
      role: "user",
      parts: [
        {
          text: `Reglas de la conversación:
Responde de manera breve, clara y en español. No uses caracteres raros ni Markdown.
Sé amable, persuasivo y profesional, como un agente de ventas experimentado.

Contexto:
Eres un representante de ventas llamado Estefani López. Trabajas para Bausch Health y vienes a ofrecer un medicamento llamado Casec al unh doctor.
Tu objetivo es convencerlo de recetar Casec a sus pacientes. 

Vas a recibir tres tipos de mensajes:

Objeccion: Cuando recibas un mensaje que empiece con "Objeccion", genera una respuesta persuasiva y profesional, como un vendedor que aclara dudas o responde con argumentos médicos o comerciales. Sé breve pero convincente.

Respuesta: Cuando recibas un mensaje que empiece con "Respuesta", considéralo una duda o comentario del doctor sobre lo que dijiste anteriormente o sobre la objeción previa. Tu tarea es responder directamente a esa duda o comentario, manteniendo el tono empático y persuasivo.

Finalizado: Cuando recibas "Finalizado", despídete amablemente, agradeciendo el tiempo del doctor y dejando una frase de cierre positiva, como lo haría un representante de ventas.

Instrucciones adicionales:
- Mantén siempre el tono humano y profesional.
- No menciones que eres IA ni que estás simulando.
- No inventes datos clínicos falsos, pero puedes referirte a beneficios generales del producto (absorción, eficacia, respaldo médico, etc.).
- Si el mensaje está vacío, responde con: "Doctor, ¿podría repetir su duda? No la escuché bien."`,
        },
      ],
    },
  ];
  interrupcionesActivas = false;
  coaching = false;
}
if (tipo == "agente") {
  const raw = localStorage.getItem("roleplay_agente");

  /*if (raw) {
  try {
    const parsed = JSON.parse(raw);
    const objectionsArray = parsed.objections || [];

    const formateadas = objectionsArray.map((item) => ({
      objecion: item.objection || "",
      argumento: item.response || "",
    }));

    // 🔹 Unimos la presentación con el resto de objeciones
    objeciones = [...objeciones, ...formateadas];

    window.objeciones = objeciones;
  } catch (e) {
    console.error("Error parseando:", e);
    window.objeciones = objeciones;
  }
} else {
  window.objeciones = objeciones;
}*/

  console.log("OBJECIONES FINALES:", objeciones);
  cargarObjeccionesEnLista(objeciones);
  // Recargar después de un delay para asegurar que el DOM móvil esté listo
  setTimeout(() => {
    cargarObjeccionesEnLista(objeciones);
  }, 200);
  primerRespuesta = data.docpack.saludo;
  doctorIa = data.docpack.id_avatar;
  vozIa = data.docpack.idvox;
  historialChat = [];
  interrupcionesActivas = true;
  coaching = false;

}
if (tipo == "coach") {
  primerRespuesta =
    "Saluda, eres un coach virtual que ayuda a agentes de ventas o capacitadores y lideres de distrito en asuntos relacionados con Casec, ayudas con vestimenta, planes de capacitacion, consejos de ventas, sentimientos. Presentate y di todo lo que puedes hacer. Menciona lo de la ayuda a capacitadores o lideres de distrito";
  doctorIa = "Anthony_Chair_Sitting_public";
  vozIa = "ba29ba1db9f44f819cea73b15167be7e";
  interrupcionesActivas = false;
  historialChat = [
    {
      role: "user",
      parts: [
        {
          text: `Reglas de la conversación:
Responde de manera breve, clara y en español. No uses caracteres raros ni Markdown.
Sé amable, profesional y directo.

Contexto:
Eres un COACH virtual especializado en capacitación de ventas médicas. Tu función es ayudar al usuario a practicar cómo manejar objecciones o responder dudas reales de doctores sobre un medicamento llamado Casec.

El usuario puede elegir dos modos:
- Modo "Programa": tú actúas como el doctor "José" y le presentas una objeción al usuario para que practique su respuesta. Cuando el usuario responda, tú evalúas su respuesta y le das retroalimentación con una calificación del 0 al 100, como un maestro serio pero cordial. Si el usuario escribe la palabra "siguiente", le presentas la siguiente objeción del listado. Puedes seguir platicando de un objeccion o repetirla si el usuario te lo pide.
- Modo "Libre": el usuario puede hacerte preguntas o comentarios directamente, y tú respondes como coach (no evalúas).
- Limita tus respuestas a que no pase de  70 palabras. 
- Todo como si fuera una platica normal.

Vas a recibir tres tipos de mensajes:

Objeccion: Cuando recibas un mensaje que empiece con "Objeccion", plantea una objeción médica o comercial realista basada en el texto que acompaña. No repitas literal, parafrasea y hazlo sonar natural, como un doctor con dudas legítimas.

Respuesta: Cuando recibas un mensaje que empiece con "Respuesta:", considéralo como el intento del usuario de responder tu última objeción. Debes evaluarlo con retroalimentación y calificación al final entre paréntesis (ejemplo: (85)). Explica si fue convincente, qué partes son sólidas y qué podría mejorar.

Finalizado: Cuando recibas "Finalizado", despídete amablemente y comenta si, basándote en las respuestas del usuario, el doctor probablemente recetaría Casec o no.

Si el usuario escribe "siguiente", pasa automáticamente a la siguiente objeción de la lista.

Si el usuario deja la respuesta vacía, responde con: (1) El usuario no respondió.

Mantén el tono profesional, motivador y realista. Eres un entrenador, no un juez.

Listado de objecciones y sus argumentos que usarás en orden:
1. Es más caro que Ensure Advance → Casec ofrece caseinato de alta biodisponibilidad, optimizando recuperación por cada peso.
2. No hay estudios locales → Estudios globales (Clinical Nutrition, 2020) son aplicables; Nestlé los comparte.
3. Prefiero marcas más conocidas → Casec, respaldado por Nestlé, destaca por ciencia, no solo marketing.
4. No veo diferencia con genéricos → Mayor biodisponibilidad (Nestlé, 2021) mejora resultados vs. opciones baratas.
5. Es caro para el beneficio → Reduce cantidad necesaria por su calidad, rentable a largo plazo.
6. No lo recomiendan mis colegas → 500+ médicos en México lo usan; comparta sus casos.
7. No está en hospitales públicos → Ideal para clínicas privadas; Nestlé trabaja en inclusión pública.

.`,
        },
      ],
    },
  ];
  agregarClase("btnObjections", "hidden");
  agregarClase("btnObejetionsMv", "hidden");
  agregarClase("contar", "hidden");
  agregarClase("indicat", "hidden");
  document.getElementById("nombreIa").innerText = "Coach Virtual";
  document.getElementById("nombreUsuario").innerText =
    "Tu - Agente de ventas en entrenamiento";
  document.getElementById("tituloIa").innerText = "Coach Virtual";
  document.getElementById("tituloUse").innerText =
    "Tu - Agente de ventas en entrenamiento";
}

function agregarClase(idElemento, clase) {
  const el = document.getElementById(idElemento);
  if (el && !el.classList.contains(clase)) {
    el.classList.add(clase);
  }
}

function quitarClase(idElemento, clase) {
  const el = document.getElementById(idElemento);
  if (el && el.classList.contains(clase)) {
    el.classList.remove(clase);
  }
}

function cargarObjeccionesEnLista(objeccionesFuente) {
  // Contenedores (web/móvil)
  const contWeb = document.getElementById("listaObjecionesWeb");
  const contMv  = document.getElementById("listaObjecionesMv");

  console.log("🔍 Buscando contenedores:");
  console.log("- Web:", contWeb);
  console.log("- Móvil:", contMv);

  if (!contWeb && !contMv) {
    console.error("❌ No se encontró ningún contenedor (ni Web ni Móvil)");
    return;
  }

  // Resolver lista de objeciones
  let lista;

  if (Array.isArray(objeccionesFuente)) {
    lista = objeccionesFuente;
  } else if (objeccionesFuente && typeof objeccionesFuente === "object") {
    lista = Object.values(objeccionesFuente);
  } else if (typeof data !== "undefined" && data?.docpack?.objecciones) {
    lista = Object.values(data.docpack.objecciones);
  } else {
    console.warn("⚠️ No hay objeciones para cargar:", objeccionesFuente);
    return;
  }

  console.log("📋 Lista de objeciones a cargar:", lista);

  const render = (container, prefix) => {
    if (!container) return;
    container.innerHTML = "";

    lista.forEach((obj, idx) => {
      const titulo = obj?.titulo || `Objeción ${idx + 1}`;

      // ids para poder cambiar iconos luego
      const itemId = `${prefix}-obj-${idx}`;
      const iconWrapId = `${prefix}-iconWrap-${idx}`;
      const iconId = `${prefix}-icon-${idx}`;

      const item = document.createElement("div");
      item.id = itemId;
      item.className = "flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm";

      // Todo inicia en estado "pendiente" (reloj amarillo)
      item.innerHTML = `
        <div id="${iconWrapId}" class="w-5 h-5 rounded-full flex items-center justify-center">
          <i id="${iconId}" class="bi bi-clock text-yellow-500 text-lg"></i>
        </div>
        <span class="text-sm text-gray-800">${titulo}</span>
      `;

      container.appendChild(item);
    });

    console.log(`✅ Lista (${prefix}) llenada con ${lista.length} objeciones`);
  };

  render(contWeb, "web");
  render(contMv, "mv");

  // Actualizar contador si lo sigues usando
  const total = lista.length;
  let elProgTot = document.getElementById("mfProgTot") || document.getElementById("mfProgTotMv");
  if (elProgTot) elProgTot.textContent = total;
  window.__objProg = { idx: 0, total };
}

function getRoleplayDataFromLocalStorage() {
  const params = new URLSearchParams(window.location.search);
  const id = "CAMZYOS-1-4-AGENTE";
  const tipo = params.get("tipo"); // agente / doctor

  if (!id) {
    console.error("No se recibió id en la URL");
    return null;
  }

  let actividades = {};
  try {
    actividades = JSON.parse(localStorage.getItem("actividades")) || {};
    console.log(actividades);
  } catch (e) {
    console.error("Error leyendo 'actividades' de localStorage:", e);
    return null;
  }

  const actividad = actividades[id];
  if (!actividad) {
    console.error("No se encontró la actividad con id:", id);
    return null;
  }

  // Opcional: advertir si no coincide el tipo de la URL con el de la actividad
  if (tipo && actividad.tipo && actividad.tipo !== tipo) {
    console.warn(
      `El tipo de la URL (${tipo}) no coincide con el de la actividad (${actividad.tipo})`
    );
  }

  const config = actividad.config || {};

  // 🧠 Caso 1: nueva forma → config = { docpack: {...}, role: "agente" }
  if (config.docpack) {
    return {
      docpack: config.docpack,
    };
  }

  // 🧠 Caso 2: por compatibilidad, si alguna vez guardaste el docpack plano
  // (idvox, id_avatar, nombre, saludo, objecciones)
  if (config.idvox || config.objecciones) {
    return {
      docpack: config,
    };
  }

  console.error(
    "No se encontró docpack válido en config de la actividad:",
    config
  );
  return null;
}

// ===== EVENT LISTENERS PARA MODAL MÓVIL =====
const btnObjecionesMv = document.getElementById("btnObejetionsMv"); // Nota: tiene el typo del HTML
const modalObjecionesMv = document.getElementById("modalObjeccionesMv");
const closeModalObjecionesMv = document.getElementById("closeModalObjeccionesMv");
const okModalObjecionesMv = document.getElementById("okModalObjeccionesMv");

if (btnObjecionesMv) {
  btnObjecionesMv.addEventListener("click", () => {
    modalObjecionesMv.classList.remove("hidden");
  });
}

if (closeModalObjecionesMv) {
  closeModalObjecionesMv.addEventListener("click", () => {
    modalObjecionesMv.classList.add("hidden");
  });
}

if (okModalObjecionesMv) {
  okModalObjecionesMv.addEventListener("click", () => {
    modalObjecionesMv.classList.add("hidden");
  });
}

if (modalObjecionesMv) {
  modalObjecionesMv.addEventListener("click", (e) => {
    if (e.target === modalObjecionesMv) {
      modalObjecionesMv.classList.add("hidden");
    }
  });
}