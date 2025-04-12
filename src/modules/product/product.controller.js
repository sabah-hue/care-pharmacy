import { nanoid } from 'nanoid'
import slugify from 'slugify'
import categoryModel from '../../../DB/model/Category.model.js'
import productModel from '../../../DB/model/Product.model.js'
import cloudinary from '../../utils/cloudinary.js'
import ApiFeatures from '../../utils/apiFeatures.js'

export const addProduct = async (req, res, next) => {
  // IDs
  const { categoryId, name, price, discount } = req.body
  const Category = await categoryModel.findById(categoryId)

  if (!Category) {
    return next(new Error('in-valid category', { cause: 400 }))
  }

  const productExist = await productModel.findOne({ name, categoryId })
  if (productExist) {
    return next(new Error('product already exist', { cause: 400 }))
  }

  // createdBy
  req.body.createdBy = req.user._id
  // name
  req.body.slug = slugify(name, {
    replacment: '_',
    lower: true,
  })


  req.body.priceAfterDiscount = price * (1 - (discount || 0) / 100)

  const customId = nanoid(5)
  req.body.customId = customId
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.customId}/Products/${customId}`,
    },
  )
  req.body.mainImage = {
    path: secure_url,
    public_id,
  }
  // subImages
  if (req.files.subImages) {
    req.body.subImgaes = []
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.customId}/Products/${customId}`,
        },
      )
      req.body.subImgaes.push({
        path: secure_url,
        public_id,
      })
    }
  }

  const product = await productModel.create(req.body)
  if (!product) {
    return next(new Error('fail', { cause: 500 }))
  }
  return res.status(201).json({ message: 'Done', product })
}


//  updateProduct
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params
  const product = await productModel.findById(productId)
  if (!product) {
    return next(new Error('in-valid productId', { cause: 400 }))
  }
  const { name, price, discount } = req.body
  //name
  if (name) {
    req.body.slug = slugify(name, {
      replacment: '_',
      lower: true,
    })
  }

  // price
  if (price && discount) {
    req.body.priceAfterDiscount = price * (1 - discount / 100)

  } else if (price || discount) {
    req.body.priceAfterDiscount =
      (price || product.price) * (1 - (discount || product.discount) / 100)
  }
  const Category = await categoryModel.findById(product.categoryId)

  // mainImage
  if (req.files?.mainImage?.length) {
    await cloudinary.uploader.destroy(product.mainImage.public_id)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.customId}/Products/${product.customId}`,
      },
    )
    req.body.mainImage = {
      path: secure_url,
      public_id,
    }
  }

  // subImages
  if (req.files?.subImages?.length) {
    req.body.subImgaes = []
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.customId}/Products/${product.customId}`,
        },
      )
      req.body.subImgaes.push({
        path: secure_url,
        public_id,
      })
    }
  }
  
  req.body.updatedBy = req.user._id
  const savedProduct = await productModel.findByIdAndUpdate(
    productId,
    req.body,
    { new: true },
  )
  if (!savedProduct) {
    return next(new Error('in-valid procustId fail to update', { cause: 400 }))
  }
  res.status(200).json({ message: 'Done', savedProduct })
}


// delete product
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  
  // Find product and check if exists
  const product = await productModel.findById(productId);
  if (!product) {
      return next(new Error('Product not found', { cause: 404 }));
  }

  // Check if already deleted
  if (product.isDeleted) {
      return next(new Error('Product already deleted', { cause: 400 }));
  }

  // Soft delete the product
  product.isDeleted = true;
  product.updatedBy = req.user._id;
  
  const deletedProduct = await product.save();
  
  return res.status(200).json({ 
      message: 'Product deleted successfully', 
      product: deletedProduct 
  });
}


// get product by id
export const getProductById = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error('Product not found', { cause: 404 }));
  }
  res.status(200).json({ message: 'Done', product });
}

// all products
export const getAllProducts = async (req, res, next) => {
  const products = await productModel.find();
  if (!products) {
    return next(new Error('No products found', { cause: 404 }));
  }
  return res.status(200).json({ message: 'Done', products });
}

// sort,search,filter,pagination,fields
/**
 * pagination
 * sort
 * select
 * search
 * filter
 */

export const productList = async (req, res, next) => {
  // class
  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .sort()
    .select()
    .search()
    .filters()
  const products = await apiFeature.mongooseQuery

  res.status(200).json({ message: 'Done', products })
}
