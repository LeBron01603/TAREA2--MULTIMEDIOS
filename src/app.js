import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mundialRoutes from './routes/mundial.routes.js';
import { notFound } from './middleware/notFound.middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Servir archivos estáticos desde /public
// Ejemplo: GET /imagenes/qatar-2022.jpg → public/imagenes/qatar-2022.jpg
app.use(express.static(join(__dirname, '..', 'public')));

// Rutas de la API
app.use('/', mundialRoutes);

// Middleware 404 — debe ir al final, después de todas las rutas
app.use(notFound);

export default app;
