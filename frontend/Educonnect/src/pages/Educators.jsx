// src/pages/Educators.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const Educators = () => {
  const [educators, setEducators] = useState([]);

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const { data } = await api.get("/educators");
        setEducators(data);
      } catch (error) {
        console.error("Error fetching educators:", error.response?.data || error.message);
      }
    };
    fetchEducators();
  }, []);

  const handleFollow = async (educatorId) => {
    try {
      await api.post(`/educators/${educatorId}/follow`);
    } catch (error) {
      console.error("Error following/unfollowing educator:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Educators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educators.map((edu) => (
          <div
            key={edu._id}
            className="card bg-gray-800 shadow-md p-6 rounded-lg border border-gray-700 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-2">{edu.name}</h2>
            <p className="text-gray-400 mb-4">{edu.subject}</p>
            <button
              className="btn btn-outline border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors w-full"
              onClick={() => handleFollow(edu._id)}
            >
              Follow / Unfollow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Educators;