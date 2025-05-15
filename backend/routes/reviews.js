const express = require("express");
const router = express.Router();
const {
  submitReview,
  fetchReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth");

// Submit a review (requires login)
router.post("/", authenticateToken, submitReview);

router.delete("/:review_id", authenticateToken, deleteReview);

// Fetch reviews for a disease by API ID
router.get("/:api_id", fetchReviews);

router.get("/disease/:api_id", fetchReviews);

module.exports = router;
