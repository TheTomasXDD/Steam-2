const formulario = document.querySelector('#formContacto');
const botonEnviar = document.querySelector('#btnEnviar');

formulario.addEventListener("submit", (evento) => {
    // Esta línea evita que el navegador se recargue
    evento.preventDefault();

    console.log("El Formulario intentó enviarse");
});