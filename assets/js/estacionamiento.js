document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('user'));

    // Si no hay token, redirige al usuario a la página de inicio de sesión
    if (!token) {
        alert('Debes iniciar sesión para hacer una reserva.');
        window.location.href = '../login.html';
        return;
    }

    // Rellenar el formulario de reserva con el nombre y email del usuario
    if (usuario) {
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('email').value = usuario.email;
        // Rellena el teléfono si existe
        if (usuario.telefono) {
            document.getElementById('telefono').value = usuario.telefono;
        }
    }

    // Evento para verificar la disponibilidad
    document.getElementById('form-reserva-estacionamiento').addEventListener('submit', verificarDisponibilidad);

    // Evento para completar la reserva
    document.getElementById('form-completar-reserva').addEventListener('submit', completarReserva);
});

// Función para verificar la disponibilidad
function verificarDisponibilidad(event) {
    event.preventDefault();
    const fechaEntrada = document.getElementById('fecha-entrada').value;
    const horaEntrada = document.getElementById('hora-entrada').value;
    const fechaSalida = document.getElementById('fecha-salida').value;
    const horaSalida = document.getElementById('hora-salida').value;
    const tipoEspacio = document.getElementById('tipo-espacio').value;

    // Aquí puedes agregar la lógica para verificar la disponibilidad
    // Por simplicidad, vamos a mostrar un mensaje de disponibilidad
    document.getElementById('resultado-disponibilidad').innerText = `Espacio ${tipoEspacio} disponible desde ${fechaEntrada} ${horaEntrada} hasta ${fechaSalida} ${horaSalida}.`;
    document.getElementById('resultado-disponibilidad').style.display = 'block';
    document.getElementById('formulario-reserva').style.display = 'block'; // Mostrar el formulario de reserva
}

// Función para completar la reserva
function completarReserva(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const matricula = document.getElementById('matricula').value;

    const usuario = JSON.parse(localStorage.getItem('user'));

    // Verificar que el nombre y el email sean los mismos que los del usuario logueado
    if (usuario.nombre !== nombre || usuario.email !== email) {
        alert('El nombre y el correo electrónico deben coincidir con los de tu cuenta.');
        return;
    }

    // Aquí puedes agregar la lógica para guardar la reserva en localStorage o enviar a un servidor
    alert(`Reserva confirmada para ${nombre}. ¡Gracias por reservar!`);
    // Reiniciar el formulario o redirigir a otra página si es necesario
}
