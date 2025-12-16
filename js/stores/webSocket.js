// 🌍 Variable global: tu WebSocket
let ws = null;

// 🌍 Variable global: URL fija del WebSocket
//const WS_URL = "ws://74.208.137.121:2700";
const WS_URL = "ws://localhost:2700";

// 🌍 Función global para conectar tu WebSocket
function conectarWS() {
  // Evita reconectar si ya está abierto
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("WS ya está conectado.");
    return;
  }

  console.log("Conectando WS a:", WS_URL);
  ws = new WebSocket(WS_URL);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    console.log("✅ WS conectado.");
  };

  ws.onmessage = (event) => {
    console.log("📩 Mensaje recibido:", event.data);
  };

  ws.onerror = (err) => {
    console.error("⚠️ Error en WS:", err);
  };

  ws.onclose = (evt) => {
    console.warn("❌ WS cerrado:", evt.code, evt.reason);
  };
}
function cerrarWS() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("🔌 Cerrando WebSocket...");
    ws.close(1000, "Cierre manual desde cliente"); 
    // 1000 = closed normally
  } else if (ws && ws.readyState === WebSocket.CONNECTING) {
    console.log("⏳ WS aún conectando, se cerrará al abrir...");
    ws.addEventListener("open", () => ws.close(1000, "Cancelado durante conexión"));
  } else {
    console.log("WS no está abierto. No hay nada que cerrar.");
  }
}

//control del audio
// Asumimos que ya tienes:
// YA conectado en otro lado
// const WS_URL = "ws://localhost:6010/stt";  // se usa en otra parte para conectar

// Globals para manejo de audio
let audioContextWS = null;
let mediaStreamWS = null;
let sourceNodeWS = null;
let processorNodeWS = null;
let isRecordingWS = false;

// Para poder resolver/rechazar la promesa desde detenerReconocimientoVozWS
let resolverReconocimientoWS = null;
let rechazarReconocimientoWS = null;
let idSalidaActualWS = null;

// Conversión Float32 -> Int16 PCM (la misma que ya usas)
function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}
let timeoutSilencioWS = null;
let textoAcumuladoWS = "";

function iniciarReconocimientoVoz({
  idSalida = cuadroTexto,
  tiempoSilencio = 5000, // 2s
} = {}) {
  return new Promise(async (resolve, reject) => {
    resolverReconocimientoWS = resolve;
    rechazarReconocimientoWS = reject;
    idSalidaActualWS = idSalida;
    setEstadoBoton("habla", mico);

    let haEmpezadoAHablar = false;
    let yaResuelto = false; // 🔥 clave para no resolver dos veces

    const safeResolve = (texto) => {
      if (yaResuelto) return;
      yaResuelto = true;
      resolve(texto ?? "");
    };

    const safeReject = (err) => {
      if (yaResuelto) return;
      yaResuelto = true;
      reject(err);
    };

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      const error = "WebSocket no está conectado";
      console.error(error);
      safeReject(error);
      return;
    }

    const salida = document.getElementById(idSalida);
    if (!salida) {
      const error = `Elemento con id "${idSalida}" no encontrado`;
      console.error(error);
      safeReject(error);
      return;
    }

    salida.textContent = "";
    textoAcumuladoWS = "";

    try {
  
      mediaStreamWS = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContextWS = new AudioCtx();

      const sampleRate = audioContextWS.sampleRate;
      console.log("SampleRate del navegador (WS):", sampleRate);

      // 🧠 Config con formato de Vosk
      ws.send(
        JSON.stringify({
          config: { sample_rate: sampleRate },
        })
      );

      sourceNodeWS = audioContextWS.createMediaStreamSource(mediaStreamWS);

      const bufferSize = 4096;
      processorNodeWS = audioContextWS.createScriptProcessor(bufferSize, 1, 1);

      processorNodeWS.onaudioprocess = (event) => {
        if (!isRecordingWS || !ws || ws.readyState !== WebSocket.OPEN) return;

        const inputData = event.inputBuffer.getChannelData(0);
        const pcmBuffer = floatTo16BitPCM(inputData);
        ws.send(pcmBuffer);
      };

      sourceNodeWS.connect(processorNodeWS);
      processorNodeWS.connect(audioContextWS.destination);

      isRecordingWS = true;
      console.log("🎤 Micrófono WS iniciado.");

      const reiniciarTimerSilencio = () => {
        if (!haEmpezadoAHablar) return;

        if (timeoutSilencioWS) {
          clearTimeout(timeoutSilencioWS);
        }
        timeoutSilencioWS = setTimeout(() => {
          console.log(
            `Silencio de ${tiempoSilencio}ms detectado, deteniendo reconocimiento WS…`
          );

          detenerReconocimientoVozWS();
          // 🔥 AQUÍ RESOLVEMOS AUNQUE EL SERVIDOR NO ENVÍE "text"
          safeResolve(textoAcumuladoWS.trim());
        }, tiempoSilencio);
      };

      ws.onmessage = (event) => {
        // ❗ Si ya resolvimos, ignoramos todo
        if (yaResuelto) return;

        try {
          const data = JSON.parse(event.data);

          if (data.partial) {
            const parcial = data.partial.trim();
            if (parcial) {
              salida.textContent = (textoAcumuladoWS + " " + parcial).trim();
              haEmpezadoAHablar = true;
              reiniciarTimerSilencio();
            }
          } else if (data.text) {
            const finalTexto = data.text.trim();
            if (finalTexto) {
              textoAcumuladoWS = (textoAcumuladoWS + " " + finalTexto).trim();
              salida.textContent = textoAcumuladoWS;

              detenerReconocimientoVozWS();
              safeResolve(textoAcumuladoWS);
            }
          } else if (data.error) {
            detenerReconocimientoVozWS();
            safeReject(data.error);
          }
        } catch (e) {
          console.log("Mensaje no JSON:", event.data);
        }
      };

      // Timeout de seguridad si nunca habla (30s)
      setTimeout(() => {
        if (!haEmpezadoAHablar && isRecordingWS && !yaResuelto) {
          console.log("Timeout por inactividad - usuario no habló");
          detenerReconocimientoVozWS();
          safeResolve(""); // texto vacío
        }
      }, 30000);
    } catch (err) {
      console.error("Error al iniciar micrófono WS:", err);
      detenerReconocimientoVozWS();
      safeReject("Error al iniciar micrófono: " + err.message);
    }
  });
}


function detenerReconocimientoVozWS() {
  console.log("⛔ Deteniendo reconocimiento SIN cerrar WebSocket...");
setEstadoBoton("espera", mico);
  // Evita dobles paradas
  if (!isRecordingWS) return;
  isRecordingWS = false;

  // 🔇 Apagar procesador
  if (processorNodeWS) {
    processorNodeWS.disconnect();
    processorNodeWS = null;
  }

  // 🔇 Apagar entrada de audio
  if (sourceNodeWS) {
    sourceNodeWS.disconnect();
    sourceNodeWS = null;
  }

  // 🔇 Apagar contexto de audio
  if (audioContextWS) {
    audioContextWS.close();
    audioContextWS = null;
  }

  // 🔇 Apagar micrófono físico
  if (mediaStreamWS) {
    mediaStreamWS.getTracks().forEach((t) => t.stop());
    mediaStreamWS = null;
  }

  // ❗❗ IMPORTANTE: Enviar buffer vacío para notificar fin de frase (END-OF-STREAM)
  // Esto NO cierra el WS, solo marca fin del audio.
  try {
    ws.send(new ArrayBuffer(0));
  } catch (e) {
    console.warn("No se pudo enviar end-of-stream:", e);
  }

  console.log("🎤 Micrófono detenido. WebSocket permanece ABIERTO.");
}



