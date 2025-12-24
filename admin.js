// Variables globales
// db se declara en firebase-config.js como window.db
let ventas = [];
let gastos = [];
let costos = [];
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let ventasUnsubscribe, gastosUnsubscribe, costosUnsubscribe;
let currentPage = 1;
const itemsPerPage = 8; // Showing 8 items per page for better visibility

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
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => updateTable());
        }

        // Tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                updateTable();
            });
        });

        // Tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                updateTable();
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                if (modalId) {
                    closeModal(modalId);
                }
            });
        });

        // Report Button
        const btnGenerarReporte = document.getElementById('btnGenerarReporte');
        if (btnGenerarReporte) {
            btnGenerarReporte.addEventListener('click', handleGenerateReport);
        }

        // Select All Checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', toggleSelectAll);
        }
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
                    // Mostrar dashboard vacío
                    updateStats();
                    updateCharts();
                    updateStats();
                    updateCharts();
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
    if (costosUnsubscribe) costosUnsubscribe();

    localStorage.setItem('isAuthenticated', 'false');
    isAuthenticated = false;
    ventas = [];
    gastos = [];
    costos = [];
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
    const form = document.getElementById(modalId.replace('Modal', 'Form'));
    form.reset();
    form.dataset.mode = ''; // Reset mode to default (create)
    form.onsubmit = null; // Clear custom submit handler if any
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

    // Listener en tiempo real para costos
    costosUnsubscribe = window.db.collection('costos')
        .orderBy('fecha', 'desc')
        .onSnapshot((snapshot) => {
            costos = [];
            snapshot.forEach((doc) => {
                costos.push({ id: doc.id, ...doc.data() });
            });
            updateStats();
            updateCharts();
            updateTable();
        }, (error) => {
            console.error('Error cargando costos:', error);
        });
}

// Helper to toggle date input visibility
function toggleFechaCobro() {
    const estado = document.getElementById('ventaEstadoCobro')?.value;
    const divFecha = document.getElementById('divFechaCobro');
    const inputFecha = document.getElementById('ventaFechaCobro');

    if (estado === 'por_cobrar') {
        divFecha.classList.remove('hidden');
        inputFecha.required = true;
    } else {
        divFecha.classList.add('hidden');
        inputFecha.required = false;
        inputFecha.value = '';
    }
}

// Helper to toggle Socio input visibility
function toggleSocioInput() {
    const compartido = document.getElementById('ventaCompartida')?.value;
    const divSocio = document.getElementById('divSocio');
    const inputSocio = document.getElementById('ventaSocio');

    if (compartido === 'si') {
        divSocio.classList.remove('hidden');
        inputSocio.required = true;
    } else {
        divSocio.classList.add('hidden');
        inputSocio.required = false;
        inputSocio.value = '';
    }
}

// Make sure it's globally available
window.toggleFechaCobro = toggleFechaCobro;
window.toggleSocioInput = toggleSocioInput;

// Ventas
async function handleVentaSubmit(e) {
    e.preventDefault();

    // Check if we are in "edit" mode to avoid duplicate create/update
    if (e.target.dataset.mode === 'edit') {
        return; // The onsubmit handler defined in editItem will handle it
    }

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
        costo: costo, // This `costo` is the initial cost of the animal, not the `costoMonto` for the `costos` collection
        compartida: esCompartida,
        descripcion: formData.get('descripcion') || '',
        total: totalVenta,

        // New Fields for Payment Status
        estadoCobro: formData.get('estadoCobro') || 'cobrado', // Default to cobrado if missing
        fechaCobro: formData.get('estadoCobro') === 'por_cobrar' ? formData.get('fechaCobro') : null,

        // Compartida (re-added for clarity, though `esCompartida` already exists)
        socio: formData.get('compartida') === 'si' ? formData.get('socio') : null,
        porcentajeSocio: formData.get('compartida') === 'si' ? 50 : 0,

        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        console.log('Guardando venta en Firebase...', venta);
        const docRef = await window.db.collection('ventas').add(venta);
        console.log('Venta guardada con ID:', docRef.id);

        // 1. Costo de Venta (A la colección costos)
        const costoMonto = parseFloat(formData.get('costo')); // Use a new variable for the cost to be added to the 'costos' collection
        if (!isNaN(costoMonto) && costoMonto > 0) {
            const costoData = {
                tipo: 'costo',
                fecha: formData.get('fecha'),
                descripcion: `Costo asociado a venta de ${venta.raza} (${docRef.id})`,
                monto: costoMonto,
                ventaId: docRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await window.db.collection('costos').add(costoData);
            console.log('Costo de venta creado');
        }

        // 2. Comisión Socio (A la colección costos)
        if (esCompartida) {
            const gananciaBruta = totalVenta - (costoMonto || 0); // Use costoMonto for calculation
            const comisionSocio = gananciaBruta / 2;

            if (comisionSocio > 0) {
                const costoComision = {
                    tipo: 'costo',
                    fecha: formData.get('fecha'),
                    descripcion: `Pago a socio (50% ganancia) por venta de ${venta.raza} (${docRef.id})`,
                    monto: comisionSocio,
                    ventaId: docRef.id,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                await window.db.collection('costos').add(costoComision);
                console.log('Costo por comisión socio creado');
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
    // Filter Sales by Status
    const ventasCobradas = ventas.filter(v => v.estadoCobro !== 'por_cobrar');
    const ventasPorCobrar = ventas.filter(v => v.estadoCobro === 'por_cobrar');

    const totalVendidos = ventas.reduce((sum, v) => sum + v.cantidad, 0); // Count all dogs regardless of payment status? Usually yes.

    // Total Sales (Revenue) - Only Paid
    const totalVentas = ventasCobradas.reduce((sum, v) => sum + v.total, 0);

    // Pending Collections
    const totalCobrosPendientes = ventasPorCobrar.reduce((sum, v) => sum + v.total, 0);

    // Map sales by ID for fast lookup and strict validation
    const ventasMap = new Map(ventas.map(v => [v.id, v]));

    // Separar gastos reales de costos legacy (guardados como gastos)
    const trueGastos = gastos.filter(g => g.categoria !== 'Costo de Venta' && g.categoria !== 'Comisión Socio');

    // Helper to check if a cost should be included
    const shouldIncludeCost = (ventaId) => {
        if (!ventaId) return true; // Legacy/Manual cost with no link -> Include (safest assumption)
        const venta = ventasMap.get(ventaId);
        // Only include if sale exists AND is NOT pending
        // This handles race conditions (sale not loaded yet) and pending status
        return venta && venta.estadoCobro !== 'por_cobrar';
    };

    // Legacy Costs
    const legacyCostos = gastos.filter(g =>
        (g.categoria === 'Costo de Venta' || g.categoria === 'Comisión Socio') &&
        shouldIncludeCost(g.ventaId)
    );

    // True Costos
    const activeCostos = costos.filter(c => shouldIncludeCost(c.ventaId));

    const totalGastos = trueGastos.reduce((sum, g) => sum + g.total, 0);
    const totalCostos = activeCostos.reduce((sum, c) => sum + c.monto, 0) +
        legacyCostos.reduce((sum, c) => sum + (c.monto || c.total), 0);

    // Solicitud usuario: No descontar gastos, solo costos y comisiones
    const gananciaNeta = totalVentas - totalCostos;

    // Solicitud usuario: Nuevo cuadro "Disponible" = Ganancia - Gastos
    const totalDisponible = gananciaNeta - totalGastos;

    document.getElementById('totalVendidos').textContent = totalVendidos;
    document.getElementById('totalVentas').textContent = `$${totalVentas.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalGastos').textContent = `$${totalGastos.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalCostos').textContent = `$${totalCostos.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    document.getElementById('gananciaNeta').textContent = `$${gananciaNeta.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;

    // Update Pending Collections Card
    if (document.getElementById('totalCobrosPendientes')) {
        document.getElementById('totalCobrosPendientes').textContent = `$${totalCobrosPendientes.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    }

    // Verificar si existe el elemento antes de actualizarlo (por si acaso caché viejo de HTML)
    if (document.getElementById('totalDisponible')) {
        document.getElementById('totalDisponible').textContent = `$${totalDisponible.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    }
}

function updateCharts() {
    updateVentasMesChart();
    updateVentasEstadoChart(); // New chart
    updateVentasRazaChart();
}

function updateVentasEstadoChart() {
    const ctx = document.getElementById('ventasEstadoChart');
    if (!ctx) return;

    // Agrupar ventas por estado
    const ventasPorEstado = {};
    ventas.forEach(v => {
        const estado = v.estado || 'Desconocido';
        ventasPorEstado[estado] = (ventasPorEstado[estado] || 0) + v.cantidad;
    });

    const estados = Object.keys(ventasPorEstado);
    const cantidades = estados.map(e => ventasPorEstado[e]);

    // Labels with counts
    const labelsWithCounts = estados.map((e, index) => `${e}: ${cantidades[index]}`);

    if (window.ventasEstadoChartInstance) {
        window.ventasEstadoChartInstance.destroy();
    }

    window.ventasEstadoChartInstance = new Chart(ctx, {
        type: 'pie', // Using pie for variety/suitability
        data: {
            labels: labelsWithCounts,
            datasets: [{
                data: cantidades,
                backgroundColor: [
                    '#fe9e5b', // Orange
                    '#32f4bb', // Green
                    '#00b9ec', // Blue
                    '#ff7db2', // Pink
                    '#ffea20'  // Yellow
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#1A1A1A',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
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
    if (!ctx) return;

    // Agrupar ventas por raza
    const ventasPorRaza = {};
    ventas.forEach(v => {
        ventasPorRaza[v.raza] = (ventasPorRaza[v.raza] || 0) + v.cantidad;
    });

    const razas = Object.keys(ventasPorRaza);
    const cantidades = razas.map(raza => ventasPorRaza[raza]);

    // Create labels with counts
    const labelsWithCounts = razas.map((raza, index) => `${raza}: ${cantidades[index]}`);

    if (window.ventasRazaChartInstance) {
        window.ventasRazaChartInstance.destroy();
    }

    window.ventasRazaChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelsWithCounts,
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
                    position: 'right', // Legend on the right
                    labels: {
                        color: '#1A1A1A', // Ensure text is visible (Using dark gray/block)
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Consolidated Table Update
function updateTable() {
    const tbody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';

    // Determine current filter from active tab
    let activeTab = document.querySelector('.filter-tab.active');
    if (!activeTab) {
        // Default to 'venta' if no active tab found
        activeTab = document.querySelector('.filter-tab[data-filter="venta"]');
        if (activeTab) activeTab.classList.add('active');
    }
    currentFilter = activeTab ? activeTab.getAttribute('data-filter') : 'venta';

    // Split Gastos into True Gastos and Legacy Costs
    const trueGastos = [];
    const legacyCostos = [];

    gastos.forEach(g => {
        if (g.categoria === 'Costo de Venta' || g.categoria === 'Comisión Socio') {
            legacyCostos.push(g);
        } else {
            trueGastos.push(g);
        }
    });

    // Merge all data
    let allData = [
        ...ventas.map(v => ({ ...v, dataType: 'venta', collection: 'ventas' })),
        ...trueGastos.map(g => ({ ...g, dataType: 'gasto', collection: 'gastos' })),
        ...costos.map(c => ({ ...c, dataType: 'costo', collection: 'costos' })),
        ...legacyCostos.map(c => ({ ...c, dataType: 'costo', collection: 'gastos', isLegacy: true }))
    ];

    // Filter by type
    if (currentFilter !== 'all') {
        allData = allData.filter(item => item.dataType === currentFilter);
    }

    // Filter by search text
    if (searchText) {
        allData = allData.filter(item => {
            const text = (
                (item.descripcion || '') +
                (item.raza || '') +
                (item.categoria || '') +
                (item.dataType || '')
            ).toLowerCase();
            return text.includes(searchText);
        });
    }

    // Sort by date desc
    allData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Pagination Logic
    const totalPages = Math.ceil(allData.length / itemsPerPage) || 1;

    // Validate current page
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = allData.slice(startIndex, startIndex + itemsPerPage);

    // Render
    tbody.innerHTML = paginatedData.map(item => {
        const dateStr = formatDate(item.fecha);
        const tipoBadge = getBadge(item.dataType);

        let detalleHtml = '';
        let montoHtml = '';
        let mobileDetailHtml = '';

        // Use total, monto, or fallback
        const amount = item.monto || item.total || 0;

        if (item.dataType === 'venta') {
            detalleHtml = `
                <div><strong>${item.raza}</strong></div>
                <div class="text-sm text-muted">${item.sexo || ''}, ${item.estado || ''}</div>
                <div class="text-sm">Cant: ${item.cantidad}</div>
                ${item.estadoCobro === 'por_cobrar'
                    ? `<span class="badge badge-warning">Por Cobrar (${formatDate(item.fechaCobro)})</span>`
                    : '<span class="badge badge-success">Cobrado</span>'}
            `;
            montoHtml = `$${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
            mobileDetailHtml = `
                <p><strong>Raza:</strong> ${item.raza}</p>
                <p><strong>Cant:</strong> ${item.cantidad}</p>
                <p><strong>Precio:</strong> $${item.precio}</p>
                <p><strong>Total:</strong> $${amount}</p>
                <p><strong>Estado Pago:</strong> ${item.estadoCobro === 'por_cobrar' ? '<span style="color:orange">Por Cobrar</span>' : '<span style="color:green">Cobrado</span>'}</p>
                <p><strong>Desc:</strong> ${item.descripcion || '-'}</p>
            `;
        } else if (item.dataType === 'gasto') {
            detalleHtml = `
                <div><strong>${item.categoria}</strong></div>
            `;
            montoHtml = `$${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
            mobileDetailHtml = `
                <p><strong>Categoría:</strong> ${item.categoria}</p>
                <p><strong>Monto:</strong> $${amount}</p>
                <p><strong>Desc:</strong> ${item.descripcion}</p>
            `;
        } else if (item.dataType === 'costo') {
            detalleHtml = `
                <div><em>${item.categoria || 'Costo Operativo'}</em></div>
            `;
            montoHtml = `$${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
            mobileDetailHtml = `
                <p><strong>Concepto:</strong> ${item.categoria || 'Costo'}</p>
                <p><strong>Monto:</strong> $${amount}</p>
                <p><strong>Desc:</strong> ${item.descripcion}</p>
            `;
        }

        return `
            <tr id="row-${item.id}" class="${item.selected ? 'selected' : ''}">
                <td style="text-align: center;">
                    ${item.dataType === 'venta'
                ? `<input type="checkbox" class="row-checkbox" value="${item.id}" onchange="handleRowSelection('${item.id}')">`
                : ''}
                </td>
                <td>
                    ${dateStr}
                    <div class="mobile-only-row">
                        ${tipoBadge}
                    </div>
                </td>
                <td class="mobile-hidden">${tipoBadge}</td>
                <td class="mobile-hidden">${item.descripcion || '-'}</td>
                <td>${detalleHtml}</td>
                <td class="mobile-hidden">${montoHtml}</td>
                <td class="mobile-hidden">
                    <button class="btn-delete" onclick="deleteItem('${item.id}', '${item.collection}')">×</button>
                    ${!item.isLegacy && item.dataType !== 'costo' ? `<button class="btn-edit" onclick="editItem('${item.id}', '${item.dataType}')">✎</button>` : ''}
                </td>
                <td class="mobile-only-cell"> 
                     <button id="btn-toggle-${item.id}" class="btn-toggle-mobile" onclick="toggleMobileRow('${item.id}')">▼</button>
                </td>
            </tr>
            <tr id="detail-${item.id}" class="mobile-detail-row hidden">
                <td colspan="6">
                    ${mobileDetailHtml}
                    <div style="margin-top: 10px; text-align: right;">
                        <button class="btn-delete" onclick="deleteItem('${item.id}', '${item.collection}')">Eliminar</button>
                        ${!item.isLegacy && item.dataType !== 'costo' ? `<button class="btn-edit" onclick="editItem('${item.id}', '${item.dataType}')">Editar</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Update Pagination Controls
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = document.getElementById('paginationControls');
    if (!container) return;

    // Don't show controls if only 1 page
    if (totalPages <= 1) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';

    container.innerHTML = `
        <button class="pagination-btn" 
            onclick="changePage(${currentPage - 1})" 
            ${currentPage === 1 ? 'disabled' : ''}>
            Anterior
        </button>
        <span class="pagination-info">
            Página ${currentPage} de ${totalPages}
        </span>
        <button class="pagination-btn" 
            onclick="changePage(${currentPage + 1})" 
            ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente
        </button>
    `;
}

function changePage(newPage) {
    currentPage = newPage;
    updateTable();
    // Scroll to the top of the table section
    const tableSection = document.querySelector('.table-section');
    if (tableSection) {
        tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Make changePage globally available
window.changePage = changePage;


function getBadge(type) {
    if (type === 'venta') return '<span class="badge-venta">Venta</span>';
    if (type === 'gasto') return '<span class="badge-gasto">Gasto</span>';
    if (type === 'costo') return '<span class="badge-costo">Costo</span>';
    return '';
}

function toggleMobileRow(id) {
    const row = document.getElementById(`detail-${id}`);
    const btn = document.getElementById(`btn-toggle-${id}`);
    if (row && btn) {
        row.classList.toggle('hidden');
        btn.innerHTML = row.classList.contains('hidden') ? '▼' : '▲';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE');
}

async function deleteItem(id, collection) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    if (!window.db) {
        alert('Error: Firebase no está conectado. Por favor, recarga la página.');
        return;
    }

    try {
        console.log('Eliminando registro:', id, 'de', collection);
        await window.db.collection(collection).doc(id).delete();
        console.log('Registro eliminado correctamente');
        // No need to alert, the listener will update the UI
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

            // Populate Payment Status
            if (document.getElementById('ventaEstadoCobro')) {
                document.getElementById('ventaEstadoCobro').value = item.estadoCobro || 'cobrado';
                document.getElementById('ventaFechaCobro').value = item.fechaCobro || ''; // Populate date if exists
                if (window.toggleFechaCobro) window.toggleFechaCobro(); // Trigger visibility toggle
            }

            document.getElementById('ventaDescripcion').value = item.descripcion;
            openModal('ventaModal');

            const form = document.getElementById('ventaForm');
            // Set mode to edit to prevent handleVentaSubmit from running
            form.dataset.mode = 'edit';

            // Remove previous event listeners... (Logic continues)
            // Remove previous event listeners to avoid stacking (Clone node trick or removeEventListener if stored)
            // Simpler: Just rely on onsubmit replacement which overwrites the previous one
            const originalSubmit = form.onsubmit;

            // Fix: The originalSubmit might be null if addEventListener was used. 
            // Ideally we should reload the page or properly handle listener removal. 
            // For now, we assume this pattern works as per existing code, but we must ensure we don't break the 'Create' mode.
            // The existing code captures 'originalSubmit' but handleVentaSubmit is attached via addEventListener in init().
            // So assigning form.onsubmit PREVENTS the addEventListener validation? No, addEventListener runs too.
            // We need to stop the default addEventListener from firing or creating a duplicate.
            // Actually, the existing code replaces 'onsubmit' property. If the form uses addEventListener, this onsubmit might run in addition.
            // Use a flag or clone the form to clear listeners.

            // BETTER APPROACH: Remove the Event Listener temporarily? No, references needed.
            // QUICK FIX FOR NOW: Use a global 'isEditing' flag in handleVentaSubmit?
            // OR: Since we are in the 'editItem' function which is separate, let's keep the existing pattern if it was working.
            // But wait, the previous code showed:
            /*
                const originalSubmit = form.onsubmit;
                form.onsubmit = async (e) => { ... }
            */
            // If the original code used addEventListener for create, updating .onsubmit property works as a separate handler.
            // We need to prevent the CREATE handler from running.
            // The create handler is: form.addEventListener('submit', handleVentaSubmit);

            // To fix this cleanly:
            // 1. Assign a data-mode="edit" to the form.
            // 2. Initial handleVentaSubmit checks this mode.

            // Let's stick to modifying the object here, assuming the user's codebase pattern was functioning or I fix it.
            // I will update the content of the helper.

            form.onsubmit = async (e) => {
                e.preventDefault();
                e.stopImmediatePropagation(); // Try to stop other listeners

                if (!window.db) {
                    alert('Error: Firebase no está conectado. Por favor, recarga la página.');
                    return;
                }

                const formData = new FormData(e.target);

                // Original calculation logic...
                const cantidad = parseInt(formData.get('cantidad'));
                const precio = parseFloat(formData.get('precio'));
                const costo = parseFloat(formData.get('costo')) || 0;
                // Note: Updating cost here is complex because we separated Costs into a collection. 
                // Updating the Cost amount in the Sale document is fine for reference, 
                // but ideally we should update the associated 'costo' document too. 
                // For now, let's update the sale document fields as requested.

                const esCompartida = formData.get('compartida') === 'si';
                const total = formData.get('total') ? parseFloat(formData.get('total')) : (cantidad * precio);

                const updatedData = {
                    fecha: formData.get('fecha'),
                    raza: formData.get('raza'),
                    sexo: formData.get('sexo') || 'Macho',
                    estado: formData.get('estado'),
                    cantidad: cantidad,
                    precio: precio,
                    costo: costo,
                    compartida: esCompartida,
                    descripcion: formData.get('descripcion') || '',
                    total: total,

                    // Update Payment Status
                    estadoCobro: formData.get('estadoCobro'),
                    fechaCobro: formData.get('estadoCobro') === 'por_cobrar' ? formData.get('fechaCobro') : null,

                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    console.log('Actualizando venta en Firebase...', id, updatedData);
                    await window.db.collection('ventas').doc(id).update(updatedData);
                    console.log('Venta actualizada correctamente');
                    closeModal('ventaModal');
                    form.onsubmit = null; // Clear this specific handler
                    location.reload(); // Reload to refresh table and stats cleanly
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
    .badge-costo {
        background: #ffea20;
        color: #1a1a1a;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
    }
    /* Filter Tabs */
    .filter-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        overflow-x: auto;
        padding-bottom: 5px;
    }
    .filter-tab {
        background: #2a2a2a;
        border: 1px solid #444;
        color: #888;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        white-space: nowrap;
    }
    .filter-tab.active {
        background: #00b9ec;
        color: white;
        border-color: #00b9ec;
    }
    .filter-tab:hover:not(.active) {
        background: #333;
        color: #ccc;
    }
    .table-actions-bar {
        margin-bottom: 15px;
    }
`;

// Selection Logic
function toggleSelectAll(e) {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        handleRowSelection(cb.value, isChecked);
    });
}

function handleRowSelection(id, forcedState = null) {
    const row = document.getElementById(`row-${id}`);
    const checkbox = row.querySelector('.row-checkbox');
    const isChecked = forcedState !== null ? forcedState : checkbox.checked;

    if (row) {
        if (isChecked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    }
}

// Report Generation
function handleGenerateReport() {
    // Get all selected IDs
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('Por favor selecciona al menos una venta para generar el reporte.');
        return;
    }

    const selectedIds = Array.from(checkboxes).map(cb => cb.value);

    // Filter sales data
    const selectedSales = ventas.filter(v => selectedIds.includes(v.id));

    // Save to localStorage
    localStorage.setItem('reportData', JSON.stringify(selectedSales));

    // Open report page
    window.open('/admin/report.html', '_blank');
}

// Expose functions
window.handleRowSelection = handleRowSelection;
window.toggleSelectAll = toggleSelectAll;
