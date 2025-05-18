const { getUserById } = require("../models/userModels");
const { findUserByEmail, createUser } = require("../models/userModels");
const { hashPassword, checkPassword, getToken } = require("../middleware/auth");

const registerUser = async (req, res) => {
  const { email, password, name, country } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the DB
    await createUser(email, hashedPassword, name, country);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration. Please check input fields." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare hashed passwords
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT
    const token = getToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user ID provided" });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, name, country } = user;
    res.json({ email, name, country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while retrieving user profile" });
  }
};

const { updateUserProfile } = require("../models/userModels");

const updateUser = async (req, res) => {
  const userId = req.user?.id;
  const { name, country } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user ID provided" });
  }

  try {
    await updateUserProfile(userId, name, country);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating profile" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUser };
