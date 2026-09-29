import { userService } from '../service/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    //res.json({ status: 'success', payload: users });
    successResponse(res, { message: 'Lista de usuarios', payload: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.uid);
    //res.json({ status: 'success', payload: user });
    successResponse(res, { message: 'Usuario obtenido por id', payload: user });
  } catch (error) {
    //res.status(500).json({ status: 'error', message: error.message, code: error.code });
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    //res.status(201).json({ status: 'success', payload: user });
    successResponse(res, { statusCode: 201, message: 'Usuario creado', payload: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.uid, req.body);
    //res.json({ status: 'success', payload: user });
    successResponse(res, { message: 'Usuario actualizado por id', payload: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.uid);
    //res.json({ status: 'success', payload: user });
    successResponse(res, { message: 'Usuario eliminado por id', payload: user });
  } catch (error) {
    next(error);
  }
};
