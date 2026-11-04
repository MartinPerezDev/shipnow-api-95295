import { UserService } from "../services/user.service.js";

const userService = new UserService();

export const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            status: "success",
            message: "Usuario creado correctamente",
            payload: user
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.id);

        res.status(200).json({
            status: "success",
            payload: user
        });
    } catch (error) {
        next(error);
    }
};

export const uploadUserDocument = async (req, res, next) => {
    try {
        const user = await userService.uploadDocument(
            req.params.id,
            req.file
        );

        res.status(201).json({
            status: "success",
            message: "Documento subido correctamente",
            payload: user
        });
    } catch (error) {
        next(error);
    }
};