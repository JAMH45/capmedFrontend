// Si no existe, inicializar en []
if (!localStorage.getItem("cursosMedicamentos")) {
  localStorage.setItem("cursosMedicamentos", JSON.stringify([]));
}

// Leer del localStorage
const cursosGuardados =
  JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];
console.log(cursosGuardados);
// Agregar slug y href a cada uno (EN MEMORIA)
const cursosMedicamentos = cursosGuardados.map((c) => ({
  ...c,
  slug: c.name.toLowerCase(),
  href: `workAdmin.html?curso=${encodeURIComponent(c.name)}`,
}));

// Petite-Vue scope
function CursosMedicamentos() {
  return {
    cursos: cursosMedicamentos,
  };
}

window.CursosMedicamentos = CursosMedicamentos;

// Modal
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-open-modal='nuevoMedicamento']")) {
    document.getElementById("modalNuevoMedicamento").classList.remove("hidden");
  }

  if (e.target.closest("[data-close-modal='nuevoMedicamento']")) {
    document.getElementById("modalNuevoMedicamento").classList.add("hidden");
  }
});

document.getElementById("guardarCurso").addEventListener("click", function (e) {
  e.preventDefault(); // evita submit normal

  const name = document.getElementById("medName").value.trim();
  const description = document.getElementById("medDescription").value.trim();

  if (!name || !description) {
    alert("Por favor llena todos los campos");
    return;
  }

  guardarCurso(name, description);

  // cerrar modal
  document.getElementById("modalNuevoMedicamento").classList.add("hidden");

  // limpiar inputs
  document.getElementById("formNuevoMedicamento").reset();

  // refrescar tarjetas si quieres:
  location.reload();
});


function guardarCurso(name, description) {
  let cursos = JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];

  const nuevoCurso = {
    name,
    description,
  };

  cursos.push(nuevoCurso);

  localStorage.setItem("cursosMedicamentos", JSON.stringify(cursos));

  console.log("Curso guardado:", nuevoCurso);
}

