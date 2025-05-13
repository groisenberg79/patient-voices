const {
  findDiseaseByApiId,
  createDisease,
  createReview,
  getReviewsByDiseaseId,
} = require("../models/reviewModels");

const submitReview = async (req, res) => {
  const { api_id, name, description, severity, comment } = req.body;
  const userId = req.user.userId; // from JWT middleware

  try {
    let disease = await findDiseaseByApiId(api_id);

    if (!disease) {
      disease = await createDisease(api_id, name, description);
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
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};
module.exports = {
  submitReview,
  fetchReviews,
};
