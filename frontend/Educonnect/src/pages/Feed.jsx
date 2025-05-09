import React, { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import api, { socket } from "../api";
import PostItem from "../components/PostItem";
import MainContent from "./MainContent";

const Feed = () => {
  const { t } = useContext(LanguageContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      console.log("Feed.jsx - Fetching posts...");
      const { data } = await api.get("/posts");
      console.log("Feed.jsx - Posts fetched:", data);
      setPosts(data.posts || data);
      setError("");
    } catch (error) {
      console.error("Feed.jsx - Error fetching posts:", error.response?.data || error.message);
      setError(error.response?.data?.message || t.failedToLoadPosts);
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
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, bookmarked } : post
      )
    );
  };

  useEffect(() => {
    fetchPosts();
    socket.on("newPost", (post) => {
      console.log("Feed.jsx - New post received:", post);
      setPosts((prevPosts) => [post, ...prevPosts]);
    });
    return () => {
      socket.off("newPost");
    };
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 max-w-5xl mx-auto">
      <span className="loading loading-spinner loading-lg text-blue-400"></span>
    </div>
  );

  if (error) return (
    <div className="text-red-400 text-center py-8 bg-gray-800 rounded-lg shadow-md max-w-5xl mx-auto">
      <p>{error}</p>
      <button
        onClick={fetchPosts}
        className="mt-4 btn btn-ghost text-blue-400 hover:text-blue-300"
      >
        {t.retry}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-900 text-gray-200">
      <MainContent setPosts={setPosts} />
      <h2 className="text-2xl font-bold text-gray-100 mb-4">{t.recentPosts}</h2>
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
        <p className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg shadow-md">
          {t.noPosts}
        </p>
      )}
    </div>
  );
};

export default Feed;