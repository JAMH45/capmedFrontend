const cursosGuardadosRaw =
  JSON.parse(localStorage.getItem("cursosMedicamentos")) || [];

console.log("cursosGuardadosRaw:", cursosGuardadosRaw);

// Normalizar para que todos tengan slug y href
const cursosGuardados = cursosGuardadosRaw.map((c) => ({
  ...c,
  slug: c.slug || c.name.toLowerCase(),
  href: c.href || `semana.html?curso=${encodeURIComponent(c.name)}`,
}));

function CursosMedicamentos() {
  return {
    cursos: cursosGuardados,
  };
}

window.CursosMedicamentos = CursosMedicamentos;

