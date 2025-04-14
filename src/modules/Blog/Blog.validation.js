import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const createBlogSchema = joi.object({
    title: joi.string().required().max(100).min(4),
    author: joi.string().required().max(50).min(2),
    excerpt: joi.string().required().min(10),
    file: generalFields.file.required()
}).required()

export const updateBlogSchema = joi.object({
    title: joi.string().max(100).min(4).optional(),
    author: joi.string().max(50).min(2).optional(),
    excerpt: joi.string().min(10).optional(),
    file: generalFields.file.optional(),
    blogId: generalFields.id
}).required()

export const deleteBlogSchema = joi.object({
    blogId: generalFields.id
}).required()
