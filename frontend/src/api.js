import axios from "axios";

/**
 * Centralized Axios instance.
 * Base URL is driven by VITE_API_BASE_URL in frontend/.env
 * so you never hardcode the backend address anywhere else.
 */
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export default api;
