// === OBTENER CURSO DESDE QUERYSTRING ===
const params = new URLSearchParams(window.location.search);
const cursoNombre = params.get("curso");
console.log("Curso recibido:", cursoNombre);

// Limpiar y guardar cursoActual en localStorage
localStorage.removeItem("cursoActual");
if (cursoNombre) {
  localStorage.setItem("cursoActual", cursoNombre);
}

// Cambiar título del curso en la vista (si existe ese elemento)
if (cursoNombre && document.getElementById("titCurso")) {
  document.getElementById("titCurso").textContent = cursoNombre;
}

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("listaSemanas");
  if (!contenedor) return;

  // Leer todos los cursos guardados
  const cursosGuardadosRaw =
    JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];

  console.log("cursosGuardadosRaw:", cursosGuardadosRaw);

  // Buscar el curso actual por name
  const curso = cursosGuardadosRaw.find(
    (c) => c.name === cursoNombre
  );

  if (!curso) {
    console.warn("No se encontró el curso:", cursoNombre);
    contenedor.innerHTML =
      '<p class="text-red-600">No se encontró este curso en el sistema.</p>';
    return;
  }

  const semanasObj = curso.semanas || {};

  const keysSemanas = Object.keys(semanasObj);
  if (keysSemanas.length === 0) {
    contenedor.innerHTML =
      '<p class="text-slate-600">Aún no hay semanas registradas para este curso.</p>';
    return;
  }

  // Limpiamos por si acaso
  contenedor.innerHTML = "";

  // Ordenamos las keys: "semana1", "semana2", etc.
  keysSemanas
    .sort((a, b) => {
      const na = parseInt(a.replace("semana", "")) || 0;
      const nb = parseInt(b.replace("semana", "")) || 0;
      return na - nb;
    })
    .forEach((semanaKey, index) => {
      const datosSemana = semanasObj[semanaKey];
      const numSemana = index + 1;

      // Contenedor de cada semana
      const wrapper = document.createElement("div");
      wrapper.className =
        "border border-blue-200 rounded-lg mb-3 overflow-hidden";

      // Por ahora TODAS desbloqueadas (si luego quieres bloquear, aquí metes la lógica)
      const bloqueada = false;

      const bloqueadaClase = bloqueada
        ? "bg-blue-50 text-blue-400 cursor-not-allowed opacity-60"
        : "bg-blue-100 text-blue-900 cursor-pointer";

      wrapper.innerHTML = `
        <div
          class="w-full px-4 py-3 flex justify-between items-center semana-header ${bloqueadaClase}"
          data-semana-key="${semanaKey}"
        >
          <span class="text-lg font-bold">
            Semana ${numSemana} - ${datosSemana.name || "Sin título"}
          </span>

          <div class="flex gap-3 items-center">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      `;

      contenedor.appendChild(wrapper);

      // Click en el header de la semana
      const header = wrapper.querySelector(".semana-header");
      header.addEventListener("click", () => {
        if (bloqueada) {
          alert(`La ${semanaKey} está bloqueada para ${cursoNombre}.`);
          return;
        }

        // Guardamos la semana actual en localStorage para usarla en inicio.html
        localStorage.setItem("semanaActual", semanaKey);

        // Redirigir a inicio.html (si quieres, también puedes pasarla por querystring)
        window.location.href = "inicio.html";
        // Ejemplo con querystring:
        // window.location.href = `inicio.html?curso=${encodeURIComponent(cursoNombre)}&semana=${encodeURIComponent(semanaKey)}`;
      });
    });
});
