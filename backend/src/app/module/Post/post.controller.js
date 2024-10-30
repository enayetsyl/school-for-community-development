import catchAsync from '../../utils/catchAsync.js';
import { sendSuccessResponse, sendErrorResponse } from '../../utils/sendResponse.js';
import { PostServices } from './post.service.js';
import httpStatus from 'http-status';

// Create Post function
const createPost = catchAsync(async (req, res) => {
  const { title, post, category } = req.body;
  const images = req.files['image'] ? req.files['image'].map(file => file.path) : []; 
  const videos = req.files['video'] ? req.files['video'].map(file => file.path) : []; 

  // Create a new post using the PostServices
  const newPost = await PostServices.createPost({
    title,
    post,
    category,
    images,
    videos,
  });

  // Send a success response if post creation is successful
  sendSuccessResponse(res, {
    message: 'Post created successfully',
    data: newPost,
  });
});

// Create Get All Posts function
const getAllPosts = catchAsync(async (req, res) => {
  const posts = await PostServices.getAllPosts(); // Retrieve all posts
  sendSuccessResponse(res, {
    message: 'Posts retrieved successfully',
    data: posts,
  });
});

// Create Get Post By ID function
const getPostById = catchAsync(async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  const post = await PostServices.getPostById(id); // Retrieve the post by ID

  if (!post) {
    return sendErrorResponse(res, {
      message: 'Post not found',
      statusCode: httpStatus.NOT_FOUND,
    });
  }

  sendSuccessResponse(res, {
    message: 'Post retrieved successfully',
    data: post,
  });
});

// Create Get Posts By Category function
const getPostsByCategory = catchAsync(async (req, res) => {
  const { category } = req.params; // Get the category from the request parameters
  const posts = await PostServices.getPostsByCategory(category); // Retrieve posts by category

  sendSuccessResponse(res, {
    message: 'Posts retrieved successfully',
    data: posts,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByCategory,
};