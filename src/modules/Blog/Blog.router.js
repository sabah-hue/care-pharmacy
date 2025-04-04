import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import * as controllers from './Blog.controller.js'
import * as validators from './Blog.validation.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./blog.endPoint.js";

const router = Router({ caseSensitive: true })

router.post('/',
    auth(endPoints.CREATE_BLOG),
    fileUpload({}).single('image'),
    validation(validators.createBlogSchema),
    asyncHandler(controllers.createBlog))

router.put('/:blogId',
    auth(endPoints.UPDATE_BLOG),
    fileUpload({}).single('image'),
    validation(validators.updateBlogSchema),
    asyncHandler(controllers.updateBlog))

router.delete('/:blogId',
    auth(endPoints.DELETE_BLOG),
    validation(validators.deleteBlogSchema),
    asyncHandler(controllers.deleteBlog))

router.get('/', asyncHandler(controllers.getAllBlogs))

router.get('/:blogId', asyncHandler(controllers.getBlogById))

export default router
