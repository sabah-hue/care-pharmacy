import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        required: true
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    }
}, {
    timestamps: true
})

const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema)

export default ReviewModel
