export function Header(visible = true) {
  return {
    visible,
    $template: /*html*/ `
      <!-- TOP HEADER -->
      <header class="relative fixed top-0 left-0 right-0 z-50 h-[12vh]  border-b border-gray-400">
        <div class="h-full px-4 flex items-center justify-between">

          <!-- Left: burger + title -->
        <div class="flex items-center gap-3">
  <img
    src="assets/img/header/logo.png"
    alt="PharmaSales Pro"
    class="h-12 w-auto object-contain"
  />
</div>
          <!-- Nav -->
          <nav class="flex items-center">
            <ul class="flex items-center gap-5">

           <li>
  <a href="#programa"
     class="flex items-center px-4 py-2 rounded-[20px]
            text-black
            hover:bg-slate-300
            transition">
    Programa
  </a>
</li>

<li v-if="visible" class=" group">
  <!-- Botón -->
  <a href="modulos.html"
     class="flex items-center px-4 py-2 rounded-[20px]
            text-black hover:bg-slate-300 transition">

    Módulos

    <!-- punto azul -->
    <span class="relative ml-3 flex items-center justify-center
                 w-3 h-3 rounded-full bg-blue-500">
      <span
        class="w-1.5 h-1.5 rounded-full bg-white
               opacity-0 group-hover:opacity-100 transition duration-700">
      </span>
    </span>
  </a>

  <!-- MEGA MENU (vacío por ahora) -->

<div
  class="absolute left-1/2 top-full z-50
         mt-0 w-[70vw] h-[76vh]
         -translate-x-1/2
         bg-slate-200/80
         backdrop-blur-sm
         rounded-xl shadow-xl
         invisible
         group-hover:visible
         transition-all duration-200
         grid grid-cols-[30vh_45vh]
         overflow-hidden"
>

  <!-- COLUMNA IZQUIERDA -->
 <div class=" h-full grid grid-rows-2">

    <!-- FILA SUPERIOR -->
    <div class="p-[5px] flex items-center justify-center">
      <img
        src="assets/img/header/img01MD.png"
        alt=""
        class="max-w-full max-h-full object-contain rounded-md"
      />
    </div>

    <!-- FILA INFERIOR -->
   <div class="p-[5px] h-[96%] w-full">
  <div class="bg-white h-full w-full p-[5px] rounded-md flex items-center justify-center">
    <img
      src="assets/img/header/img02MD.png"
      alt=""
      class="max-w-[50%] max-h-full object-contain"
    />
  </div>
</div>



  </div>

  <!-- COLUMNA DERECHA -->
<!-- COLUMNA DERECHA -->
<div class="h-full w-[56vw] grid grid-rows-[3fr_2fr] p-[5px] gap-[5px]">

  <!-- FILA SUPERIOR (BLANCA + TÍTULO + MÓDULOS) -->
  <div class="bg-white h-full w-full rounded-md p-[10px] grid grid-rows-[auto_1fr]">

    <!-- TÍTULO -->
    <div class="mb-[5px] flex items-start justify-start">
      <h2 class="text-lg font-semibold text-slate-800 text-left">
        Módulos
      </h2>
    </div>

    <!-- GRID DE MÓDULOS -->
  <div class="h-full w-full grid grid-cols-2 grid-rows-2 gap-[5px]">

  <!-- Módulo 1 -->
  <div class="rounded-md flex items-center justify-center gap-3 p-4 h-full w-full">
    
    <!-- Imagen -->
    <div class="h-12 w-12 flex items-center justify-center">
      <img
        src="assets/img/header/legos/01.png"
        alt="Módulo 1"
        class="max-h-full max-w-full object-contain"
      />
    </div>

    <!-- Texto -->
    <div class="text-left leading-tight">
      <p class="font-semibold">Módulo 1</p>
      <p class="text-sm text-slate-600">
        Inteligencia del producto y campaña
      </p>
    </div>
  </div>

  <!-- Módulo 2 -->
  <div class="rounded-md flex items-center justify-center gap-3 p-4 h-full w-full">
    <div class="h-12 w-12 flex items-center justify-center">
      <img
        src="assets/img/header/legos/02.png"
        alt="Módulo 2"
        class="max-h-full max-w-full object-contain"
      />
    </div>
    <div class="text-left leading-tight">
      <p class="font-semibold">Módulo 2</p>
      <p class="text-sm text-slate-600">
        Desarrollo de habilidades de venta.
      </p>
    </div>
  </div>

  <!-- Módulo 3 -->
  <a href="inicio.html">
  <div class="rounded-md flex items-center justify-center gap-3 p-4 h-full w-full">

    <div class="h-12 w-12 flex items-center justify-center">
      <img
        src="assets/img/header/legos/03.png"
        alt="Módulo 3"
        class="max-h-full max-w-full object-contain"
      />
    </div>
    <div class="text-left leading-tight">
      <p class="font-semibold">Módulo 3</p>
      <p class="text-sm text-slate-600">
        Simulador de diálogo y roleplaying.
      </p>
    </div>
  </div>
</a>
  <!-- Módulo 4 -->
  <div class="rounded-md flex items-center justify-center gap-3 p-4 h-full w-full">
    <div class="h-12 w-12 flex items-center justify-center">
      <img
        src="assets/img/header/legos/04.png"
        alt="Módulo 4"
        class="max-h-full max-w-full object-contain"
      />
    </div>
    <div class="text-left leading-tight">
      <p class="font-semibold">Módulo 4</p>
      <p class="text-sm text-slate-600">
        Rutas de aprendizaje y agentes de IA
      </p>
    </div>
  </div>

</div>

  </div>

  <!-- FILA INFERIOR -->
<div class="h-[95%] w-full bg-white rounded-md p-[10px] grid grid-rows-[auto_1fr]">

  <!-- TÍTULO -->
  <div class="mb-[10px]">
    <h2 class="text-lg font-semibold text-slate-800 text-left">
      Acerca de los módulos
    </h2>
  </div>

  <!-- CONTENEDOR DE SECCIONES -->
  <div class="h-full w-full grid grid-cols-3 items-center">

    <!-- Tutoriales -->
    <div class="flex items-center justify-center h-full relative">
      <span class="font-semibold text-slate-700">
        Tutoriales
      </span>

      <!-- Línea derecha -->
      <div class="absolute right-0 h-2/3 w-px bg-slate-300"></div>
    </div>

    <!-- Calendario -->
    <div class="flex items-center justify-center h-full relative">
      <span class="font-semibold text-slate-700">
        Calendario
      </span>

      <!-- Línea derecha -->
      <div class="absolute right-0 h-2/3 w-px bg-slate-300"></div>
    </div>

    <!-- Chat IA -->
    <div class="flex items-center justify-center h-full">
      <span class="font-semibold text-slate-700">
        Chat IA
      </span>
    </div>

  </div>

</div>


</div>





</div>



</li>


<li v-if="visible">
  <a href="#mentoria"
     class="flex items-center px-4 py-2 rounded-[20px]
            text-black
            hover:bg-slate-300
            transition">
    Mentoría
  </a>
</li>


<li v-if="visible">
  <label class="inline-flex items-center relative">
    <input class="peer hidden" id="toggle" type="checkbox" />

    <div
      class="relative w-[80px] h-[36px]
             bg-white peer-checked:bg-black
             rounded-full shadow-sm duration-300

             after:absolute after:content-['']
             after:w-[28px] after:h-[28px]
             after:bg-gradient-to-r from-orange-500 to-yellow-400
             peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900
             after:rounded-full
             after:top-[4px] after:left-[4px]
             peer-checked:after:translate-x-[44px]
             after:duration-300 after:shadow-md"
    ></div>

    <!-- SOL -->
    <svg
      viewBox="0 0 24 24"
      class="fill-white peer-checked:opacity-60 absolute w-4 h-4 left-[9px]"
    >
      <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5Z"/>
    </svg>

    <!-- LUNA -->
    <svg
      viewBox="0 0 24 24"
      class="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-4 h-4 right-[9px]"
    >
      <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725A12.121,12.121,0,0,1,10.1.152Z"/>
    </svg>
  </label>
</li>



<li class="relative" v-scope="{ open: false }">
  <!-- Botón -->
  <button
    class="flex items-center gap-2 px-3 py-0 mt-[-7px]
           bg-white text-slate-700
           h-[35px]
           rounded-[25px]
           hover:bg-slate-100
           transition"
    @click="open = !open"
  >
    <!-- Avatar -->
    <span
      class="flex items-center justify-center
             w-7 h-7
             rounded-full
             bg-blue-600 text-white font-semibold text-sm">
      R
    </span>

    <i class="fa-solid fa-chevron-down text-xs"></i>
  </button>

  <!-- Dropdown -->
  <ul
    v-show="open"
    @click.outside="open = false"
    class="absolute right-0 mt-2 w-40
           bg-white text-slate-700
           rounded-lg shadow-lg
           overflow-hidden"
  >
    <li>
      <a href="#perfil"
         class="block px-4 py-2 hover:bg-slate-100 transition">
        Perfil
      </a>
    </li>

    <li>
      <a href="#acerca"
         class="block px-4 py-2 hover:bg-slate-100 transition">
        Acerca
      </a>
    </li>

    <li class="border-t">
      <a href="#logout"
         class="block px-4 py-2 text-red-600 hover:bg-red-50 transition">
        Cerrar sesión
      </a>
    </li>
  </ul>
</li>



            </ul>
          </nav>
        </div>
      </header>

      <!-- Spacer para que no tape el contenido -->
      
    `,
  };
}
