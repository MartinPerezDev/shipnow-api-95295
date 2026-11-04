import { Router } from "express";

import {
    createOrder,
    getOrder,
    uploadOrderProof
} from "../controllers/order.controller.js";

import {
    uploadProof
} from "../middlewares/upload.middleware.js";

const router = Router();
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear un pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - user
 *             properties:
 *               description:
 *                 type: string
 *                 example: Entrega de paquete
 *               user:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Pedido creado
 */

/**
 * @swagger
 * /api/orders/{id}/proof:
 *   post:
 *     summary: Subir comprobante de entrega
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comprobante registrado
 */
router.post("/", createOrder);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Consultar un pedido y su comprobante
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/:id", getOrder);

router.post(
    "/:id/proof",
    uploadProof,
    uploadOrderProof
);

export default router;