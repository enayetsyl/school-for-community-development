import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Share2, ArrowRight } from "lucide-react";

const categories = [
  "All",
  "Nursery",
  "Kg",
  "Class 1",
  "Class 2",
  "Class 3",
  "English",
  "Arabic",
  "Quran",
  "Study Tour",
];

// Skeleton Card component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full animate-pulse">
    {/* Title Placeholder */}
    <div className="h-6 bg-gray-300 rounded-md mb-4"></div>
    {/* Text Placeholder */}
    <div className="h-4 bg-gray-300 rounded-md mb-4"></div>
    <div className="h-4 bg-gray-300 rounded-md mb-4"></div>
    {/* Image Placeholder */}
    <div className="relative aspect-video h-[300px] bg-gray-300 rounded-md mb-4"></div>
    {/* Button Placeholder */}
    <div className="flex justify-between mt-auto">
      <div className="h-10 bg-gray-300 rounded-lg w-24"></div>
      <div className="h-10 bg-gray-300 rounded-lg w-16"></div>
    </div>
  </div>
);


const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [linkPreviewData, setLinkPreviewData] = useState({});

  const fetchPosts = async (category) => {
    try {
      const url =
        category === "All"
          ? `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/posts`
          : `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/category/${encodeURIComponent(category)}`;
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch posts");
    }
  };

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", activeCategory],
    queryFn: () => fetchPosts(activeCategory),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  console.log(posts);

  useEffect(() => {
    if (posts) {
      posts.forEach((post) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urlMatch = post.post.match(urlRegex);
        if (urlMatch) {
          // Fetch metadata from backend proxy for each post
          axios
            .get(
              `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/preview?url=${encodeURIComponent(
                urlMatch[0]
              )}`
            )
            .then((response) => {
              setLinkPreviewData((prevData) => ({
                ...prevData,
                [post._id]: response.data.data,
              }));
            })
            .catch((error) => {
              console.error("Error fetching link preview:", error);
            });
        }
      });
    }
  }, [posts]);

  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        School Activities
      </h1>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex flex-nowrap gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
    {/* Loading Skeleton State */}
    {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6) // Number of skeleton cards to show while loading
            .fill(0)
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ?.map((post) => (
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full" key={post._id}>
              {/* Content Section */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="flex flex-col ">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.post && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.post}
                    </p>
                  )}
                </div>
            
                {/* Link Preview */}
                {linkPreviewData[post._id] && (
                  <div className="border rounded-lg p-4 mt-4 shadow-md h-[300px] overflow-hidden">
                    {linkPreviewData[post._id].image && (
                      <img
                        src={linkPreviewData[post._id].image}
                        alt="Link preview"
                        className="w-full h-20 object-cover rounded-md mb-2"
                      />
                    )}
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {linkPreviewData[post._id].title}
                    </h3>
                    <p className="text-gray-700 line-clamp-2">
                      {linkPreviewData[post._id].description}
                    </p>
                    <a
                      href={linkPreviewData[post._id].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {linkPreviewData[post._id].url}
                    </a>
                  </div>
                )}
              </div>
            
              {/* Media Section */}
              {(post.images && post.images.length > 0) && (
                <div className="relative aspect-video h-[300px] overflow-hidden p-4 border rounded-lg  m-4 shadow-md">
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
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
              )}
              {(!post.images || post.images.length === 0) && post.videos && post.videos.length > 0 && (
                <div className="relative aspect-video h-[300px] overflow-hidden border rounded-lg p-4 m-4 shadow-md">
                  <video
                    src={post.videos[0]}
                    controls
                    className="w-full h-full object-cover"
                  />
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
              )}
            
              {/* Actions */}
              <div className="flex items-center justify-between p-4 mt-auto">
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
            
            


            ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No posts found
          </h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
