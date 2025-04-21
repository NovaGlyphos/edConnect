import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

const AuthLayout = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <Outlet />
    </div>
  );
};

export default AuthLayout;