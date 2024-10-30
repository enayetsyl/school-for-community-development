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
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  sendSuccessResponse(res, {
    message: 'User successfully logged in',
    data: result.user,
  });
})

// Export the controller
export const UserControllers = {
  createUser, login
};