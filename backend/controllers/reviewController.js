const pool = require("../db");
const {
  findDiseaseByApiId,
  createDisease,
  createReview,
  hasUserReviewedApiId,
  deleteReviewByIdAndUser,
  updateReviewByIdAndUser,
  getReviewsByApiId,
  getAverageSeverityByApiId,
} = require("../models/reviewModels");

const submitReview = async (req, res) => {
  // api_id comes from the frontend, disease_id is resolved server-side
  const { api_id, name, description, severity, comment } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - user not logged in" });
  }

  try {
    console.log("Looking up disease by api_id:", api_id);
    let disease = await findDiseaseByApiId(api_id);

    if (!disease) {
      console.log("Disease not found. Creating new disease...");
      disease = await createDisease(api_id, name, description);
      console.log("New disease created:", disease);
    }
    const alreadyReviewed = await hasUserReviewedApiId(userId, api_id);

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this disease." });
    }
    // Store review using api_id directly
    const newReview = await createReview(userId, api_id, severity, comment);
    console.log("New review created:", newReview);
    const userResult = await pool.query("SELECT username FROM users WHERE id = $1", [userId]);
    const username = userResult.rows[0]?.username;
    res.status(201).json({ ...newReview, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error submitting review" });
  }
};

const fetchReviews = async (req, res) => {
  const { api_id } = req.params;
  console.log("API ID from request:", api_id);

  try {
    const reviews = await getReviewsByApiId(api_id);
    console.log("Fetched reviews:", reviews);
    const avgSeverity = await getAverageSeverityByApiId(api_id);
    console.log("Average severity:", avgSeverity);
    res.json({ reviews, avgSeverity });
  } catch (err) {
    console.error("❌ Error in fetchReviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.review_id;
  const userId = req.user.id;

  try {
    const deleted = await deleteReviewByIdAndUser(reviewId, userId);
    if (!deleted) {
      return res
        .status(403)
        .json({ error: "Unauthorized or review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

const editReview = async (req, res) => {
  const reviewId = req.params.review_id;
  const userId = req.user.id;
  const { severity, comment } = req.body;

  try {
    const updatedReview = await updateReviewByIdAndUser(
      reviewId,
      userId,
      severity,
      comment
    );

    if (!updatedReview) {
      return res
        .status(403)
        .json({ error: "Unauthorized or review not found" });
    }

    res.json(updatedReview);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
};

module.exports = {
  submitReview,
  fetchReviews,
  deleteReview,
  editReview,
};
