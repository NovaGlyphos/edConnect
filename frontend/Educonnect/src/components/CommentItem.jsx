import React from "react";
import { FaHeart } from "react-icons/fa";
import api from "../api";

const CommentItem = ({ comment, refreshComments }) => {
  const handleLike = async () => {
    try {
      const { data } = await api.patch(`/comments/${comment._id}/like`);
      refreshComments();
    } catch (error) {
      console.error("Error liking comment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="border p-2 rounded mb-2">
      <p>{comment.text}</p>
      <div className="flex items-center gap-2">
        <button onClick={handleLike} className="flex items-center gap-1">
          <FaHeart className="cursor-pointer" />
          <span>{comment.likes?.length || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
