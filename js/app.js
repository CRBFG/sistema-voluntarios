async function cargarVoluntarios() {
  try {
    const response = await fetch('data/voluntarios.json');
    const data = await response.json();

    console.log("Datos cargados:", data);

  } catch (error) {
    console.error("Error al cargar el JSON:", error);
  }
}

cargarVoluntarios();