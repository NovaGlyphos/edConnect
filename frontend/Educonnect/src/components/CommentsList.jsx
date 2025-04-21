import React, { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";
import { formatDistanceToNow } from "date-fns";

const CommentsList = ({ postId, commentPosted, setCommentPosted }) => {
  const { t } = useContext(LanguageContext);
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
      setError(error.response?.data?.message || t.failedToLoadComments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, t]);

  useEffect(() => {
    if (commentPosted) {
      fetchComments();
      setCommentPosted(false);
    }
  }, [commentPosted, setCommentPosted]);

  if (loading) return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.comments}</h3>
      <div className="flex justify-center">
        <span className="loading loading-spinner text-blue-400"></span>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.comments}</h3>
      <p className="text-red-400">{error}</p>
      <button
        onClick={fetchComments}
        className="mt-4 btn btn-ghost text-blue-400 hover:text-blue-300"
      >
        {t.retry}
      </button>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.comments}</h3>
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
        <p className="text-gray-400">{t.noComments}</p>
      )}
    </div>
  );
};

export default CommentsList;