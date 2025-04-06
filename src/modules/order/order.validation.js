import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";




export const createOrder = Joi.object({

    address: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{11}$/).required(),
    couponCode: Joi.string().optional(),
    products: Joi.array().items(
        Joi.object({
            productId: generalFields.id,
            quantity: Joi.number().integer().positive().required(),
            name: Joi.string().required(),
            productPrice: Joi.number().positive().required(),
            finalPrice: Joi.number().positive().required(),
        }).required()
    ).optional(),
    paymentMethod: Joi.string().valid('cash', 'card').required()
}).required()


export const cancelOrder = Joi.object({

    reason: Joi.string().required(),
    orderId: generalFields.id,

}).required()

export const updateOrderStatus = Joi.object({
    orderId: generalFields.id,
    status: Joi.string().valid('pending', 'deliverd', 'on way').required()
}).required()