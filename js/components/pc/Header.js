export function Header(visible = true) {
  return {
    visible,
    $template: /*html*/ `
    <!-- SIDEBAR -->
    <div id="sidebar" class="sidebar">

      <!-- Encabezado -->
      <div class="sidebar-header">
        <button id="toggle-btn" class="toggle-btn" aria-label="Toggle menu">
            <i class="fas fa-bars"></i>
        </button>
        <div class="logo-container">
            <span class="sidebar-title">PharmaSales Pro</span>
        </div>
      </div>

      <!-- NAV -->
      <nav class="sidebar-nav">
        <ul class="menu-list">

          <!-- Siempre visibles -->
          <li class="menu-item-container">
            <a href="#inicio" class="menu-item">
              <i class="fa-solid fa-house"></i>
              <span class="menu-text">Inicio</span>
            </a>
          </li>

          <!-- Solo si visible === true -->
          <li v-if="visible" class="menu-item-container">
            <a href="cursos.html" class="menu-item">
              <i class="fa-solid fa-book-medical"></i>
              <span class="menu-text">Curso</span>
            </a>
          </li>

          <li v-if="visible" class="menu-item-container">
            <a href="#perfil" class="menu-item">
              <i class="fa-solid fa-id-card"></i>
              <span class="menu-text">Perfil</span>
            </a>
          </li>
            <li v-if="visible" class="menu-item-container">
  <a href="admin.html" class="menu-item">
    <i class="fa-solid fa-tools"></i>
    <span class="menu-text">Administrador</span>
  </a>
</li>

          <!-- Siempre visible -->
          <li class="menu-item-container">
            <a href="#acerca" class="menu-item">
              <i class="fa-solid fa-circle-info"></i>
              <span class="menu-text">Acerca de</span>
            </a>
          </li>

          <!-- Solo si visible === true -->
          <li v-if="visible" class="menu-item-container">
            <a href="#logout" class="menu-item">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span class="menu-text">Cerrar sesión</span>
            </a>
          </li>

        </ul>
      </nav>

    </div>
    `,
  };
}

