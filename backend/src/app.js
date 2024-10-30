import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import router from './app/routes/index.js';
import notFound from './app/middlewares/notFound.js';
import httpStatus from 'http-status';
// import globalErrorHandler from './app/middlewares/globalErrorhandler';

const app = express();

// parsers
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'https://school-for-community-development.vercel.app'], credentials: true }));

// application routes
app.use('/api/v1', router);  

app.get('/', (req, res) => {
  res.send('Hello from scd media file code');
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Not Found
app.use(notFound); // This is connected with the notFound.js file in the middleware folder.

export default app;