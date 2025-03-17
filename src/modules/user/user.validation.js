import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

// Get user schema
export const getUserSchema = Joi.object({
    userId: generalFields.id
}).required();

// Update user schema 
export const updateUserSchema = Joi.object({
    userId: generalFields.id,
    firstName: Joi.string().min(2).max(20).optional(),
    lastName: Joi.string().min(2).max(20).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9]{11}$/).optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female').optional(),
    street: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    file: generalFields.file.optional()
}).required();

// Delete user schema
export const deleteUserSchema = Joi.object({
    userId: generalFields.id
}).required();

// Change password schema
export const changePasswordSchema = Joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password

}).required();

// Headers schema
export const Headers = Joi.object({
    authorization: Joi.string().required()
}).required();
