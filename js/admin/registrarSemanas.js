// --------- Utilidad: obtener curso desde GET ---------
function getCursoActualDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("curso"); // Ej: "CASEC" o "CAMZYOS"
}

// --------- Guardar nueva semana en localStorage ---------
function guardarSemanaParaCurso(titulo, descripcion) {
  const cursoName = getCursoActualDesdeURL();

  if (!cursoName) {
    alert("No se encontró el curso en la URL.");
    return;
  }

  // Leer cursos actuales
  const cursos = JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];

  // Buscar el curso por nombre
  const idx = cursos.findIndex((c) => c.name === cursoName);

  if (idx === -1) {
    alert(`No se encontró el curso ${cursoName} en el localStorage.`);
    return;
  }

  // Asegurar que tenga la propiedad semanas
  if (!cursos[idx].semanas) {
    cursos[idx].semanas = {};
  }

  const semanasObj = cursos[idx].semanas;

  // Calcular el siguiente número de semana
  const numActual = Object.keys(semanasObj).length; // 0 si no hay
  const numNueva = numActual + 1;
  const keySemana = `semana${numNueva}`;

  // Crear la nueva semana
  semanasObj[keySemana] = {
    name: titulo,
    description: descripcion,
  };

  // Guardar de vuelta en localStorage
  localStorage.setItem("cursosMedicamentos", JSON.stringify(cursos));

  console.log(
    `Semana registrada para ${cursoName}:`,
    keySemana,
    semanasObj[keySemana]
  );
}

// --------- Abrir / cerrar modal de Nueva Semana ---------
document.addEventListener("click", (e) => {
  // Abrir modal
  if (e.target.closest("[data-open-modal='nuevaSemana']")) {
    document.getElementById("modalNuevaSemana").classList.remove("hidden");
  }

  // Cerrar modal
  if (e.target.closest("[data-close-modal='nuevaSemana']")) {
    document.getElementById("modalNuevaSemana").classList.add("hidden");
  }
});

// --------- Manejar submit del formulario de Nueva Semana ---------
document.addEventListener("DOMContentLoaded", () => {
  const formSemana = document.getElementById("formNuevaSemana");
  if (!formSemana) return;

  formSemana.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("semanaTitulo").value.trim();
    const descripcion = document
      .getElementById("semanaDescripcion")
      .value.trim();

    if (!titulo || !descripcion) {
      alert("Por favor, completa todos los campos de la semana.");
      return;
    }

    guardarSemanaParaCurso(titulo, descripcion);

    // Cerrar modal
    document.getElementById("modalNuevaSemana").classList.add("hidden");

    // Limpiar formulario
    formSemana.reset();

    // Si quieres refrescar la lista de semanas en la UI:
    location.reload();
  });
});

//Crear actividades.
function guardarActividadEnSemana(
  cursoName,
  semanaKey,
  tipo,
  titulo,
  descripcion
) {
  const cursos = JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];

  const idxCurso = cursos.findIndex((c) => c.name === cursoName);
  if (idxCurso === -1) {
    console.warn("Curso no encontrado:", cursoName);
    return;
  }

  if (!cursos[idxCurso].semanas) {
    cursos[idxCurso].semanas = {};
  }

  const semanas = cursos[idxCurso].semanas;

  if (!semanas[semanaKey]) {
    semanas[semanaKey] = {
      name: "",
      description: "",
      activities: {},
    };
  }

  const semana = semanas[semanaKey];

  if (!semana.activities) {
    semana.activities = {};
  }

  const activities = semana.activities;

  const numSemana = parseInt(semanaKey.replace("semana", "")) || 0;
  const numActividad = Object.keys(activities).length + 1;
  const tipoNorm = (tipo || "GENERICA").toUpperCase();

  const id = `${cursoName}-${numSemana}-${numActividad}-${tipoNorm}`;

  activities[id] = {
    id,
    tipo: tipoNorm,
    titulo: titulo || "",
    descripcion: descripcion || "",
  };

  semanas[semanaKey].activities = activities;
  cursos[idxCurso].semanas = semanas;

  localStorage.setItem("cursosMedicamentos", JSON.stringify(cursos));

  console.log(
    `Actividad guardada en ${cursoName} / ${semanaKey}:`,
    activities[id]
  );
}

let contextoActividad = {
  semanaKey: null,
};

document.addEventListener("click", (e) => {
  // Abrir modal al dar click al botón +
  const trigger = e.target.closest("[data-open-modal='actividad']");
  if (trigger) {
    contextoActividad.semanaKey = trigger.dataset.semana; // "semana1", "semana2", ...
    document.getElementById("modalNuevaActividad").classList.remove("hidden");
  }

  // Cerrar modal
  if (e.target.closest("[data-close-modal='actividad']")) {
    document.getElementById("modalNuevaActividad").classList.add("hidden");
  }
});
document
  .getElementById("formNuevaActividad")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const cursoName = localStorage.getItem("cursoActual"); // o del GET
    const semanaKey = contextoActividad.semanaKey; // "semana1", "semana3", etc.

    if (!cursoName || !semanaKey) {
      console.warn("Falta cursoActual o semanaKey");
      return;
    }

    const titulo = document.getElementById("actTitulo").value.trim();
    const descripcion = document.getElementById("actDescripcion").value.trim();
    const tipo = document.getElementById("actTipo").value.trim();

    if (!titulo || !descripcion) {
      alert("Completa título y descripción");
      return;
    }

    guardarActividadEnSemana(cursoName, semanaKey, tipo, titulo, descripcion);

    document.getElementById("modalNuevaActividad").classList.add("hidden");

    e.target.reset();

    // Si quieres ver al momento la nueva actividad:
    // renderSemanas();
    // por ahora, recargar:
    location.reload();
  });

const cursosGuardados =
  JSON.parse(localStorage.getItem("actividades")) || [];
console.log(cursosGuardados);
