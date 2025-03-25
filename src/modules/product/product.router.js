import { Router } from 'express'
import auth from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import { fileUpload } from '../../utils/multer.js'
import { addProduct, productList, updateProduct, deleteProduct, getProductById } from './product.controller.js'
import { addProductSchema, Headers, deleteProductSchema, updateProductSchema } from './product.validation.js'
const router = Router()

router.post(
  '/',
  validation(Headers, true),
  auth(),
  fileUpload({}).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 2 },
  ]),
  validation(addProductSchema),
  asyncHandler(addProduct),
)

router.put(
  '/:productId',
  validation(Headers, true),
  auth(),
  fileUpload({}).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 2 },
  ]),
  validation(updateProductSchema),
  asyncHandler(updateProduct),
)

router.delete('/:productId',
  auth(),
  validation(deleteProductSchema),
  asyncHandler(deleteProduct)
);

router.get('/:productId', asyncHandler(getProductById));

router.get('/', asyncHandler(productList))

export default router
