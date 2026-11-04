import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "IN_TRANSIT", "DELIVERED"],
            default: "PENDING"
        },

        proof: {
            originalName: String,
            filename: String,
            path: String,
            mimetype: String,
            size: Number,
            uploadedAt: Date
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);