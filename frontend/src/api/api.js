import axios from "axios";

// ✅ Auto switch between local & production
const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});