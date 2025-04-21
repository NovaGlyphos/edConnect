import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

const NavBar = ({ onLogout }) => {
  const { t } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="navbar bg-gray-900 shadow-md px-4 py-3 z-50 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 flex items-center gap-2 transition-colors hover:text-blue-300"
          >
            <span className="text-3xl">🚀</span> {t.educonnect}
          </Link>
        </div>

        {/* Right Section: Search, Navigation, and Mobile Search */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search || "Search me"}
              className="input bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-lg py-2 px-4 w-48 md:w-64 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Navigation Links */}
          <ul className="menu menu-horizontal flex items-center gap-2 md:gap-4">
            <li>
              <Link
                to="/"
                className="text-gray-200 font-medium hover:text-blue-400 transition-colors text-sm md:text-base"
              >
                {t.home}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-200 font-medium hover:text-blue-400 transition-colors text-sm md:text-base"
              >
                {t.aboutUs || "About Us"}
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="text-gray-200 font-medium hover:text-blue-400 transition-colors text-sm md:text-base"
              >
                {t.events}
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="text-gray-200 font-medium hover:text-red-400 transition-colors text-sm md:text-base"
              >
                {t.logout}
              </button>
            </li>
          </ul>

          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <button
              onClick={() => navigate("/search")}
              className="text-gray-200 hover:text-blue-400 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;