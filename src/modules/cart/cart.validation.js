import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addToCartSchema = joi.object({
    productId: generalFields.id,
    quantity: joi.number().integer().min(1).required()
}).required()


export const removeFromCartSchema = joi.object({
    productIds: joi.array().items(generalFields.id).min(1).required()
}).required()