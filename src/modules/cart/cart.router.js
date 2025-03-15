import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { addToCart, getCart, removeFromCart, clearCart } from "./cart.controller.js";
import { addToCartSchema, removeFromCartSchema } from "./cart.validation.js";
import { endPoints } from "./cart.endPoint.js";

const router = Router()

router.post('/', 
    auth(endPoints.ADD_CART), 
    validation(addToCartSchema), 
    asyncHandler(addToCart)
)

router.get('/',
    auth(endPoints.GET_CART),
    asyncHandler(getCart)
)


router.delete('/',
    auth(endPoints.REMOVE_CART),
    validation(removeFromCartSchema),
    asyncHandler(removeFromCart)
)

router.delete('/clear',
    auth(endPoints.CLEAR_CART),
    asyncHandler(clearCart)
)
export default router