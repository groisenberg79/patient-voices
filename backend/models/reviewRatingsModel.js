const pool = require("../db");

// 1. Add a new rating (one per user per review)
const addReviewRating = async (userId, reviewId) => {
  const result = await pool.query(
    `INSERT INTO review_ratings (user_id, review_id, rating_value)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, review_id) DO NOTHING
     RETURNING *`,
    [userId, reviewId]
  );
  return result.rows[0];
};

// 2. Get total rating count for a review
const getReviewRatingCount = async (reviewId) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM review_ratings WHERE review_id = $1`,
    [reviewId]
  );
  return parseInt(result.rows[0].count, 10);
};

// 3. Optional: check if a user has already rated
const hasUserRated = async (userId, reviewId) => {
  const result = await pool.query(
    `SELECT * FROM review_ratings WHERE user_id = $1 AND review_id = $2`,
    [userId, reviewId]
  );
  return result.rows.length > 0;
};

module.exports = {
  addReviewRating,
  getReviewRatingCount,
  hasUserRated,
};
