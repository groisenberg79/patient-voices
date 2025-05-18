import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
        email,
        password,
        name,
        country,
        username,
      });

      if (response.data) {
        if (response.data.token) {
          const { token } = response.data;
          login(token);
          setSuccess("Registration successful! You are now logged in.");
        } else {
          setSuccess("Registration successful! You can now log in.");
        }
      } else {
        setError("Registration failed. Unexpected response from server.");
      }
    } catch (err) {
      console.error(err);
      let message = "Registration failed.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err.message) {
        message = err.message;
      }
      if (message.toLowerCase().includes("username")) {
        setError("Username is already taken.");
      } else {
        setError(message);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label><br />
        <label>Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label><br />
        <label>Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label><br />
        <label>Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label><br />
        <label>Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label><br />
        <button type="submit">Register</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;