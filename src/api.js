import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const api = axios.create({
  baseURL: API_BASE
});
