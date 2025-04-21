import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import api, { socket } from "../api";

const Events = () => {
  const { t } = useContext(LanguageContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEducator, setIsEducator] = useState(false);

  // Fetch current user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setIsEducator(data.role.toLowerCase() === "educator");
      } catch (err) {
        console.error("Error fetching user role:", err.response?.data || err.message);
      }
    };
    fetchUserRole();
  }, []);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (err) {
      console.error("Events.jsx - Fetch Events Error:", err.response?.data || err.message);
      setError(t?.failedToLoadEvents || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle event registration
  const handleRegister = async (eventId) => {
    try {
      const response = await api.post(`/events/register/${eventId}`);
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? { ...event, registered: true, registeredUsers: [...event.registeredUsers, { _id: response.data.event.registeredUsers.slice(-1)[0] }] }
            : event
        )
      );
      console.log("Registered for event:", response.data);
    } catch (err) {
      console.error("Events.jsx - Register Error:", err.response?.data || err.message);
      setError(t?.failedToRegister || "Failed to register for event.");
    }
  };

  useEffect(() => {
    fetchEvents();
    socket.on("newEvent", (newEvent) => {
      console.log("Events.jsx - New Event Received:", newEvent);
      setEvents((prev) => [newEvent, ...prev].sort((a, b) => new Date(a.date) - new Date(b.date)));
    });
    return () => socket.off("newEvent");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    try {
      const response = await api.post("/events", formData);
      console.log("Events.jsx - Event Created:", response.data);
      setFormSuccess(t?.eventCreated || "Event created successfully");
      setFormData({ title: "", date: "", time: "", location: "", description: "" });
    } catch (err) {
      console.error("Events.jsx - Create Event Error:", err.response?.data || err.message);
      setFormError(err.response?.data?.message || t?.failedToCreateEvent || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t?.events || "Events"}
        </h1>

        {/* Event Creation Form - Only for Educators */}
        {isEducator && (
          <div className="mb-12 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">{t?.addEvent || "Add Event"}</h2>
            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t?.title || "Title"}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4 transition-all"
                  required
                  placeholder={t?.title || "e.g., Hackathon 2025"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t?.date || "Date"}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t?.time || "Time"}
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="input w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t?.location || "Location"}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4"
                  required
                  placeholder={t?.location || "e.g., Online or Campus Room 101"}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t?.description || "Description"}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea w-full bg-gray-700 text-gray-200 border-gray-600 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 px-4 resize-none h-32"
                  placeholder={t?.description || "Event details..."}
                />
              </div>
              <div className="md:col-span-2">
                {formError && <p className="text-red-400 mb-4">{formError}</p>}
                {formSuccess && <p className="text-green-400 mb-4">{formSuccess}</p>}
                <button
                  type="submit"
                  className="btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (t?.saving || "Saving...") : (t?.save || "Save")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Event List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-blue-500"></div>
              <p className="mt-2 text-gray-400">{t?.loading || "Loading..."}</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchEvents}
                className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md"
              >
                {t?.retry || "Retry"}
              </button>
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">{t?.noEvents || "No events available."}</p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-300 mb-3">{event.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <span className="font-medium text-gray-400">{t?.date || "Date"}:</span> {event.date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-400">{t?.time || "Time"}:</span> {event.time}
                  </p>
                  <p>
                    <span className="font-medium text-gray-400">{t?.location || "Location"}:</span>{" "}
                    {event.location}
                  </p>
                  <p>
                    <span className="font-medium text-gray-400">{t?.organizedBy || "Organized by"}:</span>{" "}
                    {event.organizer}
                  </p>
                </div>
                <p className="mt-4 text-gray-300">
                  <span className="font-medium text-gray-400">{t?.description || "Description"}:</span>{" "}
                  {event.description || "N/A"}
                </p>
                <p className="mt-2 text-gray-400">
                  <span className="font-medium">{t?.registeredUsers || "Registered"}:</span>{" "}
                  {event.registeredUsers.length} {t?.participants || "participants"}
                </p>
                {!isEducator && (
                  <button
                    onClick={() => handleRegister(event._id)}
                    className={`mt-4 btn ${
                      event.registered
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    } text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300`}
                    disabled={event.registered}
                  >
                    {event.registered ? (t?.registered || "Registered") : (t?.register || "Register")}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;