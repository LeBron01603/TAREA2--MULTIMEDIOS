import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const { verbose } = sqlite3;
const sqlite3v = verbose();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'mundiales.db');

// Abrir (o crear) la base de datos
const db = new sqlite3v.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  }
});

// Helper: ejecutar sentencias que modifican datos (INSERT, CREATE, etc.)
export const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

// Helper: obtener una sola fila
export const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

// Helper: obtener múltiples filas
export const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

// Helper: ejecutar múltiples sentencias SQL (CREATE TABLE, etc.)
export const exec = (sql) =>
  new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

export default db;
