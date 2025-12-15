// Helper para sacar el ID de YouTube y poder embeberlo
  function getYouTubeId(url) {
    try {
      const u = new URL(url);

      // youtu.be/VIDEOID
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
      }

      // youtube.com/watch?v=VIDEOID
      if (u.hostname.includes("youtube.com")) {
        if (u.searchParams.get("v")) return u.searchParams.get("v");

        // youtube.com/embed/VIDEOID
        if (u.pathname.startsWith("/embed/")) {
          return u.pathname.split("/embed/")[1];
        }
      }
    } catch (e) {
      console.warn("URL de YouTube inválida:", url, e);
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 1) Tomar el id de la URL: ?id=CASEC-1-1-VIDEO
    const params = new URLSearchParams(window.location.search);
    const actividadId = params.get("id");

    if (!actividadId) {
      console.warn("No se recibió id de actividad en el GET");
      const cont = document.getElementById("videoContainer");
      if (cont) {
        cont.innerHTML =
          '<p class="text-red-600">No se encontró la actividad. Falta el parámetro <strong>id</strong> en la URL.</p>';
      }
      return;
    }

    // 2) Leer localStorage.actividades
    let actividades = {};
    try {
      actividades =
        JSON.parse(localStorage.getItem("actividades")) || {};
    } catch (e) {
      console.error("Error parseando localStorage.actividades:", e);
      actividades = {};
    }

    const actividad = actividades[actividadId];

    if (!actividad || !actividad.config) {
      console.warn("No se encontró la actividad en localStorage:", actividadId);
      const cont = document.getElementById("videoContainer");
      if (cont) {
        cont.innerHTML =
          '<p class="text-red-600">No se encontró la configuración de esta actividad en el sistema.</p>';
      }
      return;
    }

    // Esperamos esta estructura:
    // actividad = { id, tipo: "video", config: { title, linkVideo, description, transcripcion } }
    const { title, linkVideo, description, transcripcion } = actividad.config;

    // 3) Poner el título arriba
    const tituloSpan = document.getElementById("tituloVideo");
    if (tituloSpan) {
      tituloSpan.textContent = title || "Video sin título";
    }

    // 4) Construir el player
    const contenedor = document.getElementById("videoContainer");
    if (!contenedor) {
      console.warn("No se encontró #videoContainer");
      return;
    }

    let playerHtml = "";

    if (linkVideo) {
      const ytId = getYouTubeId(linkVideo);

      if (ytId) {
        const embedUrl = `https://www.youtube.com/embed/${ytId}`;
        playerHtml = `
          <div class="w-full max-w-4xl h-64 md:h-96 mb-4">
            <iframe
              class="w-full h-full rounded-lg shadow-md"
              src="${embedUrl}"
              title="${title || "Video"}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
      } else {
        // No es YouTube → intentamos con <video>
        playerHtml = `
          <div class="w-full max-w-4xl mb-4">
            <video
              controls
              class="w-full rounded-lg shadow-md bg-black"
            >
              <source src="${linkVideo}">
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        `;
      }
    } else {
      playerHtml = `
        <p class="text-slate-500">
          No hay un link de video configurado para esta actividad.
        </p>
      `;
    }

    // 5) Inyectar HTML completo: player + descripción + transcripción
    contenedor.innerHTML = `
      ${playerHtml}

      <div class="mt-4 text-left w-full max-w-4xl">
        <h3 class="text-lg font-semibold text-slate-800 mb-1">Descripción</h3>
        <p class="text-slate-700 text-sm">
          ${description || "Sin descripción disponible."}
        </p>
      </div>

      ${
        transcripcion
          ? `
        <div class="mt-6 text-left w-full max-w-4xl">
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Transcripción</h3>
          <p class="text-slate-700 text-sm whitespace-pre-line">
            ${transcripcion}
          </p>
        </div>
      `
          : ""
      }
    `;
  });

