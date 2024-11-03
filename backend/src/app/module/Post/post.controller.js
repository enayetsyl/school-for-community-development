import catchAsync from '../../utils/catchAsync.js';
import { sendSuccessResponse, sendErrorResponse } from '../../utils/sendResponse.js';
import { PostServices } from './post.service.js';
import httpStatus from 'http-status';
import { getLinkPreview } from "link-preview-js";
import fetch from "node-fetch"
// const cheerio = require('cheerio');
import { load } from 'cheerio';


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
  const posts = await PostServices.getAllPosts(); 
  console.log('get all post', posts)
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

const getPreview = catchAsync(async(req, res) => {
  const {url} = req.query;
  const previewData = await fetch(url, { redirect: 'follow' });
  const htmlContent = await previewData.text();

     // Load HTML content into cheerio
     const $ = load(htmlContent);

     // Extract Open Graph metadata
     const title = $('meta[property="og:title"]').attr('content') || $('title').text();
     const description = $('meta[property="og:description"]').attr('content');
     const image = $('meta[property="og:image"]').attr('content');
     const siteName = $('meta[property="og:site_name"]').attr('content');
 
     // Fallback for title and description if Open Graph tags are missing
     const metadata = {
       title: title || "No title available",
       description: description || "No description available",
       image: image || "No image available",
       siteName: siteName || new URL(url).hostname,
       url
     };
 
     sendSuccessResponse(res, {
       message: "Link for preview",
       data: metadata,
     });
  sendSuccessResponse(res, {
    message: "Link for preview",
    data: htmlContent
  })
})

export const PostControllers = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByCategory,
  getPreview
};