import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../api";

const Search = () => {
  const { t } = useContext(LanguageContext);
  const [results, setResults] = useState({
    posts: [],
    discussions: [],
    educators: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        console.error("Search error:", err.response?.data || err.message);
        setError(t?.failedToLoadSearch || "Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query, t]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t.searchResults || "Search Results"} for "{query}"
        </h1>
        {loading ? (
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-500"></div>
            <p className="mt-2 text-gray-400">{t?.loading || "Loading..."}</p>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : Object.values(results).every((arr) => arr.length === 0) ? (
          <p className="text-gray-400 text-center">{t?.noResults || "No results found."}</p>
        ) : (
          <div className="space-y-8">
            {/* Posts */}
            {results.posts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">{t.posts || "Posts"}</h2>
                <div className="space-y-4">
                  {results.posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-100">{post.title}</h3>
                      <p className="text-gray-300">{post.text.slice(0, 100)}...</p>
                      <Link
                        to={`/posts/${post._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {t.viewPost || "View Post"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Discussions */}
            {results.discussions.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">
                  {t.discussions || "Discussions"}
                </h2>
                <div className="space-y-4">
                  {results.discussions.map((discussion) => (
                    <div
                      key={discussion._id}
                      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-100">{discussion.title}</h3>
                      <p className="text-gray-300">{discussion.content.slice(0, 100)}...</p>
                      <Link
                        to={`/discussions/${discussion._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {t.viewDiscussion || "View Discussion"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Educators */}
            {results.educators.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">
                  {t.educators || "Educators"}
                </h2>
                <div className="space-y-4">
                  {results.educators.map((educator) => (
                    <div
                      key={educator._id}
                      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-100">{educator.name}</h3>
                      <p className="text-gray-300">{educator.bio || t.noBio || "No bio available."}</p>
                      <Link
                        to={`/profile/${educator._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {t.viewProfile || "View Profile"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Events */}
            {results.events.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">{t.events || "Events"}</h2>
                <div className="space-y-4">
                  {results.events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-100">{event.title}</h3>
                      <p>
                        <span className="font-medium text-gray-400">{t.date || "Date"}:</span>{" "}
                        {event.date}
                      </p>
                      <p>
                        <span className="font-medium text-gray-400">{t.location || "Location"}:</span>{" "}
                        {event.location}
                      </p>
                      <Link
                        to="/events"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {t.viewEvent || "View Event"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;