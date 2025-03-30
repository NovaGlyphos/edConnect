// src/pages/Discussions.jsx
import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import api from "../api";

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "technology",
    tags: "",
  });

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get("/discussions");
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error.response?.data || error.message);
    }
  };

  const handleNewDiscussionSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/discussions", newDiscussion);
      setDiscussions([data, ...discussions]);
      setNewDiscussion({ title: "", content: "", category: "technology", tags: "" });
    } catch (error) {
      console.error("Error creating discussion:", error.response?.data || error.message);
    }
  };

  const handleVote = async (discussionId, voteType) => {
    try {
      const { data } = await api.patch(`/discussions/${discussionId}/vote`, { vote: voteType });
      setDiscussions(discussions.map((d) => (d._id === discussionId ? data : d)));
    } catch (error) {
      console.error("Error voting on discussion:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Discussions</h1>
      <form
        onSubmit={handleNewDiscussionSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-100">Start a New Discussion</h2>
        <input
          type="text"
          placeholder="Discussion Title"
          className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
          value={newDiscussion.title}
          onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Discussion Content"
          className="textarea textarea-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
          value={newDiscussion.content}
          onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="input input-bordered w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
          value={newDiscussion.tags}
          onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
        />
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-700 hover:bg-blue-800 text-white shadow-md"
        >
          Post Discussion
        </button>
      </form>

      <div className="space-y-4">
        {discussions.length > 0 ? (
          discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <button onClick={() => handleVote(discussion._id, "up")}>
                    <FaArrowUp className="text-gray-400 hover:text-green-400 transition" size={20} />
                  </button>
                  <span className="text-lg font-medium text-gray-300">{discussion.votes}</span>
                  <button onClick={() => handleVote(discussion._id, "down")}>
                    <FaArrowDown className="text-gray-400 hover:text-red-400 transition" size={20} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">{discussion.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{discussion.content}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    Tags: {discussion.tags?.join(", ") || "None"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg shadow-md">
            No discussions yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Discussions;