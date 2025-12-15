export function FooterMv() {
  return {
    $template: /*html*/ `
      <footer class="fixed bottom-0 inset-x-0 z-50 bg-blue-950 border-t border-blue-900 shadow-lg">
        <nav class="flex justify-around items-center h-14">

          <!-- Back -->
          <button class="text-gray-200 hover:text-blue-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Inicio -->
          <button class="text-gray-200 hover:text-blue-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.75z"
              />
            </svg>
          </button>

          <!-- Cursos -->
          <button class="text-gray-200 hover:text-teal-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0l-3-3m3 3l3-3" />
            </svg>
          </button>

          <!-- Perfil -->
          <button class="text-gray-200 hover:text-blue-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                 fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z" />
            </svg>
          </button>

        </nav>
      </footer>
    `,
  };
}
