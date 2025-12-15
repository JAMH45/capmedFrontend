// Parsear el rawContent:
  // - "#Titulo"  -> bloque tipo "h1"
  // - "##Sub"    -> bloque tipo "h2"
  // - párrafos separados por líneas en blanco
  function parseLectura(raw) {
    const lineas = raw.split("\n");
    const bloques = [];
    let bufferParrafo = [];

    const pushParrafo = () => {
      if (bufferParrafo.length > 0) {
        const texto = bufferParrafo.join(" ").trim();
        if (texto) {
          bloques.push({ type: "p", text: texto });
        }
        bufferParrafo = [];
      }
    };

    for (let linea of lineas) {
      const l = linea.trim();
      if (!l) {
        // línea en blanco -> termina párrafo
        pushParrafo();
        continue;
      }

      // ## subtítulo
      if (l.startsWith("##")) {
        pushParrafo();
        const text = l.replace(/^##\s?/, "").trim();
        bloques.push({ type: "h2", text });
        continue;
      }

      // # título de sección
      if (l.startsWith("#")) {
        pushParrafo();
        const text = l.replace(/^#\s?/, "").trim();
        bloques.push({ type: "h1", text });
        continue;
      }

      // línea normal -> parte de párrafo
      bufferParrafo.push(l);
    }

    // último párrafo si quedó algo
    pushParrafo();

    return bloques;
  }

  function renderLectura(rawContent, container) {
    if (!container) return;
    container.innerHTML = "";

    const bloques = parseLectura(rawContent || "");

    if (!bloques.length) {
      container.innerHTML =
        '<p class="text-slate-500">No hay contenido para esta lectura.</p>';
      return;
    }

    bloques.forEach((b) => {
      let el;
      if (b.type === "h1") {
        el = document.createElement("h2");
        el.className =
          "text-xl font-bold text-slate-900 mt-4 mb-2 border-b border-slate-200 pb-1";
        el.textContent = b.text;
      } else if (b.type === "h2") {
        el = document.createElement("h3");
        el.className = "text-lg font-semibold text-slate-800 mt-3 mb-1";
        el.textContent = b.text;
      } else {
        el = document.createElement("p");
        el.className = "text-slate-700 text-sm leading-relaxed";
        el.textContent = b.text;
      }
      container.appendChild(el);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 1) Tomar id de la URL: ?id=CASEC-1-7-LECTURA
    const params = new URLSearchParams(window.location.search);
    const actividadId = params.get("id");

    if (!actividadId) {
      console.warn("No se recibió id de actividad en el GET");
      const cont = document.getElementById("lecturaContainer");
      if (cont) {
        cont.innerHTML =
          '<p class="text-red-600">Falta el parámetro <strong>id</strong> en la URL.</p>';
      }
      return;
    }

    // 2) Leer localStorage.actividades
    let actividades = {};
    try {
      actividades =
        JSON.parse(localStorage.getItem("actividades")) || {};
    } catch (e) {
      console.error("Error parseando localStorage.actividades:", e);
      actividades = {};
    }

    const actividad = actividades[actividadId];

    if (!actividad || !actividad.config) {
      console.warn("No se encontró la actividad en localStorage:", actividadId);
      const cont = document.getElementById("lecturaContainer");
      if (cont) {
        cont.innerHTML =
          '<p class="text-red-600">No se encontró la configuración de esta lectura.</p>';
      }
      return;
    }

    // Esperamos algo así:
    // config: { title, rawContent, sections: [] }
    const { title, rawContent } = actividad.config;

    // 3) Título principal arriba (el "bonito", de config.title)
    const tituloSpan = document.getElementById("tituloLectura");
    if (tituloSpan) {
      tituloSpan.textContent = title || "Lectura";
    }

    // 4) Renderizar contenido
    const contenedor = document.getElementById("lecturaContainer");
    renderLectura(rawContent, contenedor);
  });

