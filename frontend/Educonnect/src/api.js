import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create socket connection
export const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ["websocket", "polling"], // Add polling as fallback
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

export const reconnectSocket = () => {
  if (!socket.connected) {
    console.log("Reconnecting socket...");
    socket.auth = { token: localStorage.getItem("token") }; // Refresh token
    socket.connect();
  }
};

export default api;