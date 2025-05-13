import axios from "axios";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
    { email, password }
  );
  return response.data; // contains { token }
};
