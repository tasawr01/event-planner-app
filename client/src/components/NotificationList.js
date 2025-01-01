import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const fetchEventsAndCheckDeadlines = async () => {
      try {
        const response = await API.get(`/events/events/${user._id}`);
        const events = response.data;

        const currentNotifications = events
          .filter((event) => {
            const eventTime = new Date(event.date).getTime();
            const currentTime = new Date().getTime();
            const timeDifference = eventTime - currentTime;

            return timeDifference > 0 && timeDifference <= 60000;
          })
          .map((event) => ({
            id: event._id,
            message: `Event "${event.name}" is starting soon!`,
          }));

        setNotifications(currentNotifications);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEventsAndCheckDeadlines();
    intervalId = setInterval(fetchEventsAndCheckDeadlines, 1000);

    return () => clearInterval(intervalId);
  }, [user._id]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <React.Fragment>
    <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
    <div className="bg-[#121212] min-h-screen py-12 px-6 mt-10">
      <div className="max-w-3xl mx-auto bg-[#1D1D1D] shadow-xl rounded-2xl p-8">
        <h2 className="text-5xl font-serif text-[#F4B8A5] text-center mb-10">
        🔔 Your Notifications 🔔
        </h2>
        {notifications.length > 0 ? (
          <ul className="space-y-6">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-center justify-between bg-[#2D2D2D] p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <p className="text-[#D1D1D1] text-lg font-medium">{notification.message}</p>                
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-2xl text-[#D1D1D1] font-light">
            You have no notifications at the moment.
          </p>
        )}
      </div>
    </div>
    </React.Fragment>

  );
};

export default NotificationList;
