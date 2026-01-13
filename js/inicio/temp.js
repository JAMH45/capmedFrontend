//localStorage.removeItem("semana1");

const actividadesSemana1 = [
  { id: 1, titulo: "[Video] CASEC suplemento review", status: "activa", url: "video.html" },
  { id: 2, titulo: "[Lectura] ¿Que es CASEC?", status: "activa", url: "lectura.html" },
  { id: 3, titulo: "[Examen 1] Conceptos básicos de CASEC", status: "activa", url: "examen.html" },
  { id: 4, titulo: "[Audio 1] Conceptos básicos de CASEC", status: "activa", url: "audio.html" },
  { id: 5, titulo: "[RolePlay1] Doctor Jose Smith esta interesado en nuestro producto.", status: "activa", url: "virtualChat.html?tipo=agente" },
  { id: 6, titulo: "Evaluación de la efectividad de los mensajes publicitarios", status: "bloqueada" },
  { id: 7, titulo: "Lorem ipsum dolor sit amet consectetur", status: "bloqueada" }
];

if (!localStorage.getItem("semana1")) {
  localStorage.setItem("semana1", JSON.stringify(actividadesSemana1));
}



function cargarActividadesSemana1() {
  const data = JSON.parse(localStorage.getItem("semana1")) || [];

  data.forEach(act => {
    const el = document.querySelector(`[data-actividad-id="${act.id}"]`);
    if (!el) return;

    const icono = el.querySelector("span");
    const flecha = el.querySelector(".text-2xl:last-child");

    // Limpieza previa
    el.classList.remove(
      "bg-indigo-100/70",
      "bg-sky-100/80",
      "opacity-70",
      "pointer-events-none"
    );

    switch (act.status) {
      case "completada":
        icono.textContent = "✓";
        icono.className =
          "inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-green-500 text-green-600 text-sm font-bold";
        el.classList.add("bg-indigo-100/70");
        break;

      case "activa":
        icono.textContent = "◌";
        icono.className =
          "inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 text-xs font-bold";
        el.classList.add("bg-sky-100/80");
        break;

      case "bloqueada":
        icono.textContent = "🔒";
        icono.className =
          "inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm";
        el.classList.add("opacity-70", "pointer-events-none");

        if (el.tagName === "A") el.removeAttribute("href");
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", cargarActividadesSemana1);


function completarActividad(id) {
  const data = JSON.parse(localStorage.getItem("semana1")) || [];

  const act = data.find(a => a.id === id);
  if (!act) return;

  act.status = "completada";

  // Activar la siguiente si existe
  const siguiente = data.find(a => a.id === id + 1);
  if (siguiente && siguiente.status === "bloqueada") {
    siguiente.status = "activa";
  }

  localStorage.setItem("semana1", JSON.stringify(data));
  cargarActividadesSemana1();
}
