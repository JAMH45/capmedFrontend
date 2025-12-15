document.addEventListener("DOMContentLoaded", () => {
  const raw = sessionStorage.getItem("dataSig");
  if (!raw) {
    console.warn("No se encontró dataSig en sessionStorage");
    return;
  }
  const dataSig = JSON.parse(raw);
  console.log("dataSig recibido:", dataSig);

  // Ejemplo: pintar algo en la página
 
 const dataSig2 = JSON.parse(sessionStorage.getItem("dataSig"));
  let calGeneral = 0;
  
//prueba
/*
// Lista de objeciones/respuestas (7 elementos)
let listaObj = [
  { obj: "Ob1. ¿Está disponible en mi institución o en el cuadro básico?”", res: "Es el primer inhibidor selectivo de miosina aprobado para MCHo sintomática y cuenta con estudios fase 3 y seguimiento a largo plazo.", clas: 2 },
  { obj: "Ob2. ¿Está aprobado por la autoridad regulatoria local?",          res: "Sí, está respaldado por estudios y guías. El manejo se va ajustando con ecocardiografía y hay apoyo para quienes están empezando, aunque requiere seguimiento.", clas: 1 },
  { obj: "Ob3. ¿Se puede solicitar por compra especial?",         res: "No pasa nada, se puede usar sin experiencia. Solo hay estudios que lo aprueban y siempre hay alguien que ayuda si hace falta.", clas: 0 },
  { obj: "Ob4. ¿Hay distribución en farmacias hospitalarias?",        res: "Si, hay guías y protocolos para iniciar, el ajuste se hace con ecocardiografía y puede apoyarse en los programas de capacitación disponibles.", clas: 1 }
];

// Contadores según clasificación
const bien = listaObj.filter(x => x.clas === 2).length; // verdes
const mom  = listaObj.filter(x => x.clas === 1).length; // amarillos
const mal  = listaObj.filter(x => x.clas === 0).length; // rojos

// Calificaciones de prueba (puedes ajustarlas)
const calificacionProducto   = 89;
const calificacionRitmo      = 81;
const calificacionTono       = 84;
const calificacionModulacion = 75;

// Armado de dataSig
let dataSig2 = [];
dataSig2.push({
  calP: calificacionProducto,
  calR: calificacionRitmo,
  calT: calificacionTono,
  calM: calificacionModulacion,
  b: bien,
  mom: mom,
  mal: mal,
  hist: [...listaObj],
});
 
*/

//Prueba
const item = dataSig2[0];

  const calP = item.calP;
  let calR = item.calR;
  const calT = item.calT;
  const calM = item.calM;

  setTextById("calP", calP);
  setTextById("calT", calT);
  setTextById("calR", calR);
  setTextById("calM", calM);
  asignarColoresCalificaciones({
  calP: calP, 
  calR: calR, 
  calT: calT,
  calM: calM 
});
calR = evaluarVelocidad(calR);
  calGeneral = (calM+calP+calR+calT)/4;
  calGeneral = quitarDecimales(calGeneral);

  document.getElementById("promGeneral").textContent = calGeneral;
  mostrarCategoria(calGeneral);
 renderDona("graficoTotal", calGeneral);
  const b = item.b;
  const mo = item.mom;
  const ma = item.mal;

  setTextById("bienT", b);
  setTextById("momT", mo);
  setTextById("malT", ma);

 
  const listaObj2 = item.hist;
  
  renderTarjetas(listaObj2);
});

function setTextById(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    } else {
      console.warn(`No se encontró el elemento con id "${id}"`);
    }
  }

  function renderTarjetas(listaObj ) {
  const wrap = document.getElementById('respuestasWrap');
  if (!wrap) return console.warn('No existe #respuestasWrap');
 
  // Limpia primero
  wrap.innerHTML = '';

  if (!Array.isArray(listaObj) || listaObj.length === 0) {
    wrap.innerHTML = `<p class="text-gray-400 text-sm">Sin respuestas aún.</p>`;
    return;
  }

  // Helpers
  const escapeHTML = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const colorByClas = (c) => {
    if (c === 2) return { border: 'border-green-400' , up: '', hand: 'opacity-40', down: 'opacity-40' };
    if (c === 1) return { border: 'border-yellow-400', up: 'opacity-40', hand: '', down: 'opacity-40' };
    return          { border: 'border-red-500'   , up: 'opacity-40', hand: 'opacity-40', down: '' };
  };

  // Construye tarjetas
  const first = listaObj[0];
  const firstC = colorByClas(first.clas);
  const firstCard = `
    <div class="w-full bg-white rounded-b-lg border-t-8 ${firstC.border} px-4 py-5 flex flex-col justify-around shadow-md">
      <p class="text-lg font-bold font-sans">${escapeHTML(first.obj)}</p>
      <div class="py-3">
        <p class="text-gray-400 text-sm">${escapeHTML(first.res)}</p>
      </div>
      <div class="flex items-center justify-end gap-3">
        <i class="fa-solid fa-thumbs-up text-2xl text-green-500 ${firstC.up}"></i>
        <i class="fa-solid fa-hand text-2xl text-yellow-500 ${firstC.hand}"></i>
        <i class="fa-solid fa-thumbs-down text-2xl text-red-500 ${firstC.down}"></i>
      </div>
    </div>
  `;

  // Previews para elementos 2 y 3 (si existen)
  const previews = listaObj.slice(1, 3).map(item => {
    const c = colorByClas(item.clas);
    return `
      <div class="mt-1 w-full bg-white rounded-b-lg border-t-8 ${c.border} px-4 py-3 shadow-sm filter blur-[1.5px] opacity-70 overflow-hidden max-h-12 pointer-events-none card--rest">
        <p class="font-semibold text-sm text-gray-700">${escapeHTML(item.obj)}</p>
      </div>
    `;
  }).join('');

  const previewGroup = `
    <div id="previewGroup" class="relative">
      ${previews || ''}
      <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
    </div>
  `;

  // Resto de tarjetas completas (desde la 2da hacia adelante)
  const restCardsInner = listaObj.slice(1).map(item => {
    const c = colorByClas(item.clas);
    return `
      <div class="w-full mt-3 bg-white rounded-b-lg border-t-8 ${c.border} px-4 py-5 flex flex-col justify-around shadow">
        <p class="text-lg font-bold font-sans">${escapeHTML(item.obj)}</p>
        <div class="py-3">
          <p class="text-gray-400 text-sm">${escapeHTML(item.res)}</p>
        </div>
        <div class="flex items-center justify-end gap-3">
          <i class="fa-solid fa-thumbs-up text-2xl text-green-500 ${c.up}"></i>
          <i class="fa-solid fa-hand text-2xl text-yellow-500 ${c.hand}"></i>
          <i class="fa-solid fa-thumbs-down text-2xl text-red-500 ${c.down}"></i>
        </div>
      </div>
    `;
  }).join('');

  const restCards = `
    <div id="restCards" class="hidden mt-2 space-y-2">
      ${restCardsInner}
    </div>
  `;

  const toggleBtn = `
    <div class="flex justify-center mt-3">
      <button id="toggleAll" class="flex items-center gap-2 text-sm font-semibold border rounded-full px-3 py-1 bg-white hover:bg-gray-50 shadow">
        <span>Ver todas</span>
        <i id="chev" class="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  `;

  // Inserta todo el bloque
  wrap.innerHTML = `
    ${firstCard}
    ${previewGroup}
    ${restCards}
    ${toggleBtn}
  `;

  // Lógica de toggle (muestra/oculta restCards y previews)
  const btn = document.getElementById('toggleAll');
  const rest = document.getElementById('restCards');
  const chev = document.getElementById('chev');
  const previewsEls = wrap.querySelectorAll('#previewGroup .card--rest');

  btn.addEventListener('click', () => {
    const opening = rest.classList.contains('hidden');
    if (opening) {
      rest.classList.remove('hidden');
      chev.classList.remove('fa-chevron-down');
      chev.classList.add('fa-chevron-up');
      btn.firstElementChild.textContent = 'Ocultar';
      previewsEls.forEach(p => p.classList.add('hidden'));
    } else {
      rest.classList.add('hidden');
      chev.classList.remove('fa-chevron-up');
      chev.classList.add('fa-chevron-down');
      btn.firstElementChild.textContent = 'Ver todas';
      previewsEls.forEach(p => p.classList.remove('hidden'));
    }
  });
}

function asignarColoresCalificaciones({ calP, calR, calT, calM }) {
  calP = Number(calP); calR = Number(calR); calT = Number(calT); calM = Number(calM);

  // Color base por rango (nombres Tailwind)
  const getColorName = (v) => (v < 75 ? 'red' : v < 85 ? 'amber' : 'green');

  // Utilidades para limpiar clases previas
  const removeByPrefix = (el, prefixes) => {
    if (!el) return;
    const toRemove = [];
    el.classList.forEach(c => {
      if (prefixes.some(p => c.startsWith(p))) toRemove.push(c);
    });
    toRemove.forEach(c => el.classList.remove(c));
  };

  const tarjetas = [
    { key:'P', valor:calP, cardId:'cardCP', innerId:'cardCPInner', spanId:'calP' },
    { key:'R', valor:calR, cardId:'cardRT', innerId:'cardRTInner', spanId:'calR' },
    { key:'T', valor:calT, cardId:'cardTN', innerId:'cardTNInner', spanId:'calT' },
    { key:'M', valor:calM, cardId:'cardMD', innerId:'cardMDInner', spanId:'calM' },
  ];

  tarjetas.forEach(({ key, valor, cardId, innerId, spanId }) => {
    const card  = document.getElementById(cardId);
    const inner = document.getElementById(innerId);
    const num   = document.getElementById(spanId);
    if (!card || !inner || !num) return;

    const cname = getColorName(valor);        
    const pastelBg = `bg-${cname}-200`;       
    const strongTxt = `text-${cname}-700`;    
    const borderSoft = `border-${cname}-400`;
    const borderBottom = `border-b-${cname}-400`;

 
    // Número principal
    num.textContent = valor;

    // Sufijos por métrica
    const unit = card.querySelector('[data-unit]');
    if (unit) {
      if (key === 'P') unit.textContent = '%';
      if (key === 'R') unit.textContent = 'ppm';
      if (key === 'T') unit.textContent = 'claro';
      if (key === 'M') unit.textContent = 'claro';
    } else {
     
      if (key === 'P' && num.nextSibling?.nodeType !== 3) {
        num.parentElement?.append('%');
      }
    }

   
    removeByPrefix(card, ['border-', 'border-b-']);
    card.classList.add('border-2', borderSoft, borderBottom);

  
    const front = inner.querySelector('.backface-hidden:not(.rotate-y-180)');
    const back  = inner.querySelector('.rotate-y-180.backface-hidden');

    if (front) {
 
      removeByPrefix(front, ['bg-','text-']);
      front.classList.add(pastelBg, 'text-black');
      
      front.querySelectorAll('[class*="text-"]').forEach(el => {
        removeByPrefix(el, ['text-red-','text-amber-','text-green-','text-white']);
      });
      // El número grande debe quedar en negro sobre pastel
      num.classList.remove('text-red-400','text-amber-500','text-green-400','text-white');
      num.classList.add('text-black');
      // El sufijo también en negro (para contrastar sobre pastel)
      if (unit) {
        removeByPrefix(unit, ['text-']);
        unit.classList.add('text-black');
      }
    }

    if (back) {
      // Reverso: fondo blanco + texto del color
      removeByPrefix(back, ['bg-','text-']);
      back.classList.add('bg-white'); // fondo blanco
      // Todos los textos del reverso en color fuerte
      back.querySelectorAll('*').forEach(el => {
        removeByPrefix(el, ['text-']);
        el.classList.add(strongTxt);
      });
    }
  });
}


 const card = document.getElementById("cardCP");
    const inner = document.getElementById("cardCPInner");
    card.addEventListener("click", () => {
      inner.classList.toggle("is-flipped");
    });
    const cardRT = document.getElementById("cardRT");
    const innerRT = document.getElementById("cardRTInner");
    cardRT.addEventListener("click", () => {
      innerRT.classList.toggle("is-flipped");
    });
    const cardtn = document.getElementById("cardTN");
    const innerTN = document.getElementById("cardTNInner");
    cardTN.addEventListener("click", () => {
      innerTN.classList.toggle("is-flipped");
    });
    const cardMD = document.getElementById("cardMD");
    const innerMD = document.getElementById("cardMDInner");
    cardMD.addEventListener("click", () => {
      innerMD.classList.toggle("is-flipped");
    });

    const btn = document.getElementById("toggleAll");
    const rest = document.getElementById("restCards");
    const chev = document.getElementById("chev");
    const previews = document.querySelectorAll("#previewGroup .card--rest");

    btn.addEventListener("click", () => {
      const open = rest.classList.contains("hidden");
      if (open) {
        rest.classList.remove("hidden");
        chev.classList.remove("fa-chevron-down");
        chev.classList.add("fa-chevron-up");
        btn.firstElementChild.textContent = "Ocultar";
        previews.forEach((p) => {
          p.classList.add("hidden");
        });
      } else {
        rest.classList.add("hidden");
        chev.classList.remove("fa-chevron-up");
        chev.classList.add("fa-chevron-down");
        btn.firstElementChild.textContent = "Ver todas";
        previews.forEach((p) => {
          p.classList.remove("hidden");
        });
      }
    });

    //Grafico
    function renderDona(elementId, porcentaje) {
      const contenedor = document.getElementById(elementId);
      contenedor.innerHTML = ""; // limpia por si ya hay algo

      // Determinar color según el porcentaje
      let colorClass = "text-green-500"; // verde por defecto
      if (porcentaje < 85 && porcentaje >= 75) colorClass = "text-yellow-400";
      else if (porcentaje < 75) colorClass = "text-red-500";

      // Crear estructura HTML del gráfico
      const html = `
      <p class="font-semibold text-gray-800 mb-1"></p>
      <div class="relative w-20 h-20">
        <svg class="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
          <path
            class="text-gray-200"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="${colorClass}"
            stroke="currentColor"
            stroke-width="4"
            stroke-dasharray="${porcentaje}, 100"
            fill="none"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="font-bold text-lg text-gray-800">${porcentaje}%</span>
        </div>
      </div>
    `;

      contenedor.innerHTML = html;
    }

   function evaluarVelocidad(ppm) {
  if (ppm < 80) return Math.max(0, (ppm / 80) * 50); // demasiado lento
  if (ppm <= 150) return 80 + ((ppm - 120) / 30) * 20; // rango ideal
  if (ppm <= 180) return 80 - ((ppm - 150) / 30) * 30; // empieza a sonar acelerado
  return 20; // demasiado rápido
}
function quitarDecimales(numero) {
  return Math.trunc(numero);
}

function mostrarCategoria(puntaje) {
  const p = document.getElementById("categoriaTexto");
  const n = document.getElementById("nivelTexto");
  
  let categoria = "";
  let color = "";
  let nivel = "";

  if (puntaje < 75) {
    categoria = "Rookie";
    color = "text-red-600";
    nivel = "Bajo";
  } else if (puntaje <= 85) {
    categoria = "Performer";
    color = "text-yellow-500";
    nivel = "Intermedio";
  } else {
    categoria = "Rockstar";
    color = "text-green-600";
    nivel = "Alto";
  }

  // Actualiza la categoría con color
  p.className = `font-bold text-lg ${color}`;
  p.textContent = categoria;

  // Actualiza el nivel sin color
  n.textContent = nivel;
}

function removeClass(id, className) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove(className);
  }
}


function addClass(id, className) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add(className);
  }
}
