import { useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";

const MainContent = ({ setPosts }) => {
  const { t } = useContext(LanguageContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("File MIME type:", uploadedFile.type);
      if (uploadedFile.type.startsWith("image/")) {
        setFileType("image");
      } else if (uploadedFile.type.startsWith("video/")) {
        setFileType("video");
      } else if (uploadedFile.type.startsWith("audio/")) {
        setFileType("audio");
      } else {
        setFileType("document");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileType(null);
  };

  const handlePostSubmit = async () => {
    if (text.trim() || file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file);
        formData.append("fileType", fileType);
      }
      try {
        const { data } = await api.post("/posts", formData);
        console.log("Post response:", data);
        setPosts((prevPosts) => [data, ...prevPosts]);
        setText("");
        setFile(null);
        setFileType(null);
      } catch (error) {
        console.error("Error creating post:", error.response?.data || error.message);
        alert("Failed to create post: " + (error.response?.data?.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card bg-base-200 shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FaUserCircle size={32} className="text-gray-500" />
        <h2 className="text-xl font-bold">{t.welcome}</h2>
      </div>
      <textarea
        className="textarea textarea-bordered w-full mb-4"
        placeholder={t.whatsOnMind}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <div className="flex items-center gap-4 mb-4">
        <label className="btn btn-ghost" disabled={loading}>
          {t.attach}
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
            accept="image/*,video/*,audio/*"
          />
        </label>
        {file && (
          <button
            className="btn btn-ghost"
            onClick={removeFile}
            disabled={loading}
          >
            {t.removeFile}
          </button>
        )}
      </div>
      {file && (
        <div className="mb-4">
          {fileType === "image" && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-w-full rounded-lg"
            />
          )}
          {fileType === "video" && (
            <video
              controls
              src={URL.createObjectURL(file)}
              className="max-w-full rounded-lg"
            >
              Your browser does not support video playback.
            </video>
          )}
          {fileType === "audio" && (
            <audio controls src={URL.createObjectURL(file)} className="w-full">
              Your browser does not support audio playback.
            </audio>
          )}
          {fileType === "document" && (
            <a
              href={URL.createObjectURL(file)}
              download
              className="btn btn-ghost"
            >
              Download File
            </a>
          )}
        </div>
      )}
      <button
        className="btn btn-primary w-full"
        onClick={handlePostSubmit}
        disabled={loading}
      >
        {loading ? t.posting : t.post}
      </button>
    </div>
  );
};

export default MainContent;