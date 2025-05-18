import { useEffect, useState } from "react";
import axios from "axios";

const fetchProfile = async (setProfile, setLoading, setError) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token used in request:", token);
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProfile(res.data);
  } catch (err) {
    console.error("Full error:", err.response?.data || err.message);
    setError("Failed to load profile.");
  } finally {
    setLoading(false);
  }
};

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");

  useEffect(() => {
    fetchProfile(setProfile, setLoading, setError);
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        { name: editName, country: editCountry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile((prev) => ({ ...prev, name: editName, country: editCountry }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>

      {isEditing ? (
        <form
          onSubmit={handleProfileUpdate}
        >
          <div>
            <label>
              Name:
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Country:
              <input
                type="text"
                value={editCountry}
                onChange={(e) => setEditCountry(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Country:</strong> {profile.country}
          </p>
          <button onClick={() => {
            setEditName(profile.name);
            setEditCountry(profile.country);
            setIsEditing(true);
          }}>
            Edit Profile
          </button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default UserProfile;
