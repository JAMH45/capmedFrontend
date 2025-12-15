export function LoginMv() {
  return {
    open: true,
    toggle() {
      this.open = !this.open;
    },
    $template: /*html*/ `
      <h1
      style="font-family: raleway; color: #005b8f; font-weight: 950"
      class="text-5xl mt-[10%] "
    >
      CapMedica
    </h1>
    <div
      style="background-color: white; border-radius: 50px"
      class="w-[100%] h-[78vh] mt-[15%] pt-10 text-center mr-4"
    >
      <h4 class="font-semibold text-3xl">Iniciar Sesión</h4>

      <input
        type="text"
        placeholder="Correo o Usuario"
        class="w-[90%] h-[45px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 shadow-sm mt-11"
      />
      <input
        type="password"
        placeholder="Contraseña"
        class="w-[90%] h-[45px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 shadow-sm mt-7"
      />
      <a
        href="#"
        class="block text-center text-blue-600 text-sm font-medium mt-3 hover:underline hover:text-blue-700 active:text-blue-800 transition-colors"
      >
        Olvidé mi contraseña
      </a>
      <button
        class="w-[90%] h-[45px] bg-blue-600 text-white font-semibold rounded-xl shadow-md mt-4 transition-all active:scale-95 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        onclick="window.location.href='./inicio.html'"
            type="button"
      >
        Entrar
      </button>

      <div class="ml-5 flex items-center w-[90%] mt-7">
        <hr class="flex-grow border-t border-gray-300" />
        <span class="mx-3 text-gray-500 font-medium">O</span>
        <hr class="flex-grow border-t border-gray-300" />
      </div>

      <button
        class="w-[90%] h-[45px] bg-teal-500 text-white font-semibold rounded-xl shadow-md mt-7 transition-all active:scale-95 hover:bg-teal-600 focus:ring-2 focus:ring-teal-300"
      >
        Solicitar Registro
      </button>
    </div> `,
  };
}
