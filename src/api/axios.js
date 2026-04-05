import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");

  if (token) {
    // ✅ Remove duplicate Bearer if present
    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;