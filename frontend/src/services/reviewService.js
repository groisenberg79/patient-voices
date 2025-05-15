import axios from "axios";
const BASE_URL = "https://patient-voices-backend.onrender.com";

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

export const submitReview = async ({
  token,
  api_id,
  name,
  description,
  severity,
  comment,
}) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
    {
      api_id,
      name,
      description,
      severity,
      comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const rateReview = async (reviewId, token) => {
  const res = await axios.post(
    `${BASE_URL}/api/review-ratings/${reviewId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const fetchReviewRating = async (reviewId) => {
  const res = await axios.get(`${BASE_URL}/api/review-ratings/${reviewId}`);
  return res.data.total;
};

export const fetchRatedReviewIds = async (userId, token) => {
  const res = await axios.get(`${BASE_URL}/api/review-ratings/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.ratedReviewIds; // array of IDs
};
