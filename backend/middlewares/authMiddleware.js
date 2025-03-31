const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  console.log("protect - Headers:", req.headers); // Debug
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("protect - Token received:", token.slice(0, 10) + "...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("protect - Decoded token:", decoded);
      req.user = await User.findById(decoded._id).select("-password"); // Changed from decoded.id to decoded._id
      if (!req.user) {
        console.log("protect - User not found for ID:", decoded._id);
        return res.status(404).json({ message: "User not found" }); // Changed to 404 for clarity
      }
      console.log("protect - User set:", req.user._id);
      next();
    } catch (error) {
      console.error("protect - Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    console.log("protect - No token provided in headers");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };