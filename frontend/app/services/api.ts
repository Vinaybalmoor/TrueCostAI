import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`;

export const analyzeCost = async (payload: unknown) => {
  const response = await axios.post(API_URL, payload);

  return response.data;
};
