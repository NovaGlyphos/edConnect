import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import NotificationList from "./NotificationList";

const MainLayout = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar - Full width at the top */}
      <div className="w-full bg-gray-900 fixed top-0 left-0 z-10 shadow-md">
        <NavBar onLogout={onLogout} />
      </div>
      <div className="flex">
        {/* Sidebar - Fixed to the left */}
        <div className="w-64 bg-gray-900 h-screen fixed top-0 left-0 shadow-lg mt-16">
          <SideBar onLogout={onLogout} />
        </div>
        {/* Main Content - Shifted right */}
        <div className="flex-1 ml-64 mt-16">
          <main className="p-6 max-w-7xl mx-auto flex">
            <div className="flex-1">
              <Outlet />
            </div>
            <div className="ml-6 w-80">
              <NotificationList />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;