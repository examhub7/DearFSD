import { useEffect, useState } from "react";
import Header from "./Header";
import Post from "./Post";
import API_URL from "../api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/posts`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts (${response.status})`);
      }

      const result = await response.json();
      setPosts(result.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
  };

  return (
    <div>
      <Header />

      <div className="posts-container">
        {loading && <p>Loading posts...</p>}

        {error && (
          <div style={{ color: "red", padding: "1rem" }}>
            <p>Error: {error}</p>
            <button onClick={fetchPosts}>Retry</button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p>No posts available.</p>
        )}

        {!loading &&
          posts.map((post) => (
            <Post key={post._id} post={post} onDelete={handleDeletePost} />
          ))}
      </div>
    </div>
  );
}

export default Home;
