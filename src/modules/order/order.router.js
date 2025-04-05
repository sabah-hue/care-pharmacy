import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import * as controllers from './order.controller.js'
import { endPoints } from "./order.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { cancelOrder, createOrder } from "./order.validation.js";

const router = Router()

router.post('/', auth(endPoints.CREAT_ORDER), validation(createOrder), asyncHandler(controllers.createOrder))
router.patch('/:orderId', auth(endPoints.CACNCEL_ORDER), validation(cancelOrder), asyncHandler(controllers.cancelOrder))
router.get('/', auth(endPoints.GET_ORDERS), asyncHandler(controllers.getAllOrders));
router.put('/:orderId', auth(endPoints.UPDATE_ORDER), asyncHandler(controllers.updateOrderStatus))

export default router