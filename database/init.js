import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { run, exec } from './connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer el DDL
const createSQL = readFileSync(join(__dirname, 'CREATE.SQL'), 'utf-8');

// Leer los datos
const mundiales = JSON.parse(
  readFileSync(join(__dirname, '..', 'data', 'mundiales.json'), 'utf-8')
);

const INSERT_SQL = `
  INSERT OR IGNORE INTO mundiales
  (nombre, anio, sede, campeon, subcampeon, goleador, equipos, imagen, slug, resumen, descripcion)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

async function seed() {
  console.log('Inicializando base de datos...');

  // Crear tabla si no existe
  await exec(createSQL);
  console.log('✔ Tabla "mundiales" lista.');

  // Insertar cada mundial (OR IGNORE para que sea idempotente)
  for (const m of mundiales) {
    await run(INSERT_SQL, [
      m.nombre,
      m.anio,
      m.sede,
      m.campeon,
      m.subcampeon,
      m.goleador,
      m.equipos,
      m.imagen,
      m.slug,
      m.resumen,
      m.descripcion,
    ]);
    console.log(`  ✔ ${m.nombre}`);
  }

  console.log('\nSeed completado. Base de datos lista.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});
