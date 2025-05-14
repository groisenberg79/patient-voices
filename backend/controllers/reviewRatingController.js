const {
  addReviewRating,
  getReviewRatingCount,
  hasUserRated,
} = require("../models/reviewRatingsModel");

const rateReview = async (req, res) => {
  const userId = req.user.userId;
  const { review_id } = req.params;

  try {
    const alreadyRated = await hasUserRated(userId, review_id);
    if (alreadyRated) {
      return res
        .status(400)
        .json({ error: "You have already rated this review." });
    }

    await addReviewRating(userId, review_id);
    const total = await getReviewRatingCount(review_id);

    res.json({ message: "Review rated successfully.", total });
  } catch (err) {
    console.error("Error rating review:", err.message);
    res.status(500).json({ error: "Failed to rate review." });
  }
};

const getReviewRating = async (req, res) => {
  const { review_id } = req.params;

  try {
    const total = await getReviewRatingCount(review_id);
    res.json({ total });
  } catch (err) {
    console.error("Error getting review rating:", err.message);
    res.status(500).json({ error: "Failed to fetch rating count." });
  }
};

module.exports = { rateReview, getReviewRating };
