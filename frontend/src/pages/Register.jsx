import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://patient-voices-backend.onrender.com/api/users/register", {
        email,
        password,
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
      const message =
        err.response?.data?.message ||
        "Registration failed. Email may already be in use.";
      setError(message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
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