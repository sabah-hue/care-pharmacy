import userModel from '../../../DB/model/User.model.js'
import pkg from 'bcryptjs'
import {
  tokenDecode,
  tokenGeneration,
} from '../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../utils/sendEmail.js'
import { emailTemplete } from '../../utils/emailTemplet.js'
import { sendCodeTemplate } from '../../utils/sendCodeTemplate.js'
import { customAlphabet } from 'nanoid'
import { OAuth2Client } from 'google-auth-library'

const nanoId = customAlphabet('123456789', 6)

//======================== signUp =======================
export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body
  const emailEixsts = await userModel.findOne({ email }).select('_id email')
  if (emailEixsts) {
    return next(new Error('Email is Already Exists', { cause: 400 }))
  }
  const newUser = new userModel({
    userName: {firstName, lastName},
    email,
    password
  })

  // confimation
  const token = tokenGeneration({
    payload: { _id: newUser._id, email: newUser.email },
  })
  if (!token) {
    return next(new Error('Token Generation Fail', { cause: 400 }))
  }
  const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
  const unsupscripe = `${req.protocol}://${req.headers.host}/auth/unsupscripe/${token}`;

  const message = emailTemplete(confirmationLink, unsupscripe);
  const sentEmail = await sendEmail({
    to: email,
    message,
    subject: 'Confirmation Email',
  })
  if (!sentEmail) {
    return next(new Error('Send Email Service Fails', { cause: 400 }))
  }
  await newUser.save()
  res
    .status(201)
    .json({ message: 'registration success , please confirm your email' })
}

//========================= confirmation Email ==================
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params

  const decode = tokenDecode({ payload: token })
  if (!decode?._id) {
    return next(new Error('Decoding Fails', { cause: 400 }))
  }
  const userConfirmed = await userModel.findOneAndUpdate(
    { _id: decode._id, isConfirmed: false },
    {
      isConfirmed: true,
    },
  )
  return userConfirmed ? res.status(200).redirect(`http://localhost:5173/login`) :
                                res.status(404).send('Not registered account').redirect(`http://localhost:5173/signup`);
}

////////////////////// unspscripe email /////////////////
export const removeAccount = async (req, res, next) => {
    const {token} = req.params;
    // decode token to get user info
    console.log(token);
    const decode = tokenDecode({ payload: token })
    if (!decode?._id) {
      return next(new Error('Decoding Fails', { cause: 400 }))
    }
    const userDeleted = await userModel.findOneAndDelete({ _id: decode._id})
    
    return res.status(200).json({ message: 'unsupscribe successfully', userDeleted })
}

//=========================== Login =============================
export const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email, isConfirmed: true })
  if (!user) {
    return next(
      new Error(
        'please enter a valid email or make sure that you confirm your email',
        { cause: 400 },
      ),
    )
  }
  const match = pkg.compareSync(password, user.password)
  if (!match) {
    return next(new Error('in-valid login information', { cause: 400 }))
  }
  const token = tokenGeneration({
    payload: {
      _id: user._id,
      email: user.email,
      isLoggedIn: true,
    },
  })
  await userModel.findOneAndUpdate({ email }, { isLoggedIn: true })
  return res.status(200).json({ message: 'Login successfully', token })
}

//=========================== send code =======================
export const sendCode = async (req, res, next) => {
  const { email } = req.body
  const user = await userModel.findOne({ email, isConfirmed: true })
  if (!user) {
    return next(new Error('please sign up fisrt, this email not registered before', { cause: 400 }))
  }
  const forgetCode = nanoId()
  
  const message = sendCodeTemplate(forgetCode);
  const sentEmail = await sendEmail({
    to: email,
    message,
    subject: 'Forget Password',
  })
  if (!sentEmail) {
    return next(new Error('Send Email Service Fails', { cause: 400 }))
  }
  const saved = await userModel.findOneAndUpdate(
    { email },
    { forgetCode },
    { new: true },
  )
  return res.status(200).json({ message: 'Code sent successfully', saved })
}

//========================== reset password ===============================
export const resetPassword = async (req, res, next) => {
  const { email, forgetCode, newPassword } = req.body
  console.log(req.body);
  const user = await userModel.findOne({ email })
  if (!user) {
    return next(new Error('please sign up fisrt', { cause: 400 }))
  }
  if (user.forgetCode != forgetCode) {
    return next(new Error('in-valid Code', { cause: 400 }))
  }
  user.forgetCode = null
  user.password = newPassword
  user.changePassword = Date.now()
  const userUpdated = await user.save()
  return res.status(200).json({ message: 'please login', userUpdated })
}

//========================== change password ===============================
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  
  // Get user from DB
  const user = await userModel.findById(req.user._id);
  if (!user) {
      return next(new Error('User not found', { cause: 404 }));
  }

  // Verify old password
  const match = pkg.compareSync(oldPassword, user.password);
  if (!match) {
      return next(new Error('Old password is incorrect', { cause: 400 }));
  }

  // Check if new password is same as old
  const samePassword = pkg.compareSync(newPassword, user.password);
  if (samePassword) {
      return next(new Error('New password must be different from old password', { cause: 400 }));
  }

  // Update password
  user.password = newPassword;
  user.changePassword = Date.now();
  
  await user.save();
  return res.status(200).json({ message: 'Password updated successfully' });
}


// google login
export const googleLogin = async (req, res, next) => {
  const client = new OAuth2Client(process.env.CLIENT_ID)
  const { idToken } = req.body
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    })
    const payload = ticket.getPayload()
    return payload
  }
  const { email, email_verified, firstName, lastName, picture } = await verify()
  if (!email_verified) {
    return next(new Error('in-valid email', { cause: 400 }))
  }
  const userCheck = await userModel.findOne({ email, provider: 'GOOGLE' })
  console.log(userCheck)

  // login
  if (userCheck) {
    const token = tokenGeneration({
      payload: {
        _id: userCheck._id,
        email,
        isLoggedIn: true,
      },
    })
    await userModel.findOneAndUpdate({ email }, { isLoggedIn: true })
    return res.status(200).json({ message: 'Login Done', token })
  }

  // signUp
  const newUser = new userModel({
    userName: {firstName, lastName},
    email,
    password: nanoId(),
    isConfirmed: true,
    isLoggedIn: true,
    provider: 'GOOGLE',
    profilePic: picture,
  })
  const token = tokenGeneration({
    payload: { _id: newUser._id, email: newUser.email, isLoggedIn: true },
  })
  await newUser.save()
  return res.status(201).json({ message: 'registration success', token })
}