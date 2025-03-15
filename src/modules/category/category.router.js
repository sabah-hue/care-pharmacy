import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import * as controllers from './category.controller.js'
import * as validators from './category.validation.js'
import productRouter from '../product/product.router.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./category.endPoint.js";
const router = Router({ caseSensitive: true })

router.use('/:categoryId/product', productRouter)

router.post('/',
    auth(endPoints.CREAT_CATEGORY),
    fileUpload({}).single('image'),
    validation(validators.createCategorySchema),
    asyncHandler(controllers.createCategory))


router.put('/:categoryId',
    auth(endPoints.UPDATE_CATEGORY),
    fileUpload({}).single('image'),
    validation(validators.updateCategorySchema),
    asyncHandler(controllers.updateCategory))


router.get('/', asyncHandler(controllers.getllCategories))

router.get('/:categoryId',
    validation(validators.getCategorySchema),
    asyncHandler(controllers.getCategory))


    
router.delete('/:categoryId',
    auth(endPoints.DELETE_CATEGORY),
    validation(validators.deleteCategorySchema),
    asyncHandler(controllers.deleteCategory))
export default router