import jwt from 'jsonwebtoken'
import config from '../../config/index.js'
import { sendErrorResponse } from '../utils/sendResponse.js'
import httpStatus from 'http-status'

const verifyToken = (req, res, next) => {
  console.log('req.headers.authorization', req.headers)
  const token = req.headers.cookie?.split('token=')[1]
  console.log('token', token)

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
