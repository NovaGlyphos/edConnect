import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaBook, FaCalculator, FaFlask, FaGlobe, FaCode, FaPalette } from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";

const Subjects = () => {
  const { t } = useContext(LanguageContext);
  const [subjectCategories, setSubjectCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get("/subjects");
        setSubjectCategories(data);
      } catch (error) {
        console.error("Error fetching subjects:", error.response?.data || error.message);
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
  };

  const categoryIcons = {
    Mathematics: <FaCalculator className="text-blue-400" />,
    Science: <FaFlask className="text-green-400" />,
    Humanities: <FaGlobe className="text-purple-400" />,
    Technology: <FaCode className="text-teal-400" />,
    Arts: <FaPalette className="text-pink-400" />,
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">{t.exploreSubjects}</h1>
      <div className="relative mb-8 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
        <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          className="input input-bordered w-full pl-12 bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
          placeholder={t.searchSubjects}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              {categoryIcons[category.name] || <FaBook className="text-gray-400" />}
              <h2 className="text-xl font-semibold text-gray-100">{category.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-2 border border-gray-600"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <FaBook className="text-gray-400" />
                  <span className="text-gray-200 font-medium">{subject}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="text-center py-8 bg-gray-800 rounded-lg shadow-md border border-gray-700">
            <p className="text-gray-400 text-lg">{t.noSubjectsFound} "{searchQuery}"</p>
          </div>
        )}
      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.popularResources}</h3>
        <p className="text-gray-400 italic">
          {t.connectEducators}
        </p>
      </div>
    </div>
  );
};

export default Subjects;