import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Interceptor - Request URL:", config.url);
    console.log("Interceptor - Token:", token ? token.slice(0, 10) + "..." : "No token found");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Interceptor - Authorization Header Set:", config.headers.Authorization.slice(0, 20) + "...");
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
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const createSocket = () => {
  const token = localStorage.getItem("token");
  const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("Socket connected:", socket.id));
  socket.on("connect_error", (err) => console.error("Socket connection error:", err.message));
  socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
  socket.on("newEvent", (event) => console.log("New event received:", event));
  socket.on("eventRegistration", (data) => console.log("Event registration received:", data));

  return socket;
};

export let socket = createSocket();

export const reconnectSocket = () => {
  if (socket.connected) socket.disconnect();
  socket = createSocket();
};

export default api;