const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("../controllers/authController");
const router = express.Router();

// Route for registering a user
router.post("/register", registerUser);

// Route for logging in a user
router.post("/login", loginUser);

// Route for already loggedIn user details
router.post("/user-details", getUserDetails);

module.exports = router;
