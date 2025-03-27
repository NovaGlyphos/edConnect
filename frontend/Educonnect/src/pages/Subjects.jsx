// src/pages/Subjects.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaBook, FaCalculator, FaFlask, FaGlobe, FaCode, FaPalette } from "react-icons/fa";
import api from "../api";

const Subjects = () => {
  const [subjectCategories, setSubjectCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get("/subjects");
        setSubjectCategories(data);
      } catch (error) {
        console.error("Error fetching subjects:", error.response?.data || error.message);
        // Fallback to static data if needed
        setSubjectCategories([
          {
            id: 1,
            name: "Mathematics",
            subjects: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry"],
          },
          {
            id: 2,
            name: "Science",
            subjects: ["Biology", "Chemistry", "Physics", "Earth Science", "Astronomy"],
          },
          {
            id: 3,
            name: "Humanities",
            subjects: ["History", "Literature", "Philosophy", "Psychology", "Sociology"],
          },
          {
            id: 4,
            name: "Technology",
            subjects: ["Computer Science", "Web Development", "Data Science", "AI & Machine Learning", "Cybersecurity"],
          },
          {
            id: 5,
            name: "Arts",
            subjects: ["Visual Arts", "Music", "Theatre", "Film Studies", "Creative Writing"],
          },
        ]);
      }
    };
    fetchSubjects();
  }, []);

  const filteredCategories = subjectCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.subjects &&
      category.subjects.some((subject) => subject.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSubjectClick = (subject) => {
    console.log("Selected subject:", subject);
    // Navigate to subject details page if implemented
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Explore Subjects</h1>
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="input input-bordered w-full pl-10"
          placeholder="Search for subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-base-200 rounded-lg p-5 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              {/* If you have an icon, include it here. Otherwise, remove this line */}
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow cursor-pointer flex items-center gap-2"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <FaBook className="text-gray-500" />
                  <span className="text-gray-900 font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No subjects found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Popular Learning Resources</h3>
        <div className="p-4 bg-base-200 rounded-lg">
          <p className="text-gray-500 italic">
            Connect with top educators for these subjects and discover learning materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
