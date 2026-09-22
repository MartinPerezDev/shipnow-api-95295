import mongoose from "mongoose";

import {
    DELIVERY_STATUS,
    DELIVERY_PRIORITY
} from "../utils/constants.js";


const deliverySchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: Object.values(DELIVERY_STATUS),
            default: DELIVERY_STATUS.ASSIGNED
        },

        priority: {
            type: String,
            enum: Object.values(DELIVERY_PRIORITY),
            default: DELIVERY_PRIORITY.NORMAL
        },

        notes: {
            type: String
        }
    },
    {
        timestamps: true
    }
);


export const Delivery = mongoose.model(
    "Delivery",
    deliverySchema
);