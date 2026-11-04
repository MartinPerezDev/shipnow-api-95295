import path from "path";
import { fileTypeFromFile } from "file-type";

import { UserRepository } from "../repositories/user.repository.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/app-error.js";
import { deleteUploadedFile } from "../utils/file-helper.js";

const userRepository = new UserRepository();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
];

export class UserService {

    async createUser(data) {
        const existingUser = await userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new AppError("El email ya está registrado", 409);
        }

        return await userRepository.create(data);
    }

    async getUser(id) {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new AppError("Usuario no encontrado", 404);
        }

        return user;
    }

    async uploadDocument(userId, file) {
        try {
            if (!file) {
                throw new AppError("No se recibió ningún archivo", 400);
            }

            const user = await userRepository.findById(userId);

            if (!user) {
                throw new AppError("Usuario no encontrado", 404);
            }

            // Verificar el contenido real del archivo
            const fileType = await fileTypeFromFile(file.path);

            if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
                throw new AppError(
                    "El contenido del archivo no corresponde a un formato permitido",
                    400
                );
            }

            const document = {
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                mimetype: fileType.mime,
                size: file.size,
                uploadedAt: new Date()
            };

            const updatedUser = await userRepository.addDocument(
                userId,
                document
            );

            logger.info({
                message: "Documento cargado correctamente",
                userId,
                filename: file.filename,
                originalName: file.originalname,
                size: file.size
            });

            return updatedUser;

        } catch (error) {
            // Si la operación falla, eliminamos el archivo físico
            await deleteUploadedFile(file);
            throw error;
        }
    }
}