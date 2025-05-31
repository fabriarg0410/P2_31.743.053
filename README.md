🌍 Geolocalización con ipstack
Implementamos identificación del país del usuario mediante API de ipstack:

typescript
// Ejemplo en controlador
const userIP = req.ip;
const countryData = await ipstackService.getCountry(userIP);
// Guardamos countryData.country_name en BD
Características:

Detección automática de país basado en IP del usuario

Almacenamiento en base de datos junto con datos de contacto

Soporte para direcciones IPv4 e IPv6

Configuración:

Regístrate en ipstack.com

Obtén tu API Key gratuita

Agrega al .env: IPSTACK_API_KEY=tu_api_key

📊 Google Analytics
Integramos seguimiento de usuarios y eventos:

html
<!-- En layout principal -->
<script>
  gtag('event', 'purchase', {
    transaction_id: 'TXN_12345',
    value: 49.99,
    currency: 'USD'
  });
</script>
Eventos rastreados:

Envío de formulario de contacto

Inicio de proceso de pago

Transacción completada

Errores en formularios

🔒 Protección con reCAPTCHA v2
Implementamos verificación en dos pasos:

Frontend:

html
<div class="g-recaptcha" data-sitekey="<%= process.env.RECAPTCHA_SITE_KEY %>"></div>
Backend:

typescript
// Middleware de validación
const isValid = await recaptcha.verify(req.body['g-recaptcha-response']);
if (!isValid) throw new Error('Verificación reCAPTCHA fallida');
✉️ Notificaciones por Email
Configuramos alertas automáticas:

Contenido del correo:

Nuevo contacto recibido:
Nombre: Juan Pérez
Email: juan@ejemplo.com
IP: 192.168.1.100
País: Argentina
Mensaje: Consulta sobre productos...
Destinatarios:

programacion2ais@yopmail.com

Otras direcciones configuradas

💳 Pasarela de Pagos con FakePayment
Integramos API para simulaciones de transacciones:

typescript
// Procesamiento de pago
const paymentResult = await paymentService.process({
  amount: 100,
  cardNumber: '4242424242424242'
});
Características:

Simulación de transacciones con tarjetas de prueba

Generación de IDs de transacción únicos

Manejo de diferentes monedas (USD, EUR, etc)

🔐 Gestión de Seguridad
Implementamos protección de credenciales:

.env:

env
RECAPTCHA_SECRET_KEY=6Le...
FAKEPAYMENT_API_KEY=eyJhbG...
IPSTACK_API_KEY=abc123...
EMAIL_PASS=app_password_gmail