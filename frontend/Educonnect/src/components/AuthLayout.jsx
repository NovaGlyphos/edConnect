// src/components/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <Outlet />
    </div>
  );
};

export default AuthLayout;