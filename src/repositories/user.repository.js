import { User } from "../models/user.model.js";

export class UserRepository {

    async create(data) {
        return await User.create(data);
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async addDocument(userId, document) {
        return await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    documents: document
                }
            },
            {
                new: true
            }
        );
    }
}