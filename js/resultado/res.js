document.addEventListener("DOMContentLoaded", () => {
  const raw = sessionStorage.getItem("dataSig");
  if (!raw) {
    console.warn("No se encontró dataSig en sessionStorage");
    return;
  }
  //const dataSig = JSON.parse(raw);
  //console.log("dataSig recibido:", dataSig);

  // Ejemplo: pintar algo en la página

  const dataSig2 = JSON.parse(sessionStorage.getItem("dataSig"));
  //let calGeneral = 0;

  //prueba
/*
  // Lista de objeciones/respuestas (7 elementos)
  let listaObj = [
    {
      obj: "Ob1. ¿Está disponible en mi institución o en el cuadro básico?”",
      res: "Es el primer inhibidor selectivo de miosina aprobado para MCHo sintomática y cuenta con estudios fase 3 y seguimiento a largo plazo.",
      clas: 2,
    },
    {
      obj: "Ob2. ¿Está aprobado por la autoridad regulatoria local?",
      res: "Sí, está respaldado por estudios y guías. El manejo se va ajustando con ecocardiografía y hay apoyo para quienes están empezando, aunque requiere seguimiento.",
      clas: 1,
    },
    {
      obj: "Ob3. ¿Se puede solicitar por compra especial?",
      res: "No pasa nada, se puede usar sin experiencia. Solo hay estudios que lo aprueban y siempre hay alguien que ayuda si hace falta.",
      clas: 0,
    },
    {
      obj: "Ob4. ¿Hay distribución en farmacias hospitalarias?",
      res: "Si, hay guías y protocolos para iniciar, el ajuste se hace con ecocardiografía y puede apoyarse en los programas de capacitación disponibles.",
      clas: 1,
    },
  ];

  // Contadores según clasificación
  const bien = listaObj.filter((x) => x.clas === 2).length; // verdes
  const mom = listaObj.filter((x) => x.clas === 1).length; // amarillos
  const mal = listaObj.filter((x) => x.clas === 0).length; // rojos

  // Calificaciones de prueba (puedes ajustarlas)
  const calificacionProducto = 65;
  const calificacionRitmo = 81;
  const calificacionTono = 84;
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
    calM: calM,
  });
  calR = evaluarVelocidad(calR);
  calGeneral = (calM + calP + calR + calT) / 4;
  calGeneral = quitarDecimales(calGeneral);

  //document.getElementById("promGeneral").textContent = calGeneral;
  mostrarCategoria(calGeneral);

  const b = item.b;
  const mo = item.mom;
  const ma = item.mal;

  setTextById("bienT", b);
  console.log(b);
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

function renderTarjetas(listaObj) {
  const wrap = document.getElementById("respuestasWrap");
  if (!wrap) return console.warn("No existe #respuestasWrap");

  wrap.innerHTML = "";

  if (!Array.isArray(listaObj) || listaObj.length === 0) {
    wrap.innerHTML = `<p class="text-gray-400 text-sm">Sin respuestas aún.</p>`;
    return;
  }

  const escapeHTML = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Colores fijos (Tailwind compatible)
  const styleByClas = (c) => {
    if (c === 2) {
      return {
        border: "border-sky-200",
        bg: "bg-sky-50",
        quote: "text-sky-200",
        num: "text-sky-600",
        title: "text-sky-700",
      };
    }
    if (c === 1) {
      return {
        border: "border-indigo-200",
        bg: "bg-indigo-50",
        quote: "text-indigo-200",
        num: "text-indigo-600",
        title: "text-indigo-700",
      };
    }
    return {
      border: "border-red-200",
      bg: "bg-red-50",
      quote: "text-red-200",
      num: "text-red-600",
      title: "text-red-700",
    };
  };

  // Render opcional del chart (solo si existe el canvas)
  if (document.getElementById("chartCalificacion")) {
    renderTickRingChart("chartCalificacion", 76, 70);
  }

  // Previews (2 y 3) con blur, como ya hacías
  const previews = listaObj
    .slice(1, 3)
    .map((item, idx) => {
      const st = styleByClas(item.clas);
      const num = String(idx + 2).padStart(2, "0");
      return `
        <article
          class="mt-1 relative rounded-3xl border-2 ${st.border} ${st.bg}
                 p-4 overflow-hidden shadow-sm
                 filter blur-[1.5px] opacity-70 max-h-16 pointer-events-none card--rest"
        >
          <div class="absolute left-4 top-8 ${
            st.quote
          } text-6xl font-black leading-none select-none">“</div>
          <div class="relative">
            <div class="flex items-baseline gap-3">
              <span class="${st.num} font-bold text-lg">${num}</span>
              <h3 class="${st.title} font-semibold text-lg truncate">
                ${escapeHTML(item.obj)}
              </h3>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const previewGroup = `
    <div id="previewGroup" class="relative">
      ${previews || ""}
      <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
    </div>
  `;

  // Tarjetas completas
  const cards = listaObj
    .map((item, idx) => {
      const st = styleByClas(item.clas);
      const num = String(idx + 1).padStart(2, "0");

      return `
        <article class="relative rounded-3xl border-2 ${st.border} ${
        st.bg
      } p-5 overflow-hidden shadow-sm">
          <div class="absolute left-4 top-8 ${
            st.quote
          } text-8xl font-black leading-none select-none">“</div>

          <div class="relative">
            <div class="flex items-baseline gap-3">
              <span class="${st.num} font-bold text-xl">${num}</span>
              <h3 class="${st.title} font-semibold text-2xl">
                ${escapeHTML(item.obj)}
              </h3>
            </div>

            <div class="mt-4">
              <div class="inline-block bg-transparent rounded-2xl px-4 py-3 shadow-sm">
                <p class="text-slate-700 leading-relaxed">
                  ${escapeHTML(item.res)}
                </p>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Rest Cards: ocultamos desde la 2da hacia adelante
  const restCardsInner = listaObj
    .slice(1)
    .map((item, idx) => {
      const st = styleByClas(item.clas);
      const num = String(idx + 2).padStart(2, "0");

      return `
        <article class="relative rounded-3xl border-2 ${st.border} ${
        st.bg
      } p-5 overflow-hidden shadow-sm">
          <div class="absolute left-4 top-8 ${
            st.quote
          } text-8xl font-black leading-none select-none">“</div>

          <div class="relative">
            <div class="flex items-baseline gap-3">
              <span class="${st.num} font-bold text-xl">${num}</span>
              <h3 class="${st.title} font-semibold text-2xl">
                ${escapeHTML(item.obj)}
              </h3>
            </div>

            <div class="mt-4">
              <div class="inline-block bg-transparent rounded-2xl px-4 py-3 shadow-sm">
                <p class="text-slate-700 leading-relaxed">
                  ${escapeHTML(item.res)}
                </p>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const firstCardOnly = `
    <div class="mt-5 space-y-6">
      ${cards.split("</article>").slice(0, 1).join("</article>")}
    </div>
  `;

  const restCards = `
    <div id="restCards" class="hidden mt-5 space-y-6">
      ${restCardsInner}
    </div>
  `;

  const toggleBtn = `
    <div class="flex justify-center mt-4">
      <button id="toggleAll"
        class="flex items-center gap-2 text-sm font-semibold border rounded-full px-4 py-2 bg-white hover:bg-gray-50 shadow">
        <span>Ver todas</span>
        <i id="chev" class="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  `;

  // Insertamos: 1 tarjeta, previews, resto oculto, botón
  wrap.innerHTML = `
    ${firstCardOnly}
    ${previewGroup}
    ${restCards}
    ${toggleBtn}
  `;

  // Toggle
  const btn = document.getElementById("toggleAll");
  const rest = document.getElementById("restCards");
  const chev = document.getElementById("chev");
  const previewsEls = wrap.querySelectorAll("#previewGroup .card--rest");

  if (!btn || !rest || !chev) return;

  btn.addEventListener("click", () => {
    const opening = rest.classList.contains("hidden");
    if (opening) {
      rest.classList.remove("hidden");
      chev.classList.remove("fa-chevron-down");
      chev.classList.add("fa-chevron-up");
      btn.firstElementChild.textContent = "Ocultar";
      previewsEls.forEach((p) => p.classList.add("hidden"));
    } else {
      rest.classList.add("hidden");
      chev.classList.remove("fa-chevron-up");
      chev.classList.add("fa-chevron-down");
      btn.firstElementChild.textContent = "Ver todas";
      previewsEls.forEach((p) => p.classList.remove("hidden"));
    }
  });
}

function asignarColoresCalificaciones({ calP, calR, calT, calM }) {
  calP = Number(calP);
  calR = Number(calR);
  calT = Number(calT);
  calM = Number(calM);

  const getGroup = (v) => (v < 75 ? "red" : v < 85 ? "amber" : "green");

  const COLORS = {
    red: {
      pastelBg: "bg-red-200",
      strongTxt: "text-red-700",
      borderSoft: "border-red-400",
      borderBottom: "border-b-red-400",
    },
    amber: {
      pastelBg: "bg-amber-200",
      strongTxt: "text-amber-700",
      borderSoft: "border-amber-400",
      borderBottom: "border-b-amber-400",
    },
    green: {
      pastelBg: "bg-green-200",
      strongTxt: "text-green-700",
      borderSoft: "border-green-400",
      borderBottom: "border-b-green-400",
    },
  };

  const removeByPrefix = (el, prefixes) => {
    if (!el) return;
    const toRemove = [];
    el.classList.forEach((c) => {
      if (prefixes.some((p) => c.startsWith(p))) toRemove.push(c);
    });
    toRemove.forEach((c) => el.classList.remove(c));
  };

  const tarjetas = [
    {
      key: "P",
      valor: calP,
      cardId: "cardCP",
      innerId: "cardCPInner",
      spanId: "calP",
    },
    {
      key: "R",
      valor: calR,
      cardId: "cardRT",
      innerId: "cardRTInner",
      spanId: "calR",
    },
    {
      key: "T",
      valor: calT,
      cardId: "cardTN",
      innerId: "cardTNInner",
      spanId: "calT",
    },
    {
      key: "M",
      valor: calM,
      cardId: "cardMD",
      innerId: "cardMDInner",
      spanId: "calM",
    },
  ];

  tarjetas.forEach(({ key, valor, cardId, innerId, spanId }) => {
    const card = document.getElementById(cardId);
    const inner = document.getElementById(innerId);
    const num = document.getElementById(spanId);
    if (!card || !inner || !num) return;

    const group = getGroup(valor);
    const { pastelBg, strongTxt, borderSoft, borderBottom } = COLORS[group];

    num.textContent = valor;

    const unit = card.querySelector("[data-unit]");
    if (unit) {
      if (key === "P") unit.textContent = "%";
      if (key === "R") unit.textContent = "ppm";
      if (key === "T") unit.textContent = "claro";
      if (key === "M") unit.textContent = "claro";
    }

    removeByPrefix(card, ["border-", "border-b-"]);
    card.classList.add("border-2", borderSoft, borderBottom);

    const front = inner.querySelector(".backface-hidden:not(.rotate-y-180)");
    const back = inner.querySelector(".rotate-y-180.backface-hidden");

    if (front) {
      removeByPrefix(front, ["bg-"]);
      front.classList.add(pastelBg);

      num.classList.remove(
        "text-red-400",
        "text-amber-500",
        "text-green-400",
        "text-white"
      );
      num.classList.add("text-black");

      if (unit) {
        removeByPrefix(unit, ["text-"]);
        unit.classList.add("text-black");
      }
    }

    if (back) {
      removeByPrefix(back, ["bg-"]);
      back.classList.add("bg-white");

      back.querySelectorAll("*").forEach((el) => {
        removeByPrefix(el, ["text-"]);
        el.classList.add(strongTxt);
      });
    }
  });
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

  let categoria = "";
  let color = "";

  if (puntaje < 75) {
    categoria = "Rookie";
    color = "text-red-600 ";
  } else if (puntaje <= 85) {
    categoria = "Performer";
    color = "text-yellow-500";
  } else {
    categoria = "Rockstar";
    color = "text-green-600";
  }

  // Actualiza la categoría con color
  p.className = `font-bold text-lg ${color}`;
  p.textContent = categoria;

  // Actualiza el nivel sin color
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
