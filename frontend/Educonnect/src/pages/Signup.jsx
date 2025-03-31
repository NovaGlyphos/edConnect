import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [bio, setBio] = useState("");
  const [educationalInstitution, setEducationalInstitution] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/signup", {
        email,
        password,
        name,
        role,
        bio,
        educationalInstitution,
      });
      console.log("Signup response:", { id: data._id, email, token: data.token.slice(0, 10) + "..." }); // Debug
      localStorage.setItem("token", data.token);
      navigate("/login"); // Redirect to login after signup
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="card bg-gray-800 shadow-lg p-8 w-full max-w-md rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">Signup</h2>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-6">
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
            placeholder="Enter your name"
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
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Role</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="student">Student</option>
            <option value="educator">Educator</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Bio</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="textarea textarea-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 resize-none"
            placeholder="Tell us about yourself"
            rows="3"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">Educational Institution</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={educationalInstitution}
            onChange={(e) => setEducationalInstitution(e.target.value)}
            placeholder="Enter your institution"
            autoComplete="organization"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          Signup
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