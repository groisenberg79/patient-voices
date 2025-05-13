const express = require("express");
const router = express.Router();
const {
  submitReview,
  fetchReviews,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth");

// Submit a review (requires login)
router.post("/", authenticateToken, submitReview);

// Fetch reviews for a disease by API ID
router.get("/:api_id", fetchReviews);

router.get("/disease/:id", fetchReviews);

module.exports = router;
