import mongoose, { Schema, model } from "mongoose";
import pkg from 'bcryptjs'
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new Schema({
    userName: {
            firstName:{
                type:String,
                required: [true, 'firstName is required'],
                min: [2, 'minimum length 2 char'],
                max: [20, 'max length 2 char']
            },
            lastName:{
                type:String,
                required: [true, 'lastName is required'],
                min: [2, 'minimum length 2 char'],
                max: [20, 'max length 2 char']
            }
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    role: {
        type: String,
        default: systemRoles.USER,
        enum: [systemRoles.USER, systemRoles.ADMIN]
    },

    isActive: {
        type: Boolean,
        default: true,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    image: String,
    forgetCode: String,
    changePassword:Number
}, {
    timestamps: true
})

userSchema.pre('save', function (next, doc) {
    this.password = pkg.hashSync(this.password, +process.env.SALT_ROUNDS)
    next()
})

const userModel = mongoose.models.User || model('User', userSchema)
export default userModel