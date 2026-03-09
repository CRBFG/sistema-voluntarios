document.addEventListener("DOMContentLoaded", async () => {
  try {
    /* =========================
    VERIFICAR SUPABASE
    ========================= */
    if (typeof supabaseClient === "undefined") {
      console.error("Supabase no está inicializado");
      return;
    }

    /* =========================
    LEER CODIGO DESDE URL
    ========================= */
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("codigo"); 
    // ejemplo: perfil.html?codigo=crbf-gya-001

    if (!codigo) {
      console.error("No se recibió código del voluntario");
      return;
    }

    /* =========================
    CONSULTAR VOLUNTARIO
    ========================= */
    const { data: voluntario, error } = await supabaseClient
      .from("voluntarios")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) {
      console.error("Error consultando Supabase:", error);
      return;
    }

    if (!voluntario) {
      console.error("Voluntario no encontrado");
      return;
    }

    /* =========================
    FUNCION PARA SETEAR TEXTO
    ========================= */
    const setText = (id, valor) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = valor ?? "";
    };

    /* =========================
    RELLENAR PERFIL
    ========================= */
    setText("id", voluntario.codigo);
    setText("ci", voluntario.ci);
    setText("nombre", voluntario.nombre);
    setText("apellido", voluntario.apellido);
    setText("cargo", voluntario.area);
    setText("telefono", voluntario.telefono);
    setText("anio_ingreso", voluntario.anio_ingreso);
    setText("emergencia_nombre", voluntario.emergencia_nombre);
    setText("emergencia_telefono", voluntario.emergencia_telefono);

    /* =========================
    FOTO
    ========================= */
    const foto = document.getElementById("foto");
    if (foto) {
      foto.src = voluntario.foto_url || "LOGO.jpg";
    }

    /* =========================
    FUNCION PARA CREAR CHIPS
    ========================= */
    const cargarChips = (elementId, texto) => {
      const contenedor = document.getElementById(elementId);
      if (!contenedor) return;
      contenedor.innerHTML = "";
      if (!texto) return;

      texto
        .split(",")
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .forEach(item => {
          const chip = document.createElement("div");
          chip.classList.add("chip");
          chip.textContent = item;
          contenedor.appendChild(chip);
        });
    };

    /* =========================
    CAPACITACIONES
    ========================= */
    const { data: capacitaciones, error: errorCap } = await supabaseClient
      .from("capacitaciones")
      .select("*")
      .eq("voluntario_id", codigo);

    if (errorCap) {
      console.error("Error consultando capacitaciones:", errorCap);
    } else {
      cargarChips("lista-capacitaciones", capacitaciones?.map(c => c.nombre).join(","));
    }

    /* =========================
    ESPECIALIZACIONES
    ========================= */
    const { data: especializaciones, error: errorEsp } = await supabaseClient
      .from("especializaciones")
      .select("*")
      .eq("voluntario_id", codigo);

    if (errorEsp) {
      console.error("Error consultando especializaciones:", errorEsp);
    } else {
      cargarChips("lista-especializaciones", especializaciones?.map(e => e.nombre).join(","));
    }

    /* =========================
    FUNCION FORMATEAR FECHA
    ========================= */
    const formatearFecha = (fechaISO) => {
      if (!fechaISO) return "";
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };

    /* =========================
    ACTIVIDADES
    ========================= */
    const { data: participaciones, error: errorAct } = await supabaseClient
      .from("participaciones")
      .select(`
        actividades (
          nombre,
          descripcion,
          start_at,
          end_at
        )
      `)
      .eq("voluntario_id", codigo);

    if (errorAct) {
      console.error("Error consultando actividades:", errorAct);
    } else {
      const tablaAct = document.getElementById("tabla-actividades");
      if (tablaAct) {
        tablaAct.innerHTML = "";
        participaciones.forEach(p => {
          const act = p.actividades;
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${act?.nombre ?? ""}</td>
            <td>${act?.descripcion ?? ""}</td>
            <td>${formatearFecha(act?.start_at)}</td>
            <td>${formatearFecha(act?.end_at)}</td>
          `;
          tablaAct.appendChild(fila);
        });
      }
    }

    /* =========================
    AUTORIZACIONES
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

    if (errorAut) {
      console.error("Error consultando autorizaciones:", errorAut);
    } else {
      const tablaAut = document.getElementById("tabla-autorizaciones");
      if (tablaAut) {
        tablaAut.innerHTML = "";
        autorizaciones.forEach(a => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${a.actividades?.nombre ?? ""}</td>
            <td>${a.status ?? ""}</td>
            <td>${formatearFecha(a.valid_from)}</td>
            <td>${formatearFecha(a.valid_until)}</td>
          `;
          tablaAut.appendChild(fila);
        });
      }
    }

  } catch (error) {
    console.error("Error cargando el perfil:", error);
  }
});
