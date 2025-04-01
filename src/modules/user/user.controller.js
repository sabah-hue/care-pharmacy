import userModel from "../../../DB/model/User.model.js";
import productModel from "../../../DB/model/Product.model.js";
import pkg from 'bcryptjs';
import cloudinary from '../../utils/cloudinary.js';
import { nanoid } from 'nanoid';
// =============================
export const logout = async (req, res) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { isLoggedIn: false });
    return res.status(200).json({ message: "Logged out successfully" });
}
// =======================
export const getProfile = async (req, res) => {
    console.log('User from token:', req.user);
    const user = await userModel.findById(req.user._id).select('-password -forgetCode -changePassword');
    return res.status(200).json({ message: "Success", user });
}
// =========================
export const getAllUsers = async (req, res) => {
    const users = await userModel.find().select('-password');
    return res.status(200).json({ message: "Success", users });
}

export const getUser = async (req, res) => {
    const user = await userModel.findById(req.params.userId).select('-password -forgetCode -changePassword');
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!user.isActive) {
        return res.status(400).json({ message: "User account is not active" });
    }
    if (user.isBlocked) {
        return res.status(400).json({ message: "User account is blocked" });
    }
    return res.status(200).json({ message: "Success", user });
}
// =============================
export const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }

    const { firstName, lastName } = req.body;

    // Update name if provided
    if (firstName || lastName) {
        req.body.userName = {
            firstName: firstName || user.userName.firstName,
            lastName: lastName || user.userName.lastName
        }
    }

    const { street, city, state, zipCode, country } = req.body;
    // Update address if provided
    if (street || city || state || zipCode || country) {
        req.body.address = {
            street: street || user.address.street,
            city: city || user.address.city,
            state: state || user.address.state,
            zipCode: zipCode || user.address.zipCode,
            country: country || user.address.country
            }
    }

    // Handle profile picture upload if provided
    if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Users/${userId}/ProfilePic`,
            }
        )
        req.body.profilePic = secure_url;
    }

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        req.body,
        { new: true }
    ).select('-password -forgetCode -changePassword');

    if (!updatedUser) {
        return next(new Error('Failed to update user', { cause: 400 }));
    }

    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
}
// ================================================================
export const deleteUser = async (req, res) => {
    const user = await userModel.findByIdAndDelete(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
}

// =============================

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    // Check if old password matches
    const match = pkg.compareSync(oldPassword, user.password);
    if (!match) {  // Changed from "if (match)"
        return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from old password" });
    }

    // Hash the new password before saving
    const hashedPassword = pkg.hashSync(newPassword, parseInt(process.env.SALT_ROUND) || 8);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
}

// =========================whishList=========================
export const addToWhishList = async (req, res, next) => {
    const { productId } = req.params;
    const user = await userModel.findById(req.user._id);
    const product = await productModel.findById(productId);
    if (!user || !product) {
        return res.status(404).json({ message: "User or product not found" });
    }
    if (user.whishList.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
    }
    user.whishList.push(product);
    await user.save();
    res.status(200).json({ message: "Product added to wishlist" });
}

// ==============remove whishList===============
export const removeFromWhishList = async (req, res, next) => {
    const { productId } = req.params;
    const user = await userModel.findById(req.user._id);
    const product = await productModel.findById(productId);
    if (!user || !product) {
        return res.status(404).json({ message: "User or product not found" });
    }
    if (!user.whishList.includes(productId)) {
        return res.status(400).json({ message: "Product not in wishlist" });
    }
    user.whishList = user.whishList.filter(item => item.toString() !== productId);
    await user.save();
    res.status(200).json({ message: "Product removed from wishlist" });   
}

// ==============get whishList===============
export const getWhishList = async (req, res, next) => {
    const whishList = await userModel.findById(req.user._id).populate('whishList');
    console.log(whishList);

    if (!whishList) {
        return res.status(404).json({ message: "Whishlist is empty" });
    }
    res.status(200).json({ message: "Whishlist", whishList });
}   
