const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/userController.js");

const { authenticateToken } = require("../middleware/auth.js");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

module.exports = router;
