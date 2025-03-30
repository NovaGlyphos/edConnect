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
const subjectRoutes = require("./routes/subjectRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { apiLimiter } = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();
const server = http.createServer(app);

// CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Socket.IO setup
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
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.join(decoded.id.toString());
      console.log(`User ${decoded.id} joined room ${decoded.id.toString()}`);
    } catch (error) {
      console.error("Invalid token:", error.message);
      socket.disconnect();
    }
  }

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

app.set("io", io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/educators", educatorRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling
app.use(errorHandler);

// Start server
// Replace your connectDB() call in server.js with this:
// Start server
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    
    // No need to directly access mongoose here since we're using connectDB()
    
    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });