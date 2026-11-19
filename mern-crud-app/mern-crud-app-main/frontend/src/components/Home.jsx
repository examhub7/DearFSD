
import { useEffect, useState } from "react";
import Header from "./Header";
import Post from "./Post";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${API_URL}/api/v1/posts`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const result = await response.json();
        setPosts(result.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <Header />

      <div className="posts-container">
        {loading && <p>Loading posts...</p>}

        {error && <p>Error: {error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p>No posts available.</p>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
