// Definición de aeropuertos
const aeropuertos = [
    "Atenas (ATH)", "Berlín (BER)", "Bogotá (BOG)", "Buenos Aires (AEP)", 
    "Canberra (CBR)", "Caracas (CCS)", "Ciudad de México (MEX)", "Lima (LIM)", 
    "Londres (LHR)", "Madrid (MAD)", "Nueva Delhi (DEL)", "Oslo (OSL)", 
    "París (CDG)", "Río de Janeiro (GIG)", "Roma (FCO)", "San José (SJO)", 
    "Seúl (ICN)", "Tokio (NRT)", "Toronto (YYZ)", "Washington D.C. (DCA)"
];

// Definición de vuelos con estados aleatorios
const estados = ["en_tiempo", "retrasado", "cancelado", "en_vuelo", "aterrizado"];
const vuelos = [];

// Crear 30 vuelos por día entre el 20 de octubre y el 31 de octubre de 2024
for (let dia = 20; dia <= 31; dia++) {
    const fecha = `2024-10-${String(dia).padStart(2, '0')}`;
    for (let i = 0; i < 30; i++) {
        const origen = aeropuertos[Math.floor(Math.random() * aeropuertos.length)];
        const destino = aeropuertos[Math.floor(Math.random() * aeropuertos.length)];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        vuelos.push({ fecha, origen, destino, estado });
    }
}

// Cargar los aeropuertos en los selects
const origenSelect = document.getElementById('origen');
const destinoSelect = document.getElementById('destino');

aeropuertos.forEach(aeropuerto => {
    const optionOrigen = document.createElement('option');
    optionOrigen.value = aeropuerto;
    optionOrigen.textContent = aeropuerto;
    origenSelect.appendChild(optionOrigen);

    const optionDestino = document.createElement('option');
    optionDestino.value = aeropuerto;
    optionDestino.textContent = aeropuerto;
    destinoSelect.appendChild(optionDestino);
});

// Función para manejar la búsqueda de vuelos
document.getElementById('form-consulta-vuelos').addEventListener('submit', function(event) {
    event.preventDefault();
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const origenSeleccionado = document.getElementById('origen').value;
    const destinoSeleccionado = document.getElementById('destino').value;
    const estadoSeleccionado = document.getElementById('estado').value;

    // Mostrar indicador de carga
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';
    
    // Filtrar vuelos
    setTimeout(() => {
        const resultadosFiltrados = vuelos.filter(vuelo => {
            return ((!fechaInicio || vuelo.fecha >= fechaInicio) && 
                    (!fechaFin || vuelo.fecha <= fechaFin)) &&
                   (origenSeleccionado === "todos" || vuelo.origen === origenSeleccionado) &&
                   (destinoSeleccionado === "todos" || vuelo.destino === destinoSeleccionado) &&
                   (!estadoSeleccionado || vuelo.estado === estadoSeleccionado);
        });

        // Mostrar resultados
        mostrarResultados(resultadosFiltrados);
        loadingIndicator.style.display = 'none';
    }, 1000); // Simulación de carga
});

// Función para mostrar los resultados de los vuelos
function mostrarResultados(vuelos) {
    const resultadosDiv = document.getElementById('resultados-vuelos');
    resultadosDiv.innerHTML = '';

    if (vuelos.length === 0) {
        resultadosDiv.innerHTML = '<p>No se encontraron vuelos.</p>';
        return;
    }

    vuelos.forEach(vuelo => {
        const vueloDiv = document.createElement('div');
        vueloDiv.className = 'alert alert-info';
        vueloDiv.innerHTML = `
            <strong>Fecha:</strong> ${vuelo.fecha}<br>
            <strong>Origen:</strong> ${vuelo.origen}<br>
            <strong>Destino:</strong> ${vuelo.destino}<br>
            <strong>Estado:</strong> ${vuelo.estado}<br>
            <button class="btn btn-primary btn-detalle" data-bs-toggle="modal" data-bs-target="#detalle-vuelo">Ver Detalle</button>
        `;
        resultadosDiv.appendChild(vueloDiv);
    });

    // Agregar evento para mostrar detalles de vuelos
    document.querySelectorAll('.btn-detalle').forEach(button => {
        button.addEventListener('click', () => {
            const vueloDetalle = button.parentElement;
            mostrarDetalleVuelo(vueloDetalle);
        });
    });
}

// Función para mostrar el detalle del vuelo
function mostrarDetalleVuelo(vueloDiv) {
    const detalleVueloLabel = document.getElementById('detalleVueloLabel');
    const fechaVuelo = document.getElementById('fecha-vuelo');
    const origenVuelo = document.getElementById('origen-vuelo');
    const destinoVuelo = document.getElementById('destino-vuelo');
    const estadoVuelo = document.getElementById('estado-vuelo');

    // Obtener los datos del vuelo desde el div
    const fecha = vueloDiv.querySelector('strong').nextSibling.nodeValue.trim(); // Obtener fecha
    const origen = vueloDiv.querySelector('strong:nth-of-type(2)').nextSibling.nodeValue.trim(); // Obtener origen
    const destino = vueloDiv.querySelector('strong:nth-of-type(3)').nextSibling.nodeValue.trim(); // Obtener destino
    const estado = vueloDiv.querySelector('strong:nth-of-type(4)').nextSibling.nodeValue.trim(); // Obtener estado

    // Asignar los valores a los elementos del modal
    detalleVueloLabel.textContent = `Detalle del Vuelo - ${fecha}`;
    fechaVuelo.textContent = `Fecha: ${fecha}`;
    origenVuelo.textContent = `Origen: ${origen}`;
    destinoVuelo.textContent = `Destino: ${destino}`;
    estadoVuelo.textContent = `Estado: ${estado}`;
}

