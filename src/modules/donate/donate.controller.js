import donateModel from '../../../DB/model/Donate.model.js';
import { generateUniqueCode } from '../../utils/generateCode.js';
import payment from '../../utils/payment.js'


export const createDonation = async (req, res, next) => {
    try {
        const { description, amount } = req.body;
        const donationCode = generateUniqueCode();
        
        const donation = await donateModel.create({
            donationCode,
            description,
            amount
        });
        
        return res.status(201).json({ message: "Donation created successfully", donation });
    } catch (error) {
        return next(error);
    }
};

export const getAllDonations = async (req, res, next) => {
    try {
        const donations = await donateModel.find();
        if (donations.length) {
            return res.status(200).json({ message: "Done", donations });
        }
        return res.status(404).json({ message: "No donations found" });
    } catch (error) {
        return next(error);
    }
};


export const getDonationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const donation = await donateModel.findById(id);
        if (donation) {
            return res.status(200).json({ message: "Done", donation });
        }
        return res.status(404).json({ message: "No donation found" });
    } catch (error) {
        return next(error);
    }
};

export const updateDonation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description, amount, status } = req.body;
        
        const updatedDonation = await donateModel.findByIdAndUpdate(
            id,
            { description, amount, status },
            { new: true }
        );
        
        if (updatedDonation) {
            return res.status(200).json({ message: "Updated successfully", updatedDonation });
        }
        return res.status(404).json({ message: "No donation found" });
    } catch (error) {
        return next(error);
    }
};

export const deleteDonation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const donation = await donateModel.findByIdAndDelete(id);
        
        if (donation) {
            return res.status(200).json({ message: "Deleted successfully" });
        }
        return res.status(404).json({ message: "No donation found" });
    } catch (error) {
        return next(error);
    }
};


export const donateByStrip = async (req, res, next) => {
    const { email, amount } = req.body;
    if (req.body.donateId) {
        const donate = await donateModel.findById(req.body?.donateId);
        if (!donate) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        if(donate.status === 'closed'){
            return res.status(404).json({ message: 'Sorry, Donation closed' });
        }
    }

          const session = await payment({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: email,
            metadata: {
              donateId: req.body?.donateId?.toString() || null,
            },
            cancel_url: `http://localhost:5173/donation`,
            success_url: `http://localhost:5173/donation`,
            discounts: [],
            line_items: [
                {
                price_data: {
                currency: 'USD',
                product_data: {
                name: 'Donation',
                 },
                unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
                },
            ],
    })
    return res.status(201).json({ message: 'Done', session, url: session.url })
}
