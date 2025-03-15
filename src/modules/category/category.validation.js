


import joi from "joi"
import { generalFields } from "../../middleware/validation.js"
export const createCategorySchema = joi.object({
    name: joi.string().required().max(30).min(4),
    file: generalFields.file.required()
}).required()


export const updateCategorySchema = joi.object({
    name: joi.string().required().max(30).min(4).optional(),
    file: generalFields.file.optional(),
    categoryId: joi.string().required()
}).required()

export const getCategorySchema = joi.object({
    categoryId: joi.string().required()
}).required()


export const deleteCategorySchema = joi.object({
    categoryId: joi.string().required()
}).required()
