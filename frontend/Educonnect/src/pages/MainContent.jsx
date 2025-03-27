import React, { useState } from "react";
import { FaUserCircle, FaImage, FaPaperPlane } from "react-icons/fa";
import api from "../api";

const MainContent = ({ setPosts }) => {
  const [text, setText] = useState("");
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) setFileData(file);
  };

  const handlePostSubmit = async () => {
    if (text.trim() || fileData) {
      const formData = new FormData();
      formData.append("text", text);
      if (fileData) formData.append("file", fileData);

      try {
        const { data } = await api.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPosts((prev) => [data, ...prev]);
        setText("");
        setFileData(null);
      } catch (error) {
        console.error("Error creating post:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-3">
        <FaUserCircle className="w-10 h-10 text-gray-500" />
        <input
          type="text"
          placeholder="What's on your mind?"
          className="input input-bordered flex-grow"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <label className="cursor-pointer flex items-center gap-2">
          <FaImage className="text-gray-500" />
          <span className="text-gray-600">Upload</span>
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>

        <button onClick={handlePostSubmit} className="btn btn-primary">
          <FaPaperPlane /> Post
        </button>
      </div>
    </div>
  );
};

export default MainContent;
