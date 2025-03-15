import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        unique: true,
        required: true
    },
    Image: {
        path: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    slug: {
        type: String,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    customId: String,
    isDeleted: false

}, {
    timestamps: true
})


const blogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default blogModel
