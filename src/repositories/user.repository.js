import { User } from "../models/user.model.js";


class UserRepository {

    async create(data) {
        return await User.create(data);
    }


    async insertMany(data) {
        return await User.insertMany(data);
    }


    async findAll() {
        return await User.find();
    }


    async findById(id) {
        return await User.findById(id);
    }
}


export default new UserRepository();