import Post from './post.model.js';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary.js';

const createPost = async (payload) => {
  const { title, post, category, images, videos } = payload;

  const uploadedImages = [];
  if (images && images.length > 0) {
    for (const imagePath of images) {
      const imageName = `post_image_${Date.now()}`;
      const uploadedImage = await sendImageToCloudinary(imageName, imagePath, 'image');
      uploadedImages.push(uploadedImage.secure_url);
    }
  }

  const uploadedVideos = [];
  if (videos && videos.length > 0) {
    for (const videoPath of videos) {
      const videoName = `post_video_${Date.now()}`;
      const uploadedVideo = await sendImageToCloudinary(videoName, videoPath, 'video');
      uploadedVideos.push(uploadedVideo.secure_url);
    }
  }

  const newPost = await Post.create({
    title,
    post,
    category,
    images: uploadedImages,
    videos: uploadedVideos
  });

  return newPost;
};

const getAllPosts = async () => {
  return await Post.find(); // Fetch all posts from the database
};

const getPostById = async (id) => {
  return await Post.findById(id); // Fetch a single post by ID from the database
};

const getPostsByCategory = async (category) => {
  return await Post.find({ category }); // Fetch posts that match the specified category
};

export const PostServices = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByCategory
};