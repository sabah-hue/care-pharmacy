import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


// add
export const addProductSchema = Joi.object({
    name: Joi.string().min(4).max(13).required(),
    description: Joi.string().min(15).max(13000).optional(),
    stock: Joi.number().integer().positive().optional(),
    price: Joi.number().positive().required(),
    discount: Joi.number().positive().optional(),
    categoryId: generalFields.id,
    file: Joi.object({
        mainImage: Joi.array().items(generalFields.file.required()).required(),
        subImages: Joi.array().items(generalFields.file.required()).optional(),
    }).required(),
    category: Joi.string()
    .valid('latest', 'popular', 'sale')
    .required(),

    bestSeller: Joi.boolean()
    .default(false),

}).required()

//updateProductSchema
export const updateProductSchema = Joi.object({
    name: Joi.string().min(4).max(13).optional(),
    description: Joi.string().min(15).max(13000).optional(),
    stock: Joi.number().integer().positive().optional(),
    price: Joi.number().positive().optional(),
    discount: Joi.number().positive().optional(),
    categoryId: generalFields.id,
    productId: generalFields.id,
    file: Joi.object({
        mainImage: Joi.array().items(generalFields.file.optional()).optional(),
        subImages: Joi.array().items(generalFields.file.optional()).optional(),
    }).optional(),
    category: Joi.string()
    .valid('latest', 'popular', 'sale')
    .optional(),

    bestSeller: Joi.boolean()
    .default(false),

}).required()

export const Headers = Joi.object({
    authorization: Joi.string().required(),

}).required()


export const deleteProductSchema = Joi.object({
    productId: generalFields.id
}).required();
