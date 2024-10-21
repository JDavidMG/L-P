document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('user'));

    // Verifica si el token existe y si el usuario tiene acceso
    if (!token || !usuario) {
        alert('No tienes acceso a esta página. Debes iniciar sesión.');
        window.location.href = '../login.html'; // Redirige a la página de inicio de sesión
        return;
    }

    // Redirigir a usuarios sin rol o que no sean administradores, supervisores o empleados
    if (!esAdmin(usuario) && !esSupervisor(usuario) && !esEmpleado(usuario)) {
        alert('No tienes acceso a esta página. Rol de usuario no reconocido.');
        window.location.href = '/'; // Redirige a la página de inicio
        return;
    }

    // Ajustar permisos según el rol
    if (esAdmin(usuario)) {
        // Administrador tiene acceso completo
        document.getElementById('btn-nueva-incidencia').style.display = 'block'; // Muestra el botón para agregar incidencias
    } else if (esSupervisor(usuario)) {
        // Supervisor puede consultar y gestionar incidencias
        document.getElementById('btn-nueva-incidencia').style.display = 'none'; // Oculta el botón para agregar incidencias
    } else if (esEmpleado(usuario)) {
        // Empleado puede agregar incidencias
        document.getElementById('btn-nueva-incidencia').style.display = 'block'; // Muestra el botón para agregar incidencias
    }

    // Inicializar el módulo
    cargarIncidencias();

    // Event listener para nueva incidencia
    const btnNuevaIncidencia = document.getElementById('btn-nueva-incidencia');
    const modalIncidencia = new bootstrap.Modal(document.getElementById('modal-incidencia'));

    btnNuevaIncidencia.addEventListener('click', function () {
        modalIncidencia.show();
    });

    // Función para verificar si el usuario es el administrador
    function esAdmin(usuario) {
        return usuario.email === 'administradorAeropuerto@gmail.com' && usuario.password === 'adminp123';
    }

    function esSupervisor(usuario) {
        return usuario.rol === 'supervisor';
    }

    function esEmpleado(usuario) {
        return usuario.rol === 'empleado';
    }

    // Función para solucionar una incidencia
window.solucionarIncidencia = function (index) {
    const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
    const incidencia = incidencias[index];

    // Muestra el modal de solución
    const modalSolucion = new bootstrap.Modal(document.getElementById('modal-solucion'));
    modalSolucion.show();

    // Limpia el campo de solución al abrir el modal
    document.getElementById('solucion-descripcion').value = ''; // Limpia el campo de texto

    // Lógica para guardar la solución
    document.getElementById('btn-guardar-solucion').onclick = function () {
        const solucionDescripcion = document.getElementById('solucion-descripcion').value;

        // Asegúrate de que se haya ingresado una solución
        if (!solucionDescripcion.trim()) {
            alert('Por favor, ingresa una descripción de la solución.');
            return;
        }

        // Actualiza la incidencia con la solución y cambia el estado
        incidencia.solucion = solucionDescripcion; // Agrega la solución personalizada
        incidencia.estado = 'Solucionado'; // Cambia el estado a solucionado

        // Guarda los cambios en el localStorage
        incidencias[index] = incidencia; // Actualiza la incidencia en el arreglo
        localStorage.setItem('incidencias', JSON.stringify(incidencias));

        // Recarga la lista de incidencias
        cargarIncidencias();
        modalSolucion.hide();
    };
};

// Función para cargar incidencias
function cargarIncidencias() {
    const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
    const listaIncidencias = document.getElementById('lista-incidencias');
    listaIncidencias.innerHTML = '';

    incidencias.forEach((incidencia, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
           <td>${index + 1}</td>
                <td>${incidencia.tipo}</td>
                <td>${incidencia.gravedad}</td>
                <td>${incidencia.estado}</td>
                <td>${incidencia.fecha}</td>
                <td>
                    ${esAdmin(usuario) ? 
                    `<button class="btn btn-sm btn-info" onclick="verDetalles(${index})">Ver</button>
                     <button class="btn btn-sm btn-danger" onclick="eliminarIncidencia(${index})">Eliminar</button>
                     <button class="btn btn-sm btn-success" onclick="solucionarIncidencia(${index})">Solucionar</button>
                     <button class="btn btn-sm btn-warning" onclick="editarIncidencia(${index})">Editar</button>` : ''}
                     
                    ${esSupervisor(usuario) ? 
                    `<button class="btn btn-sm btn-info" onclick="verDetalles(${index})">Ver</button>
                    <button class="btn btn-sm btn-succes" onclick="solucionarIncidencia(${index})">Solucionar</button>
                     <button class="btn btn-sm btn-warning" onclick="editarIncidencia(${index})">Editar</button>` : ''}
                    ${esEmpleado(usuario) ? 
                    `<button class="btn btn-sm btn-info" onclick="verDetalles(${index})">Ver</button>` : ''}
                </td>
        `;
        listaIncidencias.appendChild(row);
    });
}


    // Guardar nueva incidencia
    document.getElementById('btn-guardar-incidencia').addEventListener('click', function () {
        const tipo = document.getElementById('incidencia-tipo').value;
        const gravedad = document.getElementById('incidencia-gravedad').value;
        const descripcion = document.getElementById('incidencia-descripcion').value;
        const ubicacion = document.getElementById('incidencia-ubicacion').value;
        const fecha = new Date().toLocaleDateString();

        const nuevaIncidencia = {
            tipo,
            gravedad,
            descripcion,
            ubicacion,
            fecha,
            estado: 'Pendiente'
        };

        const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
        incidencias.push(nuevaIncidencia);
        localStorage.setItem('incidencias', JSON.stringify(incidencias));

        cargarIncidencias();
        modalIncidencia.hide();
    });

    // Ver detalles de incidencia
window.verDetalles = function (index) {
    const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
    const incidencia = incidencias[index];

    // Rellenar el contenido del modal con los detalles de la incidencia
    const detallesHTML = `
        <p><strong>Tipo:</strong> ${incidencia.tipo}</p>
        <p><strong>Gravedad:</strong> ${incidencia.gravedad}</p>
        <p><strong>Descripción:</strong> ${incidencia.descripcion}</p>
        <p><strong>Ubicación:</strong> ${incidencia.ubicacion}</p>
        <p><strong>Fecha:</strong> ${incidencia.fecha}</p>
        <p><strong>Estado:</strong> ${incidencia.estado}</p>
    `;
    
    document.getElementById('detalles-incidencia').innerHTML = detallesHTML;

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modal-detalles-incidencia'));
    modal.show();
};

    // Eliminar incidencia
    window.eliminarIncidencia = function (index) {
        const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
        incidencias.splice(index, 1);
        localStorage.setItem('incidencias', JSON.stringify(incidencias));
        cargarIncidencias();
    };

    // Editar incidencia
    window.editarIncidencia = function (index) {
        const incidencias = JSON.parse(localStorage.getItem('incidencias')) || [];
        const incidencia = incidencias[index];
        
        // Rellena el formulario de edición con los datos actuales de la incidencia
        document.getElementById('incidencia-tipo').value = incidencia.tipo;
        document.getElementById('incidencia-gravedad').value = incidencia.gravedad;
        document.getElementById('incidencia-descripcion').value = incidencia.descripcion;
        document.getElementById('incidencia-ubicacion').value = incidencia.ubicacion;
        document.getElementById('modal-titulo').innerText = 'Editar Incidencia'; // Cambiar título del modal
        document.getElementById('btn-guardar-incidencia').onclick = function () {
            // Actualiza la incidencia
            incidencia.tipo = document.getElementById('incidencia-tipo').value;
            incidencia.gravedad = document.getElementById('incidencia-gravedad').value;
            incidencia.descripcion = document.getElementById('incidencia-descripcion').value;
            incidencia.ubicacion = document.getElementById('incidencia-ubicacion').value;

            // Guarda los cambios
            localStorage.setItem('incidencias', JSON.stringify(incidencias));
            cargarIncidencias();
            modalIncidencia.hide();
        };
        modalIncidencia.show();
    };
});
