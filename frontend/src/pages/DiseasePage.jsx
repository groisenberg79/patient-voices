import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { submitReview, fetchReviewsByApiId } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

function DiseasePage() {
  const { id: api_id } = useParams(); // rename 'id' to 'api_id' for clarity
  const location = useLocation();
  const diseaseName = location.state?.name || "Unknown disease";
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avgSeverity, setAvgSeverity] = useState(null);
  const hasReviewed =
    Array.isArray(reviews) && user
      ? reviews.some((review) => review.user_id === user.userId)
      : false;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [comment, setComment] = useState("");
  const [severity, setSeverity] = useState(3);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviewsByApiId(api_id);
        console.log("Fetched review data:", data); // 👈 Add this
        setReviews(data.reviews || data);
        setAvgSeverity(data.avgSeverity || null);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [api_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await submitReview({
        token,
        api_id,
        name: diseaseName,
        description: "",
        severity,
        comment,
      });

      setSubmitSuccess("Review submitted!");
      setComment("");
      setSeverity(3);

      const updatedReviews = await fetchReviewsByApiId(api_id);
      setReviews(updatedReviews.reviews || updatedReviews);
      setAvgSeverity(updatedReviews.avgSeverity || null);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 || err.response?.status === 403) {
        setSubmitError("You have already submitted a review for this disease.");
      } else {
        setSubmitError("Could not submit review. Are you logged in?");
      }
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Something went wrong. Please try again later.</p>;

  return (
    <div>
      <h2>Reviews for Disease ID: {api_id}</h2>

      {avgSeverity !== null && !isNaN(Number(avgSeverity)) && (
        <p>
          <strong>Average severity:</strong> {Number(avgSeverity).toFixed(1)} / 5
        </p>
      )}

      {reviews.length === 0 ? (
        <p>
          <em>No reviews yet. Be the first to review this condition.</em>
        </p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>Rating:</strong> {review.severity}/5
              <br />
              <strong>Comment:</strong> {review.comment}
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h3>Leave a Review</h3>

      {user?.userId && !hasReviewed ? (
        <form onSubmit={handleSubmit}>
          <label>
            Rating (1–5):
            <input
              type="number"
              min="1"
              max="5"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Submit Review</button>

          {submitSuccess && <p style={{ color: "green" }}>{submitSuccess}</p>}
          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
        </form>
      ) : hasReviewed ? (
        <p>
          <em>You’ve already submitted a review for this condition.</em>
        </p>
      ) : null}

      {!user?.userId && (
        <p style={{ color: "gray" }}>
          <em>Please log in to submit a review.</em>
        </p>
      )}
    </div>
  );
}

export default DiseasePage;
