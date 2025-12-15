export function Card(image, title, info, tipo) {
  return {
    image,
    title,
    info,
    tipo,
    $template: /*html*/ `
      <div
        class="w-[90%] mx-auto h-auto bg-white rounded-3xl text-black p-6 flex flex-col items-center gap-4 
               shadow-md hover:shadow-2xl hover:shadow-sky-300 transition-shadow text-center mt-5"
      >
        <!-- Imagen -->
        <div class="w-full h-48 rounded-2xl overflow-hidden">
          <img
            :src="'./assets/img/' + image + '.png'"
            :alt="title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Texto -->
        <div>
          <p class="font-extrabold text-lg">{{ title }}</p>
          <p class="text-sm text-gray-600">{{ info }}</p>
        </div>

        <!-- Botón -->
        <button
          class="bg-teal-500 text-white font-extrabold p-2 px-6 rounded-xl hover:bg-sky-500 transition-colors mt-2"
          type="button"
          onclick="window.location.href='./virtualChat.html?tipo=${tipo}'"
        >
          Vamos
        </button>
      </div>
    `,
  };
}
