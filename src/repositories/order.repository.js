import { Order } from "../models/order.model.js";


class OrderRepository {

    async create(data) {
        return await Order.create(data);
    }


    async insertMany(data) {
        return await Order.insertMany(data);
    }


    async findAll() {
        return await Order.find();
    }


    async findById(id) {
        return await Order.findById(id);
    }
}


export default new OrderRepository();