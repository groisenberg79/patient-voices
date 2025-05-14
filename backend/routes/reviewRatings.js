const express = require("express");
const router = express.Router();
const {
  rateReview,
  getReviewRating,
} = require("../controllers/reviewRatingController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/:review_id", authenticateToken, rateReview); // ✅ must be a function
router.get("/:review_id", getReviewRating);

module.exports = router;
