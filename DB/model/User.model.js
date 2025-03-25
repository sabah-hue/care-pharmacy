import mongoose, { Schema, model } from "mongoose";
import pkg from 'bcryptjs'
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new Schema({
    userName: {
            firstName:{
                type:String,
                required: [true, 'firstName is required'],
                min: [4, 'minimum length 4 char'],
                max: [20, 'max length 20 char']
            },
            lastName:{
                type:String,
                required: [true, 'lastName is required'],
                min: [4, 'minimum length 4 char'],
                max: [20, 'max length 20 char']
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
    profilePic: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=user'
    }, 
    dateOfBirth: {
        type: Date
      },
      gender: {
        type: String,
        enum: ["male", "female"]
      },
      address: {
        street: {
          type: String,
          trim: true
        },
        city: {
          type: String,
          trim: true
        },
        state: {
          type: String,
          trim: true
        },
        zipCode: {
          type: String,
          trim: true
        },
        country: {
          type: String,
          trim: true
        }
      },
      phone: {
        type: String,
        min: [11, 'minimum length 11 char'],
        max: [11, 'max length 11 char']
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
    forgetCode: String,
    changePassword:Number,
    whishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
}, {
    timestamps: true
})

userSchema.pre('save', function (next, doc) {
    this.password = pkg.hashSync(this.password, +process.env.SALT_ROUNDS)
    next()
})

const userModel = mongoose.models.User || model('User', userSchema)
export default userModel