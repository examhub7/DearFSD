
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Post({ post, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/update-post/${post._id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/v1/posts/${post._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      onDelete(post._id);

    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete post. Please try again.");
    }
  };

  return (
    <div className="post">
      <div className="post-title">{post.title}</div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button onClick={handleEdit}>Edit</button>

        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default Post;
