import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createReviewSchema = Joi.object({
    productId: generalFields.id,
    comment: Joi.string().min(4).max(1000).required(),
    rate: Joi.number().integer().min(1).max(5).required(),
}).required()


export const updateReviewSchema = Joi.object({
    productId: generalFields.id,
    reviewId: generalFields.id,
    comment: Joi.string().min(10).max(1000).optional(),
    rate: Joi.number().integer().min(1).max(5).optional(),
}).required()

export const deleteReviewSchema = Joi.object({
    productId: generalFields.id,
    reviewId: generalFields.id,
}).required()