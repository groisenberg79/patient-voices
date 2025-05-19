const hasUserReviewedApiId = async (userId, apiId) => {
  const result = await pool.query(
    "SELECT 1 FROM reviews WHERE user_id = $1 AND api_id = $2",
    [userId, apiId]
  );
  return result.rows.length > 0;
};
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

const createReview = async (userId, apiId, severity, comment) => {
  const result = await pool.query(
    "INSERT INTO reviews (user_id, api_id, severity, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, apiId, severity, comment]
  );
  return result.rows[0];
};

const getReviewsByApiId = async (apiId) => {
  const result = await pool.query(
    "SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id WHERE api_id = $1 ORDER BY created_at DESC",
    [apiId]
  );
  return result.rows;
};

const getAverageSeverityByApiId = async (apiId) => {
  const result = await pool.query(
    "SELECT AVG(severity) AS avg FROM reviews WHERE api_id = $1",
    [apiId]
  );
  return result.rows[0].avg;
};

const deleteReviewByIdAndUser = async (reviewId, userId) => {
  const result = await pool.query(
    "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *",
    [reviewId, userId]
  );
  return result.rowCount > 0;
};

const updateReviewByIdAndUser = async (reviewId, userId, newSeverity, newComment) => {
  const result = await pool.query(
    "UPDATE reviews SET severity = $1, comment = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *",
    [newSeverity, newComment, reviewId, userId]
  );
  return result.rows[0];
};

const getReviewsByDiseaseId = async (diseaseId) => {
  const result = await pool.query(
    "SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id WHERE disease_id = $1 ORDER BY created_at DESC",
    [diseaseId]
  );
  return result.rows;
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
  getReviewsByApiId,
  getAverageSeverityByApiId,
  getReviewsByDiseaseId,
  getAverageSeverity,
  deleteReviewByIdAndUser,
  updateReviewByIdAndUser,
  hasUserReviewedApiId,
};
