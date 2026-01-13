export function HeaderMv(tituloHeader = "Curso") {
  return {
    tituloHeader,

    // Panel lateral (hamburguesa)
    drawer: false,

    // Navegación interna del drawer (tipo Udemy)
    // "main" = menú principal, "modules" = submenú de módulos
    drawerView: "main",

    // Menú usuario (derecha)
    openUser: false,

    openDrawer() {
      this.drawer = true;
      this.drawerView = "main";
      this.openUser = false;
      document.documentElement.classList.add("overflow-hidden");

      // 👇 BLUR REAL AL MAIN (no backdrop)
      const main = document.getElementById("content");
      if (main) main.classList.add("blur-sm", "opacity-60");
    },
    closeDrawer() {
      this.drawer = false;
      this.drawerView = "main";
      document.documentElement.classList.remove("overflow-hidden");

      // 👇 Quitar blur
      const main = document.getElementById("content");
      if (main) main.classList.remove("blur-sm", "opacity-60");
    },

    toggleUser() {
      this.openUser = !this.openUser;
      if (this.openUser) this.closeDrawer();
    },

    go(view) {
      this.drawerView = view;
    },

    onKey(e) {
      if (e.key === "Escape") {
        this.openUser = false;
        this.closeDrawer();
      }
    },

    // Cierra menú usuario al click fuera
    onClickOutsideUser(e) {
      const btn = this.$refs.btnUser;
      const menu = this.$refs.menuUser;
      if (
        this.openUser &&
        menu &&
        btn &&
        !menu.contains(e.target) &&
        !btn.contains(e.target)
      ) {
        this.openUser = false;
      }
    },

    // Cierra drawer al click fuera (tipo Udemy)
    onClickOutsideDrawer(e) {
      const panel = this.$refs.drawerPanel;
      const btn = this.$refs.btnBurger;
      if (!this.drawer) return;

      // Si clic dentro del panel o en el botón hamburguesa, no cerrar
      if (
        (panel && panel.contains(e.target)) ||
        (btn && btn.contains(e.target))
      )
        return;

      this.closeDrawer();
    },
    mounted() {
      document.addEventListener("click", this.onGlobalClick, true);
    },
    unmounted() {
      document.removeEventListener("click", this.onGlobalClick, true);
    },

    onGlobalClick(e) {
      if (!this.drawer) return;

      const panel = this.$refs.drawerPanel;
      const burger = this.$refs.btnBurger;
      const header = e.target.closest("header");

      // Si el click fue:
      // - dentro del drawer
      // - en el botón hamburguesa
      // - dentro del header
      // NO cerrar
      if (
        (panel && panel.contains(e.target)) ||
        (burger && burger.contains(e.target)) ||
        header
      ) {
        return;
      }

      // Cualquier otra cosa → cerrar
      this.closeDrawer();
    },

    $template: /*html*/ `
<header
  class="fixed top-0 inset-x-0 z-50 bg-white backdrop-blur border-b border-gray-900"
  @keydown="onKey"
  @click.capture="onClickOutsideDrawer"
>
  <div class="relative h-14 px-4 flex items-center justify-between gap-3">

    <!-- HAMBURGUESA (izquierda) -->
    <button
      ref="btnBurger"
      @click="openDrawer()"
      class="inline-flex items-center justify-center w-10 h-10 rounded-lg
             border border-gray-800 text-gray-800 transition hover:bg-gray-100"
      aria-label="Abrir menú"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
      </svg>
    </button>

    <!-- LOGO CENTRADO -->
    <div class="absolute left-1/2 -translate-x-1/2">
      <img
        src="assets/img/header/logo.png"
        alt="PharmaSales Pro"
        class="h-8 sm:h-10 md:h-12 w-auto object-contain select-none pointer-events-none"
      />
    </div>

    <!-- USUARIO (derecha) -->
    <div class="relative" @click.outside="onClickOutsideUser">
      <button
        ref="btnUser"
        @click.stop="toggleUser()"
        class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-800
               text-gray-800 transition hover:bg-gray-100"
        :aria-expanded="openUser ? 'true' : 'false'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-3.33 0-6 2.24-6 5v1h12v-1c0-2.76-2.67-5-6-5z"/>
        </svg>
        <span class="sr-only">Abrir menú usuario</span>
      </button>

      <div
        ref="menuUser"
        :class="openUser ? 'block' : 'hidden'"
        class="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-1"
      >
        <a class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100" href="#perfil">Perfil</a>
        <a class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100" href="#acerca">Acerca de</a>
        <button
          class="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </div>

  </div>

  <!-- OVERLAY BLANCO DIFUMINADO -->
  <div
    :class="drawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    class="fixed inset-0 z-40 bg-white/70 backdrop-blur-sm transition-opacity"
    @click="closeDrawer()"
  ></div>

  <!-- DRAWER (panel lateral tipo Udemy) -->
  <aside
    ref="drawerPanel"
    :class="drawer ? 'translate-x-0' : '-translate-x-full'"
    class="fixed top-0 left-0 z-50 h-screen w-[300px] max-w-[85vw]
           bg-white shadow-2xl transition-transform duration-200"
    role="dialog"
    aria-modal="true"
  >
    <!-- Header del drawer -->
    <div class="h-14 px-4 border-b border-gray-200 flex items-center relative">
      <!-- Logo centrado -->
      <div class="absolute left-1/2 -translate-x-1/2">
        <img
          src="assets/img/header/logo.png"
          alt="PharmaSales Pro"
          class="h-8 sm:h-10 md:h-12 w-auto object-contain select-none pointer-events-none"
        />
      </div>

      <!-- X a la derecha -->
      <button
        class="ml-auto w-9 h-9 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
        @click="closeDrawer()"
        aria-label="Cerrar menú"
      >
        ✕
      </button>
    </div>

    <!-- Contenedor con "páginas" que se deslizan -->
    <div class="relative h-[calc(100vh-56px)] overflow-hidden">

      <!-- MAIN -->
      <div
        class="absolute inset-0 overflow-y-auto p-3 transition-transform duration-200"
        :class="drawerView === 'main' ? 'translate-x-0' : '-translate-x-full'"
      >
        <a href="#programa"
           class="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
          <span>Programa</span>
          <span class="text-gray-400">›</span>
        </a>

        <!-- MODULOS dentro del menú, abre submenú hacia la derecha -->
        <button
          type="button"
          class="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900"
          @click="go('modules')"
        >
          <span>Módulos</span>
          <span class="text-gray-400">›</span>
        </button>

        <a href="#mentoria"
           class="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900">
          <span>Mentoría</span>
          <span class="text-gray-400">›</span>
        </a>

        <div class="my-3 border-t border-gray-200"></div>

        <a href="#perfil" class="block px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900">Perfil</a>
        <a href="#acerca" class="block px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900">Acerca de</a>
        <button
          type="button"
          class="w-full text-left px-3 py-3 rounded-lg hover:bg-red-50 text-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      <!-- SUBMENU: MODULES -->
      <div
        class="absolute inset-0 overflow-y-auto p-3 transition-transform duration-200"
        :class="drawerView === 'modules' ? 'translate-x-0' : 'translate-x-full'"
      >
        <!-- Barra superior tipo "volver" -->
        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900"
          @click="go('main')"
        >
          <span class="text-gray-400">‹</span>
          <span class="font-semibold">Módulos</span>
        </button>

    <div class="mt-2 space-y-1">
  <a
    href="#mod1"
    class="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900"
  >
    <img
      src="assets/img/header/legos/01.png"
      alt="Módulo 1"
      class="h-8 w-8 object-contain"
    />
    <span>Módulo 1</span>
  </a>

  <a
    href="#mod2"
    class="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900"
  >
    <img
      src="assets/img/header/legos/02.png"
      alt="Módulo 2"
      class="h-8 w-8 object-contain"
    />
    <span>Módulo 2</span>
  </a>

  <a
    href="#mod3"
    class="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900"
  >
    <img
      src="assets/img/header/legos/03.png"
      alt="Módulo 3"
      class="h-8 w-8 object-contain"
    />
    <span>Módulo 3</span>
  </a>

  <a
    href="#mod4"
    class="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-900"
  >
    <img
      src="assets/img/header/legos/04.png"
      alt="Módulo 4"
      class="h-8 w-8 object-contain"
    />
    <span>Módulo 4</span>
  </a>
</div>

      </div>

    </div>
  </aside>
</header>
    `,
  };
}
