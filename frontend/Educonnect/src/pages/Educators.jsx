import React, { useEffect, useState } from "react";
import { FaUserCircle, FaGraduationCap } from "react-icons/fa";
import api from "../api";

const Educators = () => {
  const [educators, setEducators] = useState([]);
  const [followedEducators, setFollowedEducators] = useState(new Set());

  useEffect(() => {
    fetchEducators();
  }, []);

  const fetchEducators = async () => {
    try {
      const { data } = await api.get("/educators");
      setEducators(data);

      const followed = new Set(data.filter(e => e.followers.includes(localStorage.getItem("userId"))).map(e => e._id));
      setFollowedEducators(followed);
    } catch (error) {
      console.error("Error fetching educators:", error.response?.data || error.message);
    }
  };

  const handleFollow = async (educatorId) => {
    try {
      await api.post(`/educators/${educatorId}/follow`);
      setFollowedEducators(prev => {
        const updated = new Set(prev);
        if (updated.has(educatorId)) {
          updated.delete(educatorId);
        } else {
          updated.add(educatorId);
        }
        return updated;
      });
    } catch (error) {
      console.error("Error following educator:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Educators</h1>
      <div className="space-y-4">
        {educators.length > 0 ? (
          educators.map((educator) => (
            <div key={educator._id} className="bg-base-200 rounded-lg p-5 shadow-md flex justify-between">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-gray-400 w-12 h-12" />
                <div>
                  <h2 className="text-xl font-semibold">{educator.name}</h2>
                  <p className="text-gray-600 flex items-center gap-1">
                    <FaGraduationCap /> {educator.subject}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFollow(educator._id)}
                className={`btn ${followedEducators.has(educator._id) ? "btn-error" : "btn-primary"}`}
              >
                {followedEducators.has(educator._id) ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No educators available.</p>
        )}
      </div>
    </div>
  );
};

export default Educators;
