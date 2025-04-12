import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
// import * as validators from './donate.validation.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as donateController from './donate.controller.js';
import { createDonationSchema, updateDonationSchema, idParamSchema, donateByStripeSchema } from './donate.validation.js';
import { endPoints } from "./donate.endPoint.js";
const router = Router();

// Create donation
router.post('/', 
    auth(endPoints.CREATE_DONATION), 
    validation(createDonationSchema), 
    asyncHandler(donateController.createDonation)
);

// Get all donations
router.get('/', 
    asyncHandler(donateController.getAllDonations)
);

// Get donation by ID
router.get('/:id', 
    validation(idParamSchema), 
    asyncHandler(donateController.getDonationById)
);

// Update donation
router.put('/:id', 
    auth(endPoints.UPDATE_DONATION), 
    validation(updateDonationSchema), 
    asyncHandler(donateController.updateDonation)
);

// Delete donation
router.delete('/:id', 
    auth(endPoints.DELETE_DONATION), 
    validation(idParamSchema), 
    asyncHandler(donateController.deleteDonation)
);

// payment
router.post('/donate-payment', 
    validation(donateByStripeSchema),
    asyncHandler(donateController.donateByStrip)
);

export default router;
