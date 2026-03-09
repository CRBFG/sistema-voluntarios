document.addEventListener("DOMContentLoaded", () => {

const tarjetas = document.querySelectorAll(".tarjeta");

const mostrarTarjeta = (entries, observer) => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("visible");
observer.unobserve(entry.target);

}

});

};

const observer = new IntersectionObserver(mostrarTarjeta,{
threshold:0.2
});

tarjetas.forEach(tarjeta => {

observer.observe(tarjeta);

});

});