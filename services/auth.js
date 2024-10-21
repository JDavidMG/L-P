// Función para manejar el inicio de sesión
function login(email, password) {
  // Busca en la lista de usuarios normales (registrados por el mismo sistema)
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const empleados = JSON.parse(localStorage.getItem('empleados')) || [];

  // Busca el usuario en ambas listas
  const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.password === password) ||
                            empleados.find(empleado => empleado.email === email && empleado.password === password);

  if (usuarioEncontrado) {
      // Guardamos el token simulado
      localStorage.setItem('token', 'tokenSimulado');
      localStorage.setItem('user', JSON.stringify(usuarioEncontrado)); // Guardamos el usuario en localStorage


      // Redirigir según el rol del usuario
      if (usuarioEncontrado.rol === 'admin' || usuarioEncontrado.rol === 'supervisor') {
          window.location.href = '../empleados.html'; // Redirige a la página protegida
      } else {
          window.location.href = '../index.html'; // Redirige a la página principal si es un usuario normal
      }

      updateUI(); // Actualiza la interfaz
  } else {
      alert('Error al iniciar sesión. Por favor, verifique sus credenciales.');
  }
}

// Almacenar el usuario administrador si aún no está almacenado
const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

if (!usuarios.some(usuario => usuario.email === 'administradorAeropuerto@gmail.com')) {
    usuarios.push({
        email: 'administradorAeropuerto@gmail.com',
        password: 'adminp123',
        nombre: 'Administrador Aeropuerto' // Agrega el nombre
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}



// Función para verificar si el usuario es el administrador
function esAdmin(usuario) {
    if (usuario) { // Verifica si usuario no es null
        return usuario.email === 'administradorAeropuerto@gmail.com' && usuario.password === 'adminp123';
    }
    return false; // Retorna false si usuario es null
}




// Función para manejar el registro de usuarios
function register(nombre, email, password) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verificar si el usuario ya existe
  const usuarioExistente = usuarios.find(usuario => usuario.email === email);
  if (usuarioExistente) {
      alert('Error al registrarse. El usuario ya existe.');
      return;
  }

  // Agregar nuevo usuario
  const nuevoUsuario = { nombre, email, password };
  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  alert('Registro exitoso. Por favor, inicie sesión.'); // Mensaje de éxito
  window.location.href = '/login.html'; // Redirige a la página de login
}

// Manejar el envío del formulario de inicio de sesión
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  login(email, password);
});

// Manejar el envío del formulario de registro
document.getElementById('register-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email-register').value;
  const password = document.getElementById('password-register').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
  }

  register(nombre, email, password);
});


// Actualizar UI basada en autenticación
function updateUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

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


// Llamar a updateUI cuando se carga la página
document.addEventListener('DOMContentLoaded', updateUI);
