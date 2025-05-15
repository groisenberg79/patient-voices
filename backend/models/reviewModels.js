const pool = require("../db");

const findDiseaseByApiId = async (apiId) => {
  const result = await pool.query("SELECT * FROM diseases WHERE api_id = $1", [
    apiId,
  ]);
  return result.rows[0];
};

const createDisease = async (apiId, name, description) => {
  const result = await pool.query(
    "INSERT INTO diseases (api_id, name, description) VALUES ($1, $2, $3) RETURNING *",
    [apiId, name, description]
  );
  return result.rows[0];
};

const createReview = async (userId, diseaseId, severity, comment) => {
  const result = await pool.query(
    "INSERT INTO reviews (user_id, disease_id, severity, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, diseaseId, severity, comment]
  );
  return result.rows[0];
};

const deleteReviewByIdAndUser = async (reviewId, userId) => {
  const result = await pool.query(
    "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *",
    [reviewId, userId]
  );
  return result.rowCount > 0;
};

const getReviewsByDiseaseId = async (diseaseId) => {
  const result = await pool.query(
    "SELECT reviews.*, users.email FROM reviews JOIN users ON reviews.user_id = users.id WHERE disease_id = $1 ORDER BY created_at DESC",
    [diseaseId]
  );
  return result.rows;
};

const hasUserReviewedDisease = async (userId, diseaseId) => {
  const result = await pool.query(
    "SELECT 1 FROM reviews WHERE user_id = $1 AND disease_id = $2",
    [userId, diseaseId]
  );
  return result.rows.length > 0;
};

const getAverageSeverity = async (diseaseId) => {
  const result = await pool.query(
    "SELECT AVG(severity) AS avg FROM reviews WHERE disease_id = $1",
    [diseaseId]
  );
  return result.rows[0].avg;
};

module.exports = {
  findDiseaseByApiId,
  createDisease,
  createReview,
  getReviewsByDiseaseId,
  hasUserReviewedDisease,
  getAverageSeverity,
  deleteReviewByIdAndUser,
};
