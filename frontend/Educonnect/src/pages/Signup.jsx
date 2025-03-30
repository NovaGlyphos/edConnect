// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { name, email, password, role };
      if (role === "educator") payload.subject = subject;
      await api.post("/auth/register", payload);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="card bg-gray-800 shadow-lg p-8 w-full max-w-md rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">Sign Up</h2>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
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
            autoComplete="new-password"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Role</span>
          </label>
          <select
            className="select select-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="educator">Educator</option>
          </select>
        </div>
        {role === "educator" && (
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Subject</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        Already have an account?{" "}
        <span
          className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;