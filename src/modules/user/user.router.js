import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import * as controllers from './user.controller.js'
import * as validators from './user.validation.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./user.endPoint.js";
const router = Router({ caseSensitive: true })

// get whishList
router.get('/whishlist',
    auth(endPoints.GET_WHISHLIST),
    asyncHandler(controllers.getWhishList))
    
// User routes
router.post('/logout',
    auth(endPoints.LOGOUT),
    asyncHandler(controllers.logout))

// Protected routes
router.get('/profile',
    auth(endPoints.GET_PROFILE),
    asyncHandler(controllers.getProfile))

router.get('/',
    auth(endPoints.GET_ALL_USERS),
    asyncHandler(controllers.getAllUsers))

router.get('/:userId',
    auth(endPoints.GET_USER),
    validation(validators.getUserSchema), 
    asyncHandler(controllers.getUser))

router.put('/:userId',
    auth(endPoints.UPDATE_USER),
    fileUpload({}).single('profilePic'),
    validation(validators.updateUserSchema),
    asyncHandler(controllers.updateUser))

router.delete('/:userId',
    auth(endPoints.DELETE_USER), 
    validation(validators.deleteUserSchema),
    asyncHandler(controllers.deleteUser))

// Password management

router.patch('/change-password',
    auth(endPoints.CHANGE_PASSWORD),
    validation(validators.changePasswordSchema),
    asyncHandler(controllers.changePassword))


// add to whishList
router.post('/whishlist/:productId',
    auth(endPoints.ADD_TO_WHISHLIST),
    validation(validators.addToWhishListSchema),
    asyncHandler(controllers.addToWhishList))

// remove whishList
router.delete('/whishlist/:productId',
    auth(endPoints.REMOVE_FROM_WHISHLIST),
    validation(validators.addToWhishListSchema),
    asyncHandler(controllers.removeFromWhishList))




export default router