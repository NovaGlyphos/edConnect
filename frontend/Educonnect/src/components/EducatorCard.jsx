// src/components/EducatorCard.jsx
import { useState } from "react";
import api from "../api";

const EducatorCard = ({ educator }) => {
  const [following, setFollowing] = useState(false);

  const toggleFollow = async () => {
    try {
      await api.post(`/educators/${educator._id}/follow`);
      setFollowing(!following);
    } catch (error) {
      console.error("Error following educator:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md flex justify-between items-center border border-gray-700 hover:shadow-lg transition-shadow">
      <div>
        <h3 className="text-xl font-semibold text-gray-100">{educator.name}</h3>
        <p className="text-gray-400">{educator.subject}</p>
      </div>
      <button
        onClick={toggleFollow}
        className={`px-4 py-2 text-white rounded-lg shadow-md transition-colors ${
          following ? "bg-red-700 hover:bg-red-800" : "bg-blue-700 hover:bg-blue-800"
        }`}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default EducatorCard;