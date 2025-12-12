// Variables globales
// db se declara en firebase-config.js como window.db
let ventas = [];
let gastos = [];
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let ventasUnsubscribe, gastosUnsubscribe;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando...');

    // Configurar event listeners primero
    setupEventListeners();

    // Esperar a que Firebase esté cargado
    if (typeof firebase !== 'undefined') {
        console.log('Firebase SDK detectado, inicializando...');
        initializeFirebase();
    } else {
        console.log('Esperando Firebase SDK...');
        // Esperar un poco más si Firebase aún no está cargado
        setTimeout(() => {
            if (typeof firebase !== 'undefined') {
                initializeFirebase();
            } else {
                console.warn('Firebase SDK no está disponible');
            }
        }, 1000);
    }

    if (isAuthenticated) {
        console.log('Usuario autenticado, mostrando dashboard');
        showDashboard();
        // Esperar a que db esté listo antes de cargar datos
        const checkDb = setInterval(() => {
            if (window.db) {
                clearInterval(checkDb);
                loadDashboard();
            }
        }, 100);

        // Timeout después de 5 segundos
        setTimeout(() => {
            clearInterval(checkDb);
            if (!window.db) {
                console.warn('Firebase no disponible, mostrando dashboard sin datos');
                updateStats();
                updateCharts();
                updateTable();
            }
        }, 5000);
    } else {
        console.log('Usuario no autenticado, mostrando login');
        showLogin();
    }
});

// Inicializar Firebase
function initializeFirebase() {
    try {
        const result = initFirebase();
        if (result && result.db) {
            console.log('Firebase inicializado correctamente');
        } else {
            console.error('No se pudo inicializar Firebase');
        }
    } catch (error) {
        console.error('Error inicializando Firebase:', error);
        alert('Error al conectar con Firebase. Verifica la configuración.');
    }
}

// Event Listeners
function setupEventListeners() {
    try {
        // Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Modals
        const btnCargarVenta = document.getElementById('btnCargarVenta');
        if (btnCargarVenta) {
            btnCargarVenta.addEventListener('click', () => openModal('ventaModal'));
        }

        const btnCargarGasto = document.getElementById('btnCargarGasto');
        if (btnCargarGasto) {
            btnCargarGasto.addEventListener('click', () => openModal('gastoModal'));
        }

        // Forms
        const ventaForm = document.getElementById('ventaForm');
        if (ventaForm) {
            ventaForm.addEventListener('submit', handleVentaSubmit);
        }

        const gastoForm = document.getElementById('gastoForm');
        if (gastoForm) {
            gastoForm.addEventListener('submit', handleGastoSubmit);
        }

        // Filters
        const filterType = document.getElementById('filterType');
        if (filterType) {
            filterType.addEventListener('change', filterTable);
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', filterTable);
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                if (modalId) {
                    closeModal(modalId);
                }
            });
        });
    } catch (error) {
        console.error('Error configurando event listeners:', error);
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    console.log('Intento de login...');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Usuario:', username);

    // Credenciales simples (en producción usar autenticación real)
    if (username === 'admin' && password === 'admin123') {
        console.log('Credenciales correctas, iniciando sesión...');
        localStorage.setItem('isAuthenticated', 'true');
        isAuthenticated = true;
        showDashboard();

        // Intentar cargar dashboard, esperar a que db esté listo si es necesario
        if (window.db) {
            console.log('Firebase listo, cargando dashboard...');
            loadDashboard();
        } else {
            console.log('Esperando Firebase...');
            // Esperar a que Firebase se inicialice
            const checkDbInterval = setInterval(() => {
                if (window.db) {
                    clearInterval(checkDbInterval);
                    console.log('Firebase listo, cargando dashboard...');
                    loadDashboard();
                }
            }, 100);

            // Timeout después de 5 segundos
            setTimeout(() => {
                clearInterval(checkDbInterval);
                if (!window.db) {
                    console.warn('Firebase no está disponible, pero el login fue exitoso');
                    // Mostrar dashboard vacío
                    updateStats();
                    updateCharts();
                    updateTable();
                }
            }, 5000);
        }
    } else {
        console.log('Credenciales incorrectas');
        alert('Usuario o contraseña incorrectos');
    }
}

function handleLogout() {
    // Desconectar listeners de Firestore
    if (ventasUnsubscribe) ventasUnsubscribe();
    if (gastosUnsubscribe) gastosUnsubscribe();

    localStorage.setItem('isAuthenticated', 'false');
    isAuthenticated = false;
    ventas = [];
    gastos = [];
    showLogin();
}

function showLogin() {
    document.getElementById('loginPanel').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginPanel').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

// Modals
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    // Set today's date as default
    const fechaInput = document.querySelector(`#${modalId} input[type="date"]`);
    if (fechaInput) {
        fechaInput.valueAsDate = new Date();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId.replace('Modal', 'Form')).reset();
}

// Firestore: Cargar datos en tiempo real
function loadDashboard() {
    if (!window.db) {
        console.error('Firebase no está inicializado');
        return;
    }

    // Listener en tiempo real para ventas
    ventasUnsubscribe = window.db.collection('ventas')
        .orderBy('fecha', 'desc')
        .onSnapshot((snapshot) => {
            ventas = [];
            snapshot.forEach((doc) => {
                ventas.push({ id: doc.id, ...doc.data() });
            });
            updateStats();
            updateCharts();
            updateTable();
        }, (error) => {
            console.error('Error cargando ventas:', error);
        });

    // Listener en tiempo real para gastos
    gastosUnsubscribe = window.db.collection('gastos')
        .orderBy('fecha', 'desc')
        .onSnapshot((snapshot) => {
            gastos = [];
            snapshot.forEach((doc) => {
                gastos.push({ id: doc.id, ...doc.data() });
            });
            updateStats();
            updateCharts();
            updateTable();
        }, (error) => {
            console.error('Error cargando gastos:', error);
        });
}

// Ventas
async function handleVentaSubmit(e) {
    e.preventDefault();

    if (!window.db) {
        alert('Error: Firebase no está conectado. Por favor, recarga la página.');
        console.error('window.db no está disponible');
        return;
    }

    const formData = new FormData(e.target);
    const cantidad = parseInt(formData.get('cantidad'));
    const precio = parseFloat(formData.get('precio'));
    const costo = parseFloat(formData.get('costo')) || 0;
    const esCompartida = formData.get('compartida') === 'si';

    // Venta y Costo siempre al 100%
    const totalVenta = cantidad * precio;

    const venta = {
        tipo: 'venta',
        fecha: formData.get('fecha'),
        raza: formData.get('raza'),
        sexo: formData.get('sexo') || 'Macho',
        estado: formData.get('estado'),
        cantidad: cantidad,
        precio: precio,
        costo: costo,
        compartida: esCompartida,
        descripcion: formData.get('descripcion') || '',
        total: totalVenta,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        console.log('Guardando venta en Firebase...', venta);
        const docRef = await window.db.collection('ventas').add(venta);
        console.log('Venta guardada con ID:', docRef.id);

        // 1. Gasto por Costo (Automático)
        if (costo > 0) {
            const gastoCosto = {
                tipo: 'gasto',
                fecha: formData.get('fecha'),
                categoria: 'Costo de Venta',
                monto: costo,
                descripcion: `Costo asociado a venta de ${venta.raza} (${docRef.id})`,
                total: costo,
                ventaId: docRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await window.db.collection('gastos').add(gastoCosto);
            console.log('Gasto por costo creado');
        }

        // 2. Gasto por Comisión Socio (Solo si es compartida)
        if (esCompartida) {
            const gananciaBruta = totalVenta - costo;
            const comisionSocio = gananciaBruta / 2;

            if (comisionSocio > 0) {
                const gastoComision = {
                    tipo: 'gasto',
                    fecha: formData.get('fecha'),
                    categoria: 'Comisión Socio',
                    monto: comisionSocio,
                    descripcion: `Pago a socio (50% ganancia) por venta de ${venta.raza} (${docRef.id})`,
                    total: comisionSocio,
                    ventaId: docRef.id,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await window.db.collection('gastos').add(gastoComision);
                console.log('Gasto por comisión socio creado');
            }
        }

        closeModal('ventaModal');
        alert('Venta guardada correctamente');
    } catch (error) {
        console.error('Error guardando venta:', error);
        alert('Error al guardar la venta: ' + error.message);
    }
}

// Gastos
async function handleGastoSubmit(e) {
    e.preventDefault();

    if (!window.db) {
        alert('Error: Firebase no está conectado. Por favor, recarga la página.');
        console.error('window.db no está disponible');
        return;
    }

    const formData = new FormData(e.target);
    const gasto = {
        tipo: 'gasto',
        fecha: formData.get('fecha'),
        categoria: formData.get('categoria'),
        monto: parseFloat(formData.get('monto')),
        descripcion: formData.get('descripcion'),
        total: parseFloat(formData.get('monto')),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        console.log('Guardando gasto en Firebase...', gasto);
        const docRef = await window.db.collection('gastos').add(gasto);
        console.log('Gasto guardado con ID:', docRef.id);
        closeModal('gastoModal');
        alert('Gasto guardado correctamente');
    } catch (error) {
        console.error('Error guardando gasto:', error);
        alert('Error al guardar el gasto: ' + error.message);
    }
}

// Dashboard
function updateStats() {
    const totalVendidos = ventas.reduce((sum, v) => sum + v.cantidad, 0);
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.total, 0);
    const gananciaNeta = totalVentas - totalGastos;

    document.getElementById('totalVendidos').textContent = totalVendidos;
    document.getElementById('totalVentas').textContent = `$${totalVentas.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalGastos').textContent = `$${totalGastos.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    document.getElementById('gananciaNeta').textContent = `$${gananciaNeta.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
}

function updateCharts() {
    updateVentasMesChart();
    updateVentasRazaChart();
}

function updateVentasMesChart() {
    const ctx = document.getElementById('ventasMesChart');

    // Agrupar ventas por mes
    const ventasPorMes = {};
    ventas.forEach(v => {
        const mes = new Date(v.fecha).toLocaleDateString('es-VE', { year: 'numeric', month: 'short' });
        ventasPorMes[mes] = (ventasPorMes[mes] || 0) + v.total;
    });

    const meses = Object.keys(ventasPorMes).sort();
    const valores = meses.map(mes => ventasPorMes[mes]);

    if (window.ventasMesChartInstance) {
        window.ventasMesChartInstance.destroy();
    }

    window.ventasMesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Ventas ($)',
                data: valores,
                borderColor: '#00b9ec',
                backgroundColor: 'rgba(0, 185, 236, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateVentasRazaChart() {
    const ctx = document.getElementById('ventasRazaChart');

    // Agrupar ventas por raza
    const ventasPorRaza = {};
    ventas.forEach(v => {
        ventasPorRaza[v.raza] = (ventasPorRaza[v.raza] || 0) + v.cantidad;
    });

    const razas = Object.keys(ventasPorRaza);
    const cantidades = razas.map(raza => ventasPorRaza[raza]);

    if (window.ventasRazaChartInstance) {
        window.ventasRazaChartInstance.destroy();
    }

    window.ventasRazaChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: razas,
            datasets: [{
                data: cantidades,
                backgroundColor: [
                    '#00b9ec',
                    '#32f4bb',
                    '#ff7db2',
                    '#fe9e5b',
                    '#ffea20'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTable() {
    const tbody = document.getElementById('tableBody');
    const allData = [
        ...ventas.map(v => ({ ...v, tipo: 'venta' })),
        ...gastos.map(g => ({ ...g, tipo: 'gasto' }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    tbody.innerHTML = allData.map(item => {
        if (item.tipo === 'venta') {
            return `
                <tr>
                    <td>${formatDate(item.fecha)}</td>
                    <td><span class="badge-venta">Venta</span></td>
                    <td>${item.descripcion || '-'}</td>
                    <td>${item.raza} (${item.sexo || '?'}) <br> <small>${item.estado || 'N/A'}</small></td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precio.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td>$${item.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td>
                        <button class="btn-edit" onclick="editItem('${item.id}', 'venta')">Editar</button>
                        <button class="btn-delete" onclick="deleteItem('${item.id}', 'venta')">Eliminar</button>
                    </td>
                </tr>

            `;
        } else {
            return `
                <tr>
                    <td>${formatDate(item.fecha)}</td>
                    <td><span class="badge-gasto">Gasto</span></td>
                    <td>${item.descripcion}</td>
                    <td>${item.categoria}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>$${item.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td>
                        <button class="btn-edit" onclick="editItem('${item.id}', 'gasto')">Editar</button>
                        <button class="btn-delete" onclick="deleteItem('${item.id}', 'gasto')">Eliminar</button>
                    </td>
                </tr>
            `;
        }
    }).join('');

    filterTable();
}

function filterTable() {
    const filterType = document.getElementById('filterType').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');

    rows.forEach(row => {
        const tipo = row.querySelector('td:nth-child(2)').textContent.trim();
        const texto = row.textContent.toLowerCase();

        const matchType = filterType === 'all' ||
            (filterType === 'venta' && tipo === 'Venta') ||
            (filterType === 'gasto' && tipo === 'Gasto');

        const matchSearch = texto.includes(searchText);

        row.style.display = (matchType && matchSearch) ? '' : 'none';
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE');
}

async function deleteItem(id, tipo) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    if (!window.db) {
        alert('Error: Firebase no está conectado. Por favor, recarga la página.');
        console.error('window.db no está disponible');
        return;
    }

    try {
        const collection = tipo === 'venta' ? 'ventas' : 'gastos';
        console.log('Eliminando registro:', id, 'de', collection);
        await window.db.collection(collection).doc(id).delete();
        console.log('Registro eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando registro:', error);
        alert('Error al eliminar el registro: ' + error.message);
    }
}

function editItem(id, tipo) {
    let item;
    if (tipo === 'venta') {
        item = ventas.find(v => v.id === id);
        if (item) {
            document.getElementById('ventaFecha').value = item.fecha;
            document.getElementById('ventaRaza').value = item.raza;
            if (document.getElementById('ventaSexo')) document.getElementById('ventaSexo').value = item.sexo || 'Macho';
            if (document.getElementById('ventaEstado')) document.getElementById('ventaEstado').value = item.estado || '';
            document.getElementById('ventaCantidad').value = item.cantidad;
            document.getElementById('ventaPrecio').value = item.precio;
            // Costo: Si es compartida y tenía costo, mostrar el doble para reflejar el original (aproximado) o mostrar el guardado
            // Nota: Guardamos costoFinal. Si queremos editar, mostramos ese.
            if (document.getElementById('ventaCosto')) document.getElementById('ventaCosto').value = item.costo || '';
            if (document.getElementById('ventaCompartida')) document.getElementById('ventaCompartida').value = item.compartida ? 'si' : 'no';
            document.getElementById('ventaDescripcion').value = item.descripcion;
            openModal('ventaModal');
            // Modificar el submit para actualizar en lugar de crear
            const form = document.getElementById('ventaForm');
            const originalSubmit = form.onsubmit;
            form.onsubmit = async (e) => {
                e.preventDefault();

                if (!window.db) {
                    alert('Error: Firebase no está conectado. Por favor, recarga la página.');
                    console.error('window.db no está disponible');
                    return;
                }

                const formData = new FormData(e.target);
                const cantidad = parseInt(formData.get('cantidad'));
                const precio = parseFloat(formData.get('precio'));
                const costo = parseFloat(formData.get('costo')) || 0;
                const esCompartida = formData.get('compartida') === 'si';

                // Recalcular costo final
                const costoFinal = esCompartida ? (costo / 2) : costo;
                const total = esCompartida ? (cantidad * precio) / 2 : (cantidad * precio);

                const updatedData = {
                    fecha: formData.get('fecha'),
                    raza: formData.get('raza'),
                    sexo: formData.get('sexo') || 'Macho',
                    estado: formData.get('estado'),
                    cantidad: cantidad,
                    precio: precio,
                    costo: costoFinal,
                    compartida: esCompartida,
                    descripcion: formData.get('descripcion') || '',
                    total: total,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    console.log('Actualizando venta en Firebase...', id, updatedData);
                    await window.db.collection('ventas').doc(id).update(updatedData);
                    console.log('Venta actualizada correctamente');
                    closeModal('ventaModal');
                    form.onsubmit = originalSubmit;
                } catch (error) {
                    console.error('Error actualizando venta:', error);
                    alert('Error al actualizar la venta: ' + error.message);
                }
            };
        }
    } else {
        item = gastos.find(g => g.id === id);
        if (item) {
            document.getElementById('gastoFecha').value = item.fecha;
            document.getElementById('gastoCategoria').value = item.categoria;
            document.getElementById('gastoMonto').value = item.monto;
            document.getElementById('gastoDescripcion').value = item.descripcion;
            openModal('gastoModal');
            const form = document.getElementById('gastoForm');
            const originalSubmit = form.onsubmit;
            form.onsubmit = async (e) => {
                e.preventDefault();

                if (!window.db) {
                    alert('Error: Firebase no está conectado. Por favor, recarga la página.');
                    console.error('window.db no está disponible');
                    return;
                }

                const formData = new FormData(e.target);
                const updatedData = {
                    fecha: formData.get('fecha'),
                    categoria: formData.get('categoria'),
                    monto: parseFloat(formData.get('monto')),
                    descripcion: formData.get('descripcion'),
                    total: parseFloat(formData.get('monto')),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    console.log('Actualizando gasto en Firebase...', id, updatedData);
                    await window.db.collection('gastos').doc(id).update(updatedData);
                    console.log('Gasto actualizado correctamente');
                    closeModal('gastoModal');
                    form.onsubmit = originalSubmit;
                } catch (error) {
                    console.error('Error actualizando gasto:', error);
                    alert('Error al actualizar el gasto: ' + error.message);
                }
            };
        }
    }
}

// Agregar estilos para badges
const style = document.createElement('style');
style.textContent = `
    .badge-venta {
        background: #32f4bb;
        color: #1A1A1A;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
    }
    .badge-gasto {
        background: #ff7db2;
        color: #FFFFFF;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
