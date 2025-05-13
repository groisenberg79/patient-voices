import axios from "axios";

export const fetchReviewsByApiId = async (api_id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/reviews/disease/${api_id}`
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return []; // No reviews yet
    } else {
      throw err; // Let caller handle other errors
    }
  }
};
