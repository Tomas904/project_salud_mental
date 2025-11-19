// NO-OP middlewares (permiten todas las peticiones)
const noop = (req, _res, next) => next();

// Exportar no-ops en lugar de los limiters reales
module.exports = {
  limiter: noop,
  authLimiter: noop
};