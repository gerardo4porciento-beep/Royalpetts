// Datos almacenados en localStorage
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated) {
        showDashboard();
    } else {
        showLogin();
    }
    
    setupEventListeners();
    if (isAuthenticated) {
        loadDashboard();
    }
});

// Event Listeners
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Modals
    document.getElementById('btnCargarVenta').addEventListener('click', () => openModal('ventaModal'));
    document.getElementById('btnCargarGasto').addEventListener('click', () => openModal('gastoModal'));
    
    // Forms
    document.getElementById('ventaForm').addEventListener('submit', handleVentaSubmit);
    document.getElementById('gastoForm').addEventListener('submit', handleGastoSubmit);
    
    // Filters
    document.getElementById('filterType').addEventListener('change', filterTable);
    document.getElementById('searchInput').addEventListener('input', filterTable);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Credenciales simples (en producción usar autenticación real)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        isAuthenticated = true;
        showDashboard();
        loadDashboard();
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function handleLogout() {
    localStorage.setItem('isAuthenticated', 'false');
    isAuthenticated = false;
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

// Ventas
function handleVentaSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const venta = {
        id: Date.now(),
        tipo: 'venta',
        fecha: formData.get('fecha'),
        raza: formData.get('raza'),
        cantidad: parseInt(formData.get('cantidad')),
        precio: parseFloat(formData.get('precio')),
        descripcion: formData.get('descripcion') || '',
        total: parseFloat(formData.get('cantidad')) * parseFloat(formData.get('precio'))
    };
    
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    
    closeModal('ventaModal');
    loadDashboard();
}

// Gastos
function handleGastoSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const gasto = {
        id: Date.now(),
        tipo: 'gasto',
        fecha: formData.get('fecha'),
        categoria: formData.get('categoria'),
        monto: parseFloat(formData.get('monto')),
        descripcion: formData.get('descripcion'),
        total: parseFloat(formData.get('monto'))
    };
    
    gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    
    closeModal('gastoModal');
    loadDashboard();
}

// Dashboard
function loadDashboard() {
    updateStats();
    updateCharts();
    updateTable();
}

function updateStats() {
    const totalVendidos = ventas.reduce((sum, v) => sum + v.cantidad, 0);
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.total, 0);
    const gananciaNeta = totalVentas - totalGastos;
    
    document.getElementById('totalVendidos').textContent = totalVendidos;
    document.getElementById('totalVentas').textContent = `$${totalVentas.toLocaleString('es-VE', {minimumFractionDigits: 2})}`;
    document.getElementById('totalGastos').textContent = `$${totalGastos.toLocaleString('es-VE', {minimumFractionDigits: 2})}`;
    document.getElementById('gananciaNeta').textContent = `$${gananciaNeta.toLocaleString('es-VE', {minimumFractionDigits: 2})}`;
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
        ...ventas.map(v => ({...v, tipo: 'venta'})),
        ...gastos.map(g => ({...g, tipo: 'gasto'}))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    tbody.innerHTML = allData.map(item => {
        if (item.tipo === 'venta') {
            return `
                <tr>
                    <td>${formatDate(item.fecha)}</td>
                    <td><span class="badge-venta">Venta</span></td>
                    <td>${item.descripcion || '-'}</td>
                    <td>${item.raza}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precio.toLocaleString('es-VE', {minimumFractionDigits: 2})}</td>
                    <td>$${item.total.toLocaleString('es-VE', {minimumFractionDigits: 2})}</td>
                    <td>
                        <button class="btn-edit" onclick="editItem(${item.id}, 'venta')">Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${item.id}, 'venta')">Eliminar</button>
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
                    <td>$${item.total.toLocaleString('es-VE', {minimumFractionDigits: 2})}</td>
                    <td>
                        <button class="btn-edit" onclick="editItem(${item.id}, 'gasto')">Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${item.id}, 'gasto')">Eliminar</button>
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

function deleteItem(id, tipo) {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
        if (tipo === 'venta') {
            ventas = ventas.filter(v => v.id !== id);
            localStorage.setItem('ventas', JSON.stringify(ventas));
        } else {
            gastos = gastos.filter(g => g.id !== id);
            localStorage.setItem('gastos', JSON.stringify(gastos));
        }
        loadDashboard();
    }
}

function editItem(id, tipo) {
    let item;
    if (tipo === 'venta') {
        item = ventas.find(v => v.id === id);
        if (item) {
            document.getElementById('ventaFecha').value = item.fecha;
            document.getElementById('ventaRaza').value = item.raza;
            document.getElementById('ventaCantidad').value = item.cantidad;
            document.getElementById('ventaPrecio').value = item.precio;
            document.getElementById('ventaDescripcion').value = item.descripcion;
            openModal('ventaModal');
            // Modificar el submit para actualizar en lugar de crear
            const form = document.getElementById('ventaForm');
            form.onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                Object.assign(item, {
                    fecha: formData.get('fecha'),
                    raza: formData.get('raza'),
                    cantidad: parseInt(formData.get('cantidad')),
                    precio: parseFloat(formData.get('precio')),
                    descripcion: formData.get('descripcion') || '',
                    total: parseFloat(formData.get('cantidad')) * parseFloat(formData.get('precio'))
                });
                localStorage.setItem('ventas', JSON.stringify(ventas));
                closeModal('ventaModal');
                loadDashboard();
                form.onsubmit = handleVentaSubmit;
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
            form.onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                Object.assign(item, {
                    fecha: formData.get('fecha'),
                    categoria: formData.get('categoria'),
                    monto: parseFloat(formData.get('monto')),
                    descripcion: formData.get('descripcion'),
                    total: parseFloat(formData.get('monto'))
                });
                localStorage.setItem('gastos', JSON.stringify(gastos));
                closeModal('gastoModal');
                loadDashboard();
                form.onsubmit = handleGastoSubmit;
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

