const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login - Attempt:", { email });
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      console.log("Login - Failed: Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Login - Success - Generated Token:", token);
    console.log("Login - User Data:", { _id: user._id, name: user.name });
    res.json({ token, _id: user._id, name: user.name });
  } catch (err) {
    console.error("Login - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role, bio, educationalInstitution } = req.body;
    const user = new User({
      email,
      password,
      name,
      role,
      bio,
      educationalInstitution,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Signup success - Token payload:", { _id: user._id, name: user.name });
    res.status(201).json({ token, _id: user._id, name: user.name });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile", require("../middlewares/authMiddleware").protect, async (req, res) => {
  try {
    console.log("Profile - Fetching user:", req.user._id);
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;