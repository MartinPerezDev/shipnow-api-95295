import { Delivery } from "../models/delivery.model.js";


class DeliveryRepository {

    async create(data) {
        return await Delivery.create(data);
    }


    async insertMany(data) {
        return await Delivery.insertMany(data);
    }


    async findAll() {
        return await Delivery.find();
    }


    async findById(id) {
        return await Delivery.findById(id);
    }
}


export default new DeliveryRepository();