function getCursoActualDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("curso"); // "CASEC", "CAMZYOS", etc.
}

function obtenerCursoDesdeLocalStorage(cursoName) {
  const cursos = JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];
  return cursos.find((c) => c.name === cursoName) || null;
}

function renderSemanas() {
  const cursoName = getCursoActualDesdeURL();
  const contenedor = document.getElementById("listaSemanas");

  // Poner nombre del curso
  const nameCursoEl = document.getElementById("nameCurso");
  if (nameCursoEl && cursoName) {
    nameCursoEl.textContent = cursoName;
  }

  if (!contenedor) return;

  if (!cursoName) {
    contenedor.innerHTML =
      '<p class="text-red-600">No se encontró el curso en la URL.</p>';
    return;
  }

  const curso = obtenerCursoDesdeLocalStorage(cursoName);

  if (!curso) {
    contenedor.innerHTML =
      '<p class="text-red-600">No se encontró este curso en el sistema.</p>';
    return;
  }

  const semanas = curso.semanas || {};
  const keys = Object.keys(semanas);

  if (keys.length === 0) {
    contenedor.innerHTML =
      '<p class="text-slate-600">Aún no hay semanas registradas para este curso.</p>';
    return;
  }

  contenedor.innerHTML = "";

  keys
    .sort((a, b) => {
      const na = parseInt(a.replace("semana", "")) || 0;
      const nb = parseInt(b.replace("semana", "")) || 0;
      return na - nb;
    })
    .forEach((key, index) => {
      const datosSemana = semanas[key];
      const numSemana = index + 1;

      const wrapper = document.createElement("div");
      wrapper.className =
        "border border-blue-200 rounded-lg mb-3 overflow-hidden";

      const headerId = `${key}-header`;
      const contenidoId = `${key}-contenido`;
      const chevronId = `${key}-chevron`;

      wrapper.innerHTML = `
        <!-- HEADER DE SEMANA -->
        <div
          id="${headerId}"
          class="w-full bg-blue-100 px-4 py-3 flex justify-between items-center cursor-pointer"
        >
          <span class="text-lg font-bold text-blue-900">
            Semana ${numSemana} - ${datosSemana.name || "Sin título"}
          </span>

          <div class="flex gap-3 text-blue-900 items-center">
            <i
              id="${chevronId}"
              class="fa-solid fa-chevron-down transition-transform duration-300"
            ></i>

            <!-- Botón + para nueva actividad -->
            <button
              class="hover:text-blue-700"
              data-open-modal="actividad"
              data-semana="${key}"
            >
              <i class="fa-solid fa-plus"></i>
            </button>

            <button class="hover:text-blue-700">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="hover:text-red-600">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- CONTENIDO DE ACTIVIDADES -->
        <div
          id="${contenidoId}"
          class="bg-blue-50 px-6 overflow-hidden transition-all duration-500 ease-out semana-contenido"
          style="max-height: 0;"
        >
          <div class="py-2 space-y-2" data-semana-actividades="${key}">
          </div>
        </div>
      `;

      contenedor.appendChild(wrapper);

      // Acordeón
      const header = wrapper.querySelector(`#${headerId}`);
      const contenido = wrapper.querySelector(`#${contenidoId}`);
      const chevron = wrapper.querySelector(`#${chevronId}`);

      let abierto = false;

      header.addEventListener("click", (evt) => {
        if (evt.target.closest("button")) return;

        abierto = !abierto;
        if (abierto) {
          contenido.style.maxHeight = contenido.scrollHeight + "px";
          chevron.classList.add("rotate-180");
        } else {
          contenido.style.maxHeight = "0px";
          chevron.classList.remove("rotate-180");
        }
      });

      // 🔹 Aquí pintamos las actividades de ESTA semana
      const contenedorActividades = wrapper.querySelector(
        `[data-semana-actividades="${key}"]`
      );

      renderActividadesSemana(datosSemana.activities, contenedorActividades);
    });
}

function renderActividadesSemana(activitiesObj, contenedorActividades) {
  if (!contenedorActividades) return;

  contenedorActividades.innerHTML = "";

  if (!activitiesObj || Object.keys(activitiesObj).length === 0) {
    contenedorActividades.innerHTML = `
      <p class="text-sm text-slate-600 py-2">
        Aún no hay actividades registradas en esta semana.
      </p>
    `;
    return;
  }

  const entries = Object.entries(activitiesObj);

  // Ordenar por número de actividad dentro del ID:
  // ID = NOMBRE-SEMANA-NUMACT-TIPO  → tomamos la tercera parte
  entries
    .sort(([, aVal], [, bVal]) => {
      const aParts = aVal.id.split("-");
      const bParts = bVal.id.split("-");
      const aNum = parseInt(aParts[2]) || 0;
      const bNum = parseInt(bParts[2]) || 0;
      return aNum - bNum;
    })
    .forEach(([id, act], index) => {
      const numActividad = index + 1;

      // Tipo legible: VIDEO → Video, LECTURA → Lectura, etc.
      const tipoTexto =
        act.tipo && typeof act.tipo === "string"
          ? act.tipo.charAt(0) + act.tipo.slice(1).toLowerCase()
          : "Actividad";

      const titulo = act.titulo || "Sin título";

      const fila = document.createElement("div");
      fila.className =
        "flex justify-between items-center border-b border-blue-200 py-2";

      const tipoLower =
        act.tipo && typeof act.tipo === "string"
          ? act.tipo.toLowerCase()
          : "generica";

      fila.innerHTML = `
  <span class="text-blue-900 font-medium">
    Actividad ${numActividad} — ${tipoTexto}: ${titulo}
  </span>

  <div class="flex gap-3 text-blue-900">
    <button
      class="hover:text-blue-700"
      data-open-modal="${tipoLower}"
      data-actividad-id="${id}"
    >
      <i class="fa-solid fa-pen"></i>
    </button>
    <button
      class="hover:text-red-600"
      data-actividad-delete="${id}"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
`;

      contenedorActividades.appendChild(fila);
    });
}

// Ejecutar cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  renderSemanas();
});
