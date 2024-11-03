import jwt from 'jsonwebtoken'
import config from '../../config/index.js'
import { User } from '../module/User/user.model.js';
import { sendErrorResponse } from '../utils/sendResponse.js'
import httpStatus from 'http-status'

const verifyToken = (req, res, next) => {
  const token = req.headers.cookie?.split('token=')[1]

  if (!token) {
    return sendErrorResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'You are not authorized'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret)
    req.user = decoded
    next()
  } catch (error) {
    return sendErrorResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Invalid token'
    })
  }
}

export default verifyToken



export const isSuperUser = async (req, res, next) => {
  try {
    const token = req.headers.cookie?.split('token=')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, config.jwt_secret);
    const user = await User.findById(decoded.id);
    
    if (user.role !== 'superUser') {
      return res.status(403).json({ message: 'Forbidden access' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};