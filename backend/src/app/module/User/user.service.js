import { User } from "./user.model.js"
import jwt from 'jsonwebtoken'
import config from '../../../config/index.js'

const createUser = async (email, password, name) => {
  const user = new User({email, password, name})
  const result = await user.save();
  return result;
}

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password'); 
  if (!user) {
    throw new Error('User not found'); 
  }
  
  const isPasswordMatched = await User.isPasswordMatched(password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Invalid password');
  }

  

  if(!user.isVerified) {
    throw new Error('Your account is not verified yet. Contact with admin. ')
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.jwt_secret,
    { expiresIn: '7d' }
  );

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    token
  }; 
}

const getAllUsers = async () => {
  const users = await User.find({ role: 'user' })
  return users
}

const verifyUser = async (userId) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { new: true }
  )
  return result
}

export const UserServices = {
  createUser,
  login,
  getAllUsers,
  verifyUser
}