import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";
import { FaGlobe } from "react-icons/fa"; // Import globe icon

const Signup = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useContext(LanguageContext);
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
      console.log("Signup response:", { id: data._id, email, token: data.token.slice(0, 10) + "..." });
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setError(error.response?.data?.message || t.signupFailed);
    }
  };

  return (
    <div className="card bg-gray-800 shadow-lg p-8 w-full max-w-md rounded-lg border border-gray-700 relative">
      {/* Language Selection Dropdown */}
      <div className="absolute top-4 right-4 dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-sm text-gray-200 hover:bg-gray-700 transition-colors">
          <FaGlobe className="mr-1" /> {language === "en" ? "English" : "हिन्दी"}
        </label>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-gray-700 rounded-box w-36 border border-gray-600">
          <li>
            <button
              onClick={() => setLanguage("en")}
              className="text-gray-200 hover:bg-gray-600 transition-colors"
            >
              English
            </button>
          </li>
          <li>
            <button
              onClick={() => setLanguage("hi")}
              className="text-gray-200 hover:bg-gray-600 transition-colors"
            >
              हिन्दी
            </button>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">{t.signup}</h2>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">{t.name}</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t.name}
            autoComplete="name"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">{t.email}</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t.email}
            autoComplete="email"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">{t.password}</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t.password}
            autoComplete="new-password"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">{t.role}</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="student">{t.student}</option>
            <option value="educator">{t.educator}</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">{t.bio}</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="textarea textarea-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 resize-none"
            placeholder={t.bio}
            rows="3"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300 font-medium">{t.educationalInstitution}</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            value={educationalInstitution}
            onChange={(e) => setEducationalInstitution(e.target.value)}
            placeholder={t.educationalInstitution}
            autoComplete="organization"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          {t.signup}
        </button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        {t.alreadyHaveAccount}{" "}
        <span
          className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium"
          onClick={() => navigate("/login")}
        >
          {t.loginLink}
        </span>
      </p>
    </div>
  );
};

export default Signup;