const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middlewares/rateLimiter");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Ensure "uploads" directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ API Rate Limiting
app.use(apiLimiter);

// ✅ Static file serving for uploaded files
app.use("/uploads", express.static(uploadsDir));

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const educatorRoutes = require("./routes/educatorRoutes");

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/educators", educatorRoutes); // Educators API

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("EduConnect API is running...");
});

// ✅ Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
