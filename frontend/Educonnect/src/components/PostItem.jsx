// src/components/PostItem.jsx
import React from "react";
import { FaUserCircle, FaHeart, FaComment, FaBookmark } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import api from "../api";

const PostItem = ({ post, onLike, onBookmark }) => {
  const handleLike = async () => {
    try {
      const { data } = await api.patch(`/posts/${post._id}/like`);
      onLike(post._id, data.likes, data.bookmarked);
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
    }
  };

  const handleBookmark = async () => {
    try {
      const { data } = await api.post(`/bookmarks/${post._id}`);
      onBookmark(post._id, data.bookmarked);
    } catch (error) {
      console.error("Error bookmarking post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="card bg-gray-800 shadow-md p-6 rounded-lg border border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <FaUserCircle size={40} className="text-gray-400" />
        <div>
          <p className="font-semibold text-gray-100 text-lg">
            {post.author?.name || "Unknown User"}
          </p>
          <p className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <Link to={`/posts/${post._id}`} className="block">
        <p className="text-gray-200 leading-relaxed mb-4">{post.text}</p>
        {post.image && (
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            className="max-w-full rounded-lg shadow-sm"
          />
        )}
      </Link>
      <div className="flex gap-6 mt-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <FaHeart
            className={
              post.author && post.likes.includes(post.author._id) ? "text-blue-400" : ""
            }
          />
          {post.likes.length}
        </button>
        <Link
          to={`/posts/${post._id}`}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <FaComment /> Comment
        </Link>
        <button
          onClick={handleBookmark}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <FaBookmark className={post.bookmarked ? "text-blue-400" : ""} />
          {post.bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>
    </div>
  );
};

export default PostItem;