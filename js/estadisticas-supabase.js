// CONFIGURACIÓN SUPABASE
const supabaseUrl = "https://lfbzuvuvxyiivhwwcput.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYnp1dnV2eHlpaXZod3djcHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzgyNjQsImV4cCI6MjA4ODQxNDI2NH0.G5xejqNpnvwU97PqNBj1kyq_GQz4koGX-jh5Zjq1v1E";

const client = supabase.createClient(supabaseUrl, supabaseKey);


/* ANIMACIÓN CONTADOR */
function animarNumero(id, valorFinal) {

  const elemento = document.getElementById(id);
  if (!elemento) return;

  let inicio = 0;
  const incremento = Math.ceil(valorFinal / 40);

  const intervalo = setInterval(() => {

    inicio += incremento;

    if (inicio >= valorFinal) {
      elemento.innerText = valorFinal;
      clearInterval(intervalo);
    } else {
      elemento.innerText = inicio;
    }

  }, 30);
}


/* CARGAR ESTADISTICAS */
async function cargarEstadisticas() {

  try {

    /* =========================
    VOLUNTARIOS (DESDE SUPABASE)
    ========================= */

    let totalVoluntarios = 0;

    const voluntarios = await client
      .from("voluntarios")
      .select("*", { count: "exact", head: true });

    if (voluntarios.count) {
      totalVoluntarios = voluntarios.count;
    }


    /* =========================
    CAPACITACIONES ÚNICAS
    ========================= */

    let totalCapacitaciones = 0;

    const cap = await client
      .from("capacitaciones")
      .select("nombre");

    if (cap.data) {

      const capacitacionesUnicas = new Set(
        cap.data.map(c => c.nombre)
      );

      totalCapacitaciones = capacitacionesUnicas.size;

    }


    /* =========================
    ESPECIALIZACIONES ÚNICAS
    ========================= */

    let totalEspecializaciones = 0;

    const esp = await client
      .from("especializaciones")
      .select("nombre");

    if (esp.data) {

      const especializacionesUnicas = new Set(
        esp.data.map(e => e.nombre)
      );

      totalEspecializaciones = especializacionesUnicas.size;

    }


    /* =========================
    ACTIVIDADES
    ========================= */

    let totalActividades = 0;

    const act = await client
      .from("actividades")
      .select("*", { count: "exact", head: true });

    if (act.count) {
      totalActividades = act.count;
    }


    /* =========================
    MOSTRAR
    ========================= */

    animarNumero("totalVoluntarios", totalVoluntarios);
    animarNumero("totalCapacitaciones", totalCapacitaciones);
    animarNumero("totalEspecializaciones", totalEspecializaciones);
    animarNumero("totalActividades", totalActividades);

  } catch (error) {

    console.error("Error cargando estadísticas:", error);

  }

}


/* ESPERAR QUE CARGUE LA PAGINA */
document.addEventListener("DOMContentLoaded", cargarEstadisticas);
