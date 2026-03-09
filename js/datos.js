document.addEventListener("DOMContentLoaded", () => {

const voluntario = {
nombre: "Juan Pérez",
rol: "Paramédico Voluntario",
estado: "Activo",
telefono: "+52 555 123 4567",
email: "juan.perez@email.com",
capacitaciones: [
"Primeros Auxilios",
"RCP",
"Atención Prehospitalaria"
],
especializaciones: [
"Rescate urbano",
"Atención a desastres"
]
};

document.getElementById("nombre-voluntario").textContent = voluntario.nombre;
document.getElementById("rol-voluntario").textContent = voluntario.rol;
document.getElementById("telefono-voluntario").textContent = voluntario.telefono;
document.getElementById("email-voluntario").textContent = voluntario.email;

const listaCap = document.getElementById("lista-capacitaciones");
voluntario.capacitaciones.forEach(cap => {

const li = document.createElement("li");
li.textContent = cap;
listaCap.appendChild(li);

});

const listaEsp = document.getElementById("lista-especializaciones");
voluntario.especializaciones.forEach(esp => {

const li = document.createElement("li");
li.textContent = esp;
listaEsp.appendChild(li);

});

});