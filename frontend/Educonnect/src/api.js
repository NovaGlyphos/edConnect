import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Attach Authorization Token for Protected Routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Ensure token is added only for protected routes
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Global Response Handling
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    // If unauthorized, remove token and redirect to login
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
