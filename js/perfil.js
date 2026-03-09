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
      const listaCap = document.getElementById("lista-capacitaciones");
      if (listaCap) {
        listaCap.innerHTML = "";
        capacitaciones.forEach(cap => {
          const chip = document.createElement("div");
          chip.classList.add("chip");
          chip.textContent = cap.nombre;
          listaCap.appendChild(chip);
        });
      }
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
      const listaEsp = document.getElementById("lista-especializaciones");
      if (listaEsp) {
        listaEsp.innerHTML = "";
        especializaciones.forEach(esp => {
          const chip = document.createElement("div");
          chip.classList.add("chip");
          chip.textContent = esp.nombre;
          listaEsp.appendChild(chip);
        });
      }
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
            <td>${act?.start_at ?? ""}</td>
            <td>${act?.end_at ?? ""}</td>
          `;
          tablaAct.appendChild(fila);
        });
      }
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
            <td>${a.valid_from ?? ""}</td>
            <td>${a.valid_until ?? ""}</td>
          `;
          tablaAut.appendChild(fila);
        });
      }
    }

  } catch (error) {
    console.error("Error cargando el perfil:", error);
  }
});
