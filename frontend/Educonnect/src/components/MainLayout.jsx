import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <div className="flex">
        <div className="w-1/4 p-4">
          <SideBar />
        </div>
        <div className="w-3/4 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
