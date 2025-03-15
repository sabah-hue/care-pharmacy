import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controllers from './auth.controller.js'
import { logInSchema, signUpSchema, resetPassSchema } from "./auth.validation.js";
const router = Router()




router.post('/signUp', validation(signUpSchema), asyncHandler(controllers.signUp))
router.get('/confirmEmail/:token', asyncHandler(controllers.confirmEmail))
router.get("/unsupscripe/:token", asyncHandler(controllers.removeAccount))


router.post('/login', validation(logInSchema), asyncHandler(controllers.login))
router.get('/sendcode', asyncHandler(controllers.sendCode))
router.put('/resetPass', validation(resetPassSchema), asyncHandler(controllers.resetPassword))
export default router