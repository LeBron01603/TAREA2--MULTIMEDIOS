// Middleware catch-all para rutas que no existen → 404
export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'La ruta solicitada no existe',
  });
};
