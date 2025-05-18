import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  submitReview,
  fetchReviewsByApiId,
  rateReview,
  fetchReviewRating,
  fetchRatedReviewIds,
  deleteReview,
  updateReview, // new import
} from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

function DiseasePage() {
  const { id: api_id } = useParams();
  const location = useLocation();
  const diseaseName = location.state?.name || "Unknown disease";

  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewRatings, setReviewRatings] = useState({});
  const [avgSeverity, setAvgSeverity] = useState(null);
  const [ratedReviews, setRatedReviews] = useState(new Set());
  const [recentlyRated, setRecentlyRated] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [severity, setSeverity] = useState(3);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [globalError, setGlobalError] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editSeverity, setEditSeverity] = useState(3);

  // Sorting and filtering state
  const [sortOption, setSortOption] = useState("date");
  const [showOnlyWithComments, setShowOnlyWithComments] = useState(false);

  // Move loadReviews outside of useEffect and define as standalone function
  const loadReviews = async (api_id, user, token) => {
    try {
      const data = await fetchReviewsByApiId(api_id);
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
        const ratedSet = new Set(
          ratedIds.filter((id) => reviewList.some((r) => r.id === id))
        );
        setRatedReviews(ratedSet);
      } else {
        setRatedReviews(new Set());
      }
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
      console.error("api_id used:", api_id);
      if (err.response?.status === 404) {
        setReviews([]);
        setAvgSeverity(null);
      } else {
        setGlobalError("Could not load reviews. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(api_id, user, token);
  }, [api_id, user, token]);

  const hasReviewed =
    Array.isArray(reviews) && user
      ? reviews.some((review) => review.user_id === user.userId)
      : false;

  if (api_id === "unknown") {
    return (
      <div>
        <h2>Condition Not Found</h2>
        <p>
          We couldn't find any information on "<strong>{diseaseName}</strong>".
          Please try another search.
        </p>
      </div>
    );
  }

  // Filtering and sorting logic for reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (showOnlyWithComments) {
        return review.comment && review.comment.trim() !== "";
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "severity") {
        return b.severity - a.severity;
      } else if (sortOption === "helpfulness") {
        return (reviewRatings[b.id] || 0) - (reviewRatings[a.id] || 0);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const handleRateReview = async (reviewId) => {
    try {
      await rateReview(reviewId, token);
      const updatedCount = await fetchReviewRating(reviewId);
      setReviewRatings((prev) => ({ ...prev, [reviewId]: updatedCount }));
      setRatedReviews((prev) => new Set(prev).add(reviewId));
      setRecentlyRated((prev) => new Set(prev).add(reviewId));
    } catch (err) {
      console.error("Rating error:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId, token);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setGlobalError("Failed to delete review. Please try again later.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditComment(review.comment);
    setEditSeverity(review.severity);
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
        setGlobalError("Failed to submit review. Please try again later.");
      }
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateReview(editingReviewId, token, {
        severity: editSeverity,
        comment: editComment,
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setEditingReviewId(null);
      setEditComment("");
      setEditSeverity(3);
    } catch (err) {
      setGlobalError("Failed to update review. Please try again later.");
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      {globalError && (
        <p style={{ color: "red", fontWeight: "bold" }}>{globalError}</p>
      )}
      <h2>Reviews for {diseaseName}</h2>

      {avgSeverity !== null && !isNaN(Number(avgSeverity)) && (
        <p>
          <strong>Average severity:</strong> {Number(avgSeverity).toFixed(1)} /
          5
        </p>
      )}

      {/* Sorting and filtering controls */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Sort by:{" "}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">Newest</option>
            <option value="severity">Severity</option>
            <option value="helpfulness">Helpfulness</option>
          </select>
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={showOnlyWithComments}
            onChange={(e) => setShowOnlyWithComments(e.target.checked)}
          />{" "}
          Show only reviews with comments
        </label>
      </div>

      {filteredAndSortedReviews.length === 0 ? (
        <p>
          <em>No reviews yet. Be the first to review this condition.</em>
        </p>
      ) : (
        <div>
          {filteredAndSortedReviews.map((review) => (
            <div className="review-box" key={review.id}>
              {editingReviewId === review.id ? (
                <form onSubmit={handleUpdateReview}>
                  <label>
                    Severity:
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editSeverity}
                      onChange={(e) => setEditSeverity(Number(e.target.value))}
                    />
                  </label>
                  <br />
                  <label>
                    Review:
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                    />
                  </label>
                  <br />
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setEditingReviewId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p>
                    <strong>Severity:</strong> {review.severity}/5
                  </p>
                  <p>
                    <strong>By:</strong> {review.user?.username || "Unknown"}
                  </p>
                  <strong>Review:</strong> {review.comment}
                </>
              )}
              <br />
              <strong>Helpful votes:</strong> {reviewRatings[review.id] || 0}
              <br />
              {user?.userId && user.userId !== review.user_id && (
                <>
                  {!ratedReviews.has(review.id) &&
                  !recentlyRated.has(review.id) ? (
                    <button onClick={() => handleRateReview(review.id)}>
                      Helpful
                    </button>
                  ) : recentlyRated.has(review.id) ? (
                    <p style={{ color: "green" }}>Thanks for your feedback!</p>
                  ) : null}
                </>
              )}
              {user?.userId === review.user_id && (
                <>
                  <button
                    id="delete-button"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
                  </button>
                  <button
                    id="edit-button"
                    onClick={() => handleEditReview(review)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <hr />
      <h3>Leave a Review</h3>

      {user?.userId && !hasReviewed ? (
        <form onSubmit={handleSubmit}>
          <label>
            Severity (1–5):
            <input
              type="number"
              min="1"
              max="5"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
            />
          </label>
          <br />
          <div style={{ marginTop: "1rem" }}>
            <label
              htmlFor="review"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Review:
            </label>
            <textarea
              id="review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "100%", minHeight: "100px" }}
            />
          </div>
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
