import express, { Application, Request, Response, NextFunction ,RequestHandler} from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from '@config/passport.js';
import authRoutes from '@routes/auth.js';
import mainRouter from '@routes/index.js';

import path from 'path';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const i18n = require('i18n');

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '/locales'),
  defaultLocale: 'es',
  queryParameter: 'lang',
  cookie: 'lang',
  autoReload: true,
  updateFiles: false,
  objectNotation: true,
});
app.use(cookieParser());
app.use(i18n.init as unknown as RequestHandler);


app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax' as const
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Middleware para detectar idioma desde la URL, cookie o encabezado
app.use((req: Request, res: Response, next: NextFunction) => {
  const lang = req.query.lang as string || req.cookies.locale || req.acceptsLanguages(['es', 'en']) || 'es';
  const validLocales = ['es', 'en'];
  const selectedLang = validLocales.includes(lang) ? lang : 'es';
  req.setLocale(selectedLang);

  if (req.cookies.locale !== selectedLang) {
    res.cookie('locale', selectedLang, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    });
  }

  next();
});

// ✅ Middleware para pasar i18n a las vistas
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.__ = res.__;
  res.locals.__n = res.__n;
  res.locals.locale = req.getLocale();
  res.locals.getLocale = () => req.getLocale();
  res.locals.t = (key: string, options?: any) => res.__(key, options);
  next();
});

// ✅ Archivos estáticos y body parsers
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Rutas
app.use('/', mainRouter);
app.use(authRoutes);

// ✅ Página 404
app.use((req: Request, res: Response) => {
  res.status(404).render('error', {
    title: '404 - ' + res.__('general.error'),
    message: res.__('general.error')
  });
});

// ✅ Manejador de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: res.__('general.error'),
    message: res.__('general.error'),
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.set('trust proxy', true);
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Archivos estáticos desde: ${publicDir}`);
});
