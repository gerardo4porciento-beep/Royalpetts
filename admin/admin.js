// Variables globales
// db se declara en firebase-config.js como window.db
let ventas = [];
let gastos = [];
let costos = [];
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let ventasUnsubscribe, gastosUnsubscribe, costosUnsubscribe;

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

        // 1. Costo de Venta (A la colección costos)
        if (costo > 0) {
            const costoData = {
                tipo: 'costo',
                fecha: formData.get('fecha'),
                descripcion: `Costo asociado a venta de ${venta.raza} (${docRef.id})`,
                monto: costo,
                ventaId: docRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await window.db.collection('costos').add(costoData);
            console.log('Costo de venta creado');
        }

        // 2. Comisión Socio (A la colección costos)
        if (esCompartida) {
            const gananciaBruta = totalVenta - costo;
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
    const totalVendidos = ventas.reduce((sum, v) => sum + v.cantidad, 0);
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);

    // Separar gastos reales de costos legacy (guardados como gastos)
    const trueGastos = gastos.filter(g => g.categoria !== 'Costo de Venta' && g.categoria !== 'Comisión Socio');
    const legacyCostos = gastos.filter(g => g.categoria === 'Costo de Venta' || g.categoria === 'Comisión Socio');

    const totalGastos = trueGastos.reduce((sum, g) => sum + g.total, 0);
    const totalCostos = costos.reduce((sum, c) => sum + c.monto, 0) +
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
    // Verificar si existe el elemento antes de actualizarlo (por si acaso caché viejo de HTML)
    if (document.getElementById('totalDisponible')) {
        document.getElementById('totalDisponible').textContent = `$${totalDisponible.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
    }
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
    if (!ctx) return;

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

// Consolidated Table Update
function updateTable() {
    const tbody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';

    // Determine current filter from active tab
    let activeTab = document.querySelector('.filter-tab.active');
    if (!activeTab) {
        // Default to 'all' if no active tab found
        activeTab = document.querySelector('.filter-tab[data-filter="all"]');
        if (activeTab) activeTab.classList.add('active');
    }
    currentFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

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

    // Render
    tbody.innerHTML = allData.map(item => {
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
            `;
            montoHtml = `$${amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
            mobileDetailHtml = `
                <p><strong>Raza:</strong> ${item.raza}</p>
                <p><strong>Cant:</strong> ${item.cantidad}</p>
                <p><strong>Precio:</strong> $${item.precio}</p>
                <p><strong>Total:</strong> $${amount}</p>
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
            <tr id="row-${item.id}">
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
                    <div class="mobile-detail-content">
                        ${mobileDetailHtml}
                        <div class="mobile-actions">
                             <button class="btn-delete" onclick="deleteItem('${item.id}', '${item.collection}')">Eliminar</button>
                             ${!item.isLegacy && item.dataType !== 'costo' ? `<button class="btn-edit" onclick="editItem('${item.id}', '${item.dataType}')">Editar</button>` : ''}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Legacy filter function removal as we handle it above
}

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
document.head.appendChild(style);
