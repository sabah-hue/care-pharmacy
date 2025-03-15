
import { nanoid } from 'nanoid';
import slugify from 'slugify'
import categoryModel from '../../../DB/model/Category.model.js';
import cloudinary from '../../utils/cloudinary.js';


// create category
export const createCategory = async (req, res, next) => {
    const { name } = req.body
    const slug = slugify(name, '_')
    if (await categoryModel.findOne({ name })) {
        return res.status(400).json({ message: "please enter different category name" })
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`
        })

    const catergory = await categoryModel.create({
        testId: nanoid(6),
        name,
        slug,
        Image: {
            path: secure_url,
            public_id
        },
        customId,
        createdBy: req.user._id
    })
    if (!catergory) {
        await cloudinary.uploader.destroy(public_id)
        return res.status(400).json({ message: "Fail to add category, please try again later" })
    }
    return res.status(201).json({ message: `Category ${name} Added successfully` })

}

// update category
export const updateCategory = async (req, res, next) => {
    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    if (req.body.name) {
        if (category.name == req.body.name) {
            return next(new Error('please enter different categotry name', { cause: 400 }))
        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error('Category name already exist', { cause: 400 }))
        }
        category.name = req.body.name
        category.slug = slugify(req.body.name, '_')
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.Image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`

            })
        category.Image = {
            path: secure_url,
            public_id
        }
    }
    if (!Object.keys(req.body).length) {
        return next(new Error('please enter the updated fields', { cause: 400 }))
    }
    category.updatedBy = req.user._id
    const savedCat = await category.save()
    return res.status(200).json({ mesaage: "Done", savedCat })
}

// get all categories
export const getllCategories = async (req, res, next) => {
    const categories = await categoryModel.find({})
    .populate([{
        path: 'products',
    }])
    if (!categories.length) {
        return res.status(200).json({ message: "Empty categories" })
    }
    return res.status(200).json({ message: "Done", categories })

}


// get specific category by id
export const getCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    
    const category = await categoryModel.findById(categoryId)
        .populate([{
            path: 'products',
        }]);
    
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    
    return res.status(200).json({ message: "Done", category });
}


//delete category
export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    // Delete category image from cloudinary
    await cloudinary.uploader.destroy(category.Image.public_id);
    
    // Delete category from database
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);
    
    return res.status(200).json({ 
        message: "Category deleted successfully", 
        category: deletedCategory 
    });
}