import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { submitReview, fetchReviewsByApiId } from "../services/reviewService";

function DiseasePage() {
  const { id: api_id } = useParams(); // rename 'id' to 'api_id' for clarity
  const location = useLocation();
  const diseaseName = location.state?.name || "Unknown disease";
  const [reviews, setReviews] = useState([]);
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
        setReviews(data);
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
      const token = localStorage.getItem("token");

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
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
      setSubmitError("Could not submit review. Are you logged in?");
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Something went wrong. Please try again later.</p>;

  return (
    <div>
      <h2>Reviews for Disease ID: {api_id}</h2>

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
    </div>
  );
}

export default DiseasePage;
