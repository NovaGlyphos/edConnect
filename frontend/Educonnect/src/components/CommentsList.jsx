import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import api from "../api";

const CommentsList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} refreshComments={fetchComments} />
      ))}
    </div>
  );
};

export default CommentsList;
