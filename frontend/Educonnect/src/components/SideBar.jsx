import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBookmark, FaComments, FaUserGraduate, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa"; // Replaced FaBook with FaCalendarAlt
import { LanguageContext } from "../context/LanguageContext";

const Sidebar = ({ onLogout }) => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="w-64 bg-gray-900 h-full p-6 shadow-lg flex flex-col border-r border-gray-800">
      <nav className="space-y-4 flex-grow">
        <NavItem to="/" icon={<FaHome className="text-gray-400" />} label={t.home} />
        <NavItem to="/bookmarks" icon={<FaBookmark className="text-gray-400" />} label={t.bookmarks} />
        <NavItem to="/discussions" icon={<FaComments className="text-gray-400" />} label={t.discussions} />
        <NavItem to="/educators" icon={<FaUserGraduate className="text-gray-400" />} label={t.educators} />
        <NavItem to="/events" icon={<FaCalendarAlt className="text-gray-400" />} label={t.events} /> {/* Replaced "/subjects" with "/events" */}
      </nav>
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-200 hover:bg-red-700 hover:text-white transition-colors w-full"
        >
          <FaSignOutAlt className="text-gray-400" /> <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
          isActive ? "bg-blue-700 text-white" : "text-gray-200 hover:bg-gray-800"
        }`
      }
    >
      {icon} <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export default Sidebar;