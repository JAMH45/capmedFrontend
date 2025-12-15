let recordingStream = null; // audio+video (grabar + previsualizar)
let mediaRecorder = null;
let chunks = [];
let isRecording = false;
let previewOn = false;

// UI
const recDot = document.getElementById("recDot");
const recLabel = document.getElementById("recLabel");

// Botones / refs que SÍ usamos

const btnCam = document.getElementById("btnCam");
const btnObj = document.getElementById("btnObjections");

// Modal
const modal = document.getElementById("modalObjecciones");
const closeModal = document.getElementById("closeModal");
const okModal = document.getElementById("okModal");

// Preview
const localVideo = document.getElementById("localVideo");
const noCamOverlay = document.getElementById("noCamOverlay");

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

// ===== Modal =====
btnObj.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
okModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// ===== Cámara: SOLO vista previa (no afecta la grabación) =====
btnCam.addEventListener("click", async () => {
  try {
    await ensureRecordingStream();
    previewOn = !previewOn;

    if (previewOn) {
      localVideo.srcObject = recordingStream; // misma stream que se graba
      localVideo.muted = true; // evita eco
      noCamOverlay.classList.add("hidden");
      btnCam.classList.remove("bg-gray-200", "text-gray-700");
      btnCam.classList.add("bg-blue-600", "text-white");
    } else {
      localVideo.srcObject = null; // ocultar solo la vista previa
      noCamOverlay.classList.remove("hidden");
      btnCam.classList.add("bg-gray-200", "text-gray-700");
      btnCam.classList.remove("bg-blue-600", "text-white");
    }
  } catch (err) {
    console.error("Cam error:", err);
    alert("No se pudo acceder a la cámara/micrófono.");
  }
});

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

