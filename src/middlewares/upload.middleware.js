import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/app-error.js";

const uploadDirectories = {
    document: "uploads/documents",
    license: "uploads/licenses",
    proof: "uploads/proofs"
};

// Crear las carpetas automáticamente
Object.values(uploadDirectories).forEach((directory) => {
    fs.mkdirSync(directory, { recursive: true });
});

//TIPOS MIME PERMITIDOS
const allowedFiles = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".pdf": "application/pdf"
};

const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, req.uploadFolder);
    },

    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        callback(null, uniqueName);
    }
});

//VALIDACION DEL ARCHIVO
const fileFilter = (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const expectedMime = allowedFiles[extension];

    if (!expectedMime || expectedMime !== file.mimetype) {
        return callback(
            new AppError("Formato de archivo no permitido", 400)
        );
    }

    callback(null, true);
};

//CONFIGURACION GENERAL
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
});

export const uploadDocument = (req, res, next) => {
    req.uploadFolder = uploadDirectories.document;
    upload.single("file")(req, res, next);
};

export const uploadLicense = (req, res, next) => {
    req.uploadFolder = uploadDirectories.license;
    upload.single("file")(req, res, next);
};

export const uploadProof = (req, res, next) => {
    req.uploadFolder = uploadDirectories.proof;
    upload.single("file")(req, res, next);
};