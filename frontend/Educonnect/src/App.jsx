import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Educators from "./pages/Educators";
import PostDetails from "./pages/PostDetails";
import Bookmarks from "./pages/Bookmarks";
import Discussions from "./pages/Discussions";
import Subjects from "./pages/Subjects";
import Profile from "./pages/Profile"; // Import the new Profile page
import api from "./api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await api.get("/auth/profile");
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Feed />} />
          <Route path="educators" element={<Educators />} />
          <Route path="posts/:postId" element={<PostDetails />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="discussions" element={<Discussions />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="profile/:id" element={<Profile />} /> {/* Added Profile route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;