import { z } from 'zod';

// Schema de validación para el parámetro :text de /search/:text
export const searchSchema = z
  .string()
  .trim()
  .min(3, 'El texto de búsqueda debe tener al menos 3 caracteres')
  .max(50, 'El texto de búsqueda no puede superar los 50 caracteres');
