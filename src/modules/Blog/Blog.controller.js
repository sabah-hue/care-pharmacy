import { nanoid } from 'nanoid';
import blogModel from '../../../DB/model/Blog.model.js';
import cloudinary from '../../utils/cloudinary.js';

export const createBlog = async (req, res, next) => {
    const { title, author, excerpt } = req.body
    
    if (await blogModel.findOne({ title })) {
        return res.status(400).json({ message: "Blog title already exists" })
    }
    
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/Blogs/${customId}`
        })

    const blog = await blogModel.create({
        title,
        author,
        excerpt,
        image: {
            path: secure_url,
            public_id
        },
        customId,
    })
    
    if (!blog) {
        await cloudinary.uploader.destroy(public_id)
        return res.status(400).json({ message: "Failed to add blog, please try again later" })
    }
    
    return res.status(201).json({ message: 'Blog added successfully', blog })
}
//  update Blog
export const updateBlog = async (req, res, next) => {
    const { blogId } = req.params
    const blog = await blogModel.findById(blogId)
    
    if (!blog) {
        return next(new Error('Blog not found', { cause: 404 }))
    }
    
    if (req.body.title) {
        if (blog.title === req.body.title) {
            return next(new Error('Please enter a different blog title', { cause: 400 }))
        }
        if (await blogModel.findOne({ title: req.body.title })) {
            return next(new Error('Blog title already exists', { cause: 400 }))
        }
        blog.title = req.body.title
    }
    
    if (req.body.author) {
        blog.author = req.body.author
    }
    
    if (req.body.excerpt) {
        blog.excerpt = req.body.excerpt
    }
    
    if (req.file) {
        await cloudinary.uploader.destroy(blog.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Blogs/${blog.customId}`
            })
        blog.image = {
            path: secure_url,
            public_id
        }
    }
    
    if (!Object.keys(req.body).length && !req.file) {
        return next(new Error('Please enter the updated fields', { cause: 400 }))
    }
    
    const savedBlog = await blog.save()
    return res.status(200).json({ message: "Blog updated successfully", blog: savedBlog })
}
// delete blog
export const deleteBlog = async (req, res, next) => {
    const { blogId } = req.params
    const blog = await blogModel.findOneAndDelete(blogId)
    
    if (!blog) {
        return next(new Error('Blog not found', { cause: 404 }))
    }
    
    return res.status(200).json({ message: "Blog deleted successfully" })
}
// all blogs
export const getAllBlogs = async (req, res, next) => {
    const blogs = await blogModel.find()
    
    if (!blogs.length) {
        return res.status(200).json({ message: "No blogs found" })
    }
    
    return res.status(200).json({ message: "Blogs retrieved successfully", blogs })
}
// blog by Id
export const getBlogById = async (req, res, next) => {
    const { blogId } = req.params
    const blog = await blogModel.findOne({ _id: blogId })
    
    if (!blog) {
        return next(new Error('Blog not found', { cause: 404 }))
    }
    
    return res.status(200).json({ message: "Blog retrieved successfully", blog })
}
