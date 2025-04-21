import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Educators from "./pages/Educators";
import PostDetails from "./pages/PostDetails";
import Bookmarks from "./pages/Bookmarks";
import Discussions from "./pages/Discussions";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Search from "./pages/Search"; // Added
import About from "./pages/About"; // Added
import api from "./api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("App.jsx - Token on mount:", token ? token.slice(0, 10) + "..." : "No token");
        if (token) {
          const { data } = await api.get("/auth/profile");
          console.log("App.jsx - Auth check response:", data);
          setIsAuthenticated(true);
        } else {
          console.log("App.jsx - No token found, user not authenticated");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("App.jsx - Auth check error:", error.response?.data || error.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-gray-300 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
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
            <Route path="events" element={<Events />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="search" element={<Search />} /> {/* Added */}
            <Route path="about" element={<About />} /> {/* Added */}
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;