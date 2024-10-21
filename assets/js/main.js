// Función para verificar si el usuario está autenticado
function estaAutenticado() {
    return localStorage.getItem('token') !== null;
}

// Verificación de autenticación en páginas protegidas
document.addEventListener('DOMContentLoaded', function () {
    const paginasProtegidas = ['/modules/empleados.html', '/modules/incidencias.html'];
    
    if (paginasProtegidas.includes(window.location.pathname)) {
        if (!estaAutenticado() || !esAdmin()) {
            window.location.href = '/login.html'; // Redirigir a la página de login/registro si no está autenticado
        }
    }

    // Cargar header, navbar y footer de componentes externos
    Promise.all([
        fetch('../components/header.html').then(response => response.text()).then(data => {
            document.getElementById('header').innerHTML = data;
        }),
        fetch('../components/navbar.html').then(response => response.text()).then(data => {
            document.getElementById('navbar').innerHTML = data;
        }),
        fetch('../components/footer.html').then(response => response.text()).then(data => {
            document.getElementById('footer').innerHTML = data;
        }),
    ]).then(() => {
        updateUI(); // Llama a updateUI después de que todos los componentes se hayan cargado
        addLogoutEvent(); // Llama a la función para agregar el evento de cierre de sesión aquí
    });
});

// Función para verificar si el usuario es administrador
function esAdmin() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    return usuarioActual && usuarioActual.email === 'administradorAeropuerto@gmail.com' && usuarioActual.password === 'adminp123';
}


// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('user'); // Elimina la información del usuario
    updateUI(); // Actualiza la interfaz
    window.location.href = 'login.html'; // Redirige al login
}

// Actualizar UI basada en autenticación
function updateUI() {
    const token = localStorage.getItem('token'); // Obtiene el token
    const user = JSON.parse(localStorage.getItem('user')); // Obtiene el usuario

    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const userInfo = document.getElementById('user-info');

    // Comprobar si los elementos existen en el DOM
    if (navLogin && navLogout && userInfo) {
        if (token && user) {
            navLogin.style.display = 'none'; // Ocultar "Iniciar Sesión"
            navLogout.style.display = 'block'; // Mostrar "Cerrar Sesión"
            userInfo.innerHTML = `Bienvenido, ${user.nombre}`; // Mostrar el nombre del usuario
        } else {
            navLogin.style.display = 'block'; // Mostrar "Iniciar Sesión"
            navLogout.style.display = 'none'; // Ocultar "Cerrar Sesión"
            userInfo.innerHTML = 'Bienvenido, Invitado'; // Para usuarios no autenticados
        }
    }
}

function addLogoutEvent() {
    const btnCerrarSesion = document.getElementById('btn-logout');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function(e) {
            e.preventDefault(); // Evita la acción predeterminada del enlace
            logout(); // Llama a la función de cierre de sesión
        });
    }
}