import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed origins for CORS
const defaultOrigins = [
  "https://mern-crud-frontend-theta.vercel.app",
  "https://mern-crud-frontend-diplomaqx-9468.vercel.app",
  "https://mern-crud-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const envFrontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim().replace(/\/+$/, ""))
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envFrontendUrl]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl, Postman, health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        /^https:\/\/mern-crud-frontend.*\.vercel\.app$/.test(cleanOrigin)
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "mernDB";

// Post schema and model
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

// CRUD operations for Blog Posts

// Create a new post
app.post("/api/v1/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const post = new Post({ title, content });
    await post.save();
    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to create post" });
  }
});

// Read all posts
app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Posts retrieved successfully", data: posts });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to retrieve posts" });
  }
});

// Read post by id
app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post retrieved successfully", data: post });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to retrieve post" });
  }
});

// Update post by id
app.put("/api/v1/posts/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post updated successfully", data: post });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update post" });
  }
});

// Delete post by id
app.delete("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully", data: post });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to delete post" });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Express Test", status: "healthy" });
});

// Connect to MongoDB and start the server
const startServer = async () => {
  if (!mongoUri) {
    console.error("MongoDB Connection Failed: MONGO_URI environment variable is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Successfully");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
