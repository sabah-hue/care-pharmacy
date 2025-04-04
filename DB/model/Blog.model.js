import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        path: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
    },
    excerpt: {
        type: String,
        required: true
    },
    customId: String,
    isDeleted: false
}, {
    timestamps: true
})


const blogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default blogModel
