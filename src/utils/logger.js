import winston from "winston";
import fs from "fs";

fs.mkdirSync("logs", { recursive: true });

export const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: "logs/errors.log",
            level: "error"
        }),

        new winston.transports.File({
            filename: "logs/combined.log"
        })
    ]
});