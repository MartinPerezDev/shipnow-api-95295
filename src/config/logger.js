import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
};

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "debug",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),

    transports: [
        // Mostrar logs en la terminal
        new winston.transports.Console(),

        // Archivo general con rotación diaria
        new DailyRotateFile({
            filename: "src/logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d"
        }),

        // Archivo solamente para errores
        new DailyRotateFile({
            filename: "src/logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "14d"
        })
    ]
});

export default logger;
