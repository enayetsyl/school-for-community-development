
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { id } = useParams();

  const fetchPost = async () => {
    const response = await axios.get(`http://localhost:5005/api/v1/posts/posts/${id}`);
    return response.data.data;
  };

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: fetchPost,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-600 mb-4">{post.category.join(', ')}</p>
        {post.post && <p className="mb-4">{post.post}</p>}
        {post.images && post.images.map((image, index) => (
          <img key={index} src={image} alt={`Post image ${index + 1}`} className="w-full max-w-2xl mx-auto rounded-md mb-4" />
        ))}
        {post.videos && post.videos.map((video, index) => (
          <video key={index} src={video} controls className="w-full max-w-2xl mx-auto rounded-md mb-4" />
        ))}
      </div>
    </div>
  );
};

export default PostPage;