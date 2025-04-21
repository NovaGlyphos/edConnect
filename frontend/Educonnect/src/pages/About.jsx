import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const About = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t.aboutUs || "About Us"}
        </h1>
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <p className="text-lg mb-4">
            Welcome to <span className="font-bold text-blue-400">EduConnect</span>, a platform
            designed to bridge the gap between educators and students through interactive and
            engaging educational experiences.
          </p>
          <p className="text-lg mb-4">
            Our mission is to foster a collaborative learning environment where educators can share
            knowledge through events like hackathons, workshops, and seminars, and students can
            participate to enhance their skills and network with peers.
          </p>
          <p className="text-lg">
            Join us to explore, learn, and grow together in a vibrant community dedicated to
            education and innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;