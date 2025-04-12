import joi from 'joi';
import { generalFields } from "../../middleware/validation.js";

export const createDonationSchema = joi.object({
        description: joi.string().required(),
        amount: joi.number().positive().required()
}).required();

export const updateDonationSchema = joi.object({
        id: generalFields.id,
        description: joi.string().required(),
        amount: joi.number().positive().required(),
        status: joi.string().valid('open', 'closed')
    }).required();

export const idParamSchema = joi.object({
        id: generalFields.id
    }).required();

export const donateByStripeSchema = joi.object({
        amount: joi.number().positive().required(),
        email: generalFields.email,
        donateId: joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
                'string.pattern.base': 'Invalid donation ID format'
            }),
    }).required();
