
import Joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const createCategorySchema = Joi.object({
    name: Joi.string().required().max(30).min(4),
    file: generalFields.file.required(),
}).required()


export const updateCategorySchema = Joi.object({
    name: Joi.string().required().max(30).min(4).optional(),
    file: generalFields.file.optional(),
    categoryId: Joi.string().required(),
}).required()

export const getCategorySchema = Joi.object({
    categoryId: Joi.string().required()
}).required()


export const deleteCategorySchema = Joi.object({
    categoryId: Joi.string().required()
}).required()
