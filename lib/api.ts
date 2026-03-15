import axios from "axios";
import type { MemberFormData } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export const submitMemberForm = async (data: MemberFormData) => {
  const response = await api.post("/api/members", data);
  return response.data;
};

export default api;
