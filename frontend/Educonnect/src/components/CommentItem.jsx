// src/components/CommentItem.jsx
import React from "react";
import { FaHeart } from "react-icons/fa";
import api from "../api";

const CommentItem = ({ comment, refreshComments }) => {
  const handleLike = async () => {
    try {
      await api.patch(`/comments/${comment._id}/like`);
      refreshComments();
    } catch (error) {
      console.error("Error liking comment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <p className="text-gray-200 leading-relaxed">{comment.text}</p>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
        >
          <FaHeart className="cursor-pointer" />
          <span>{comment.likes?.length || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem;