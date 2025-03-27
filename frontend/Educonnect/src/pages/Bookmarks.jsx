import React, { useEffect, useState } from "react";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import api from "../api";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await api.get("/bookmarks");
        setBookmarks(data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error.response?.data || error.message);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error removing bookmark:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Bookmarked Posts</h1>
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="bg-base-200 rounded-lg p-4 shadow flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">{bookmark.post.text}</h3>
              <a href={`/posts/${bookmark.post._id}`} className="text-blue-500 text-sm flex items-center">
                View Post <FaExternalLinkAlt className="ml-1" />
              </a>
            </div>
            <button onClick={() => handleRemoveBookmark(bookmark._id)} className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No bookmarks yet.</p>
      )}
    </div>
  );
};

export default Bookmarks;
