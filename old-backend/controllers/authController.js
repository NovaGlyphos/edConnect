const User = require("../models/User");
const Educator = require("../models/Educator");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, subject } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Store the password as plain text (no hashing)
    const user = await User.create({
      name,
      email,
      password, // saving password directly
      role,
    });

    if (role === "educator") {
      await Educator.create({
        user: user._id,
        name: user.name,
        email: user.email,
        subject: subject || "Unknown",
        followers: [],
      });
    }

    console.log("User signed up:", { id: user._id, email: user.email, password }); // Debug: log plaintext

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email, password }); // Debug: log plaintext temporarily

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? { id: user._id, email: user.email } : "No user found");

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Directly compare plain text passwords
    if (password !== user.password) {
      console.log("Login failed: Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    console.log("Login successful, token:", token.slice(0, 10) + "...");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getMe };
