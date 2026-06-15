import axios from "axios";

const API_URL = "http://localhost:3000/api/analyze";

export const analyzeCost = async (payload: unknown) => {
  const response = await axios.post(API_URL, payload);

  return response.data;
};
