import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";
import { FaGlobe } from "react-icons/fa"; // Import globe icon

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useContext(LanguageContext);
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
      console.log("Token stored in localStorage:", localStorage.getItem("token").slice(0, 10) + "...");
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || t.loginFailed);
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

      <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">{t.login}</h2>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-6">
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
            autoComplete="email"
            placeholder={t.email}
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
            autoComplete="current-password"
            placeholder={t.password}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          {t.login}
        </button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        {t.dontHaveAccount}{" "}
        <span
          className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium"
          onClick={() => navigate("/signup")}
        >
          {t.signUpLink}
        </span>
      </p>
    </div>
  );
};

export default Login;