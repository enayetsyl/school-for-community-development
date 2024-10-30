import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  post: {
    type: String,
    required: false,
  },
  category: {
    type: [String],
    required: true, 
    enum: [
      "Nursery Performance",
      "Kg Performance",
      "Class 1 Performance",
      "Class 2 Performance",
      "Class 3 Performance",
      "Class 4 Performance",
      "Class 5 Performance",
      "Class 6 Performance",
      "Class 7 Performance",
      "Class 8 Performance",
      "English Performance",
      "Arabic Performance",
      "Quran Performance",
      "Study Tour"
    ], 
  },
  images: {
    type: [String],
    required: false, 
  },
  videos: {
    type: [String],
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field before saving
postSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
