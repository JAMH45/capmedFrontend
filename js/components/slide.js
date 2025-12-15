// === Config ===
const FORCE_COLLAPSED_ON_LOAD = true; // true = siempre inicia pequeño; false = solo por defecto

// === Helpers ===
function applyCollapsedState(collapsed) {
  document.body.classList.toggle('sidebar-collapsed', collapsed);
  document.querySelectorAll('.sidebar').forEach(sb => {
    sb.classList.toggle('collapsed', collapsed);
  });
  const content = document.getElementById('content');
  if (content) content.classList.toggle('expanded', !collapsed);
}

function setCollapsed(collapsed) {
  applyCollapsedState(collapsed);
  // Si quieres persistir el toggle del usuario, guarda siempre;
  // si fuerzas colapsado, igual lo guardamos para coherencia de la UI.
  localStorage.setItem('sidebarCollapsed', String(collapsed));
}

document.addEventListener('DOMContentLoaded', () => {
  // Decide estado inicial
  let collapsed;
  if (FORCE_COLLAPSED_ON_LOAD) {
    collapsed = true;                    // forzar pequeño SIEMPRE
  } else {
    const saved = localStorage.getItem('sidebarCollapsed');
    collapsed = (saved === null) ? true  // por defecto pequeño si no hay preferencia
                                 : (saved === 'true');
  }
  setCollapsed(collapsed);

  // Aplicar a sidebars que aparezcan después (contenido dinámico)
  const mo = new MutationObserver(() => applyCollapsedState(
    document.body.classList.contains('sidebar-collapsed')
  ));
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Delegación de clicks (dinámico)
  document.addEventListener('click', (e) => {
    // Toggle desktop
    const toggleBtn = e.target.closest('#toggle-btn, [data-action="toggle-sidebar"]');
    if (toggleBtn) {
      const current = document.body.classList.contains('sidebar-collapsed');
      setCollapsed(!current);
      return;
    }

    // Toggle móvil
    const mobileToggle = e.target.closest('#mobile-toggle, [data-action="toggle-sidebar-mobile"]');
    if (mobileToggle) {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('overlay');
      if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        overlay?.classList.toggle('active');
        document.body.classList.toggle('sidebar-open', sidebar.classList.contains('mobile-open'));
      }
      return;
    }

    // Cerrar por overlay
    const overlayClick = e.target.closest('#overlay');
    if (overlayClick) {
      const sidebar = document.querySelector('.sidebar');
      overlayClick.classList.remove('active');
      sidebar?.classList.remove('mobile-open');
      document.body.classList.remove('sidebar-open');
      return;
    }
  });

  // Cerrar sidebar móvil si pasa a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.sidebar').forEach(sb => sb.classList.remove('mobile-open'));
      const overlay = document.getElementById('overlay');
      overlay?.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  });
});
