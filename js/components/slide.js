// === Config ===
const FORCE_COLLAPSED_ON_LOAD = true;

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
  localStorage.setItem('sidebarCollapsed', String(collapsed));
}

// Función para cerrar sidebar móvil
function closeMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay');
  sidebar?.classList.remove('mobile-open');
  overlay?.classList.remove('active');
  document.body.classList.remove('sidebar-open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Decide estado inicial
  let collapsed;
  if (FORCE_COLLAPSED_ON_LOAD) {
    collapsed = true;
  } else {
    const saved = localStorage.getItem('sidebarCollapsed');
    collapsed = (saved === null) ? true : (saved === 'true');
  }
  setCollapsed(collapsed);

  // Aplicar a sidebars que aparezcan después
  const mo = new MutationObserver(() => applyCollapsedState(
    document.body.classList.contains('sidebar-collapsed')
  ));
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Variables de control
  let isNavigating = false;

  // Listener para menu items en móvil
  document.addEventListener('click', (e) => {
    const menuLink = e.target.closest('.sidebar .menu-item');
    if (menuLink && window.innerWidth <= 768) {
      isNavigating = true;
      setTimeout(() => {
        closeMobileSidebar();
        isNavigating = false;
      }, 150);
      return; // Dejar que el link funcione
    }
  }, true); // CAPTURE PHASE - se ejecuta primero

  // Resto de los listeners
  document.addEventListener('click', (e) => {
    // Si está navegando, ignorar otros clicks
    if (isNavigating) return;

    // Toggle desktop
    const toggleBtn = e.target.closest('#toggle-btn, [data-action="toggle-sidebar"]');
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      const current = document.body.classList.contains('sidebar-collapsed');
      setCollapsed(!current);
      return;
    }

    // Toggle móvil
    const mobileToggle = e.target.closest('#mobile-toggle, [data-action="toggle-sidebar-mobile"]');
    if (mobileToggle) {
      e.preventDefault();
      e.stopPropagation();
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
      e.preventDefault();
      e.stopPropagation();
      closeMobileSidebar();
      return;
    }
  });

  // Cerrar sidebar móvil si pasa a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileSidebar();
    }
  });
});