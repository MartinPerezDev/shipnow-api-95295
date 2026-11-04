import multer from "multer";
import mongoose from "mongoose";

import { logger } from "../utils/logger.js";

export const errorHandler = (error, req, res, next) => {

    let statusCode = error.statusCode || 500;
    let message = error.message || "Error interno del servidor";

    if (error instanceof multer.MulterError) {
        statusCode = 400;

        if (error.code === "LIMIT_FILE_SIZE") {
            message = "El archivo supera el tamaño máximo de 5 MB";
        } else {
            message = error.message;
        }
    }

    if (error instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = "El identificador proporcionado no es válido";
    }

    if (error.code === 11000) {
        statusCode = 409;
        message = "El email ya está registrado";
    }

    logger.error({
        message: error.message,
        method: req.method,
        url: req.originalUrl,
        statusCode,
        stack: error.stack
    });

    res.status(statusCode).json({
        status: "error",
        message: statusCode === 500
            ? "Error interno del servidor"
            : message
    });
};