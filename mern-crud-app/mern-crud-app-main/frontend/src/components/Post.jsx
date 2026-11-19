import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function Post({ post, onDelete }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/update-post/${post._id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/posts/${post._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete post");
      }

      if (typeof onDelete === "function") {
        onDelete(post._id);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Unable to delete post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="post">
      <div className="post-title">{post.title}</div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button onClick={handleEdit} disabled={deleting}>
          Edit
        </button>

        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default Post;
