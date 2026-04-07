import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Attach token automatically to every request
API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      // 🔥 Ensure no duplicate "Bearer "
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle unauthorized globally (VERY IMPORTANT)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized - logging out");

      // 🔥 Clear token + redirect
      localStorage.removeItem("token");

      // Avoid infinite redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;