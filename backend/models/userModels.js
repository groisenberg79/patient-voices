const pool = require('../db');

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const createUser = async (email, hashedPassword) => {
  await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
};

module.exports = { findUserByEmail, createUser };