const supabaseUrl = "https://lfbzuvuvxyiivhwwcput.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYnp1dnV2eHlpaXZod3djcHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzgyNjQsImV4cCI6MjA4ODQxNDI2NH0.G5xejqNpnvwU97PqNBj1kyq_GQz4koGX-jh5Zjq1v1E";

/* ======================================
CREAR CLIENTE SUPABASE UNA SOLA VEZ
====================================== */
if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );
}

const supabaseClient = window.supabaseClient;

/* ======================================
CARGAR DATOS DINÁMICOS DEL PERFIL
====================================== */
async function cargarDatosDinamicos() {
  try {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("codigo");
    if (!codigo) return;

    /* =========================
    CAPACITACIONES
    ========================= */
    const { data: capacitaciones, error: errorCap } = await supabaseClient
      .from("capacitaciones")
      .select("*")
      .eq("voluntario_id", codigo);

    if (errorCap) console.error("Error capacitaciones:", errorCap);

    const listaCap = document.getElementById("lista-capacitaciones");
    if (listaCap) {
      listaCap.innerHTML = "";
      capacitaciones?.forEach(c => {
        const chip = document.createElement("div");
        chip.classList.add("chip");
        chip.textContent = `${c.nombre ?? ""} (${c.estado ?? ""})`;
        listaCap.appendChild(chip);
      });
    }

    /* =========================
    ESPECIALIZACIONES
    ========================= */
    const { data: especializaciones, error: errorEsp } = await supabaseClient
      .from("especializaciones")
      .select("*")
      .eq("voluntario_id", codigo);

    if (errorEsp) console.error("Error especializaciones:", errorEsp);

    const listaEsp = document.getElementById("lista-especializaciones");
    if (listaEsp) {
      listaEsp.innerHTML = "";
      especializaciones?.forEach(e => {
        const chip = document.createElement("div");
        chip.classList.add("chip");
        chip.textContent = e.nombre ?? "";
        listaEsp.appendChild(chip);
      });
    }

    /* =========================
    ACTIVIDADES (desde participaciones)
    ========================= */
    const { data: participaciones, error: errorAct } = await supabaseClient
      .from("participaciones")
      .select(`
        rol,
        actividades (
          nombre,
          descripcion,
          start_at,
          end_at
        )
      `)
      .eq("voluntario_id", codigo);

    if (errorAct) console.error("Error actividades:", errorAct);

    const tablaAct = document.getElementById("tabla-actividades");
    if (tablaAct) {
      tablaAct.innerHTML = "";
      participaciones?.forEach(p => {
        const act = p.actividades;
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${act?.nombre ?? ""}</td>
          <td>${act?.descripcion ?? ""}</td>
          <td>${act?.start_at ?? ""}</td>
          <td>${act?.end_at ?? ""}</td>
        `;
        tablaAct.appendChild(fila);
      });
    }

    /* =========================
    AUTORIZACIONES (desde autorizaciones_evento)
    ========================= */
    const { data: autorizaciones, error: errorAut } = await supabaseClient
      .from("autorizaciones_evento")
      .select(`
        status,
        valid_from,
        valid_until,
        actividades (nombre)
      `)
      .eq("voluntario_id", codigo);

    if (errorAut) console.error("Error autorizaciones:", errorAut);

    const tablaAut = document.getElementById("tabla-autorizaciones");
    if (tablaAut) {
      tablaAut.innerHTML = "";
      autorizaciones?.forEach(a => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${a.actividades?.nombre ?? ""}</td>
          <td>${a.status ?? ""}</td>
          <td>${a.valid_from ?? ""}</td>
          <td>${a.valid_until ?? ""}</td>
        `;
        tablaAut.appendChild(fila);
      });
    }
  } catch (error) {
    console.error("Error cargando datos de Supabase:", error);
  }
}

/* ======================================
INICIAR CARGA
====================================== */
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosDinamicos();
});
