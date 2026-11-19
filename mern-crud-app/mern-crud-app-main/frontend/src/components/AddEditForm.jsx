
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AddEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing post when editing
  useEffect(() => {
    if (id) {
      async function fetchPost() {
        try {
          const response = await fetch(
            `${API_URL}/api/v1/posts/${id}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch post");
          }

          const result = await response.json();

          setTitle(result.data.title);
          setContent(result.data.content);
        } catch (err) {
          setError(err.message);
        }
      }

      fetchPost();
    }
  }, [id]);

  // Create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const method = id ? "PUT" : "POST";

    const url = id
      ? `${API_URL}/api/v1/posts/${id}`
      : `${API_URL}/api/v1/posts`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>{id ? "Edit Form" : "Add Form"}</div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <br />

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : id
            ? "Update"
            : "Add"}
        </button>
      </form>
    </>
  );
}

export default AddEditForm;
