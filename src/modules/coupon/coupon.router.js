import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

import * as controllers from './coupon.controller.js'
import { endPoints } from "./coupon.endPoint.js";
import * as validators from "./coupon.validation.js";


router.post('/', auth(endPoints.CREAT_COUPON), validation(validators.createCouponSchema), asyncHandler(controllers.createCoupon))
router.put('/:couponId', auth(endPoints.UPDATE_COUPON), validation(validators.updateCouponSchema), asyncHandler(controllers.updateCoupon))
router.delete('/:couponId', auth(endPoints.DELETE_COUPON), validation(validators.deleteCouponSchema), asyncHandler(controllers.deleteCoupon))
router.get('/', auth(endPoints.GET_ALL_COUPONS), asyncHandler(controllers.getAllCoupons))
router.get('/:couponId', auth(endPoints.GET_QR_CODE), asyncHandler(controllers.getQRCode))

export default router