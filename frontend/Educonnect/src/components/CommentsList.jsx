// src/components/CommentsList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { formatDistanceToNow } from "date-fns";

const CommentsList = ({ postId, commentPosted, setCommentPosted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/comments`, { params: { postId } });
      setComments(data);
      setError("");
    } catch (error) {
      console.error("Error fetching comments:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(error.response?.data?.message || "Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  useEffect(() => {
    if (commentPosted) {
      fetchComments();
      setCommentPosted(false);
    }
  }, [commentPosted, setCommentPosted]);

  if (loading) return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Comments</h3>
      <div className="flex justify-center">
        <span className="loading loading-spinner text-blue-400"></span>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Comments</h3>
      <p className="text-red-400">{error}</p>
      <button
        onClick={fetchComments}
        className="mt-4 btn btn-ghost text-blue-400 hover:text-blue-300"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="border-b border-gray-700 pb-4 last:border-b-0"
          >
            <p className="text-gray-200 leading-relaxed">{comment.text}</p>
            <p className="text-sm text-gray-400 mt-1">
              By {comment.author?.name || "Unknown"} -{" "}
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentsList;