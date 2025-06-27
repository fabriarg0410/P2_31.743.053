document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const estado = document.getElementById('estadoSelect');
  const servicio = document.getElementById('servicioSelect');
  const fechaInicio = document.getElementById('fechaInicio');
  const fechaFin = document.getElementById('fechaFin');
  const container = document.getElementById('contactsContainer');

  const fetchAndRender = async () => {
  const query = input.value.trim();
  const estadoVal = estado.value;
  const servicioVal = servicio.value;
  const fechaInicioVal = fechaInicio.value;
  const fechaFinVal = fechaFin.value;

  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (estadoVal) params.append('estado', estadoVal);
  if (servicioVal) params.append('servicio', servicioVal);
  if (fechaInicioVal) params.append('fechaInicio', fechaInicioVal);
  if (fechaFinVal) params.append('fechaFin', fechaFinVal);

  try {
    const res = await fetch(`/filterPayment?${params.toString()}`);
    const data = await res.json();

    if (!data.status || data.filterResult.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 my-6">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <p>No hay registros</p>
        </div>`;
      return;
    }

    const pagosHTML = data.filterResult.map((payment, index) => {
      const fecha = new Date(payment.createdAt);
      const fechaStr = fecha.toLocaleDateString();
      const horaStr = fecha.toLocaleTimeString();
      const ultimos4 = payment.cardNumber.slice(-4);
      const icono =
        payment.cardNumber.startsWith("4") ? '<i class="fab fa-cc-visa"></i> Visa' :
        payment.cardNumber.startsWith("5") ? '<i class="fab fa-cc-mastercard"></i> Mastercard' :
        payment.cardNumber.startsWith("3") ? '<i class="fab fa-cc-amex"></i> Amex' :
        '<i class="fas fa-credit-card"></i> Tarjeta';

      const moneda = payment.currency === 'USD' ? '$ USD' :
                     payment.currency === 'EUR' ? '€ EUR' :
                     payment.currency === 'GBP' ? '£ GBP' : payment.currency;

      return `
<div class="bg-white rounded-xl shadow-md p-6 mb-6 overflow-hidden border border-gray-200 animate-fadeIn" style="animation-delay: ${index * 0.1}s">
  <!-- Header -->
  <div class="flex items-center justify-between pb-4 border-b border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800">${payment.nombreTitular}</h3>
    <span class="text-2xl">${icono}</span>
  </div>

  <!-- Body -->
  <div class="py-4 space-y-3">
    <!-- Correo -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Correo:</span>
      <span class="w-2/3 break-words text-gray-800">${payment.correo}</span>
    </div>
    
    <!-- Tarjeta -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Tarjeta:</span>
      <span class="w-2/3 break-words font-mono">•••• •••• •••• ${ultimos4}</span>
    </div>
    
    <!-- Expira -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Expira:</span>
      <span class="w-2/3 break-words">${payment.expMonth}/${payment.expYear.toString().slice(-2)}</span>
    </div>
    
    <!-- Moneda -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Moneda:</span>
      <span class="w-2/3 break-words">${moneda}</span>
    </div>
    
    <!-- Monto -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Monto:</span>
      <span class="w-2/3 break-words">${payment.amount}</span>
    </div>
    
    <!-- Descripción -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Descripción:</span>
      <span class="w-2/3 break-words">${payment.descripcion}</span>
    </div>
    
    <!-- Referencia -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Referencia:</span>
      <span class="w-2/3 break-words">${payment.reference}</span>
    </div>
    
    <!-- Estado -->
    <div class="flex flex-wrap items-start">
      <span class="w-1/3 font-medium text-gray-600">Estado:</span>
      <span class="w-2/3 break-words uppercase font-bold ${
        payment.estado === 'aprobado'
          ? 'text-green-600'
          : payment.estado === 'rechazado'
          ? 'text-red-600'
          : 'text-yellow-500'
      }">${payment.estado}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 text-gray-500 text-sm gap-2">
    <div class="flex items-center gap-1">
      <i class="far fa-calendar-alt"></i>
      <span>${fechaStr}</span>
    </div>
    <div class="flex items-center gap-1">
      <i class="far fa-clock"></i>
      <span>${horaStr}</span>
    </div>
  </div>
</div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="payments-container">
        <div class="payments-header">
          <h1 class="payments-title"><i class="fas fa-credit-card"></i> Registros de Pagos</h1>
          <div class="payments-count">Total: ${data.filterResult.length}</div>
        </div>
        <div class="payments-grid">${pagosHTML}</div>
      </div>
    `;
  } catch (err) {
    console.error('Error al filtrar:', err);
    container.innerHTML = `<p>Error al cargar resultados.</p>`;
  }
};


  [input, estado, servicio, fechaInicio, fechaFin].forEach(el => el.addEventListener('input', fetchAndRender));
});
