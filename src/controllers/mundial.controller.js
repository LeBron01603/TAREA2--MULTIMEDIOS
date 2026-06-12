import { get, all } from '../../database/connection.js';
import { searchSchema } from '../schemas/mundial.schema.js';

// GET /
export const getInfo = (req, res) => {
  res.json({
    api: 'Copa Mundial FIFA',
    version: '1.0.0',
    descripcion: 'API REST con información sobre las ediciones de la Copa Mundial FIFA',
    rutas: [
      { metodo: 'GET', ruta: '/',                        descripcion: 'Información de la API' },
      { metodo: 'GET', ruta: '/mundiales',               descripcion: 'Lista resumida de mundiales' },
      { metodo: 'GET', ruta: '/mundiales?include=full',  descripcion: 'Lista completa de mundiales' },
      { metodo: 'GET', ruta: '/mundial/:slug',           descripcion: 'Mundial por slug' },
      { metodo: 'GET', ruta: '/campeon/:pais',           descripcion: 'Mundiales ganados por un país' },
      { metodo: 'GET', ruta: '/random',                  descripcion: 'Mundial aleatorio' },
      { metodo: 'GET', ruta: '/search/:text',            descripcion: 'Buscar mundiales por texto' },
      { metodo: 'GET', ruta: '/imagenes/*',              descripcion: 'Imágenes de los mundiales' },
    ],
  });
};

// GET /mundiales  y  GET /mundiales?include=full
export const getMundiales = async (req, res) => {
  try {
    const full = req.query.include === 'full';

    const sql = full
      ? 'SELECT * FROM mundiales ORDER BY anio ASC'
      : 'SELECT nombre, anio, sede, campeon, slug FROM mundiales ORDER BY anio ASC';

    const mundiales = await all(sql);
    res.json(mundiales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// GET /mundial/:slug
export const getMundialBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const mundial = await get('SELECT * FROM mundiales WHERE slug = ?', [slug]);

    if (!mundial) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No existe un mundial con ese slug',
      });
    }

    res.json(mundial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// GET /campeon/:pais  — búsqueda case-insensitive
export const getCampeon = async (req, res) => {
  try {
    const { pais } = req.params;

    const rows = await all(
      'SELECT slug FROM mundiales WHERE LOWER(campeon) = LOWER(?)',
      [pais]
    );

    res.json({
      pais,
      mundiales: rows.map((r) => r.slug),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// GET /random
export const getRandom = async (req, res) => {
  try {
    const mundial = await get('SELECT * FROM mundiales ORDER BY RANDOM() LIMIT 1');
    res.json(mundial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// GET /search/:text
export const searchMundiales = async (req, res) => {
  try {
    const { text } = req.params;

    // Validar con Zod
    const result = searchSchema.safeParse(text);
    if (!result.success) {
      const issue = result.error.issues[0];
      let message = 'El texto de búsqueda no es válido';

      if (issue.code === 'too_small') {
        message = 'El texto de búsqueda debe tener al menos 3 caracteres';
      } else if (issue.code === 'too_big') {
        message = 'El texto de búsqueda no puede superar los 50 caracteres';
      }

      return res.status(400).json({ error: 'Bad Request', message });
    }

    const term = `%${result.data}%`;
    const mundiales = await all(
      `SELECT * FROM mundiales
       WHERE nombre      LIKE ?
          OR sede        LIKE ?
          OR campeon     LIKE ?
          OR subcampeon  LIKE ?
          OR goleador    LIKE ?
          OR resumen     LIKE ?
          OR descripcion LIKE ?
       ORDER BY anio ASC`,
      Array(7).fill(term)
    );

    res.json(mundiales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
