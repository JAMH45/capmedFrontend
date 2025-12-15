// js/audio/audio.js

document.addEventListener("DOMContentLoaded", () => {
  // 1) Obtener el id desde la URL (?id=CASEC-1-3-AUDIO)
  const params = new URLSearchParams(window.location.search);
  const actividadId = params.get("id");

  if (!actividadId) {
    console.warn("No se recibió id de actividad en el GET");
    const cont = document.getElementById("podcastContainer");
    if (cont) {
      cont.innerHTML =
        '<p class="text-red-600">Falta el parámetro <strong>id</strong> en la URL.</p>';
    }
    return;
  }

  // 2) Leer localStorage.actividades
  let actividades = {};
  try {
    actividades = JSON.parse(localStorage.getItem("actividades")) || {};
  } catch (e) {
    console.error("Error parseando localStorage.actividades:", e);
    actividades = {};
  }

  const actividad = actividades[actividadId];

  if (!actividad || !actividad.config) {
    console.warn("No se encontró la actividad en localStorage:", actividadId);
    const cont = document.getElementById("podcastContainer");
    if (cont) {
      cont.innerHTML =
        '<p class="text-red-600">No se encontró la configuración de este audio/podcast.</p>';
    }
    return;
  }

  const { title, linkAudio, description, transcription } = actividad.config;

  // 3) Título arriba
  const tituloSpan = document.getElementById("tituloPodcast");
  if (tituloSpan) {
    tituloSpan.textContent = title || "Audio / Podcast";
  }

  // 4) Render del contenido
  const container = document.getElementById("podcastContainer");
  if (!container) return;

  container.innerHTML = "";

  const card = document.createElement("div");
  // Diseño parecido a los otros: card blanca, borde suave, sombra
  card.className =
    "w-full max-w-4xl bg-white border border-slate-200 rounded-xl p-6 shadow-md text-left space-y-5";

  // ¿Es archivo de audio directo?
  const esArchivoAudio = linkAudio && /\.(mp3|wav|ogg|m4a)$/i.test(linkAudio);
  let audioHtml = "";

  if (linkAudio) {
    if (esArchivoAudio) {
      audioHtml = `
        <div class="mt-2">
          <audio controls class="w-full rounded-lg">
            <source src="${linkAudio}">
            Tu navegador no soporta audio embebido.
          </audio>
          <p class="text-xs text-slate-500 mt-2">
            Si el audio no se reproduce, puedes abrirlo directamente:
            <a href="${linkAudio}" target="_blank" class="text-blue-600 underline">
              Abrir enlace
            </a>
          </p>
        </div>
      `;
    } else {
      // Link a Spotify / plataforma externa
      audioHtml = `
        <div class="mt-2 flex flex-col items-start gap-2">
          <a
            href="${linkAudio}"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <i class="fa-solid fa-play"></i>
            Escuchar podcast
          </a>
          <p class="text-xs text-slate-500">
            Se abrirá en una pestaña nueva.
          </p>
        </div>
      `;
    }
  } else {
    audioHtml = `
      <p class="text-red-600 text-sm">
        No se configuró un link de audio para esta actividad.
      </p>
    `;
  }

  // Transcripción (solo el contenido, el contenedor lo armamos en la card)
  const transcriptionBlock = transcription
    ? `
      <div class="mt-3">
        <h3 class="text-sm font-semibold text-slate-800 mb-1">
          Transcripción
        </h3>
        <p class="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
          ${transcription}
        </p>
      </div>
    `
    : "";

  // Card completa: descripción bien visible + bloque de audio + (opcional) transcripción
  card.innerHTML = `
    <div class="space-y-4">
      <div>
        <h3 class="text-base font-semibold text-slate-800 mb-1">
          Descripción
        </h3>
        <p class="text-slate-700 text-sm leading-relaxed">
          ${description || "Audio relacionado con el curso."}
        </p>
      </div>

      <div>
        <h3 class="text-base font-semibold text-slate-800 mb-2">
          Reproductor
        </h3>
        ${audioHtml}
      </div>

      ${transcriptionBlock}
    </div>
  `;

  container.appendChild(card);
});
