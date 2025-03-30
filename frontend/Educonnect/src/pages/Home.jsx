// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import PostItem from "../components/PostItem";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Recent Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => <PostItem key={post._id} post={post} />)
      ) : (
        <p className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg shadow-md">
          No posts available.
        </p>
      )}
    </div>
  );
};

export default Home;