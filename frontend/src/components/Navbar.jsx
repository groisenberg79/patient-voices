import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      {!user ? (
        <>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        </>
      ) : (
        <>
          <Link to="/profile" style={{ marginRight: "10px" }}>Your Profile</Link>
          <button id="logout-button" onClick={handleLogout}>Logout</button>
          <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
            Logged in as: {user.email}
          </span>
        </>
      )}
    </nav>
  );
}

export default Navbar;