import React, { useEffect, useState } from "react";
import api, { socket } from "../api";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setLoading(false);
      setError("");
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
      setError("Failed to load notifications");
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error.response?.data || error.message);
    }
  };

  const handleClearNotifications = async () => {
    setClearing(true);
    setTimeout(async () => {
      try {
        await api.delete("/notifications/clear");
        setNotifications([]);
      } catch (error) {
        console.error("Error clearing notifications:", error.response?.data || error.message);
        setError("Failed to clear notifications");
      }
      setClearing(false);
    }, 300); // Duration of the fade-out animation
  };

  useEffect(() => {
    fetchNotifications();

    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.off("newNotification");
      socket.off("connect_error");
    };
  }, []);

  if (loading) return <div className="text-gray-400">Loading notifications...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const notificationStyle = {
    transition: 'opacity 300ms, transform 300ms',
    opacity: clearing ? 0 : 1,
    transform: clearing ? 'translateY(-20px)' : 'translateY(0)',
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h3 className="card-title text-lg font-semibold">Notifications</h3>
        <button
          onClick={handleClearNotifications}
          className="btn btn-error btn-sm mb-4"
        >
          Clear All Notifications
        </button>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-2 rounded-md ${
                  notification.read ? "bg-gray-700" : "bg-gray-600"
                }`}
                style={notificationStyle}
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-200">{notification.message}</p>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="btn btn-sm btn-primary ml-2"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;