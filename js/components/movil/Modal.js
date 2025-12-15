export function Modal() {
  return {
    open: true,

    async solicitarPermisos() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        console.log("Permisos concedidos", stream);

        // Detenemos los tracks para no dejar la cámara encendida
        stream.getTracks().forEach((track) => track.stop());

        // Cerramos el modal o continuamos el flujo
        this.open = false;
      } catch (error) {
        console.error("Error o permisos denegados:", error);
        alert(
          "Debes permitir acceso a la cámara y al micrófono para continuar la prueba."
        );
      }
    },

    $template: /*html*/ `
      <div v-show="open" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div 
          @click.outside="open=false"
          class="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-xl"
        >
          <h2 class="text-2xl font-extrabold text-gray-600 mb-4">¡Bienvenido!</h2>

         <p class="text-gray-700 text-sm mb-6 leading-relaxed">
  En esta prueba aplicarás los conocimientos adquiridos durante la capacitación en línea.  
  Antes de comenzar, acepta los permisos de 
  <span class="font-semibold text-teal-600">cámara</span> y 
  <span class="font-semibold text-teal-600">micrófono</span> para poder continuar con la evaluación.
</p>

<p class="text-gray-700 text-sm mb-6 leading-relaxed">
  La prueba constará de diferentes <span class="font-semibold text-teal-600">objeciones</span> planteadas por el doctor.  
  Después de cada objeción, deberás <span class="font-semibold text-teal-600">responder</span> de manera adecuada según el contexto.  
  Posteriormente, el doctor te brindará una <span class="font-semibold text-teal-600">retroalimentación</span> sobre tu respuesta.  
  <span class="font-semibold">No debes responder a esa retroalimentación.</span>
</p>

<p class="text-gray-700 text-sm mb-6 leading-relaxed">
  Al finalizar todas las objeciones, se mostrarán tus 
  <span class="font-semibold text-teal-600">resultados finales</span> 
  junto con una evaluación general de tu desempeño durante la prueba.
</p>


          <p class="text-gray-900 font-semibold mb-6">¡Mucha suerte y éxito!</p>

          <button 
            class="bg-gray-500 text-white font-extrabold py-2 px-6 rounded-xl hover:bg-teal-600 active:scale-95 transition-all"
            @click="solicitarPermisos"
          >
            Comenzar prueba
          </button>
        </div>
      </div>
    `,
  };
}
