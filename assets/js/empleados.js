document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('user'));

    // Verifica si hay un token y si el usuario está logueado
    if (!token || !usuario) {
        mostrarMensaje('No tienes acceso a esta página. Debes iniciar sesión.');
        window.location.href = '../login.html';
        return;
    }

    // Verifica si el usuario es administrador
    if (esAdmin(usuario)) {
        // El administrador tiene acceso total, no hay más verificaciones necesarias
    } else if (usuario.rol === 'supervisor') {
        // Permite solo acciones limitadas para supervisores (puede ver empleados, pero no añadir/eliminar)
        document.getElementById('btn-nuevo-empleado').style.display = 'none'; // Oculta el botón de nuevo empleado
    } else if (usuario.rol === 'empleado') {
        mostrarMensaje('No tienes permisos para gestionar empleados.');
        window.location.href = '/'; // Redirige a la página de inicio
        return; // Detiene la ejecución
    } else {
        // Cualquier otro caso (sin rol asignado) redirige a la página de inicio
        mostrarMensaje('No tienes acceso a esta página. Rol de usuario no reconocido.');
        window.location.href = '/'; // Redirige a la página de inicio
        return; // Detiene la ejecución
    }

    // Carga la lista de empleados desde localStorage
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];

    // Llama a la función para mostrar los empleados
    mostrarEmpleados(empleados, usuario); // Asegúrate de pasar 'usuario' aquí
});

// Función para verificar si el usuario es administrador
function esAdmin(usuario) {
    if (usuario) { // Verifica si usuario no es null
        return usuario.email === 'administradorAeropuerto@gmail.com' && usuario.password === 'adminp123';
    }
    return false; // Retorna false si usuario es null
}

// Función para verificar si el usuario es supervisor
function esSupervisor(usuario) {
    return usuario && usuario.rol === 'supervisor'; // Chequeo de existencia
}

// Función para mostrar mensajes en un modal
function mostrarMensaje(mensaje, tipo) {
    const modalMensajeBody = document.getElementById('modal-mensaje-body');
    modalMensajeBody.textContent = mensaje;

    const modal = new bootstrap.Modal(document.getElementById('modal-mensaje'));
    modal.show();
}

// Función para asignar un turno a un empleado
function asignarTurno(id) {
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modal-turno'));
    modal.show();

    // Setea el ID del empleado en el campo oculto
    document.getElementById('turno-empleado-id').value = id;

    // Al hacer clic en el botón de guardar turno
    document.getElementById('btn-guardar-turno').onclick = function () {
        const fecha = document.getElementById('turno-fecha').value;
        const horaInicio = document.getElementById('turno-hora-inicio').value;
        const horaFin = document.getElementById('turno-hora-fin').value;

        if (!fecha || !horaInicio || !horaFin) {
            mostrarMensaje('Por favor, complete todos los campos.');
            return;
        }

        const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
        const empleado = empleados.find(e => e.id === id);
        if (empleado) {
            // Asignar el turno al empleado
            const turno = {
                fecha: fecha,
                horaInicio: horaInicio,
                horaFin: horaFin
            };

            // Verifica si ya tiene turnos asignados y añade el nuevo
            if (!empleado.turnos) {
                empleado.turnos = []; // Inicializa la lista de turnos si no existe
            }
            empleado.turnos.push(turno); // Agrega el nuevo turno

            // Guarda los cambios en localStorage
            localStorage.setItem('empleados', JSON.stringify(empleados));

            mostrarMensaje(`Turno asignado a ${empleado.nombre} para el ${fecha} de ${horaInicio} a ${horaFin}.`);
        } else {
            mostrarMensaje('Empleado no encontrado.');
        }

        
        modal.hide(); // Cierra el modal
        mostrarEmpleados(empleados); // Actualiza la lista de empleados
    };
}

// Modificar la función para mostrar los empleados
function mostrarEmpleados(empleados, usuario) {
    const listaEmpleados = document.getElementById('lista-empleados');
    listaEmpleados.innerHTML = '';

    if (Array.isArray(empleados)) {
        empleados.forEach(empleado => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${empleado.id}</td>
                <td>${empleado.nombre}</td>
                <td>${empleado.cargo}</td>
                <td>${empleado.departamento}</td>
                <td>${empleado.turnos && empleado.turnos.length > 0 ? empleado.turnos.map(turno => `${turno.fecha} ${turno.horaInicio}-${turno.horaFin}`).join(', ') : 'No asignado'}</td>
                <td>
                    ${esAdmin(usuario) || (usuario && esSupervisor(usuario)) ? `
                    <button class="btn btn-sm btn-info" onclick="editarEmpleado(${empleado.id})">Editar</button>
                    <button class="btn btn-sm btn-warning" onclick="asignarTurno(${empleado.id})">Asignar Turno</button>` : ''}
                    ${esAdmin(usuario) ? `<button class="btn btn-sm btn-danger" onclick="eliminarEmpleado(${empleado.id})">Eliminar</button>` : ''}
                </td>
            `;
            listaEmpleados.appendChild(fila);
        });
    } else {
        console.error('No se pudo cargar la lista de empleados. Asegúrate de que los datos sean válidos.');
    }
}

// Función para verificar si el usuario es administrador
function esAdmin(usuario) {
    return usuario.rol === 'admin'; // Compara el rol
}

// Función para verificar si el usuario es supervisor
function esSupervisor(usuario) {
    return usuario.rol === 'supervisor';
}

// Función para abrir el modal de nuevo empleado
function nuevoEmpleado() {
    document.getElementById('modal-empleado-titulo').textContent = 'Nuevo Empleado';
    document.getElementById('form-empleado').reset();
    document.getElementById('empleado-id').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modal-empleado'));
    modal.show();
}

// Función para editar un empleado existente
function editarEmpleado(id) {
    const empleados = JSON.parse(localStorage.getItem('empleados')) || []; // Carga los empleados desde localStorage
    const empleado = empleados.find(e => e.id === id);
    if (empleado) {
        document.getElementById('modal-empleado-titulo').textContent = 'Editar Empleado';
        document.getElementById('empleado-id').value = empleado.id;
        document.getElementById('empleado-nombre').value = empleado.nombre;
        document.getElementById('empleado-email').value = empleado.email;
        document.getElementById('empleado-cargo').value = empleado.cargo;
        document.getElementById('empleado-departamento').value = empleado.departamento;
        document.getElementById('empleado-rol').value = empleado.rol;
        const modal = new bootstrap.Modal(document.getElementById('modal-empleado'));
        modal.show();
    }
}

// Función para guardar un empleado (nuevo o editado)
function guardarEmpleado() {
    const empleados = JSON.parse(localStorage.getItem('empleados')) || []; // Carga los empleados
    const id = document.getElementById('empleado-id').value;
    const empleado = {
        id: id ? parseInt(id) : empleados.length + 1,
        nombre: document.getElementById('empleado-nombre').value,
        email: document.getElementById('empleado-email').value,
        cargo: document.getElementById('empleado-cargo').value,
        departamento: document.getElementById('empleado-departamento').value,
        rol: document.getElementById('empleado-rol').value,
        password: '123456',
    };

    if (id) {
        const index = empleados.findIndex(e => e.id === empleado.id);
        if (index !== -1) {
            empleados[index] = empleado; // Actualiza el empleado
        }
    } else {
        empleados.push(empleado); // Agrega un nuevo empleado
    }

    // Guarda en localStorage
    localStorage.setItem('empleados', JSON.stringify(empleados));

    bootstrap.Modal.getInstance(document.getElementById('modal-empleado')).hide();
    mostrarEmpleados(empleados, JSON.parse(localStorage.getItem('user'))); // Actualiza la lista
    mostrarMensaje(id ? 'Empleado actualizado con éxito' : 'Empleado creado con éxito');
}

// Función para eliminar un empleado
function eliminarEmpleado(id) {
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
        const empleadosFiltrados = empleados.filter(empleado => empleado.id !== id);
        localStorage.setItem('empleados', JSON.stringify(empleadosFiltrados));
        mostrarEmpleados(empleadosFiltrados, JSON.parse(localStorage.getItem('user')));
        mostrarMensaje('Empleado eliminado con éxito', 'success');
    }
}


// Evento para buscar empleados
document.getElementById('buscar-empleado').addEventListener('input', function (e) {
    const busqueda = e.target.value.toLowerCase();
    const empleados = JSON.parse(localStorage.getItem('empleados')) || []; // Carga los empleados
    const empleadosFiltrados = empleados.filter(empleado =>
        empleado.nombre.toLowerCase().includes(busqueda) ||
        empleado.cargo.toLowerCase().includes(busqueda) ||
        empleado.departamento.toLowerCase().includes(busqueda)
    );
    mostrarEmpleados(empleadosFiltrados, JSON.parse(localStorage.getItem('user'))); // Muestra los empleados filtrados
});

// Eventos para los botones
document.getElementById('btn-nuevo-empleado').addEventListener('click', nuevoEmpleado);
document.getElementById('btn-guardar-empleado').addEventListener('click', guardarEmpleado);
