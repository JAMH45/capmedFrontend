let recordingStream = null; // audio+video (grabar + previsualizar)
let mediaRecorder = null;
let chunks = [];
let isRecording = false;
let previewOn = false;

// UI
const recDot = document.getElementById("recDot");
const recLabel = document.getElementById("recLabel");

// Botones / refs que SÍ usamos

const btnCamWeb = document.getElementById("btnCam");

const btnCamMv = document.getElementById("btnCamMv");


// Preview
const localVideoWeb = document.getElementById("localVideo");
const noCamOverlayWeb = document.getElementById("noCamOverlay");
const localVideoMv = document.getElementById("localVideoMv");
const noCamOverlayMv = document.getElementById("noCamOverlayMv");

// ===== Util =====
function setRecUI(on) {
  isRecording = on;
  recDot.style.opacity = on ? "1" : "0";
  recLabel.textContent = on ? "Grabando" : "Listo";
  // Evita múltiples inicios simultáneos
  btnStart.disabled = on;
}

function pickMime() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";
}

async function ensureRecordingStream() {
  if (recordingStream && recordingStream.active) return recordingStream;
  recordingStream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: true,
  });
  return recordingStream;
}



// ===== Cámara: SOLO vista previa (no afecta la grabación) =====
if (btnCamWeb) {
  btnCamWeb.addEventListener("click", async () => {
    try {
      await ensureRecordingStream();
      previewOn = !previewOn;

      if (previewOn) {
        // Cámara ON
        localVideoWeb.srcObject = recordingStream;
        localVideoWeb.muted = true;
        noCamOverlayWeb.classList.add("hidden");

        btnCamWeb.classList.remove("bg-gray-200", "text-gray-700");
        btnCamWeb.classList.add("bg-blue-600", "text-white");

        // 🔁 CAMBIO DE ICONO
        iconCam.classList.remove("bi-camera-video-off");
        iconCam.classList.add("bi-camera-video");
      } else {
        // Cámara OFF
        localVideoWeb.srcObject = null;
        noCamOverlayWeb.classList.remove("hidden");

        btnCamWeb.classList.add("bg-gray-200", "text-gray-700");
        btnCamWeb.classList.remove("bg-blue-600", "text-white");

        // 🔁 REGRESA ICONO ORIGINAL
        iconCam.classList.remove("bi-camera-video");
        iconCam.classList.add("bi-camera-video-off");
      }
    } catch (err) {
      console.error("Cam error:", err);
      alert("No se pudo acceder a la cámara/micrófono.");
    }
  });
}

if (btnCamMv) {
  btnCamMv.addEventListener("click", async () => {
    try {
      await ensureRecordingStream();
      previewOn = !previewOn;

      if (previewOn) {
        localVideoMv.srcObject = recordingStream;
        localVideoMv.muted = true;
        noCamOverlayMv.classList.add("hidden");
        btnCamMv.classList.remove("bg-gray-200", "text-gray-700");
        btnCamMv.classList.add("bg-blue-600", "text-white");
      } else {
        localVideoMv.srcObject = null;
        noCamOverlayMv.classList.remove("hidden");
        btnCamMv.classList.add("bg-gray-200", "text-gray-700");
        btnCamMv.classList.remove("bg-blue-600", "text-white");
      }
    } catch (err) {
      console.error("Cam error:", err);
      alert("No se pudo acceder a la cámara/micrófono.");
    }
  });
}

// ===== Grabación: inicia SOLO con botón Iniciar =====
async function startRecording() {
  try {
    await ensureRecordingStream();
    chunks = [];

    const mimeType = pickMime();
    mediaRecorder = new MediaRecorder(
      recordingStream,
      mimeType ? { mimeType } : undefined
    );

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const mimeType = pickMime() || "video/webm";
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agente.webm"; // nombre del archivo
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start(1000); // fragmentos cada 1s (útil para subida por partes)
    setRecUI(true);
  } catch (err) {
    console.error("Record start error:", err);
    alert("No se pudo iniciar la grabación (permisos de cámara/micrófono).");
  }
}

// ===== Detener: función invocable desde fuera (sin botón) =====
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  setRecUI(false);
  // Si quieres terminar por completo la sesión (ahorro batería):
  // recordingStream.getTracks().forEach(t => t.stop());
  // recordingStream = null;
}
// Exponerla para uso externo
window.stopRecording = stopRecording;

