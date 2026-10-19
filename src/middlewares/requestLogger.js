import logger from "../config/logger.js";

export function requestLogger(req, res, next) {
  logger.http(`${req.method} ${req.path}`);
  next();
}
