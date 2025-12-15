// js/examen/examen.js

document.addEventListener("DOMContentLoaded", () => {
  // 1) Obtener el id desde la URL (?id=CASEC-1-6-EXAMEN)
  const params = new URLSearchParams(window.location.search);
  const actividadId = params.get("id");

  if (!actividadId) {
    console.warn("No se recibió id de actividad en el GET");
    const cont = document.getElementById("examenContainer");
    if (cont) {
      cont.innerHTML =
        '<p class="text-red-600">Falta el parámetro <strong>id</strong> en la URL.</p>';
    }
    return;
  }

  // 2) Leer localStorage.actividades
  let actividades = {};
  try {
    actividades = JSON.parse(localStorage.getItem("actividades")) || {};
  } catch (e) {
    console.error("Error parseando localStorage.actividades:", e);
    actividades = {};
  }

  const actividad = actividades[actividadId];

  if (!actividad || !actividad.config) {
    console.warn("No se encontró la actividad en localStorage:", actividadId);
    const cont = document.getElementById("examenContainer");
    if (cont) {
      cont.innerHTML =
        '<p class="text-red-600">No se encontró la configuración de este examen.</p>';
    }
    return;
  }

  const { title, questions } = actividad.config;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    const cont = document.getElementById("examenContainer");
    if (cont) {
      cont.innerHTML =
        '<p class="text-red-600">Este examen no tiene preguntas configuradas.</p>';
    }
    return;
  }

  // 3) Título arriba
  const tituloSpan = document.getElementById("tituloExamen");
  if (tituloSpan) {
    tituloSpan.textContent = title || "Examen";
  }

  // 4) Render del contenido
  const container = document.getElementById("examenContainer");
  if (!container) return;

  container.innerHTML = "";

  // Card principal (mismo estilo general que audio/lectura)
  const card = document.createElement("div");
  card.className =
    "w-full max-w-4xl bg-white border border-slate-200 rounded-xl p-6 shadow-md text-left space-y-6";

  // Título interno opcional
  const intro = document.createElement("div");
  intro.innerHTML = `
    <p class="text-slate-700 text-sm leading-relaxed">
      Responde las siguientes preguntas seleccionando la opción que consideres correcta.
    </p>
  `;
  card.appendChild(intro);

  // Formulario del examen
  const form = document.createElement("form");
  form.className = "space-y-6";

  questions.forEach((q, qIndex) => {
    const qWrapper = document.createElement("div");
    qWrapper.className =
      "border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3";

    const qTitle = document.createElement("div");
    qTitle.className = "flex items-start gap-2";

    qTitle.innerHTML = `
      <span class="text-sm font-semibold text-blue-700">
        Pregunta ${qIndex + 1}.
      </span>
      <p class="text-slate-800 text-sm leading-relaxed">
        ${q.text || "Pregunta sin texto"}
      </p>
    `;

    qWrapper.appendChild(qTitle);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "space-y-2";

    if (Array.isArray(q.options)) {
      q.options.forEach((opt, optIndex) => {
        const optId = `q${qIndex}_opt${optIndex}`;
        const label = document.createElement("label");
        label.className =
          "flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-100";

        label.innerHTML = `
          <input
            id="${optId}"
            type="radio"
            name="pregunta_${qIndex}"
            value="${optIndex}"
            class="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
          />
          <span class="text-sm text-slate-800">
            ${opt.text || "Opción sin texto"}
          </span>
        `;

        optionsContainer.appendChild(label);
      });
    } else {
      const noOptions = document.createElement("p");
      noOptions.className = "text-xs text-red-600";
      noOptions.textContent = "No se configuraron opciones para esta pregunta.";
      optionsContainer.appendChild(noOptions);
    }

    qWrapper.appendChild(optionsContainer);
    form.appendChild(qWrapper);
  });

  // Contenedor de resultados
  const resultadoDiv = document.createElement("div");
  resultadoDiv.id = "examenResultado";
  resultadoDiv.className = "mt-4";

  // Botón de envío
  const btnEnviar = document.createElement("button");
  btnEnviar.type = "submit";
  btnEnviar.className =
    "mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold";

  btnEnviar.innerHTML = `
    <i class="fa-solid fa-paper-plane"></i>
    Enviar respuestas
  `;

  form.appendChild(btnEnviar);
  card.appendChild(form);
  card.appendChild(resultadoDiv);
  container.appendChild(card);

  // Lógica de corrección
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let correctas = 0;
    let respondidas = 0;

    questions.forEach((q, qIndex) => {
      const seleccion = form.querySelector(
        `input[name="pregunta_${qIndex}"]:checked`
      );
      if (!seleccion) {
        return;
      }

      respondidas++;

      const optIndex = parseInt(seleccion.value, 10);
      const opcion = q.options?.[optIndex];

      if (opcion && opcion.correct) {
        correctas++;
      }
    });

    const total = questions.length;
    const porcentaje = Math.round((correctas / total) * 100);

    resultadoDiv.innerHTML = `
      <div class="mt-4 p-4 rounded-lg border ${
        porcentaje >= 70
          ? "border-emerald-300 bg-emerald-50"
          : "border-amber-300 bg-amber-50"
      }">
        <p class="text-sm text-slate-800">
          Preguntas respondidas: <strong>${respondidas}</strong> de ${total}
        </p>
        <p class="text-sm text-slate-800">
          Respuestas correctas: <strong>${correctas}</strong> de ${total}
        </p>
        <p class="text-sm font-semibold mt-1 ${
          porcentaje >= 70 ? "text-emerald-700" : "text-amber-700"
        }">
          Calificación: ${porcentaje}%
        </p>
      </div>
    `;
  });
});
