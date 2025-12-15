export function HeaderMv(tituloHeader = "Curso") {
  return {
    tituloHeader,
    open: false,
    close() { this.open = false },
    onKey(e) { if (e.key === 'Escape') this.close() },
    onClickOutside(e) {
      const btn = this.$refs.btn;
      const menu = this.$refs.menu;
      if (!menu.contains(e.target) && !btn.contains(e.target)) this.close();
    },
    $template: /*html*/ `
    <header
  class="fixed top-0 inset-x-0 z-50 bg-blue-950/95 backdrop-blur border-b border-blue-900"
  @keydown="onKey"
>
  <div class="h-14 px-4 flex items-center justify-between">

    <!-- Marca -->
    <span class="text-lg font-bold text-white">PSP</span>
    <span class="text-lg font-bold text-gray-200">{{tituloHeader}}</span>

    <!-- Menú -->
    <div class="relative" @click.outside="onClickOutside">
      <button
        ref="btn"
        @click.stop="open = !open"
        :aria-expanded="open ? 'true' : 'false'"
        aria-haspopup="true"
        aria-controls="menuPanel"
        class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-800
               text-gray-100 hover:bg-blue-900 active:scale-95 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-3.33 0-6 2.24-6 5v1h12v-1c0-2.76-2.67-5-6-5z"/>
        </svg>
        <span class="sr-only">Abrir menú</span>
      </button>

      <!-- Panel -->
      <div
        ref="menu"
        id="menuPanel"
        :class="open ? 'block' : 'hidden'"
        class="absolute right-0 mt-2 w-44 origin-top-right 
               bg-blue-950 rounded-xl shadow-lg ring-1 ring-blue-900 p-1"
      >
        <a href="#perfil"
           class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                  text-gray-200 hover:bg-blue-900">
          Perfil
        </a>
        <a href="#Acerca de"
           class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                  text-gray-200 hover:bg-blue-900">
          Acerca de
        </a>
        <button type="button"
                class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                       text-red-400 hover:bg-red-600/20">
          Cerrar sesión
        </button>
      </div>
    </div>

  </div>
</header>

    `,
  };
}