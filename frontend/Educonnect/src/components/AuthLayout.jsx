import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
