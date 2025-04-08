import orderModel from '../../../DB/model/Order.model.js'
import reviewModel from '../../../DB/model/Review.model.js'

export const createReview = async (req, res, next) => {
    const {productId} = req.params;
    const {rate, comment} = req.body;
    const order = await orderModel.findOne({
        userId: req.user._id,
        "products.productId": productId,
        orderStatus: "deliverd"
    })
    console.log(order);
    if (!order) {
        return next(new Error("You can't review this product, you should by it first"))
    }
    const oldReview = await reviewModel.findOne({productId, createdBy: req.user._id})
    if (oldReview) {
        return next(new Error("You have already reviewed this product"))
    }
    const review = await reviewModel.create({
        orderId: order._id,
        createdBy: req.user._id,
        productId,
        rate,
        comment
    })
    res.status(201).json({message: "Review added successfully", review})
}

// =========== update review
export const updateReview = async (req, res, next) => {
    const {productId, reviewId} = req.params;
    const review = await reviewModel.findOneAndUpdate({
        _id: reviewId,
        productId,
        createdBy: req.user._id,
    }, req.body, { new: true })
    if (!review) {
        return next(new Error("Updated failed"))
    }
    return res.status(200).json({message: "Review updated successfully", review})
}

// =========== delete review
export const deleteReview = async (req, res, next) => {
    const {reviewId, productId} = req.params;
    const review = await reviewModel.findOneAndDelete({
        _id: reviewId,
        productId,
        createdBy: req.user._id
    })
    console.log(review);
    if (!review) {
        return next(new Error("Deleted failed"))
    }
    res.status(200).json({message: "Review deleted successfully"})
}
// =========== get review by product id
export const getReviewByProductId = async (req, res, next) => {
    const {productId} = req.params;
    const reviews = await reviewModel.find({productId}).populate("createdBy", "name email")
    if (!reviews) {
        return res.status(404).json({ message: "Not Found", err: error.message });
    }
    res.status(200).json({message: "Done", reviews})
}