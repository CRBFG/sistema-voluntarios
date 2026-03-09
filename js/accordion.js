document.addEventListener("DOMContentLoaded", () => {

const botones = document.querySelectorAll(".acordeon-titulo");

botones.forEach(boton => {

boton.addEventListener("click", () => {

const contenido = boton.nextElementSibling;

contenido.classList.toggle("abierto");

});

});

});