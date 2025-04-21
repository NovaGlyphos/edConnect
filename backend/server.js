require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const commentRoutes = require("./routes/commentRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const educatorRoutes = require("./routes/educatorRoutes");
const postRoutes = require("./routes/postRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes"); // Added

const { apiLimiter } = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();
const server = http.createServer(app);

// CORS setup for frontend communication
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Socket.IO setup for real-time features (e.g., notifications, events)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const token = socket.handshake.auth.token;
  console.log("Received token:", token); // Log the token for debugging

  if (!token) {
    console.log("No token provided, disconnecting socket:", socket.id);
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log the decoded payload

    if (!decoded._id) {
      console.error("Token payload missing '_id':", decoded);
      socket.disconnect();
      return;
    }

    const userId = decoded._id.toString();
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);

    // Event-specific listeners (optional, for debugging or future use)
    socket.on("newEvent", (event) => {
      console.log(`User ${userId} received new event:`, event);
    });
    socket.on("eventRegistration", (data) => {
      console.log(`User ${userId} received registration update:`, data);
    });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    socket.disconnect();
  }

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// Attach io to app for use in controllers
app.set("io", io);

// Middleware to pass io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve static files (e.g., profile pics)
app.use(apiLimiter); // Rate limiting for API security

// Routes
app.use("/api/auth", authRoutes);           // Authentication (login, signup)
app.use("/api/bookmarks", bookmarkRoutes);  // Bookmark-related endpoints
app.use("/api/comments", commentRoutes);    // Comment-related endpoints
app.use("/api/discussions", discussionRoutes); // Discussion-related endpoints
app.use("/api/educators", educatorRoutes);  // Fetch educators list
app.use("/api/posts", postRoutes);          // Post-related endpoints
app.use("/api/events", eventsRoutes);       // Events endpoints
app.use("/api/notifications", notificationRoutes); // Notification endpoints
app.use("/api/users", userRoutes);          // User profile and follow system
app.use("/api/search", searchRoutes);       // Search endpoints (Added)

// Error handling middleware (should be last)
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });