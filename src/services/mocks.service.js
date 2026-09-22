import {
    generateMockUsers,
    generateMockDrivers
} from "../mocks/users.mock.js";

import {
    generateMockOrders
} from "../mocks/orders.mock.js";

import {
    generateMockDeliveries
} from "../mocks/deliveries.mock.js";


import userRepository
    from "../repositories/user.repository.js";

import orderRepository
    from "../repositories/order.repository.js";

import deliveryRepository
    from "../repositories/delivery.repository.js";


export const generateUsers = async (quantity) => {

    return generateMockUsers(quantity);
};


export const generateOrders = async (quantity) => {

    const users =
        generateMockUsers(quantity);

    return generateMockOrders(
        users.map(user => user._id),
        quantity
    );
};


export const generateData = async ({
    users = 0,
    drivers = 0,
    orders = 0,
    deliveries = 0
}) => {

    const result = {
        users: 0,
        drivers: 0,
        orders: 0,
        deliveries: 0
    };


    // --------------------------------
    // USUARIOS
    // --------------------------------

    let createdUsers = [];

    if (users > 0) {

        const mockUsers =
            generateMockUsers(users);

        createdUsers =
            await userRepository.insertMany(
                mockUsers
            );

        result.users =
            createdUsers.length;
    }


    // --------------------------------
    // REPARTIDORES
    // --------------------------------

    let createdDrivers = [];

    if (drivers > 0) {

        const mockDrivers =
            generateMockDrivers(drivers);

        createdDrivers =
            await userRepository.insertMany(
                mockDrivers
            );

        result.drivers =
            createdDrivers.length;
    }


    // --------------------------------
    // PEDIDOS
    // --------------------------------

    let createdOrders = [];

    if (
        orders > 0 &&
        createdUsers.length > 0
    ) {

        const customerIds =
            createdUsers.map(
                user => user._id
            );


        const mockOrders =
            generateMockOrders(
                customerIds,
                orders
            );


        createdOrders =
            await orderRepository.insertMany(
                mockOrders
            );


        result.orders =
            createdOrders.length;
    }


    // --------------------------------
    // ENTREGAS
    // --------------------------------

    if (
        deliveries > 0 &&
        createdOrders.length > 0 &&
        createdDrivers.length > 0
    ) {

        const mockDeliveries =
            generateMockDeliveries(
                createdOrders,
                createdDrivers,
                deliveries
            );


        const createdDeliveries =
            await deliveryRepository.insertMany(
                mockDeliveries
            );


        result.deliveries =
            createdDeliveries.length;
    }


    return result;
};