// src/pages/Bookmarks.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import PostItem from "../components/PostItem";

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookmarkedPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookmarks");
      setPosts(data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load bookmarked posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId, updatedLikes, bookmarked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: updatedLikes, bookmarked } : post
      )
    );
  };

  const handleBookmark = (postId, bookmarked) => {
    setPosts((prevPosts) => {
      if (!bookmarked) {
        return prevPosts.filter((post) => post._id !== postId);
      }
      return prevPosts.map((post) =>
        post._id === postId ? { ...post, bookmarked } : post
      );
    });
  };

  useEffect(() => {
    fetchBookmarkedPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg text-blue-400"></span>
    </div>
  );

  if (error) return (
    <div className="text-red-400 text-center py-8 bg-gray-800 rounded-lg shadow-md max-w-2xl mx-auto">
      <p>{error}</p>
      <button
        onClick={fetchBookmarkedPosts}
        className="mt-4 btn btn-ghost text-blue-400 hover:text-blue-300"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Bookmarked Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center">No bookmarked posts yet.</p>
      )}
    </div>
  );
};

export default Bookmarks;