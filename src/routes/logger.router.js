import { Router } from "express";
import logger from "../config/logger.js";

const router = Router();

router.get("/loggerTest", (req, res) => {
  logger.debug("log de prueba DEBUG");
  logger.http("Log de prueba HTTP");
  logger.info("Log de prueba INFO");
  logger.warning("Log de prueba WARNING");
  logger.error("Log de prueba ERROR");
  logger.fatal("Log de prueba FATAL");

  res.json({
    status: "success",
    message: "Logs generados correctamente",
  });
});

export default router;
