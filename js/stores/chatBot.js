
  function normalizeText(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(str = "") {
  const t = normalizeText(str);
  return t ? t.split(" ").length : 0;
}

function includesAny(textNorm, arr = []) {
  return arr.some(k => textNorm.includes(normalizeText(k)));
}

function includesAll(textNorm, arr = []) {
  return arr.every(k => textNorm.includes(normalizeText(k)));
}

function detectarRompehielosVosk(textoUsuario, intents, opts = {}) {
  const {
    maxWords = 16,   
    maxChars = 140,
    minScore = 3,    // umbral de confianza
  } = opts;

  if (!textoUsuario) return { ok: false, reason: "empty" };

  if (textoUsuario.length > maxChars || wordCount(textoUsuario) > maxWords) {
    return { ok: false, reason: "too_long" };
  }

  const t = normalizeText(textoUsuario);

  let best = null;

  for (const intent of intents) {
    if (intent.deny && includesAny(t, intent.deny)) continue;

    // scoring simple y controlable
    let score = 0;

    if (intent.mustAll && includesAll(t, intent.mustAll)) score += 3;
    if (intent.mustAny && includesAny(t, intent.mustAny)) score += 2;

    if (intent.any) {
      for (const k of intent.any) {
        if (t.includes(normalizeText(k))) score += 1;
      }
    }

    if (!best || score > best.score) {
      best = { intent, score };
    }
  }

  if (!best || best.score < minScore) {
    return { ok: false, reason: "no_match" };
  }

  const list = best.intent.responses || [];
  const pick = list.length ? list[Math.floor(Math.random() * list.length)] : "";
  return { ok: true, id: best.intent.id, text: pick, score: best.score };
}

const rompehielosDoctor = [
  {
    id: "familia",
    mustAny: ["familia", "hijo", "hija", "esposa", "esposo"],
    any: ["como", "esta", "estan", "todo", "bien", "doctor"],
    deny: ["dosis", "estudio", "efecto", "mecanismo", "contraindicacion", "seguridad"],
    responses: [
      "Bien gracias mi hijo esta a punto de graduarse de la universidad pero el tiempo no sobra",
      "La familia bien gracias aunque con poco tiempo ultimamente ahora digame esto",
    ],
  },

  {
    id: "estado_general",
    mustAll: ["como", "esta"],
    any: ["doctor", "doc", "hoy", "todo", "bien"],
    deny: ["dosis", "estudio", "efecto", "mecanismo", "seguridad"],
    responses: [
      "Bien gracias aunque el dia ha estado pesado ahora expliqueme esto",
      "Cansado pero bien digame que propone",
    ],
  },

  {
    id: "dia_trabajo",
    mustAny: ["dia", "consulta", "jornada"],
    any: ["pesado", "largo", "movido", "hoy"],
    deny: ["dosis", "estudio", "efecto", "mecanismo"],
    responses: [
      "Ha sido un dia largo con muchos pacientes pero vamos al punto",
      "Bastante movido hoy expliqueme esto",
    ],
  },

  {
    id: "cansancio",
    mustAny: ["cansado", "agotado"],
    any: ["hoy", "doctor", "dia"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "Si bastante cansado pero sigamos adelante expliqueme esto",
      "Un poco cansado como siempre en consulta que me trae hoy",
    ],
  },

  {
    id: "hospital",
    mustAny: ["hospital", "guardia", "turno"],
    any: ["hoy", "anoche", "semana"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "El hospital ha estado complicado estos dias pero vamos a lo importante",
      "Mucho movimiento en el hospital ultimamente expliqueme esto",
    ],
  },

  {
    id: "saludo_formal",
    mustAny: ["buenos dias", "buenas tardes", "buenas noches"],
    any: ["doctor", "doc"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "Buenos dias vayamos directo al tema",
      "Buenas tardes adelante que tiene para mi hoy",
    ],
  },

  {
    id: "saludo_simple",
    mustAny: ["hola", "buenas"],
    any: ["doctor", "doc"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "Hola adelante expliqueme",
      "Buenas vayamos al punto",
    ],
  },

  {
    id: "semana",
    mustAny: ["semana"],
    any: ["como", "va", "doctor"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "La semana ha sido pesada pero sigamos adelante expliqueme esto",
      "Movida la semana como siempre ahora digame",
    ],
  },

  {
    id: "pacientes",
    mustAny: ["pacientes"],
    any: ["muchos", "cargado", "consulta"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "Si muchos pacientes ultimamente pero vamos a lo que me quiere comentar",
      "Bastante cargada la consulta hoy expliqueme esto",
    ],
  },

  {
    id: "animo",
    mustAny: ["todo", "bien"],
    any: ["doctor", "hoy", "dia"],
    deny: ["dosis", "estudio", "efecto"],
    responses: [
      "Todo bien gracias ahora expliqueme que propone",
      "Bien dentro de lo normal vayamos al punto",
    ],
  },
];

async function responderRompehielosYObjeccionVosk(textoUsuario, objActual) {
  const r = detectarRompehielosVosk(textoUsuario, rompehielosDoctor, {
    maxWords: 16,
    maxChars: 140,
    minScore: 3,
  });

  if (!r.ok) return null;

  const puente = " expliqueme esto";
  
  // CAMBIO PRINCIPAL: Parafrasear la objeción cada vez
  let objeccionTexto = "";
  
  if (objActual?.objeccion) {
    console.log("🔄 Parafraseando objeción para rompehielo...");
    objeccionTexto = await parafrasearObjecionGroq(objActual.objeccion);
  } else if (typeof objActual === "string") {
    objeccionTexto = await parafrasearObjecionGroq(objActual);
  } else {
    objeccionTexto = "";
  }

  const base = r.text;
  const yaTraePuente = base.includes("expliqueme") || base.includes("digame esto");
  
  return yaTraePuente 
    ? `${base} ${objeccionTexto}`.trim() 
    : `${base} ${puente} ${objeccionTexto}`.trim();
}

function esTextoFueraDeTema(textoUsuario, palabrasClaveActuales = [], opts = {}) {
  const {
    minWords = 6,           // Mínimo de palabras para considerar "fuera de tema"
    maxCharsRompehielo = 140, // Si es corto, probablemente sea rompehielo
  } = opts;

  const t = normalizeText(textoUsuario);
  const palabras = wordCount(textoUsuario);
  
  // 1) Si es muy corto, puede ser rompehielo (ya se maneja en otro lado)
  if (textoUsuario.length <= maxCharsRompehielo && palabras < minWords) {
    return false; // Dejamos que lo maneje responderRompehielosYObjeccionVosk
  }

  // 2) Palabras que indican que SÍ está hablando del tema médico/producto
  const palabrasMedicas = [
    "medicamento", "medicina", "farmaco", "dosis", "tratamiento", "paciente",
    "efecto", "secundario", "contraindicacion", "estudio", "clinico", "seguridad",
    "eficacia", "beneficio", "mecanismo", "accion", "prescribir", "recomendar",
    "aprobar", "administrar", "tomar", "producto", "farmaceutico", "terapia",
    "sintoma", "enfermedad", "diagnostico", "resultados", "evidencia", "prueba"
  ];

  // 3) Si menciona alguna palabra clave del contexto actual, está en tema
  if (palabrasClaveActuales && palabrasClaveActuales.length > 0) {
    for (const palabra of palabrasClaveActuales) {
      if (t.includes(normalizeText(palabra))) {
        return false; // Está en tema
      }
    }
  }

  // 4) Si menciona palabras médicas generales, está en tema
  if (includesAny(t, palabrasMedicas)) {
    return false; // Está en tema
  }

  // 5) Detectar temas claramente fuera de contexto
  const temasFueraDeTema = [
    // Deportes
    ["futbol", "balon", "gol", "equipo", "partido"],
    ["basketball", "canasta", "anotar"],
    
    // Entretenimiento
    ["pelicula", "serie", "actor", "netflix", "streaming"],
    ["musica", "cancion", "cantante", "banda", "concierto"],
    ["videojuego", "juego", "consola", "play", "xbox"],
    
    // Comida (si no es relevante al producto)
    ["receta", "cocinar", "restaurant", "comida", "comer", "platillo"],
    
    // Viajes
    ["viaje", "viajar", "vacaciones", "playa", "hotel", "turismo"],
    
    // Tecnología general
    ["celular", "telefono", "computadora", "laptop", "internet", "red social"],
    
    // Política
    ["presidente", "gobierno", "elecciones", "partido", "politico"],
  ];

  for (const grupo of temasFueraDeTema) {
    let coincidencias = 0;
    for (const palabra of grupo) {
      if (t.includes(normalizeText(palabra))) {
        coincidencias++;
      }
    }
    // Si menciona 2+ palabras de un mismo tema irrelevante
    if (coincidencias >= 1) {
      return true; // Definitivamente fuera de tema
    }
  }

  // 6) Si llegamos aquí y tiene muchas palabras pero ninguna relevante, probablemente esté fuera de tema
  if (palabras > 15) {
    return true;
  }

  return false; // Por defecto, asumimos que está en tema
}

// Respuestas cuando está fuera de tema
const respuestasFueraDeTema = [
  "En este momento me gustaría que nos centremos en el tema de la sesión.",
  "Disculpa, pero preferiría que continuemos con lo que estábamos tratando.",
  "Necesito que nos enfoquemos en el producto que me estás presentando.",
  "Perdón por interrumpir, pero me gustaría que regresemos al tema de la consulta.",
  "Prefiero que nos mantengamos en el tema de la sesión. Explícame esto:",
];

function obtenerRespuestaFueraDeTema() {
  return respuestasFueraDeTema[Math.floor(Math.random() * respuestasFueraDeTema.length)];
}