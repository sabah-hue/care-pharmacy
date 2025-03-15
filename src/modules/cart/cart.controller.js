import cartModel from "../../../DB/model/Cart.model.js"
import productModel from "../../../DB/model/Product.model.js"

export const addToCart = async (req, res, next) => {
    const userId = req.user._id
    const { productId, quantity } = req.body
    // product
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error('in-valid productID', { cause: 400 }))
    }
    if (product.isDeleted) {
        await productModel.findByIdAndUpdate(productId, {
            $addToSet: {
                userAddToWishList: userId
            }
        })
        return next(new Error('not available now', { cause: 400 }))
    }
    if (product.stock < quantity) {
        await productModel.findByIdAndUpdate(productId, {
            $addToSet: {
                userAddToWishList: userId
            }
        })
        return next(new Error(`sorry, max quantity can added is ${product.stock}`, { cause: 400 }))
    }
    // userId
    const cart = await cartModel.findOne({ userId })
    if (!cart) {
        const newCart = await cartModel.create({
            userId,
            products: [{ productId, quantity }]
        })
        return res.status(201).json({ messages: "Done", newCart })
    }

    // update exist product 
    let isProductExist = false;
    for (const product of cart.products) {
        if (product.productId.toString() == productId) {
            product.quantity = quantity
            isProductExist = true
            break
        }
    }

    // add new product
    if (!isProductExist) {
        cart.products.push({ productId, quantity })
    }
    await cart.save()
    res.status(200).json({ message: "Done", cart })
}


// ===================
// Get user's cart
export const getCart = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id })
        .populate({
            path: 'products.productId',
            select: 'name price mainImage stock'
        })

    if (!cart) {
        return res.status(200).json({ message: "Cart is empty" })
    }

    return res.status(200).json({ message: "Done", cart })
}


// Remove product from cart
export const removeFromCart = async (req, res, next) => {
    const { productIds } = req.body;

    // Validate if cart exists
    const existingCart = await cartModel.findOne({ userId: req.user._id });
    if (!existingCart) {
        return next(new Error('Cart not found', { cause: 404 }));
    }

    // Remove products from cart
    const updatedCart = await cartModel.findOneAndUpdate(
        { userId: req.user._id },
        { 
            $pull: { products: { productId: { $in: productIds } } } 
        },
        { new: true }
    ).populate({
        path: 'products.productId',
        select: 'name price mainImage'
    });

    // Check if any products were removed
    if (existingCart.products.length === updatedCart.products.length) {
        return next(new Error('No products found to remove', { cause: 400 }));
    }

    return res.status(200).json({ 
        message: "Products removed from cart successfully",
        removedCount: existingCart.products.length - updatedCart.products.length,
        cart: updatedCart 
    });
}

// Clear entire cart
export const clearCart = async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        { userId: req.user._id },
        { products: [] },
        { new: true }
    )

    return res.status(200).json({ message: "Cart cleared" })
}