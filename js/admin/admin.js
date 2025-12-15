//Menus desplegabl
let modal = null;
let modalBody = null;
let modalTitle = null;
let btnGuardar = null;

let tipoActual = null;
let actividadActualId = null;

document.addEventListener("DOMContentLoaded", () => {
  modal = document.getElementById("modal-actividad");
  modalBody = document.getElementById("modal-actividad-body");
  modalTitle = document.getElementById("modal-actividad-titulo");
  btnGuardar = document.getElementById("modal-actividad-guardar");

  /* header.addEventListener("click", () => {
    contenido.classList.toggle("abierta");
    chevron.classList.toggle("chevron-rotado");
  });*/
  //modal
  // ===== MODAL GENERAL DE ACTIVIDAD =====

  let tipoActual = null;

  // Títulos por tipo
  const modalTitles = {
    video: "Configurar video de la actividad",
    lectura: "Configurar lectura de la actividad",
    audio: "Configurar audio de la actividad",
    examen: "Configurar examen de la actividad",
    agente: "Configurar roleplay del agente",
    doctor: "Configurar roleplay del doctor",
  };

  // Plantillas HTML por tipo
  const modalTemplates = {
    video: `
  <div class="space-y-4">
  <!-- FUENTE DEL VIDEO -->
  <div class="space-y-2">
    <p class="text-sm text-slate-600 font-semibold">
      Fuente del video
    </p>

    <!-- ARCHIVO (por ahora solo lo sube, no lo guardamos en JSON) -->
    <label class="block text-sm text-slate-700">
      Archivo de video
      <input
        name="video_file"
        type="file"
        accept="video/*"
        class="mt-1 block w-full text-sm text-slate-700
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-100 file:text-blue-900
               hover:file:bg-blue-200"
      />
    </label>

    <div class="flex items-center justify-center my-1">
      <span class="text-xs text-slate-500 uppercase tracking-wide">
        o
      </span>
    </div>

    <!-- LINK (este sí va al JSON como linkVideo) -->
    <label class="block text-sm text-slate-700">
      Link del video (YouTube, Vimeo, etc.)
      <input
        name="video_url"
        type="url"
        placeholder="https://..."
        class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </label>
  </div>

  <!-- TÍTULO -->
  <div>
    <label class="block text-sm text-slate-700 font-semibold">
      Título del video
      <input
        name="video_title"
        type="text"
        placeholder="Ej. Video de introducción a Casec"
        class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </label>
  </div>

  <!-- DESCRIPCIÓN -->
  <div>
    <label class="block text-sm text-slate-700 font-semibold">
      Descripción
      <textarea
        name="video_description"
        rows="3"
        placeholder="Describe brevemente el contenido y objetivo del video..."
        class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
      ></textarea>
    </label>
  </div>

  <!-- TRANSCRIPCIÓN -->
  <div>
    <label class="block text-sm text-slate-700 font-semibold">
      Transcripción (opcional)
      <textarea
        name="video_transcription"
        rows="4"
        placeholder="Copia aquí la transcripción si la tienes..."
        class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
      ></textarea>
    </label>

    <p class="mt-1 text-xs text-slate-500">
      Recomendado para accesibilidad y repaso del contenido.
    </p>
  </div>

</div>

  `,
    lectura: `
  <div class="space-y-4">

    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Título de la lectura
        <input
          name="lectura_titulo"
          type="text"
          placeholder="Ej. Introducción a Casec"
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
    </div>

    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Contenido de la lectura
        <textarea
          name="lectura_contenido"
          rows="10"
          placeholder="Usa # Para subutitulos principales o ## Para subtitulos Secundarios Ejemplo: # Funcionalidades principales ## Funcionalidades secundarias. Escribe respentando salto de lineas y parrafos."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>
      </label>
    </div>

  </div>
  `,
    audio: `
  <div class="space-y-4">

    <!-- Fuente del audio -->
    <div class="space-y-2">
      <p class="text-sm text-slate-600 font-semibold">Fuente del audio</p>

      <label class="block text-sm text-slate-700">
        Archivo de audio
        <input
          name="audio_file"
          type="file"
          accept="audio/*"
          class="mt-1 block w-full text-sm text-slate-700
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-100 file:text-blue-900
                 hover:file:bg-blue-200"
        />
      </label>

      <div class="flex items-center justify-center my-1">
        <span class="text-xs text-slate-500 uppercase tracking-wide">o</span>
      </div>

      <label class="block text-sm text-slate-700">
        Link del audio (Spotify, hosting, etc.)
        <input
          name="audio_url"
          type="url"
          placeholder="https://..."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
    </div>

    <!-- Título -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Título del audio
        <input
          name="audio_title"
          type="text"
          placeholder="Ej. Audio de explicación de Casec"
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
    </div>

    <!-- Descripción -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Descripción
        <textarea
          name="audio_description"
          rows="3"
          placeholder="Describe brevemente el contenido y objetivo del audio..."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>
      </label>
    </div>

    <!-- Transcripción -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Transcripción (opcional)
        <textarea
          name="audio_transcription"
          rows="5"
          placeholder="Escribe la transcripción del audio si está disponible..."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>
      </label>
      <p class="mt-1 text-xs text-slate-500">
        Útil para accesibilidad y repaso.
      </p>
    </div>

  </div>
  `,
    examen: `
  <div class="space-y-4">
    <!-- Título del examen -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Título del examen
        <input
          name="examen_title"
          type="text"
          placeholder="Ej. Examen de introducción a Casec"
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
    </div>

    <!-- Contenedor dinámico de preguntas -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold text-slate-700">
          Preguntas
        </p>
        <button
          type="button"
          class="px-3 py-1 text-xs rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          data-examen-add-question
        >
          + Agregar pregunta
        </button>
      </div>

      <div id="examen-preguntas-container" class="space-y-3">
        <!-- Aquí se agregan las preguntas con JS -->
      </div>
    </div>
  </div>
  `,
    agente: `
     <div class="space-y-6">

    <!-- 🧑‍⚕️ CONFIGURACIÓN DEL DOCTOR -->
    <div class="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-3">
      <p class="text-sm text-slate-700 font-semibold">
        Configuración del doctor
      </p>
      <p class="text-xs text-slate-500">
        Define la voz, avatar, nombre y saludo inicial del doctor para este roleplay.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label class="block text-sm text-slate-700">
          ID de voz (idvox)
          <input
            name="rp_idvox"
            type="text"
            placeholder="Ej. 742eb247d8eb4f1898f4c7d0776707be"
            class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label class="block text-sm text-slate-700">
          ID del avatar (id_avatar)
          <input
            name="rp_id_avatar"
            type="text"
            placeholder="Ej. Shawn_Therapist_public"
            class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label class="block text-sm text-slate-700">
          Nombre del doctor
          <input
            name="rp_nombre"
            type="text"
            placeholder="Ej. Dr. José Smith"
            class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
      </div>

      <label class="block text-sm text-slate-700">
        Saludo inicial
        <textarea
          name="rp_saludo"
          rows="3"
          placeholder="Buenos días. Soy el Dr. José Smith..."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>
        <p class="mt-1 text-xs text-slate-500">
          Este saludo se usará al inicio del roleplay para recibir al usuario.
        </p>
      </label>
    </div>

    <!-- 📌 OBJECCIONES -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="text-sm font-semibold text-slate-700">
            Objecciones y respuestas del agente
          </p>
          <p class="text-xs text-slate-500">
            Agrega las objecciones típicas del doctor y cómo debe responder el agente.
          </p>
        </div>

        <button
          type="button"
          class="px-3 py-1 text-xs rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          data-roleplay-add-objection
        >
          + Agregar objección
        </button>
      </div>

      <div id="roleplay-objections-container" class="space-y-3">
        <!-- Se llena con JS -->
      </div>
    </div>
  </div>
  `,
    doctor: `
    <div class="space-y-4">
      <div>
        <p class="text-sm text-slate-700 font-semibold">
          Objecciones y respuestas del doctor
        </p>
        <p class="text-xs text-slate-500">
          Agrega las objecciones del agente o paciente y cómo debe responder el doctor.
        </p>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold text-slate-700">
          Lista de objecciones
        </p>
        <button
          type="button"
          class="px-3 py-1 text-xs rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          data-roleplay-add-objection
        >
          + Agregar objección
        </button>
      </div>

      <div id="roleplay-objections-container" class="space-y-3">
        <!-- Se llena con JS -->
      </div>
    </div>
  `,
  };

  function abrirModal(tipo) {
    console.log(tipo);
    if (!modal || !modalBody || !modalTitle) return;

    modalTitle.textContent = modalTitles[tipo] ?? "Configurar actividad";
    modalBody.innerHTML = modalTemplates[tipo] ?? "<p>Tipo no soportado.</p>";

    if (tipo === "examen") {
      setupExamenModal();
    } else if (tipo === "agente" || tipo === "doctor") {
      setupRoleplayModal();
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function cerrarModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    tipoActual = null;
  }

  // === Delegación de eventos global ===
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-modal]");
    const closeBtn = e.target.closest('[data-close-modal="actividad"]');

    // Abrir modal
    if (btn) {
      e.preventDefault();

      const tipo = btn.dataset.openModal; // video, lectura, audio...
      const id = btn.dataset.actividadId; // CASEC-1-1-VIDEO, etc.

      // Guardamos en las globales
      tipoActual = tipo;
      actividadActualId = id;

      // (Si quieres, deja el alert para pruebas)
      alert(`CLICK\nTipo: ${tipo}\nID: ${id}`);

      abrirModal(tipo);
      return;
    }

    // 🔹 CERRAR MODAL
    if (closeBtn) {
      e.preventDefault();
      cerrarModal();
      return;
    }

    // Cerrar clicando fuera del cuadro
    if (e.target === modal) {
      cerrarModal();
      return;
    }

    // ==============================
    //   EXAMEN: agregar pregunta
    // ==============================
    const addQuestionBtn = e.target.closest("[data-examen-add-question]");
    if (addQuestionBtn) {
      const container = modalBody.querySelector("#examen-preguntas-container");
      if (container) {
        addExamenQuestion(container);
      }
      return;
    }

    // ==============================
    //   EXAMEN: agregar opción
    // ==============================
    const addOptionBtn = e.target.closest("[data-examen-add-option]");
    if (addOptionBtn) {
      const questionEl = addOptionBtn.closest("[data-examen-question]");
      if (questionEl) {
        addExamenOption(questionEl);
      }
      return;
    }

    // ==============================
    //   EXAMEN: eliminar pregunta
    // ==============================
    const removeQuestionBtn = e.target.closest("[data-examen-remove-question]");
    if (removeQuestionBtn) {
      const questionEl = removeQuestionBtn.closest("[data-examen-question]");
      if (questionEl) {
        questionEl.remove();
      }
      return;
    }

    // ==============================
    //   EXAMEN: eliminar opción
    // ==============================
    const removeOptionBtn = e.target.closest("[data-examen-remove-option]");
    if (removeOptionBtn) {
      const optionEl = removeOptionBtn.closest("[data-examen-option]");
      if (optionEl) {
        optionEl.remove();
      }
      return;
    }

    const addObjBtn = e.target.closest("[data-roleplay-add-objection]");
    if (addObjBtn) {
      const container = modalBody.querySelector(
        "#roleplay-objections-container"
      );
      if (container) {
        addRoleplayObjection(container);
      }
      return;
    }

    // ==============================
    //   ROLEPLAY: eliminar objección
    // ==============================
    const removeObjBtn = e.target.closest("[data-roleplay-remove-objection]");
    if (removeObjBtn) {
      const item = removeObjBtn.closest("[data-roleplay-objection]");
      if (item) {
        item.remove();
      }
      return;
    }
  });

  // ESC para cerrar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      cerrarModal();
    }
  });

  // Guardar por ahora solo loguea
  if (btnGuardar) {
    btnGuardar.addEventListener("click", async () => {
      let config = null;
      console.log(tipoActual);
      if (tipoActual === "video") {
        const videoConfig = readVideoFromModal();
        if (!validarVideoConfig(videoConfig)) return;
        config = videoConfig;
      }

      if (tipoActual === "lectura") {
        const lecturaConfig = readLecturaFromModal();
        if (!validarLectura(lecturaConfig)) return;
        config = lecturaConfig;
      }

      if (tipoActual === "audio") {
        const audioConfig = readAudioFromModal();
        if (!validarAudio(audioConfig)) return;
        config = audioConfig;
      }

      if (tipoActual === "examen") {
        const examenConfig = readExamenFromModal();
        if (!validarExamen(examenConfig)) return;
        config = examenConfig;
      }

      if (tipoActual === "agente" || tipoActual === "doctor") {
        const roleplayConfig = await readRoleplayFromModal(tipoActual);
        if (!validarRoleplay(roleplayConfig)) return;
        config = roleplayConfig;
      }

      // 🔹 Aquí guardamos TODO en localStorage["actividades"]
      if (config) {
        guardarConfigActividad(actividadActualId, tipoActual, config);
      }

      cerrarModal();
    });
  }

  //Control de creación de examenes.
  let examenQuestionCounter = 0;

  function setupExamenModal() {
    examenQuestionCounter = 0;
    const container = modalBody.querySelector("#examen-preguntas-container");
    if (!container) return;
    container.innerHTML = "";
    // Creamos una pregunta inicial por defecto
    addExamenQuestion(container);
  }

  function addExamenQuestion(container) {
    const index = examenQuestionCounter++;
    const questionEl = document.createElement("div");

    questionEl.className =
      "border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50";
    questionEl.dataset.examenQuestion = "true";
    questionEl.dataset.questionIndex = String(index);

    questionEl.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        Pregunta #${index + 1}
      </span>
      <button
        type="button"
        class="text-xs text-red-500 hover:text-red-700"
        data-examen-remove-question
      >
        Eliminar
      </button>
    </div>

    <div>
      <input
        type="text"
        placeholder="Escribe aquí el enunciado de la pregunta"
        class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="space-y-2" data-examen-options>
      <!-- Opciones dinámicas -->
    </div>

    <button
      type="button"
      class="mt-1 px-3 py-1 text-xs rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
      data-examen-add-option
    >
      + Agregar opción
    </button>
  `;

    container.appendChild(questionEl);

    // Dos opciones por defecto
    addExamenOption(questionEl);
    addExamenOption(questionEl);
  }

  function addExamenOption(questionEl) {
    const optionsContainer = questionEl.querySelector("[data-examen-options]");
    if (!optionsContainer) return;

    const qIndex = questionEl.dataset.questionIndex || "0";

    const optionEl = document.createElement("div");
    optionEl.className = "flex items-center gap-2";
    optionEl.dataset.examenOption = "true";

    optionEl.innerHTML = `
    <input
      type="radio"
      name="examen-correct-${qIndex}"
      class="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
    />
    <input
      type="text"
      placeholder="Texto de la opción"
      class="flex-1 border border-slate-300 rounded-md px-3 py-1.5
             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <button
      type="button"
      class="text-xs text-red-500 hover:text-red-700"
      data-examen-remove-option
    >
      Quitar
    </button>
  `;

    optionsContainer.appendChild(optionEl);
  }

  //Control de guardado en lecturas
  function readLecturaFromModal() {
    const form = document.getElementById("modal-actividad-form");

    const raw = form.lectura_contenido?.value.trim() || "";

    // Procesamos títulos, subtítulos y párrafos
    const parsed = procesarLecturaConTitulos(raw);

    return {
      title: parsed.title || form.lectura_titulo?.value.trim() || "",
      rawContent: raw,
      sections: parsed.sections,
    };
  }

  //Control guardado de audios
  function readAudioFromModal() {
    const form = document.getElementById("modal-actividad-form");

    const title = form.audio_title?.value.trim() || "";
    const linkAudio = form.audio_url?.value.trim() || "";
    const description = form.audio_description?.value.trim() || "";
    const transcription = form.audio_transcription?.value.trim() || "";

    return {
      title,
      linkAudio,
      description,
      transcription,
    };
  }
  //Control de guardado de Examen
  function readExamenFromModal() {
    const form = document.getElementById("modal-actividad-form");
    const title = form.examen_title?.value.trim() || "";

    const questions = [];
    const questionEls = modalBody.querySelectorAll("[data-examen-question]");

    questionEls.forEach((qEl) => {
      // enunciado
      const questionInput = qEl.querySelector("input[type='text']");
      const questionText = questionInput?.value.trim() || "";

      const options = [];
      const optionEls = qEl.querySelectorAll("[data-examen-option]");

      optionEls.forEach((optEl) => {
        const radio = optEl.querySelector("input[type='radio']");
        const textInput = optEl.querySelector("input[type='text']");
        const text = textInput?.value.trim() || "";
        const correct = !!radio?.checked;

        options.push({
          text,
          correct,
        });
      });

      questions.push({
        text: questionText,
        options,
      });
    });

    return {
      title,
      questions,
    };
  }
  //Control de guardado roleplay
  async function readRoleplayFromModal(tipoActual) {
    const form = document.getElementById("modal-actividad-form");

    // 🔹 Config del doctor (solo existe en el modal de "agente", pero no pasa nada si está vacío en "doctor")
    const idvox = form.rp_idvox?.value.trim() || "";
    const id_avatar = form.rp_id_avatar?.value.trim() || "";
    const nombre = form.rp_nombre?.value.trim() || "";
    const saludo = form.rp_saludo?.value.trim() || "";

    // 🔹 Objecciones en formato objeccion1, objeccion2, ...
    const objecciones = {};
    let palabrasClave = "";
    let con = 0;
    const items = modalBody.querySelectorAll("[data-roleplay-objection]");

    let index = 1;

    items.forEach((item) => {
      const tituloInput = item.querySelector("input[name^='rp_titulo_']");
      const objeccionTA = item.querySelector("textarea[name^='rp_objeccion_']");
      const argumentoTA = item.querySelector("textarea[name^='rp_argumento_']");
      const respBuenaTA = item.querySelector(
        "textarea[name^='rp_resp_buena_']"
      );
      const respMediaTA = item.querySelector(
        "textarea[name^='rp_resp_parcial_']"
      );
      const respMalaTA = item.querySelector("textarea[name^='rp_resp_mala_']");

      const titulo = tituloInput?.value.trim() || "";
      const objeccion = objeccionTA?.value.trim() || "";
      const argumento = argumentoTA?.value.trim() || "";
      const respBuena = respBuenaTA?.value.trim() || "";
      const respMedia = respMediaTA?.value.trim() || "";
      const respMala = respMalaTA?.value.trim() || "";

      const key = `objeccion${index}`;

      objecciones[key] = {
        objeccion,
        argumento,
        titulo,
        respuestas: {
          buena: respBuena,
          media: respMedia,
          mala: respMala,
        },
      };
      con++;
      palabrasClave = palabrasClave + " " + con + "." + argumento + " ";
      index++;
    });

    console.log(palabrasClave);
    let palabras = await consultarIa(palabrasClave);
    console.log("📥 Respuesta IA:", palabras);
    const grupos = palabras.match(/\[[^\]]*]/g) || [];
    console.log("🧩 Grupos detectados:", grupos);

    const keys = Object.keys(objecciones);
    keys.forEach((key, idx) => {
      const grupo = grupos[idx] || "[]"; // por si viene menos de lo esperado

      // 2) Limpiar corchetes y separar por comas
      const contenido = grupo.replace(/^\[/, "").replace(/]$/, "");

      const listaPalabras = contenido
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // 3) Inyectar en el objeto correspondiente
      objecciones[key].pClaves = listaPalabras;
    });

    console.log("✅ Objecciones finales con pClaves:", objecciones);

    return {
      docpack: {
        idvox,
        id_avatar,
        nombre,
        saludo,
        objecciones,
      },
      // opcional, por si quieres saber de qué tipo era:
      role: tipoActual, // "agente" o "doctor"
    };
  }

  //funcion para guardar LocalStorage
  function readVideoFromModal() {
    const form = document.getElementById("modal-actividad-form");

    const title = form.video_title?.value?.trim() || "";
    const linkVideo = form.video_url?.value?.trim() || "";
    const description = form.video_description?.value?.trim() || "";
    const transcripcion = form.video_transcription?.value?.trim() || "";

    // JSON exactamente como tú lo quieres
    return {
      title,
      linkVideo,
      description,
      transcripcion,
    };
  }

  //Validacion especifica del video
  function validarVideoConfig(config) {
    // Tiene que tener título sí o sí
    if (!config.title.trim()) {
      alert("El título del video no puede estar vacío.");
      return false;
    }

    // Debe tener al menos una fuente
    if (!config.linkVideo.trim()) {
      alert(
        "Debes proporcionar un link al video. (El archivo será procesado cuando esté listo el backend)"
      );
      return false;
    }

    // Descripción no debe estar vacía
    if (!config.description.trim()) {
      alert("La descripción no puede estar vacía.");
      return false;
    }

    // Transcripción puede ser opcional
    return true;
  }
  //Validacion especifica para lecturas
  function validarLectura(config) {
    if (!config.title) {
      alert("El título de la lectura no puede estar vacío.");
      return false;
    }
    if (!config.rawContent) {
      alert("El contenido de la lectura no puede estar vacío.");
      return false;
    }
    return true;
  }
  //Validacion especifica para audio
  function validarAudio(config) {
    if (!config.title) {
      alert("El título del audio no puede estar vacío.");
      return false;
    }

    if (!config.linkAudio) {
      alert(
        "Debes proporcionar un link al audio. (El archivo se procesará cuando exista backend)"
      );
      return false;
    }

    if (!config.description) {
      alert("La descripción no puede estar vacía.");
      return false;
    }

    return true;
  }
  //Validación especifica paras examen
  function validarExamen(examen) {
    if (!examen.title) {
      alert("El título del examen no puede estar vacío.");
      return false;
    }

    if (!examen.questions || examen.questions.length === 0) {
      alert("El examen debe tener al menos una pregunta.");
      return false;
    }

    for (let i = 0; i < examen.questions.length; i++) {
      const q = examen.questions[i];
      const numPregunta = i + 1;

      if (!q.text) {
        alert(`La pregunta #${numPregunta} no puede estar vacía.`);
        return false;
      }

      if (!q.options || q.options.length < 2) {
        alert(`La pregunta #${numPregunta} debe tener al menos 2 opciones.`);
        return false;
      }

      // todas con texto
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.text) {
          alert(
            `La opción #${
              j + 1
            } de la pregunta #${numPregunta} no puede estar vacía.`
          );
          return false;
        }
      }

      // al menos una correcta
      const algunaCorrecta = q.options.some((opt) => opt.correct);
      if (!algunaCorrecta) {
        alert(
          `La pregunta #${numPregunta} debe tener al menos una respuesta correcta marcada.`
        );
        return false;
      }
    }

    return true;
  }
  //Validacion para ambos roleplays
  function validarRoleplay(config) {
    if (!config.docpack) {
      alert("Error interno: no se encontró el docpack del roleplay.");
      return false;
    }

    const { nombre, saludo, objecciones } = config.docpack;

    if (!nombre) {
      alert("El nombre del doctor no puede estar vacío.");
      return false;
    }

    if (!saludo) {
      alert("El saludo inicial no puede estar vacío.");
      return false;
    }

    if (!objecciones || Object.keys(objecciones).length === 0) {
      alert("Debes agregar al menos una objeción.");
      return false;
    }

    let i = 1;
    for (const key of Object.keys(objecciones)) {
      const obj = objecciones[key];
      const num = i++;

      if (!obj.titulo) {
        alert(`El título de la objeción #${num} no puede estar vacío.`);
        return false;
      }

      if (!obj.objeccion) {
        alert(`El texto de la objeción #${num} no puede estar vacío.`);
        return false;
      }

      if (!obj.argumento) {
        alert(`El argumento de la objeción #${num} no puede estar vacío.`);
        return false;
      }

      if (
        !obj.respuestas ||
        !obj.respuestas.buena ||
        !obj.respuestas.media ||
        !obj.respuestas.mala
      ) {
        alert(
          `Debes completar las respuestas buena, media y mala de la objeción #${num}.`
        );
        return false;
      }
    }

    return true;
  }
});
//control de creaccion de objecciones
let roleplayObjectionCounter = 0;

function setupRoleplayModal() {
  roleplayObjectionCounter = 0;
  const container = modalBody.querySelector("#roleplay-objections-container");
  if (!container) return;
  container.innerHTML = "";
  // Una objección por defecto
  addRoleplayObjection(container);
}

function addRoleplayObjection(container) {
  const index = roleplayObjectionCounter++;
  const numero = index + 1;

  const item = document.createElement("div");

  item.className =
    "border border-slate-200 rounded-md p-3 space-y-3 bg-slate-50";
  item.dataset.roleplayObjection = "true";
  item.dataset.roleplayIndex = String(index);

  item.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        Objección #${numero}
      </span>
      <button
        type="button"
        class="text-xs text-red-500 hover:text-red-700"
        data-roleplay-remove-objection
      >
        Eliminar
      </button>
    </div>

    <!-- TÍTULO -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Título
        <input
          type="text"
          name="rp_titulo_${numero}"
          placeholder="Ej. No tengo suficiente experiencia con inhibidores de miosina cardíaca."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
    </div>

    <!-- OBJECCIÓN -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Objección
        <textarea
          rows="2"
          name="rp_objeccion_${numero}"
          placeholder="Ej. No tengo suficiente experiencia con inhibidores de miosina cardíaca y prefiero no tocar algo que no domino..."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>
      </label>
    </div>

    <!-- ARGUMENTO -->
    <div>
      <label class="block text-sm text-slate-700 font-semibold">
        Argumento
        <textarea
          rows="3"
          name="rp_argumento_${numero}"
          placeholder="Ej. CAMZYOS es el primer inhibidor selectivo de miosina aprobado para MCHo sintomática clase II–III NYHA..."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        ></textarea>
      </label>
    </div>

    <!-- RESPUESTAS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <label class="block text-sm text-slate-700 font-semibold">
        Respuesta buena
        <textarea
          rows="3"
          name="rp_resp_buena_${numero}"
          placeholder="Texto cuando la respuesta del agente es muy buena."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
        ></textarea>
      </label>

      <label class="block text-sm text-slate-700 font-semibold">
        Respuesta parcialmente buena
        <textarea
          rows="3"
          name="rp_resp_parcial_${numero}"
          placeholder="Texto cuando la respuesta del agente es aceptable pero le falta fuerza."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y"
        ></textarea>
      </label>

      <label class="block text-sm text-slate-700 font-semibold">
        Respuesta mala
        <textarea
          rows="3"
          name="rp_resp_mala_${numero}"
          placeholder="Texto cuando la respuesta del agente es deficiente."
          class="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2
                 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y"
        ></textarea>
      </label>
    </div>
  `;

  container.appendChild(item);
}

//funciones para organizar lecturas
function procesarLecturaConTitulos(texto) {
  const lineas = texto.split("\n");
  let title = "";
  let sections = [];
  let currentSection = null;
  let bufferParrafos = [];

  function guardarParrafos() {
    if (bufferParrafos.length > 0) {
      const cleaned = bufferParrafos
        .join("\n")
        .split(/\n{2,}/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (currentSection) {
        currentSection.paragraphs.push(...cleaned);
      }
      bufferParrafos = [];
    }
  }

  for (let line of lineas) {
    line = line.trim();

    // TÍTULO PRINCIPAL
    if (line.startsWith("# ") && !title) {
      title = line.replace("# ", "");
      continue;
    }

    // NUEVO SUBTÍTULO
    if (line.startsWith("## ")) {
      guardarParrafos();

      currentSection = {
        subtitle: line.replace("## ", ""),
        paragraphs: [],
      };
      sections.push(currentSection);
      continue;
    }

    // Párrafo normal
    if (line.length > 0) {
      bufferParrafos.push(line);
    }
  }

  // Guardar párrafos del final
  guardarParrafos();

  return { title, sections };
}

//Modales de confirmacion y eliminar
// VARIABLES PARA CONTROLAR EL BORRADO ACTUAL
let roleplayToDelete = null;

// Obtener modales
const modalConfirmDelete = document.getElementById("modal-confirm-delete");
const modalSuccessDelete = document.getElementById("modal-delete-success");

// Botones internos
const btnCancelDelete = document.getElementById("btn-cancel-delete");
const btnConfirmDelete = document.getElementById("btn-confirm-delete");
const btnSuccessClose = document.getElementById("btn-close-success");

// Abrir modal de confirmación al presionar borrar
document.querySelectorAll("[data-roleplay-delete]").forEach((btn) => {
  btn.addEventListener("click", () => {
    roleplayToDelete = btn.dataset.roleplayDelete; // roleplay_agente o roleplay_doctor
    document.getElementById(
      "confirm-delete-text"
    ).textContent = `¿Deseas borrar la configuración de ${roleplayToDelete.replace(
      "_",
      " "
    )}?`;

    modalConfirmDelete.classList.remove("hidden");
  });
});

// Cancelar borrado
btnCancelDelete.addEventListener("click", () => {
  roleplayToDelete = null;
  modalConfirmDelete.classList.add("hidden");
});

// Confirmar borrado
btnConfirmDelete.addEventListener("click", () => {
  if (roleplayToDelete) {
    localStorage.removeItem(roleplayToDelete);
  }

  modalConfirmDelete.classList.add("hidden");
  modalSuccessDelete.classList.remove("hidden");
});

// Cerrar modal de éxito
btnSuccessClose.addEventListener("click", () => {
  modalSuccessDelete.classList.add("hidden");
});

//pruebas

function guardarConfigActividad(id, tipo, config) {
  if (!id) {
    console.warn(
      "No hay actividadActualId, no se puede guardar la configuración específica."
    );
    return;
  }

  // Leer actividades existentes
  let actividades = {};
  try {
    actividades = JSON.parse(localStorage.getItem("actividades")) || {};
  } catch (e) {
    actividades = {};
  }

  // Guardar / sobrescribir
  actividades[id] = {
    id,
    tipo, // "video", "lectura", "audio", "examen", "roleplay_agente", ...
    config, // lo que devuelve readVideoFromModal, readLecturaFromModal, etc.
  };

  localStorage.setItem("actividades", JSON.stringify(actividades));

  console.log(`Configuración guardada para actividad ${id}:`, actividades[id]);
}

function borrarAgentesCasec1() {
  let actividades = JSON.parse(localStorage.getItem("actividades")) || {};

  ["CASEC-1-5-AGENTE", "CASEC-1-8-AGENTE"].forEach((id) => {
    if (actividades[id]) {
      delete actividades[id];
    }
  });

  localStorage.setItem("actividades", JSON.stringify(actividades));
}

//borrarAgentesCasec1();
async function consultarIa(text) {
  let prompt = `Te voy a enviar varias cadenas de texto y tu debes extraer las palabras clave y regresarlas entre corchetes [] y separadas por comas ",", no las palabras no pueden ser acronimos o siglas, si una frase trae numers conviertelos a texto. Ejemplo: Frase: "No, las 5 muertes reportadas fueron no relacionadas con CAMZYOS." Tu respondes: [No, cinco, muertes, relacionadas]
Frases: 
${text}`;
  let respuesta = await consultarOpenRouter(prompt);
  return respuesta;
}
console.log(localStorage.getItem("actividades"));