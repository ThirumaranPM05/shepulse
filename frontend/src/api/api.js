import axios from "axios";

// ✅ Local FastAPI backend (working version)
export const API_BASE = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
