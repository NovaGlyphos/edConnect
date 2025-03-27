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
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleNewDiscussionSubmit} className="mb-6 bg-base-200 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Start a New Discussion</h2>
        <input
          type="text"
          placeholder="Discussion Title"
          className="input input-bordered w-full mb-2"
          value={newDiscussion.title}
          onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Discussion Content"
          className="textarea textarea-bordered w-full mb-2"
          value={newDiscussion.content}
          onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="input input-bordered w-full mb-2"
          value={newDiscussion.tags}
          onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
        />
        <button type="submit" className="btn btn-primary w-full">Post Discussion</button>
      </form>

      {discussions.length > 0 ? (
        discussions.map((discussion) => (
          <div key={discussion._id} className="bg-base-200 p-4 mb-4 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <button onClick={() => handleVote(discussion._id, "up")}>
                <FaArrowUp className="text-gray-600 hover:text-green-500" />
              </button>
              <span>{discussion.votes}</span>
              <button onClick={() => handleVote(discussion._id, "down")}>
                <FaArrowDown className="text-gray-600 hover:text-red-500" />
              </button>
            </div>
            <h3 className="text-xl font-bold">{discussion.title}</h3>
            <p>{discussion.content}</p>
            <div className="text-sm text-gray-600">Tags: {discussion.tags?.join(", ")}</div>
          </div>
        ))
      ) : (
        <p>No discussions yet.</p>
      )}
    </div>
  );
};

export default Discussions;
