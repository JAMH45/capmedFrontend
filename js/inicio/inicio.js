document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedorActividades");
  if (!contenedor) {
    console.warn("No se encontró el contenedor de actividades");
    return;
  }

  // Leer curso y semana actuales
  const cursoActual = localStorage.getItem("cursoActual");
  const semanaActual = localStorage.getItem("semanaActual"); // ej. "semana1"

  console.log("cursoActual:", cursoActual);
  console.log("semanaActual:", semanaActual);

  if (!cursoActual || !semanaActual) {
    contenedor.innerHTML =
      '<p class="text-red-600">No se encontró curso o semana actual. Regresa a la pantalla anterior.</p>';
    return;
  }

  // Leer cursos guardados desde localStorage
  const cursosGuardadosRaw =
    JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];

  console.log("cursosGuardadosRaw:", cursosGuardadosRaw);

  // Buscar el curso actual por nombre
  const curso = cursosGuardadosRaw.find((c) => c.name === cursoActual);

  if (!curso) {
    console.warn("No se encontró el curso:", cursoActual);
    contenedor.innerHTML =
      '<p class="text-red-600">No se encontró este curso en el sistema.</p>';
    return;
  }

  const semanaObj = curso.semanas?.[semanaActual];

  if (!semanaObj) {
    console.warn(
      `No se encontró la ${semanaActual} para el curso`,
      cursoActual
    );
    contenedor.innerHTML =
      '<p class="text-slate-600">Aún no hay actividades configuradas para esta semana.</p>';
    return;
  }

  const activitiesObj = semanaObj.activities || {};
  const actividadesLista = Object.values(activitiesObj);

  if (actividadesLista.length === 0) {
    contenedor.innerHTML =
      '<p class="text-slate-600">No hay actividades registradas para esta semana.</p>';
    return;
  }

  // Función auxiliar para mapear tipo → rol (para CardWb)
  function tipoToRol(tipo) {
    switch ((tipo || "").toUpperCase()) {
      case "AGENTE":
        return "agente";
      case "DOCTOR":
        return "doctor";
      default:
        return "agente"; // por defecto
    }
  }

  // Limpiamos el contenedor antes de pintar
  contenedor.innerHTML = "";

  // Crear una card por actividad
 // Crear una card por actividad
 console.log(actividadesLista);
actividadesLista.forEach((act) => {
 
  const id = act.id || "";
  const titulo = act.titulo || "Sin título";
  const descripcion = act.descripcion || "";
  const rol = tipoToRol(act.tipo); // agente / doctor / default


  // 👉 Aquí decidimos a qué URL va
  let urlActividad;

  if (act.tipo === "AGENTE" || act.tipo === "DOCTOR") {
    // Enviar al virtualChat
    urlActividad = `./virtualChat.html?tipo=${rol}&id=${encodeURIComponent(id)}`;
  } else {
    // Comportamiento normal
    urlActividad = `./${act.tipo}.html?id=${encodeURIComponent(id)}`;
  }

  const cardDiv = document.createElement("div");
  cardDiv.className = "w-[330px]";

  cardDiv.setAttribute(
    "v-scope",
    `CardWb('${act.tipo}', '${titulo.replace(/'/g, "\\'")}', '${descripcion.replace(
      /'/g,
      "\\'"
    )}', '${rol}', '${urlActividad}')`
  );

  contenedor.appendChild(cardDiv);
});


  // Activar PetiteVue después de insertar dinámicamente
  if (window.petiteVue) {
    window.petiteVue.createApp().mount();
  } else {
    console.warn("PetiteVue no está disponible en window.petiteVue");
  }
});
