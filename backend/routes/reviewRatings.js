const express = require("express");
const router = express.Router();
const {
  rateReview,
  getReviewRating,
} = require("../controllers/reviewRatingController");
const authenticateToken = require("../middleware/auth");

router.post("/:review_id", authenticateToken, (req, res, next) => rateReview(req, res).catch(next));
router.get("/:review_id", getReviewRating);

module.exports = router;
