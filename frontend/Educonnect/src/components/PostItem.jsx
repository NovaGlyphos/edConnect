import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import api from "../api";

const PostItem = ({ post }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  // Check if the post is already bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const { data } = await api.get("/bookmarks");
        const existingBookmark = data.find((b) => b.post._id === post._id);
        if (existingBookmark) {
          setBookmarked(true);
          setBookmarkId(existingBookmark._id);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error.response?.data || error.message);
      }
    };
    checkBookmark();
  }, [post._id]);

  // Handle bookmark toggle
  const handleBookmark = async () => {
    try {
      if (!bookmarked) {
        const { data } = await api.post("/bookmarks", { postId: post._id });
        setBookmarkId(data._id);
        setBookmarked(true);
      } else {
        await api.delete(`/bookmarks/${bookmarkId}`);
        setBookmarkId(null);
        setBookmarked(false);
      }
    } catch (error) {
      console.error("Error bookmarking post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <p>{post.text}</p>
      <div className="flex justify-between mt-2">
        <button 
          onClick={handleBookmark} 
          className={`text-gray-600 hover:text-yellow-500 ${bookmarked ? "text-yellow-500" : ""}`}
        >
          <FaBookmark />
        </button>
      </div>
    </div>
  );
};

export default PostItem;
