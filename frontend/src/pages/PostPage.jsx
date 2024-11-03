import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { id } = useParams();
  const [linkPreviewData, setLinkPreviewData] = useState(null);

  const fetchPost = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/posts/${id}`
    );
    return response.data.data;
  };

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: fetchPost,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });


  useEffect(() => {
    if (post && post.post) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlMatch = post.post.match(urlRegex);
      if (urlMatch) {
        // Fetch metadata from backend proxy
        axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts/preview?url=${encodeURIComponent(urlMatch[0])}`)
          .then((response) => {
            console.log('link response', response.data)
            setLinkPreviewData(response.data.data)})
          .catch((error) => {
            console.error("Error fetching link preview:", error);
            setLinkPreviewData(null);
          });
      }
    }
  }, [post]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-600 mb-4">{post.category.join(", ")}</p>
        {post.post && <p className="mb-4">{post.post}</p>}

 {/* Display link preview if available */}
 {linkPreviewData && (
          <div className="border rounded-lg p-4 mb-4 shadow-md">
            {linkPreviewData.image && (
              <img
                src={linkPreviewData.image}
                alt="Link preview"
                className="w-full max-w-md mx-auto rounded-md mb-2"
              />
            )}
            <h3 className="font-semibold text-lg">{linkPreviewData.title}</h3>
            <p className="text-gray-700">{linkPreviewData.description}</p>
            <a
              href={linkPreviewData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {linkPreviewData.url}
            </a>
          </div>
        )}

        {post.images &&
          post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full max-w-2xl mx-auto rounded-md mb-4"
            />
          ))}
        {post.videos &&
          post.videos.map((video, index) => (
            <video
              key={index}
              src={video}
              controls
              className="w-full max-w-2xl mx-auto rounded-md mb-4"
            />
          ))}
      </div>
    </div>
  );
};

export default PostPage;
