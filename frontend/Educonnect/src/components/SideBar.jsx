import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBookmark, FaComments, FaUserGraduate, FaBook, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-base-200 h-full p-5 shadow-lg flex flex-col">
      {/* Navigation Links */}
      <nav className="space-y-3 flex-grow">
        <NavItem to="/" icon={<FaHome />} label="Home" />
        <NavItem to="/bookmarks" icon={<FaBookmark />} label="Bookmarks" />
        <NavItem to="/discussions" icon={<FaComments />} label="Discussions" />
        <NavItem to="/educators" icon={<FaUserGraduate />} label="Educators" />
        <NavItem to="/subjects" icon={<FaBook />} label="Subjects" />
      </nav>

      
    </div>
  );
};

// Reusable Nav Item Component
const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 ${
          isActive ? "bg-blue-500 text-white" : "hover:bg-gray-300"
        }`
      }
    >
      {icon} <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
