import { useState } from "react";
import api from "../api"; // Ensure API is correctly imported

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
    <div className="p-4 bg-gray-800 rounded-lg shadow flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">{educator.name}</h3>
        <p className="text-gray-400">{educator.subject}</p>
      </div>
      <button
        onClick={toggleFollow}
        className={`px-4 py-2 text-white rounded ${following ? "bg-red-500" : "bg-blue-500"}`}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default EducatorCard;
