import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login attempt from frontend:", { email, password: password.length > 0 ? "[hidden]" : "empty" });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      console.log("Login response:", { id: data._id, name: data.name, token: data.token.slice(0, 10) + "..." });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name }));
      console.log("Token stored in localStorage:", localStorage.getItem("token").slice(0, 10) + "..."); // Debug
      setIsAuthenticated(true);
      navigate("/"); // Redirect after setting state
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="card bg-gray-800 shadow-lg p-8 w-full max-w-md rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">Login</h2>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        Don't have an account?{" "}
        <span
          className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;