import {
    ORDER_STATUS,
    DELIVERY_PRIORITY
} from "../utils/constants.js";


export const generateMockOrder = (
    customerId,
    index
) => {

    const items = [
        {
            name: `Paquete ${index}`,
            quantity: 1,
            price: 1500
        }
    ];


    const total = items.reduce(
        (acc, item) =>
            acc + item.quantity * item.price,
        0
    );


    return {
        customer: customerId,

        items,

        deliveryAddress:
            `Av. Siempre Viva ${100 + index}`,

        total,

        status: ORDER_STATUS.CREATED,

        priority: DELIVERY_PRIORITY.NORMAL
    };
};


export const generateMockOrders = (
    customerIds,
    quantity
) => {

    const orders = [];


    for (let i = 0; i < quantity; i++) {

        const customerId =
            customerIds[i % customerIds.length];


        orders.push(
            generateMockOrder(
                customerId,
                i + 1
            )
        );
    }


    return orders;
};