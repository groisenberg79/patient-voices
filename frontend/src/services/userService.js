import axios from "axios";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
    { email, password }
  );
  return response.data; // contains { token }
};

export const updateUserProfile = async (updatedData, token) => {
  const response = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
