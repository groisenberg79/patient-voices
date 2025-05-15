import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  submitReview,
  fetchReviewsByApiId,
  rateReview,
  fetchReviewRating,
  fetchRatedReviewIds,
} from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

function DiseasePage() {
  const { id: api_id } = useParams(); // rename 'id' to 'api_id' for clarity
  const location = useLocation();
  const diseaseName = location.state?.name || "Unknown disease";
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [reviewRatings, setReviewRatings] = useState({});
  const [avgSeverity, setAvgSeverity] = useState(null);
  // Track which reviews the user has already rated
  const [ratedReviews, setRatedReviews] = useState(new Set());
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
        console.log("Fetched review data:", data);
        const reviewList = data.reviews || data;
        setReviews(reviewList);
        setAvgSeverity(data.avgSeverity || null);

        const ratings = {};
        for (const review of reviewList) {
          ratings[review.id] = await fetchReviewRating(review.id);
        }
        setReviewRatings(ratings);

        if (user && token) {
          const ratedIds = await fetchRatedReviewIds(user.userId, token);
          const validRatedIds = ratedIds.filter((id) =>
            reviewList.some((r) => r.id === id)
          );
          setRatedReviews(new Set(validRatedIds));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [api_id, user, token]);

  const handleRateReview = async (reviewId) => {
    try {
      await rateReview(reviewId, token);
      const updatedCount = await fetchReviewRating(reviewId);
      setReviewRatings((prev) => ({ ...prev, [reviewId]: updatedCount }));
      setRatedReviews((prev) => new Set(prev).add(reviewId));
    } catch (err) {
      console.error("Rating error:", err);
    }
  };

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
          <strong>Average severity:</strong> {Number(avgSeverity).toFixed(1)} /
          5
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
              <br />
              <strong>Helpful votes:</strong> {reviewRatings[review.id] || 0}
              <br />
              {user?.userId && !ratedReviews.has(review.id) && (
                <button onClick={() => handleRateReview(review.id)}>
                  Helpful
                </button>
              )}
              {user?.userId && ratedReviews.has(review.id) && (
                <p style={{ color: "green" }}>Thanks for your feedback!</p>
              )}
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
