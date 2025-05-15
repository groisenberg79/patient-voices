const express = require("express");
const router = express.Router();
const {
  rateReview,
  getReviewRating,
  getRatedReviewIdsByUser,
} = require("../controllers/reviewRatingController");
const { authenticateToken } = require("../middleware/auth");

router.post("/:review_id", authenticateToken, rateReview);
router.get("/:review_id", getReviewRating);
router.get("/user/:user_id", authenticateToken, getRatedReviewIdsByUser);

module.exports = router;
