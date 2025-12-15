// No usamos ids, todo por clases
const mfBtn = document.getElementsByClassName('mfBtn');
const mfPanel = document.getElementsByClassName('mfPanel');

let abierto = false;
let timerInterval;

// 🔹 Actualiza todos los contadores de tiempo
function setTimer(texto) {
  const timers = document.getElementsByClassName('mfTimer');
  for (const timer of timers) {
    timer.textContent = texto; // ej. "09:58"
  }
}



// 🔹 Inicia cuenta regresiva en todos los timers
function iniciarCuentaRegresiva(segundosTotales) {
  clearInterval(timerInterval);
  let tiempoRestante = segundosTotales;

  function actualizarDisplay() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    const texto = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    const timers = document.getElementsByClassName('mfTimer');
    for (const timer of timers) timer.textContent = texto;
  }

  actualizarDisplay();

  timerInterval = setInterval(() => {
    tiempoRestante--;
    actualizarDisplay();

    if (tiempoRestante <= 0) {
      clearInterval(timerInterval);
      const timers = document.getElementsByClassName('mfTimer');
      for (const timer of timers) timer.textContent = "00:00";
    }
  }, 1000);
}

// 🔹 Reinicia todos los timers a 00:00
function reiniciarCuentaRegresiva() {
  clearInterval(timerInterval);
  const timers = document.getElementsByClassName('mfTimer');
  for (const timer of timers) timer.textContent = "00:00";
}
