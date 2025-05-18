const pool = require('../db');

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const createUser = async (email, hashedPassword, name, country) => {
  await pool.query(
    "INSERT INTO users (email, password, name, country) VALUES ($1, $2, $3, $4)",
    [email, hashedPassword, name, country]
  );
};

const getUserById = async (id) => {
  const result = await pool.query("SELECT id, email, name, country FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

module.exports = { findUserByEmail, createUser, getUserById };