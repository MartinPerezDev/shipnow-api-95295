import { fileTypeFromFile } from "file-type";

import { OrderRepository } from "../repositories/order.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/app-error.js";
import { deleteUploadedFile } from "../utils/file-helper.js";

const orderRepository = new OrderRepository();
const userRepository = new UserRepository();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
];

export class OrderService {

    async createOrder(data) {
        const user = await userRepository.findById(data.user);

        if (!user) {
            throw new AppError("El usuario asociado no existe", 404);
        }

        return await orderRepository.create(data);
    }

    async getOrder(id) {
        const order = await orderRepository.findById(id);

        if (!order) {
            throw new AppError("Pedido no encontrado", 404);
        }

        return order;
    }

    async uploadProof(orderId, file) {
        try {
            if (!file) {
                throw new AppError("No se recibió ningún comprobante", 400);
            }

            const order = await orderRepository.findById(orderId);

            if (!order) {
                throw new AppError("Pedido no encontrado", 404);
            }

            if (order.status === "DELIVERED") {
                throw new AppError("El pedido ya fue entregado", 409);
            }

            const fileType = await fileTypeFromFile(file.path);

            if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
                throw new AppError(
                    "El contenido del archivo no corresponde a un formato permitido",
                    400
                );
            }

            const proof = {
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                mimetype: fileType.mime,
                size: file.size,
                uploadedAt: new Date()
            };

            const updatedOrder = await orderRepository.addProof(
                orderId,
                proof
            );

            logger.info({
                message: "Comprobante de entrega cargado correctamente",
                orderId,
                filename: file.filename,
                originalName: file.originalname
            });

            return updatedOrder;

        } catch (error) {
            await deleteUploadedFile(file);
            throw error;
        }
    }
}