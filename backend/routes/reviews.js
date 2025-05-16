const express = require("express");
const router = express.Router();
const {
  submitReview,
  fetchReviews,
  deleteReview,
  editReview,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth");

// Submit a review (requires login)
router.post("/", authenticateToken, submitReview);

router.delete("/:review_id", authenticateToken, deleteReview);

router.put("/:review_id", authenticateToken, editReview);


router.get("/disease/:api_id", fetchReviews);

module.exports = router;
