import  { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Share2, ArrowRight, Loader2 } from 'lucide-react';

const categories = [
  "All",
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
];

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchPosts = async (category) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const url = category === 'All' 
        ? `${baseUrl}/api/v1/posts/posts`
        : `${baseUrl}/api/v1/posts/category/${encodeURIComponent(category)}`;
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  };
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', activeCategory],
    queryFn: () => fetchPosts(activeCategory),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  console.log('posts', posts)

  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600">{error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">School Activities</h1>
      
      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex flex-nowrap gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeCategory === category 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((post) => (
            <div 
              key={post._id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Media Section */}
              <div className="relative aspect-video">
                {post.images && post.images[0] && (
                  <img 
                    src={post.images[0]} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {post.videos && post.videos[0] && (
                  <video 
                    src={post.videos[0]} 
                    controls
                    className="w-full h-full object-cover pt-2"
                  />
                )}
                {/* Category Pills */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {post.category.map((cat, index) => (
                    <span 
                      key={index}
                      className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                {post.post && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.post}
                  </p>
                )}
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <Link 
                    to={`/post/${post._id}`}
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleShare(post._id)}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;