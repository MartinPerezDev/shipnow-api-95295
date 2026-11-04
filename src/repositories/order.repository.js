import { Order } from "../models/order.model.js";

export class OrderRepository {

    async create(data) {
        return await Order.create(data);
    }

    async findById(id) {
        return await Order.findById(id).populate("user");
    }

    async addProof(orderId, proof) {
        return await Order.findByIdAndUpdate(
            orderId,
            {
                proof,
                status: "DELIVERED"
            },
            {
                new: true
            }
        );
    }
}