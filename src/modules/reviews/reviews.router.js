import { Router } from "express";
const router = Router({mergeParams: true})
import auth from "../../middleware/auth.js";

import {createReview, updateReview, deleteReview, getReviewByProductId} from "./reviews.controller.js"
import {validation} from "../../middleware/validation.js"
import {createReviewSchema, updateReviewSchema, deleteReviewSchema} from "./reviews.validation.js"
import {asyncHandler} from "../../utils/errorHandling.js"

router.post('/', auth(), validation(createReviewSchema), asyncHandler(createReview));
router.put('/:reviewId', auth(), validation(updateReviewSchema), asyncHandler(updateReview));
router.delete('/:reviewId', auth(), validation(deleteReviewSchema), asyncHandler(deleteReview));
router.get('/', asyncHandler(getReviewByProductId));



export default router