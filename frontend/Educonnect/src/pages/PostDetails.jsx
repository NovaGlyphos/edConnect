import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import CommentsList from "../components/CommentsList";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [newComment, setNewComment] = useState("");

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/posts/${postId}`);
      setPost(data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching post details:", error.response?.data || error.message);
      setErrorMsg("Failed to load post. Please try again later.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/posts/${postId}/comments`, { text: newComment });
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (postId) {
      console.log("Fetching post with ID:", postId);
      fetchPost();
    }
  }, [postId]);

  if (errorMsg) {
    return <p>{errorMsg}</p>;
  }

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{post.text}</h1>

      {post.file && post.fileType === "image" && (
        <img src={`http://localhost:5000/${post.file}`} alt="Post" className="my-4" />
      )}

      <form onSubmit={handleCommentSubmit} className="my-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary mt-2">
          Post Comment
        </button>
      </form>
      <CommentsList postId={postId} />
    </div>
  );
};

export default PostDetails;
