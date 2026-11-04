import { Router } from "express";

import {
    createUser,
    getUser,
    uploadUserDocument
} from "../controllers/user.controller.js";

import {
    uploadDocument
} from "../middlewares/upload.middleware.js";

const router = Router();
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Perez
 *               email:
 *                 type: string
 *                 example: juan@gmail.com
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */

/**
 * @swagger
 * /api/users/{id}/documents:
 *   post:
 *     summary: Subir un documento de usuario
 *     tags: [Users]
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
 *         description: Documento cargado correctamente
 */
router.post("/", createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Consultar un usuario y sus documentos
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", getUser);

router.post(
    "/:id/documents",
    uploadDocument,
    uploadUserDocument
);

export default router;