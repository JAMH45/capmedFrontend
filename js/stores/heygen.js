// Configuration
var nameBot = "";
const API_CONFIG = {
  apiKey: "sk_V2_hgu_kmy4cHnT2ML_oiozLyU0Qnpga0SPBn7FojvRKfXWLmRd",
  serverUrl: "https://api.heygen.com",
};

// Global variables
let sessionInfo = null;
let room = null;
let mediaStream = null;
let webSocket = null;
let sessionToken = null;

// DOM Elements
const statusElement = document.getElementById("status");
const avatarID = document.getElementById("avatarID");
const voiceID = document.getElementById("voiceID");
const taskInput = document.getElementById("taskInput");

// Helper function to update status
function updateStatus(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(message);
}

// Get session token
// 1) Obtener token con 3 intentos, backoff y timeout interno
async function getSessionToken() {
  const maxRetries = 5;
  const baseDelayMs = 800;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Timeout interno por intento (15s)
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        `${API_CONFIG.serverUrl}/v1/streaming.create_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": API_CONFIG.apiKey,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(t);

      if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          msg = errJson?.message || msg;
        } catch {}
        throw new Error(`Fallo al obtener token: ${msg}`);
      }

      const data = await response.json();
      if (!data?.data?.token)
        throw new Error("Respuesta inválida: token vacío");

      sessionToken = data.data.token;
      updateStatus("Session token obtained");
      return; // éxito
    } catch (err) {
      console.warn(
        `getSessionToken intento ${attempt} fallido:`,
        err?.message || err
      );
      if (attempt === maxRetries) {
        alert(
          "No se pudo conectar con el servidor.\n" +
            "Por favor, revisa tu conexión a internet, recarga la página e inténtalo de nuevo."
        );
        return;
      }
      // backoff simple
      const wait = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, wait));
      updateStatus(`Reintentando token (${attempt + 1}/${maxRetries})…`);
    }
  }
}

// Connect WebSocket
async function connectWebSocket(sessionId) {
  let texto = "";

  const params = new URLSearchParams({
    session_id: sessionId,
    session_token: sessionToken,
    silence_response: false,
    opening_text: texto,
    stt_language: "es",
  });
  //aqui
  const wsUrl = `wss://${
    new URL(API_CONFIG.serverUrl).hostname
  }/v1/ws/streaming.chat?${params}`;

  webSocket = new WebSocket(wsUrl);

  // Handle WebSocket events
  webSocket.addEventListener("message", (event) => {
    const eventData = JSON.parse(event.data);

    console.log("Raw WebSocket event:", eventData);
  });
}

// Create new session
async function createNewSession(doc, voz) {
  // Asegurar token (tu getSessionToken ya maneja reintentos/alert)
  if (!sessionToken) {
    updateStatus("Obteniendo token de sesión…");
    await getSessionToken();
    if (!sessionToken) return; // ya alertó en la función
  }

  // --- Fase A: Crear sesión remota (3 intentos) ---
  const maxRetries = 3;
  const baseDelayMs = 800;
  let dataNuevaSesion = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      updateStatus(
        attempt === 1
          ? "Creando sesión remota…"
          : `Reintentando creación de sesión (${attempt}/${maxRetries})…`
      );

      // Timeout interno por intento (15s)
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          quality: "high",
          avatar_name: "Dexter_Doctor_Standing2_public",
          voice: { voice_id: "76940a9adcd0490a9ce2cfe9a64a2664", rate: 1.0,  },
          version: "v2",
          video_encoding: "H264",
        }),
        signal: controller.signal,
      });

      clearTimeout(t);

      if (!response.ok) {
        let msg = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          msg = errJson?.message || msg;
        } catch {}
        throw new Error(`Fallo al crear sesión: ${msg}`);
      }

      const apiData = await response.json();
      const d = apiData?.data;
      if (!d?.session_id || !d?.url || !d?.access_token) {
        throw new Error("Respuesta inválida al crear sesión");
      }

      dataNuevaSesion = d;
      break; // éxito
    } catch (err) {
      console.warn(
        `streaming.new intento ${attempt} fallido:`,
        err?.message || err
      );
      if (attempt === maxRetries) {
        alert(
          "No se pudo crear la sesión remota.\n" +
            "Revisa tu conexión a internet, recarga la página e inténtalo de nuevo."
        );
        return;
      }
      const wait = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, wait));
    }
  }

  sessionInfo = dataNuevaSesion;

  // --- Fase B: Preparar conexión LiveKit (3 intentos) ---
  try {
    updateStatus("Preparando conexión de medios…");

    // Crear room y eventos
    room = new LivekitClient.Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: LivekitClient.VideoPresets.h720.resolution,
      },
    });

    room.on(LivekitClient.RoomEvent.DataReceived, (message) => {
      try {
        const d = new TextDecoder().decode(message);
        console.log("Room message:", JSON.parse(d));
      } catch {
        console.log("Room message (raw):", message);
      }
    });

    mediaStream = new MediaStream();
    room.on(LivekitClient.RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === "video" || track.kind === "audio") {
        mediaStream.addTrack(track.mediaStreamTrack);
        if (
          mediaStream.getVideoTracks().length > 0 &&
          mediaStream.getAudioTracks().length > 0
        ) {
          mediaElement.srcObject = mediaStream;
          updateStatus("Media stream ready");
        }
      }
    });

    room.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track) => {
      const mediaTrack = track.mediaStreamTrack;
      if (mediaTrack) mediaStream.removeTrack(mediaTrack);
    });

    room.on(LivekitClient.RoomEvent.Disconnected, (reason) => {
      updateStatus(`Room disconnected: ${reason}`);
    });

    // prepareConnection con 3 intentos
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          updateStatus(
            `Reintentando preparar conexión (${attempt}/${maxRetries})…`
          );
        }
        await room.prepareConnection(sessionInfo.url, sessionInfo.access_token);
        break; // éxito
      } catch (err) {
        console.warn(
          `prepareConnection intento ${attempt} fallido:`,
          err?.message || err
        );
        if (attempt === maxRetries) {
          alert(
            "No se pudo preparar la conexión de medios.\n" +
              "Revisa tu conexión a internet, recarga la página e inténtalo de nuevo."
          );
          return;
        }
        const wait = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((res) => setTimeout(res, wait));
      }
    }

    updateStatus("Connection prepared");
  } catch (err) {
    console.error(err);
    alert(
      "No se pudo preparar la conexión de medios.\n" +
        "Revisa tu conexión a internet, recarga la página e inténtalo de nuevo."
    );
    return;
  }

  // --- Fase C: Conectar WebSocket (3 intentos) ---
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt === 1) updateStatus("Conectando canal WebSocket…");
      else updateStatus(`Reintentando WebSocket (${attempt}/${maxRetries})…`);

      await connectWebSocket(sessionInfo.session_id);
      updateStatus("Session created successfully");
      return; // éxito total
    } catch (err) {
      console.warn(
        `connectWebSocket intento ${attempt} fallido:`,
        err?.message || err
      );
      if (attempt === maxRetries) {
        alert(
          "No se pudo establecer el canal de comunicación.\n" +
            "Revisa tu conexión a internet, recarga la página e inténtalo de nuevo."
        );
        return;
      }
      const wait = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, wait));
    }
  }
}

// Start streaming session
async function startStreamingSession() {
  const startResponse = await fetch(
    `${API_CONFIG.serverUrl}/v1/streaming.start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        session_id: sessionInfo.session_id,
      }),
    }
  );

  // Connect to LiveKit room
  await room.connect(sessionInfo.url, sessionInfo.access_token);
  updateStatus("Connected to room");
  updateStatus("Streaming started successfully");
}

// Send text to avatar
// utilitario para esperar
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Send text to avatar y esperar que termine de hablar
async function sendText(text, taskType = "talk") {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {

      if (!sessionInfo) {
        updateStatus("No active session");
        return;
      }

      const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          session_id: sessionInfo.session_id,
          text: text,
          task_type: taskType,
        }),
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${txt}`);
      }

      const data = await response.json().catch(() => ({}));
      const durationMs = Number(data?.duration_ms) || 0;

      updateStatus(`Sent text (${taskType}): ${text}`);
      await escribirComoPersona(idTextoBot, text, {
        velocidad: 60,
        pausaPunto: 200,
        pausaComa: 90,
        pausaEspacio: 50,
      });

      if (durationMs > 0) {
        await sleep(Math.ceil(durationMs * 1.1));
      } else {
        const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
        const estMs = Math.max(1000, (words / 160) * 60_000);
        await sleep(Math.ceil(estMs * 1.1));
      }

      return data?.task_id || null;

    } catch (err) {
      console.warn(`Error en intento ${attempt}:`, err);

      if (attempt === maxRetries) {
        updateStatus("Error al enviar texto. Intenta de nuevo.");
        return null;
      }

      // pequeña espera antes de reintentar
      await sleep(500);
    }
  }
}


// Close session
async function closeSession() {
  if (!sessionInfo) {
    updateStatus("No active session");
    return;
  }

  const response = await fetch(`${API_CONFIG.serverUrl}/v1/streaming.stop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      session_id: sessionInfo.session_id,
    }),
  });

  // Close WebSocket
  if (webSocket) {
    webSocket.close();
  }
  // Disconnect from LiveKit room
  if (room) {
    room.disconnect();
  }

  mediaElement.srcObject = null;
  sessionInfo = null;
  room = null;
  mediaStream = null;
  sessionToken = null;
  document.querySelector("#startBtn").disabled = false;

  updateStatus("Session closed");
}

//document.querySelector("#closeBtn").addEventListener("click", closeSession);

async function habla(texto) {
  if (!texto) return;

  await sendText(texto, "repeat");
}

function escribirComoPersona(id, texto, opciones = {}) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.error(`Elemento con id "${id}" no encontrado`);
    return;
  }

  // Opciones por defecto
  const config = {
    velocidad: opciones.velocidad || 1000,
    pausaPunto: opciones.pausaPunto || 5000,
    pausaComa: opciones.pausaComa || 2500,
    pausaEspacio: opciones.pausaEspacio || 1000,
    ...opciones,
  };

  elemento.textContent = "";

  let index = 0;

  function escribirCaracter() {
    if (index >= texto.length) return;

    const caracter = texto.charAt(index);
    elemento.textContent += caracter;
    index++;

    // Calcular el tiempo para el siguiente caracter
    let siguienteTiempo = config.velocidad;

    if (caracter === ".") {
      siguienteTiempo = config.pausaPunto;
    } else if (caracter === ",") {
      siguienteTiempo = config.pausaComa;
    } else if (caracter === " ") {
      siguienteTiempo = config.pausaEspacio;
    }

    setTimeout(escribirCaracter, siguienteTiempo);
  }

  escribirCaracter();
}
