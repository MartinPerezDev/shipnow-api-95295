import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "FileManager API funcionando correctamente"
    });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Siempre después de las rutas
app.use(errorHandler);

export default app;