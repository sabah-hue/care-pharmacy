import mongoose from "mongoose";

const donateSchema = new mongoose.Schema({
    donationCode: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
    timestamps: true
});

const donateModel = mongoose.models.Donate || mongoose.model('Donate', donateSchema);

export default donateModel;
