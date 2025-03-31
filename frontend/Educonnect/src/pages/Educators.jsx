import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Educators = () => {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const { data } = await api.get("/educators");
        setEducators(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching educators:", error.response?.data || error.message);
        setError("Failed to load educators");
        setLoading(false);
      }
    };
    fetchEducators();
  }, []);

  const defaultUserIcon = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-gray-300 text-xl animate-pulse">Loading educators...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-red-400 text-lg bg-gray-800 p-4 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-3xl font-bold text-gray-100 mb-6 tracking-tight">
        Our Educators
      </h2>
      <ul className="space-y-6 max-w-2xl mx-auto">
        {educators.map((educator) => (
          <li
            key={educator._id}
            className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <Link
              to={`/profile/${educator._id}`}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={educator.profilePic || defaultUserIcon}
                  alt={educator.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                  onError={(e) => (e.target.src = defaultUserIcon)}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100">
                    {educator.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {educator.bio || "No bio available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {educator.educationalInstitution || "No institution provided"}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Educators;