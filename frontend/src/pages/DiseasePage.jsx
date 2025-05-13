import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReviewsByApiId } from "../services/reviewService";

function DiseasePage() {
  const { id: api_id } = useParams(); // rename 'id' to 'api_id' for clarity
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    </div>
  );
}

export default DiseasePage;
