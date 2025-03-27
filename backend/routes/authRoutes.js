const express = require("express");
const { signup, login } = require("../controllers/authController"); // ✅ Ensure correct import
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  signup
);

router.post("/login", login);

module.exports = router;
