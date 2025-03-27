import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="navbar bg-base-200 shadow-md px-6 py-3">
      <div className="flex-1">
        <Link 
          to="/" 
          className="text-xl font-bold transition-all duration-300 text-blue-500 hover:text-blue-600"
          style={{ textShadow: "2px 2px 10px rgba(0, 132, 255, 0.5)" }}
        >
          🚀 EduConnect
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal space-x-4">
          <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
          <li><Link to="/bookmarks" className="hover:text-blue-500 transition-colors">Bookmarks</Link></li>
          <li><Link to="/login" className="hover:text-blue-500 transition-colors">Login</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
