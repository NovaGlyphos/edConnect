// src/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ onLogout }) => {
  return (
    <header className="navbar bg-gray-900 shadow-md px-6 py-4 z-50 border-b border-gray-800">
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-400 flex items-center gap-2 transition-colors hover:text-blue-300"
        >
          <span className="text-3xl">🚀</span> EduConnect
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-200 font-medium hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/bookmarks"
              className="text-gray-200 font-medium hover:text-blue-400 transition-colors"
            >
              Bookmarks
            </Link>
          </li>
          <li>
            <button
              onClick={onLogout}
              className="text-gray-200 font-medium hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;