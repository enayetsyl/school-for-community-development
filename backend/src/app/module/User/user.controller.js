import catchAsync from '../../utils/catchAsync.js';
import { sendSuccessResponse, sendErrorResponse } from '../../utils/sendResponse.js';
import { UserServices } from './user.service.js';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  // This can throw a synchronous error or return a promise that can reject
  const result = await UserServices.createUser(email, password, name);
  
  // Send a success response if user creation is successful
  sendSuccessResponse(res, {
    message: 'User is created successfully',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const {email, password} = req.body;

  const result = await UserServices.login(email, password)

  // Set token in cookie
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  sendSuccessResponse(res, {
    message: 'User successfully logged in',
    data: result.user,
  });
})
  const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsers()
  
    sendSuccessResponse(res, {
      message: 'Users retrieved successfully',
      data: result,
    })
  })

  const verifyUser = catchAsync(async (req, res) => {
    const { userId } = req.params
    const result = await UserServices.verifyUser(userId)
  
    sendSuccessResponse(res, {
      message: 'User verified successfully',
      data: result,
    })
  })

  export const UserControllers = {
    createUser,
    login,
    getAllUsers,
    verifyUser
  }
