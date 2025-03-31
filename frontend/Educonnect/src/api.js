import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Interceptor - Request URL:", config.url);
    console.log("Interceptor - Token:", token ? token : "No token found");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Interceptor - Authorization Header Set:", config.headers.Authorization);
    } else {
      console.warn("Interceptor - No token available to send");
    }
    return config;
  },
  (error) => {
    console.error("Interceptor - Request setup error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Interceptor - Response from:", response.config.url, "Status:", response.status);
    return response;
  },
  (error) => {
    console.error("Interceptor - Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data || error.message,
    });
    return Promise.reject(error);
  }
);

export const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ["websocket"],
});

socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("connect_error", (err) => console.error("Socket connection error:", err.message));
socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

export default api;