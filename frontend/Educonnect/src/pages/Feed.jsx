import React, { useEffect, useState } from "react";
import { FaUserCircle, FaHeart, FaComment, FaShare, FaBookmark } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import api from "../api";
import MainContent from "./MainContent";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <MainContent setPosts={setPosts} />
      <h2 className="text-2xl font-bold my-4">Recent Posts</h2>

      {posts.map((post) => (
        <div key={post._id} className="mb-6 p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <FaUserCircle size={32} />
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          {post.text && <p className="my-2">{post.text}</p>}

          {post.file && (
            <img
              src={`http://localhost:5000/${post.file}`}
              alt="Uploaded"
              className="max-w-full my-2 rounded-lg shadow-md"
            />
          )}

          <div className="flex gap-4 mt-3">
            <button className="flex items-center gap-1"><FaHeart className="cursor-pointer" /><span>{post.likes?.length || 0}</span></button>
            <button className="flex items-center gap-1"><FaComment className="cursor-pointer" /><span>{post.comments?.length || 0}</span></button>
            <button className="flex items-center gap-1"><FaShare className="cursor-pointer" /></button>
            <button className="flex items-center gap-1"><FaBookmark className="cursor-pointer" /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
