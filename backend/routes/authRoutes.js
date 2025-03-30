const express = require("express");
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  ],
  signup
);
router.post("/login", login);
router.get("/profile", protect, getMe);

module.exports = router;