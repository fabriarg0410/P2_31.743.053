// ------------ 📧 1. Nodemailer (Envío de correos) ------------ 
// Archivo: src/utils/emailSender.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// 1. Crear transporter (objeto que envía emails)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo
    pass: process.env.EMAIL_PASS  // Contraseña de aplicación (no la personal)
  }
});

// 2. Función para enviar a múltiples destinatarios
export const enviarCorreo = async (
  destinatarios: string[], 
  asunto: string, 
  contenidoHTML: string
) => {
  const info = await transporter.sendMail({
    from: `"Mi App" <${process.env.EMAIL_USER}>`,
    to: destinatarios.join(', '),  // Convierte array a "a@x.com, b@y.com"
    subject: asunto,
    html: contenidoHTML
  });
  return info.messageId; // ID único del email enviado
};

/* USO:
await enviarCorreo(
  ['cliente1@mail.com', 'admin@negocio.com'],
  '¡Compra exitosa!',
  `<h1>Gracias por tu compra</h1><p>Detalles: ...</p>`
);
*/

// ------------ 💳 2. fakePayment API (Pagos simulados) ------------ 
// Archivo: src/services/pagoService.ts
import axios from 'axios';

// Simula procesamiento de tarjeta de crédito
export const procesarPago = async (datosTarjeta: {
  numero: string;
  vencimiento: string;
  cvv: string;
  monto: number;
}) => {
  const respuesta = await axios.post(
    'https://fakepayment.onrender.com/payments',
    {
      ...datosTarjeta,
      referencia: `pago_${Date.now()}` // ID único
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY_PAGOS}`, // API Key secreta
        'Content-Type': 'application/json'
      }
    }
  );
  return respuesta.data; // { éxito: true, id: "txn_123" }
};

/* USO EN RUTA:
router.post('/pagar', async (req, res) => {
  const resultado = await procesarPago(req.body);
  res.json(resultado);
});
*/

// ------------ 📊 3. Google Analytics (Seguimiento web) ------------ 
// En tus vistas EJS/HTML (ej: views/layout.ejs):
`
<!-- HEAD del HTML -->
<script async src="https://www.googletagmanager.com/gtag/js?id=<%= process.env.ID_ANALYTICS %>"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', '<%= process.env.ID_ANALYTICS %>'); // Configuración inicial

  // Ejemplo: Registrar evento de compra
  function registrarCompra(monto) {
    gtag('event', 'purchase', {
      transaction_id: 'TXN_<%= Date.now() %>',
      value: monto,
      currency: 'USD'
    });
  }
</script>
`

// ------------ 🔒 4. reCAPTCHA v2 (Protección anti-bots) ------------ 
// Middleware: src/middlewares/captcha.ts
import axios from 'axios';

export const validarCaptcha = async (token: string) => {
  const { data } = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null, // Sin body
    {
      params: {
        secret: process.env.CLAVE_SECRETA_CAPTCHA,
        response: token
      }
    }
  );
  return data.success; // true = humano, false = bot
};

/* USO EN RUTA:
router.post('/comentarios', async (req, res) => {
  if (!(await validarCaptcha(req.body.captchaToken))) {
    return res.status(400).json({ error: "¡Captcha inválido!" });
  }
  // ...procesar comentario
});
*/

// Frontend (HTML):
`
<form>
  <div class="g-recaptcha" data-sitekey="<%= process.env.CLAVE_SITIO_CAPTCHA %>"></div>
  <button>Enviar</button>
</form>
<script src="https://www.google.com/recaptcha/api.js"></script>
`

// ------------ 🔑 5. Variables de Entorno (.env) ------------ 
EMAIL_USER=tuapp@gmail.com
EMAIL_PASS=abcdefghijklmnop  # Contraseña de aplicación (Google)
API_KEY_PAGOS=eyJhbGciOiJI...  # Key de fakePayment API
CLAVE_SITIO_CAPTCHA=6LeTV1ErAAAAAF...  # Frontend (visible)
CLAVE_SECRETA_CAPTCHA=6LeTV1ErAAAAAHpX... # Backend (oculta)