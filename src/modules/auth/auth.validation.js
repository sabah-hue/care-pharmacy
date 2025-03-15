import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const signUpSchema = Joi.object({
    firstName: Joi.string().max(20).min(5).required().alphanum(),
    lastName: Joi.string().max(20).min(5).required().alphanum(),
    email: generalFields.email,
    password: generalFields.password,
    // cPass: generalFields.cPassword,
}).required()



export const logInSchema = Joi.object({
    email: generalFields.email,
    password: generalFields.password,
   
}).required()


export const resetPassSchema = Joi.object({
    email: generalFields.email,
    forgetCode: Joi.string().max(6).min(6).required(),
    newPassword: generalFields.password
   
}).required()

export const changePasswordSchema = Joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password
}).required()