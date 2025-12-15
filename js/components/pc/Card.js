export function CardWb(image, title, info, tipo, ruta = null) {
  
  const finalRuta = ruta ?? `./virtualChat.html?tipo=${tipo}`;

  return {
    image,
    title,
    info,
    tipo,
    ruta: finalRuta,

    $template: /*html*/ `
      <div
        class="w-full h-[60vh] bg-white rounded-3xl text-black p-4 flex flex-col items-center justify-between gap-3
               shadow-md hover:shadow-lg hover:shadow-blue-900 transition-shadow text-center"
      >
        <div class="w-full h-48 rounded-2xl overflow-hidden">
          <img :src="'./assets/img/' + image + '.png'" :alt="title" class="w-full h-full object-cover" />
        </div>

        <div>
          <p class="font-extrabold text-blue-950 text-lg">{{ title }}</p>
          <p class="text-sm text-gray-600">{{ info }}</p>
        </div>

        <button 
          type="button"
          onclick="window.location.href='${finalRuta}'"
          class="text-white font-extrabold p-2 px-6 rounded-xl bg-blue-800 hover:bg-blue-900 active:scale-95 transition-all"
        >
          Vamos
        </button>
      </div>
    `,
  };
}
