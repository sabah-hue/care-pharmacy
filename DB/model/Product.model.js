
import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    // descriptions
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    slug: String,
    description: String,
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    // price
    price: {
        type: Number,
        required: true,
        default: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    priceAfterDiscount: {
        type: Number,
        default: 0
    },
    // images
    mainImage: { type: Object, required: true },
    subImgaes: { type: [Object] },

    // IDs
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    customId: String,

    // two fileds
    isDeleted: {
        type: Boolean,
        default: false
    },

    // userAddToWishList: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    category: {
        type: String,
        enum: ['latest', 'popular', 'sale'],
        required: true
    },
    bestSeller: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})


const productModel = mongoose.models.Product || mongoose.model('Product', productSchema)

export default productModel
