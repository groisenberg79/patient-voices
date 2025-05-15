const {
  findDiseaseByApiId,
  createDisease,
  createReview,
  getReviewsByDiseaseId,
  hasUserReviewedDisease,
  getAverageSeverity,
  deleteReviewByIdAndUser,
} = require("../models/reviewModels");

const submitReview = async (req, res) => {
  const { api_id, name, description, severity, comment } = req.body;
  const userId = req.user.userId; // from JWT middleware

  try {
    let disease = await findDiseaseByApiId(api_id);

    if (!disease) {
      disease = await createDisease(api_id, name, description);
    }
    const alreadyReviewed = await hasUserReviewedDisease(userId, disease.id);

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this disease." });
    }
    const newReview = await createReview(userId, disease.id, severity, comment);

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error submitting review" });
  }
};

const fetchReviews = async (req, res) => {
  const { api_id } = req.params;
  console.log("API ID from request:", api_id);

  try {
    const disease = await findDiseaseByApiId(api_id);
    console.log("Disease found:", disease);

    if (!disease) {
      return res.status(404).json({ error: "Disease not found in database" });
    }

    const reviews = await getReviewsByDiseaseId(disease.id);
    const avgSeverity = await getAverageSeverity(disease.id);
    res.json({ reviews, avgSeverity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.review_id;
  const userId = req.user.userId;

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

module.exports = {
  submitReview,
  fetchReviews,
  deleteReview,
};
