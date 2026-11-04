import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);

        res.status(201).json({
            status: "success",
            message: "Pedido creado correctamente",
            payload: order
        });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrder(req.params.id);

        res.status(200).json({
            status: "success",
            payload: order
        });
    } catch (error) {
        next(error);
    }
};

export const uploadOrderProof = async (req, res, next) => {
    try {
        const order = await orderService.uploadProof(
            req.params.id,
            req.file
        );

        res.status(201).json({
            status: "success",
            message: "Comprobante de entrega registrado",
            payload: order
        });
    } catch (error) {
        next(error);
    }
};