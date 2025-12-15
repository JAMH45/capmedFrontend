// ============================================
// DETECCIÓN DE DISPOSITIVO Y CONFIGURACIÓN
// ============================================
const isMobile = window.innerWidth < 768;

// Referencias a botones (manejo de nulls)
const btnStart = document.getElementById("btnStart");
const btnStart2 = document.getElementById("btnStart2");
const btnStartMv = document.getElementById("iniciarMv");
const btnStart2Mv = document.getElementById("btnStart2Mv");

const totalObjeciones = objeciones.length;
let idTextoBot;
let cuadroTexto;
let tabla;
let mico;

let calificacionProducto = 0,
  calificacionRitmo = 0,
  calificacionTono = 0,
  calificacionModulacion = 0,
  b = 0,
  mom = 0,
  mal = 0,
  numObj = 0;
let segundaFase = false;
let listaObj = [];
let dataSig = [];

// Event Listeners con verificación de existencia
if (btnStart2) btnStart2.addEventListener("click", inciarWeb);
if (btnStart) btnStart.addEventListener("click", inciarWeb);
if (btnStartMv) btnStartMv.addEventListener("click", inciarMovil);
if (btnStart2Mv) btnStart2Mv.addEventListener("click", inciarMovil);

let mediaElement;
let texto = saludo;

async function inciarWeb() {
  if (segundaFase) {
    ciclo2();
  } else {
    if (btnStart) btnStart.classList.remove("btn-animando");
    
    mediaElement = document.getElementById("mediaElementWb");
    agregarClase("mensajeInicio", "hidden");
    quitarClase("loadWb", "hidden");
    if (document.getElementById("iniciarMv")) {
      quitarClase("iniciarMv", "btn-estado");
    }

    mico = ".btn-estado";
    setEstadoBoton("espera", mico);
    idTextoBot = "textoBotWb";
    tabla = "tablaObjWeb";

    cuadroTexto = "textoUsuarioWb";
    
    conectarWS();
    await iniciarHeyGen();
    ciclo();
  }
}

async function inciarMovil() {
  if (segundaFase) {
    ciclo2();
  } else {
    mico = ".btn-estado";
    setEstadoBoton("espera", mico);
    
    agregarClase("mensajeInicioMv", "hidden");
    quitarClase("loadMv", "hidden");
    
    mediaElement = document.getElementById("mediaElementMv");
    tabla = "tablaObjMv";
    idTextoBot = "textoBotMv";
    cuadroTexto = "textoUsuarioMv";
    
    conectarWS();
    await iniciarHeyGen();
    ciclo();
  }
}

async function iniciarHeyGen() {
  // Usar IDs según el dispositivo
  const estatusUserClass = "estatusUser";
  const estatusUserTextClass = "estatusUsert";
  const estatusDocClass = "estatusDoc";
  const estatusDocTextClass = "estatusDoct";

  cambiarEstatusColor(estatusUserClass, estatusUserTextClass, "Cargando...", "gris");
  cambiarEstatusColor(estatusDocClass, estatusDocTextClass, "Cargando...", "gris");
  
  await getSessionToken();
  await createNewSession(doctorIa, vozIa);
  await startStreamingSession();
  await delay(4000);
  
  agregarClase("loadMv", "hidden");
  agregarClase("loadWb", "hidden");
  
  cambiarEstatusColor(estatusUserClass, estatusUserTextClass, "Doctor presentandose", "azul");
  cambiarEstatusColor(estatusDocClass, estatusDocTextClass, "Doctor presentandose", "azul");

  await habla(respuestaGemini);
}

function setEstadoBoton(estado, selector = ".btn-estado") {
  const botones = document.querySelectorAll(selector);
  
  botones.forEach(boton => {
    if (!boton) return;
    
    const texto = boton.querySelector(".texto");

    // Limpiar clases anteriores
    boton.classList.remove(
      "bg-blue-600",
      "text-white",
      "hover:bg-blue-700",
      "bg-gray-200",
      "text-gray-500",
      "cursor-not-allowed",
      "bg-green-500",
      "hover:bg-green-600"
    );

    // Aplicar clases según estado
    if (estado === "iniciar") {
      boton.classList.add(
        "bg-blue-600",
        "text-white",
        "hover:bg-blue-700",
        "cursor-pointer"
      );
      if (texto) texto.textContent = "Iniciar";
      boton.disabled = false;
    }
    else if (estado === "espera") {
      boton.classList.add("bg-gray-200", "text-gray-500", "cursor-not-allowed");
      boton.disabled = true;

      boton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2z" />
          <path fill-rule="evenodd" d="M5 10a5 5 0 0010 0h1a6 6 0 01-5 5.917V18h2a1 1 0 110 2H7a1 1 0 110-2h2v-2.083A6 6 0 014 10h1z" clip-rule="evenodd" />
        </svg>
      `;
    }
    else if (estado === "habla") {
      boton.classList.add(
        "bg-green-500",
        "text-white",
        "hover:bg-green-600",
        "cursor-pointer"
      );
      boton.disabled = true;

      boton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2zM4 10a6 6 0 0012 0h-1a5 5 0 11-10 0H4z" clip-rule="evenodd" />
        </svg>
      `;
    }
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const interrupciones = [
  "Perdón, me llamó mi secretaria, ¿puedes repetir lo que decías?",
  "Perdón, recibí un mensaje importante, ¿me lo podrías repetir?",
  "Disculpa, tuve que atender una llamada rápida, ¿puedes repetirlo?",
  "Perdón, entró una notificación urgente, ¿podrías repetir lo último?",
  "Perdón, estaba revisando unos estudios y no escuché, ¿puedes repetir?",
  "Disculpa, me distraje con una llamada, ¿qué estabas diciendo?",
  "Perdón, estaba respondiendo un mensaje urgente, ¿puedes repetirlo?",
  "Disculpa, me interrumpió mi asistente, ¿puedes volver a decirlo?",
  "Perdón, tuve que contestar el teléfono, ¿qué comentabas?",
  "Perdón, recibí un correo urgente, ¿me podrías repetir lo que dijiste?",
  "Disculpa, me distraje un momento, ¿puedes volver a explicarlo?",
  "Perdón, mi secretaria entró a la oficina, ¿qué estabas diciendo?",
  "Perdón, atendí un mensaje de voz rápido, ¿me lo repites?",
  "Disculpa, tuve que responder una alerta, ¿puedes repetir por favor?",
  "Perdón, me distraje revisando otra nota, ¿me puedes repetir lo que decías?",
];

function interrupcion() {
  const indice = Math.floor(Math.random() * interrupciones.length);
  return interrupciones[indice];
}

let interrupcionBool = false;
let tipoRespuestaGemini = true;
let objtxt;
let hilo = "Presentacion del producto";
let numeroPalabras = 0;
let respuestaGemini;

let objActual;
let txtHabla = primerRespuesta;
let resActual;
let retro;
let resRestro;
let pre = true;

//calculos finales
let caliCono = 0; // {}
let calReco = 0; //Velocidad
let calTon = 0; //Funcion
let calMod = 0; //[]

let bn = 0;
let md = 0;
let ml = 0;
const listaRetro = [];

let isRunning = true;
let pClave = [];
let respuesta = [];
let hist = [];

async function ciclo() {
  await habla(txtHabla);
  delay(5000);
  
  const ejecutarCiclo = async () => {
    try {
      iniciarCuentaRegresiva(30);
      cambioDeTexto(2);
      let texto = await iniciarReconocimientoVoz();
      numeroPalabras = contarPalabras(texto);
      calReco = calReco + numeroPalabras;
      console.log(calReco);
      respuestaGemini = await evaluarTexto2(texto, pClave);
      console.log(respuestaGemini);
      let calTemp = extraerCalificaciones(respuestaGemini);
      console.log("calTemp: " + calTemp);
      retro = evaluarProducto(
        calTemp.calReco,
        calTemp.calC,
        txtHabla,
        resActual,
        texto
      );
      caliCono = caliCono + parseInt(calTemp.calReco);
      calMod = calMod + parseInt(calTemp.calC);
      console.log(caliCono + " " + calMod);
      resRestro = obtenerRetroPorCalificacion(calTemp.calReco, resActual);
      console.log("resRetro: " + resRestro);
      if (!pre) {
        agregarAHist(objtxt.titulo, texto, parseInt(calTemp.calReco));
        guardarRetro(
          objtxt.titulo,
          objtxt.objeccion,
          objtxt.argumento,
          resRestro
        );
      }
      cambioDeTexto(1);
      if (segundaFase) {
        console.log(listaRetro);

        await habla(
          "No hay más objeciones, la práctica ha sido finalizada. " +
            "Ahora pasaré a darte tu retroalimentación por cada una de tus respuestas a mis objeciones. " +
            "Presiona el botón azul para continuar."
        );
        isRunning = false;
        
        // Restaurar botón correcto según dispositivo
        if (btnStart) {
          btnStart.disabled = false;
          restaurarBtnStart();
        }
        if (btnStartMv) {
          btnStartMv.disabled = false;
          restaurarBtnStartMv();
        }
        
        return;
      }
      objtxt = obtenerObjeccionActual();
      hilo = objtxt.argumento;
      txtHabla = objtxt.objeccion;
      resActual = objtxt.respuestas;
      pClave = objtxt.pClaves;
      incrementarProgreso();
      await habla(txtHabla);
      await delay(2000);
      avanzarObjeccion();
      pre = false;
      if (isRunning) {
        await ejecutarCiclo();
      }
    } catch (err) {
      console.error("Error en ejecutarCiclo:", err);
    }
  };

  await ejecutarCiclo();
}

function restaurarBtnStart() {
  const btn = document.getElementById("btnStart");
  if (!btn) return;

  // Elimina TODAS las clases previas
  btn.className = "";

  // Agrega las clases originales
  btn.classList.add(
    "btnStart",
    "btn-estado",
    "w-10",
    "h-10",
    "grid",
    "place-items-center",
    "rounded-xl",
    "bg-blue-600",
    "text-white",
    "hover:bg-blue-700",
    "active:scale-95",
    "transition",
    "animate-pulse"
  );

  // Reestablece icono e info accesible
  btn.innerHTML = `
    <i class="bi bi-play-fill text-lg"></i>
    <span class="sr-only">Iniciar</span>
  `;
}

function restaurarBtnStartMv() {
  const btn = document.getElementById("iniciarMv");
  if (!btn) return;

  btn.className = "";
  btn.classList.add(
    "btnStart",
    "btn-estado",
    "w-10",
    "h-10",
    "grid",
    "place-items-center",
    "rounded-xl",
    "bg-blue-600",
    "text-white",
    "hover:bg-blue-700",
    "active:scale-95",
    "transition",
    "animate-pulse"
  );

  btn.innerHTML = `
    <i class="bi bi-play-fill text-lg"></i>
  `;
}

async function ciclo2() {
  console.log("📋 listaRetro en ciclo2:", listaRetro);

  if (!Array.isArray(listaRetro) || listaRetro.length === 0) {
    await habla("Por el momento no tengo retroalimentaciones registradas.");
    return;
  }
  cambioDeTexto(3);
  cerrarWS();

  const ordinales = [
    "primera",
    "segunda",
    "tercera",
    "cuarta",
    "quinta",
    "sexta",
    "séptima",
    "octava",
    "novena",
    "décima",
  ];

  // Recorremos cada retro
  for (let i = 0; i < listaRetro.length; i++) {
    const item = listaRetro[i];
    const ord = ordinales[i] || `${i + 1}ª`;

    // Por si acaso viene algo raro
    if (!item) continue;

    const objeccion = item.titulo || "sin texto de objeción registrado";
    const argumento = item.argumento || "sin argumento registrado";
    const retro = item.retroalimentacion || "sin retroalimentación registrada";

    // Lo que dices en voz
    await habla(`Mi ${ord} objeción fue: ${objeccion}`);
    await delay(1000);
    await habla(`${retro}`);
    await delay(1000);
  }

  // Mensaje final
  await habla(
    "Estas fueron todas las retroalimentaciones. Pasaremos al panel para que puedas ver más a detalle la información que te acabo de dar."
  );

  cordinarFinal();
}

function cordinarFinal() {
  caliCono = caliCono / 4;
  calReco = calcularPalabrasPorMinuto(calReco, 90);
  calTon = tonoFinal(70, 90);
  calMod = calMod / 4;
  console.log(caliCono + " " + calReco + " " + calTon + " " + calMod);

  console.log(b + " " + mom + " " + mal);
  respuesta.push({
    calP: caliCono,
    calR: calReco,
    calT: calTon,
    calM: calMod,
    b: b,
    mom: mom,
    mal: mal,
    hist: [...hist],
  });
  console.log(respuesta);
  // respuesta ES un array
  sessionStorage.setItem("dataSig", JSON.stringify(respuesta));
  console.log(sessionStorage.getItem("dataSig"));
  
  window.location.href = "./resultado.html";
}

function obtenerRetroPorCalificacion(calificacion, respuestas) {
  // Convertir a entero si viene como string
  const valor = parseInt(calificacion, 10);

  // Si no es número válido
  if (isNaN(valor)) return "Calificación inválida";

  // Fallback en caso de objeto vacío, null o incompleto
  const sinRespuestas =
    !respuestas ||
    typeof respuestas !== "object" ||
    !respuestas.buena ||
    !respuestas.media ||
    !respuestas.mala;

  if (sinRespuestas) {
    if (valor <= 33) return "Mala presentación";
    if (valor <= 66) return "Regular presentación";
    return "Buena presentación";
  }

  // Rangos normales
  if (valor <= 53) {
    ml++;
    return respuestas.mala;
  } else if (valor <= 76) {
    md++;
    return respuestas.media;
  } else {
    bn++;
    return respuestas.buena;
  }
}

function extraerCalificaciones(texto) {
  // Asegurar que siempre trabajamos con string
  if (texto == null) texto = "";
  texto = String(texto);

  // Inicializamos el resultado
  const resultado = {
    calReco: null,
    calC: null,
  };

  // ---------- Buscar valor dentro de { } ----------
  const iniLlave = texto.indexOf("{");
  const finLlave = texto.indexOf("}", iniLlave + 1);

  if (iniLlave !== -1 && finLlave !== -1) {
    resultado.calReco = texto.slice(iniLlave + 1, finLlave).trim();
  }

  // ---------- Buscar valor dentro de [ ] ----------
  const iniCor = texto.indexOf("[");
  const finCor = texto.indexOf("]", iniCor + 1);

  if (iniCor !== -1 && finCor !== -1) {
    resultado.calC = texto.slice(iniCor + 1, finCor).trim();
  }

  return resultado;
}

//Funciones nuevas
function obtenerObjeccionActual() {
  return listaObjecciones[indiceObjeccionActual];
}

function avanzarObjeccion() {
  const indiceAnterior = indiceObjeccionActual;

  indiceObjeccionActual = (indiceObjeccionActual + 1) % listaObjecciones.length;

  // 🔥 Si dio la vuelta y regresó a 0, llamamos otra función
  if (indiceObjeccionActual === 0 && indiceAnterior !== 0) {
    segundaFase = true;
  }
}

function guardarRetro(tit, obj, arg, respuestasAvatar) {
  if (!respuestasAvatar) return;

  listaRetro.push({
    titulo: tit,
    objeccion: obj,
    argumento: arg,
    retroalimentacion: respuestasAvatar,
  });
}

function decidirTipoRetro(calRNum, calCNum) {
  // Puedes cambiar los rangos a lo que uses en tu sistema
  if (calRNum >= 85 && calCNum >= 85) return "buena";
  if (calRNum >= 70 && calCNum >= 70) return "media";
  return "mala";
}

function incrementarProgreso() {
  // Buscar el elemento correcto según el dispositivo
  let el = document.getElementById("mfProgAct");
  if (!el) el = document.getElementById("mfProgActMv");
  if (!el) return;

  // Convertir el contenido a número
  let valor = parseInt(el.textContent, 10) || 0;

  // Sumar 1
  valor++;

  // Actualizar el span
  el.textContent = valor;
}

let contadorCalificacion = 0;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//temporales
//Funciones nuevas
function cambiarTexto(textoUsuario, hilo2 = "Presentación del producto") {
  let textoU = `Eres un coach evaluador. Califica la respuesta del usuario comparándola con este argumento base: ${hilo2}.
Debes generar EXACTAMENTE dos líneas:
1) Una calificación dentro de llaves la cual evaluara la relacion de la respuesta con el argumento base Ejemplo: {85}
2) Una calificación dentro de corchetes la cual evaluara ortografia, sintaxis y coehrencia el texto sin tomar en cuenta el argumento.  Ejemplo: [90]
Reglas:
- NO expliques qué significan las calificaciones.
- NO agregues títulos, notas, ni texto adicional.
- Si la respuesta del usuario no se relaciona con el argumento base:
  {0}
  [0]
Respuesta del usuario: ${textoUsuario}
`;
  console.log("fUNCION CAMBIAR TEXTO:", textoU);
  return textoU;
}

function extraerLlaves(texto) {
  // Busca el primer contenido entre llaves
  const match = texto.match(/\{([^}]+)\}/);
  return match ? match[1] : null;
}

function procesarTexto(texto) {
  const coincidencias = texto.match(/\[(-?\d+)\]/g);
  if (coincidencias) {
    coincidencias.forEach((item) => {
      const valor = parseInt(item.replace(/\[|\]/g, ""), 10);
      modulacionTotal += valor;
    });
  }

  // Quitar las partes entre corchetes del texto
  const textoLimpio = texto.replace(/\[.*?\]/g, "").trim();

  return textoLimpio;
}

function quitarLlavesYContenido(texto) {
  return texto.replace(/\{[^}]*\}/g, "");
}

let progreso = 0;

function actualizarProgreso() {
  const filas = document.querySelectorAll("#" + tabla + " tbody tr");

  // Verifica que no se pase del número de filas
  if (progreso < filas.length) {
    const fila = filas[progreso];
    const celdaEstado = fila.querySelector("td:last-child");

    // Reemplaza el ícono por la palomita verde
    celdaEstado.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mx-auto text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    `;

    progreso++;
    setProgreso(progreso, totalObjeciones);
  }
}

function evaluarProducto(caliR, caliC, obj, arg, res, respuestasAvatar) {
  if (!interrupcionesActivas) return null;

  // Si obj está vacío, nulo o undefined, se reemplaza por texto por defecto
  if (!obj || obj.trim() === "") {
    obj = "Presentación del producto";
  }

  // Normalizar calificación de Relevancia
  let calRNum = parseFloat(caliR);
  if (isNaN(calRNum) || calRNum === 0) {
    calRNum = 50;
  }

  // Normalizar calificación de Calidad
  let calCNum = parseFloat(caliC);
  if (isNaN(calCNum) || calCNum === 0) {
    calCNum = 50;
  }

  // Clasificación (Rookie / Performer / Rockstar o lo que tengas en evaluarNumero)
  const clasR = evaluarNumero(calRNum);
  const clasC = evaluarNumero(calCNum);

  // Calificación acumulada del producto (si así lo usas)
  calificacionProducto += calRNum;

  // Decidir tipo de retro según las calificaciones
  const tipoRetro = decidirTipoRetro(calRNum, calCNum);

  // Obtener texto de retro desde respuestasAvatar, si existe
  let textoRetro = "";
  if (respuestasAvatar && typeof respuestasAvatar === "object") {
    textoRetro = respuestasAvatar[tipoRetro] || "";
  }

  // Si no hay texto de retro configurado, usar default según el tipo
  if (!textoRetro || textoRetro.trim() === "") {
    if (tipoRetro === "mala") {
      textoRetro = "Mala presentación del producto";
    } else if (tipoRetro === "media") {
      textoRetro = "Tu presentación puede mejorar";
    } else {
      textoRetro = "Buena presentación";
    }
  }

  // Guardar en listaObj **todo el paquete**, incluyendo la retro
  listaObj.push({
    obj: "Ob" + numObj + ". " + obj,
    arg: arg,
    res: res,
    calReco: calRNum,
    calC: calCNum,
    clasR: clasR,
    clasC: clasC,
    tipoRetro: tipoRetro,
    retro: textoRetro,
  });

  numObj++;

  // Devolver la retro que corresponde para usarla en pantalla / TTS
  return textoRetro;
}

function evaluarNumero(num) {
  if (num <= 75) {
    return 0;
  } else if (num <= 85) {
    return 1;
  } else {
    return 2;
  }
}

function cambiarEstatusColor(contenedorClass, textoClass, text, color) {
  const colores = {
    gris: "#e5e7eb",
    amarillo: "#fef9c3",
    azul: "#dbeafe",
    verde: "#d1fae5",
  };

  const bgColor = colores[color] || colores.gris;

  // Cambiar fondo del div
  document.querySelectorAll(`.${contenedorClass}`).forEach((div) => {
    div.style.backgroundColor = bgColor;
  });

  // Cambiar texto del p/span
  document.querySelectorAll(`.${textoClass}`).forEach((txt) => {
    txt.textContent = text;
    txt.style.color = "black";
    txt.style.fontSize = "1.25rem";
  });
}

function cambioDeTexto(caso) {
  if (caso === 1) {
    cambiarEstatusColor(
      "estatusUser",
      "estatusUsert",
      "Dando objeccion",
      "azul"
    );

    cambiarEstatusColor(
      "estatusDoc ",
      "estatusDoct",
      "Dando objeccion",
      "azul"
    );
  }
  if (caso === 2) {
    cambiarEstatusColor(
      "estatusUser",
      "estatusUsert",
      "Por favor responde",
      "verde"
    );

    cambiarEstatusColor(
      "estatusDoc",
      "estatusDoct",
      "Por favor responde",
      "verde"
    );
  }
  if (caso === 3) {
    cambiarEstatusColor(
      "estatusUser",
      "estatusUsert",
      "Retroalimentación",
      "amarillo"
    );

    cambiarEstatusColor(
      "estatusDoc",
      "estatusDoct",
      "Retroalimentación ",
      "amarillo"
    );
  }
  if (caso === 4) {
    cambiarEstatusColor(
      "estatusUser",
      "estatusUsert",
      "Prueba finalizada.",
      "gris"
    );

    cambiarEstatusColor(
      "estatusDoc",
      "estatusDoct",
      "Prueba finalizada.",
      "gris"
    );
  }
}

async function evaluarTexto2(texto, palabrasClave) {
  // Si no hay palabras clave → calificación perfecta
  console.log("recibo");
  console.log(texto);
  console.log(palabrasClave);
  console.log("final");

  if (!palabrasClave || palabrasClave.length === 0) {
    return `{100}\n[100]`;
  }

  if (!texto) {
    let numero = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
    return `{${numero}}\n[${numero - 4}]`;
  }

  const t = texto.toLowerCase();
  let encontradas = 0;

  for (const palabra of palabrasClave) {
    const p = palabra.toLowerCase();
    if (t.includes(p)) {
      encontradas++;
    }
  }

  // Calificación principal
  const score1 = Math.round((encontradas / palabrasClave.length) * 100);
  if (score1 === 0) {
    let numero = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
    return `{${numero}}\n[${numero - 4}]`;
  }
  
  const resta = Math.floor(Math.random() * 3) + 5;
  const score2 = Math.max(score1 - resta, 0);

  return `{${score1}}\n[${score2}]`;
}

function agregarAHist(texto1, texto2, numero) {
  let nivel;

  if (numero < 60) {
    mal++;
    nivel = 0;
  } else if (numero < 85) {
    mom++;
    nivel = 1;
  } else {
    b++;
    nivel = 2;
  }

  hist.push({
    obj: texto1,
    res: texto2,
    clas: nivel,
  });
  console.log(hist);
}
