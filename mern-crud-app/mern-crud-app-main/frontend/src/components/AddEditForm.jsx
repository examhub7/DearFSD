import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../api";

function AddEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(id));
  const [error, setError] = useState("");

  // Fetch existing post when editing
  useEffect(() => {
    if (id) {
      async function fetchPost() {
        setFetching(true);
        setError("");
        try {
          const response = await fetch(`${API_URL}/api/v1/posts/${id}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch post (${response.status})`);
          }

          const result = await response.json();
          if (result.data) {
            setTitle(result.data.title || "");
            setContent(result.data.content || "");
          }
        } catch (err) {
          setError(err.message || "Error fetching post details");
        } finally {
          setFetching(false);
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save post");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Loading post details...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>{id ? "Edit Post" : "Create New Post"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
            Title:
          </label>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
            Content:
          </label>
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Post" : "Add Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditForm;
