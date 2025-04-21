import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";
import CommentsList from "../components/CommentsList";

const PostDetails = () => {
  const { t } = useContext(LanguageContext);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentPosted, setCommentPosted] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/${postId}`);
      setPost(data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching post details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setErrorMsg(error.response?.data?.message || t.failedToLoadPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setErrorMsg("Comment cannot be empty.");
      return;
    }
    try {
      await api.post(`/comments/${postId}`, { text: newComment });
      setNewComment("");
      setCommentPosted(true);
      setErrorMsg("");
      setSuccessMsg(t.commentPostedSuccess);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error posting comment:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setErrorMsg(error.response?.data?.message || "Failed to post comment. Please try again.");
    }
  };

  useEffect(() => {
    if (postId) fetchPost();
  }, [postId]);

  if (loading) return (
    <div className="flex justify-center items-center h-64 max-w-2xl mx-auto">
      <span className="loading loading-spinner loading-lg text-blue-400"></span>
    </div>
  );

  if (errorMsg) return (
    <div className="text-red-400 text-center py-8 bg-gray-800 rounded-lg shadow-md max-w-2xl mx-auto">
      <p>{errorMsg}</p>
      <button
        onClick={fetchPost}
        className="mt-4 btn btn-ghost text-blue-400 hover:text-blue-300"
      >
        {t.retry}
      </button>
    </div>
  );

  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-gray-900 text-gray-200">
      <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">{post.text}</h1>
        {post.image && (
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            className="max-w-full rounded-lg shadow-sm my-4"
          />
        )}
      </div>
      <form
        onSubmit={handleCommentSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 space-y-4"
      >
        {successMsg && (
          <div className="text-green-400 text-center">{successMsg}</div>
        )}
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t.addComment}
          className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
          required
        />
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          {t.postComment}
        </button>
      </form>
      <CommentsList postId={postId} commentPosted={commentPosted} setCommentPosted={setCommentPosted} />
    </div>
  );
};

export default PostDetails;