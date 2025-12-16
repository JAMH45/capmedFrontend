// ✅ Variable global para acumular la calificación
let acumuladoCalificacionTono = 0;
let contadorMetricasTono = 0;
let totalPalabras = 0;
let modulacionTotal = 0;
class AnalizadorTono {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
  }

  async iniciarAnalisisTono(stream) {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      console.log("Análisis de tono iniciado");
    } catch (error) {
      console.error("Error iniciando análisis de tono:", error);
    }
  }

  capturarMetricasTono() {
    if (!this.analyser) return null;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    const metricas = {
      intensidad: this.calcularIntensidad(dataArray),
      tono: this.calcularPitch(dataArray),
      variabilidad: this.calcularVariabilidad(dataArray),
    };

    // ✅ ACUMULAR EN VARIABLE GLOBAL
    const calificacionParcial = this.calcularCalificacionParcial(metricas);
    acumuladoCalificacionTono += calificacionParcial;
    contadorMetricasTono++;

    console.log(
      `Calificación parcial: ${calificacionParcial} | Acumulado: ${acumuladoCalificacionTono} | Muestras: ${contadorMetricasTono}`
    );

    return metricas;
  }

  calcularCalificacionParcial(metricas) {
    // Calcular calificación parcial basada en las métricas actuales
    let calificacion = (metricas.intensidad + metricas.variabilidad) / 2;

    // Normalizar a escala 55-90
    calificacion = this.mapearARango(calificacion, 50, 200, 55, 90);

    // Asegurar que esté en el rango
    return Math.max(55, Math.min(90, calificacion));
  }

  calcularIntensidad(dataArray) {
    const sum = dataArray.reduce((a, b) => a + b, 0);
    return sum / dataArray.length;
  }

  calcularPitch(dataArray) {
    let maxIndex = 0;
    let maxValue = 0;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  calcularVariabilidad(dataArray) {
    const mean = this.calcularIntensidad(dataArray);
    const squareDiffs = dataArray.map((value) => Math.pow(value - mean, 2));
    const avgSquareDiff =
      squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  mapearARango(valor, minEntrada, maxEntrada, minSalida, maxSalida) {
    return (
      ((valor - minEntrada) * (maxSalida - minSalida)) /
        (maxEntrada - minEntrada) +
      minSalida
    );
  }

  detenerAnalisis() {
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
function tonoFinal(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function contarPalabras(texto) {
  if (!texto || typeof texto !== "string") return 0;

  // Elimina espacios extra y separa por espacios o signos de puntuación
  const palabras = texto
    .trim()
    .split(/\s+|[,.!?;:()"'«»]/)
    .filter((p) => p.length > 0);

  return palabras.length;
}

function calcularPalabrasPorMinuto(totalPalabras, tiempoSegundos) {
  if (tiempoSegundos <= 0 || totalPalabras < 0) return 0;

  const tiempoMinutos = tiempoSegundos / 60;

  const ppm = Math.floor(totalPalabras / tiempoMinutos);

  return ppm;
}

const modalObjeccionesMv = document.getElementById("modalObjeccionesMv");
const btnObejetionsMv = document.getElementById("btnObejetionsMv");
const btnCloseModalObjeccionesMv = document.getElementById(
  "closeModalObjeccionesMv"
);
const btnOkModalObjeccionesMv = document.getElementById("okModalObjeccionesMv");

// === ABRIR / CERRAR ===
function openModalObjeccionesMv() {
  modalObjeccionesMv.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModalObjeccionesMv() {
  modalObjeccionesMv.classList.add("hidden");
  document.body.style.overflow = "";
}

// === CARGA DE OBJECIONES EN UNA TABLA (reutilizable) ===


// === LISTENERS ===
btnObejetionsMv?.addEventListener("click", () => {
  openModalObjeccionesMv(); // abre modal
});

btnCloseModalObjeccionesMv?.addEventListener("click", closeModalObjeccionesMv);
btnOkModalObjeccionesMv?.addEventListener("click", closeModalObjeccionesMv);

// Cerrar con clic en backdrop
modalObjeccionesMv.addEventListener("click", (e) => {
  if (e.target === modalObjeccionesMv) closeModalObjeccionesMv();
});

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalObjeccionesMv.classList.contains("hidden")) {
    closeModalObjeccionesMv();
  }
});
