import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import mocksRouter from "./routes/mocks.router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

import loggerRouter from "./routes/logger.router.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "API funcionando"
  });
});
app.use("/", loggerRouter);
app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//middleware de rutas no encontradas
app.use(notFoundHandler);

//middleware global de errores
app.use(errorHandler);

export default app;
