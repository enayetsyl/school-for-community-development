import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import Select from "react-select";

const categories = [
  "Nursery Performance",
  "Kg Performance",
  "Class 1 Performance",
  "Class 2 Performance",
  "Class 3 Performance",
  "Class 4 Performance",
  "Science Performance",
  "English Performance",
  "Arabic Performance",
  "Quran Performance",
  "Study Tour",
  "Other",
];

const CreatePostPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("post", data.post);
    data.category.forEach((cat) => formData.append("category", cat.value));

    if (data.images) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("image", data.images[i]);
      }
    }

    if (data.videos) {
      for (let i = 0; i < data.videos.length; i++) {
        formData.append("video", data.videos[i]);
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/posts/create-post`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.data.message.includes("Post created successfully")) {
        toast.success("Post created successfully!");
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register("post")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Post content (optional)"
              rows="4"
            />
          </div>

          <div>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categories.map((cat) => ({
                    value: cat,
                    label: cat,
                  }))}
                  isMulti
                  placeholder="Select categories"
                />
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div>
            <input
              type="file"
              {...register("images")}
              multiple
              accept="image/*"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <input
              type="file"
              {...register("videos")}
              multiple
              accept="video/*"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
            disabled={isLoading}
          >
            {isLoading ? "Creating Post..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
