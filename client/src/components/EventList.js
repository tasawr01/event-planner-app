import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [countdowns, setCountdowns] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get(`/events/events/${user._id}`);
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
  
    fetchEvents();
  }, [user._id]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns = {};
      events.forEach((event) => {
        updatedCountdowns[event._id] = calculateCountdown(event.date);
      });
      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const handleAddEvent = async () => {
    if (!eventName || !eventDate) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const newEvent = {
        name: eventName,
        date: eventDate,
        description: eventDescription,
      };
      if (editingEvent) {
        await API.put(`/events/update-event/${editingEvent._id}`, newEvent);
        setEvents((prev) =>
          prev.map((event) =>
            event._id === editingEvent._id ? { ...event, ...newEvent } : event
          )
        );
        setEditingEvent(null);
      } else {
        const response = await API.post(
          `/events/create-event/${user._id}`,
          newEvent
        );
        setEvents((prev) => [...prev, response.data]);
      }
      setEventName("");
      setEventDate("");
      setEventDescription("");
      setShowPopup(false);
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;
  
    try {
      await API.delete(`/events/delete-event/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };
  

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventName(event.name);
    setEventDate(event.date);
    setEventDescription(event.description);
    setShowPopup(true);
  };

  const calculateCountdown = (date) => {
    const eventDate = new Date(date);
    const currentDate = new Date();
    const diff = eventDate - currentDate;
  
    if (diff <= 0) return "Event has passed";
  
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)) % 12;
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30.44);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
  
    return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#121212] flex items-center justify-center py-12 px-6 mt-10">
        <div className="relative w-full max-w-4xl bg-[#1D1D1D] rounded-3xl shadow-2xl p-8 overflow-hidden">
          <h2 className="text-5xl font-serif text-[#F4B8A5] text-center mb-10">
            ✨ Your Events ✨
          </h2>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white text-lg font-semibold py-4 px-12 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              + Add Event
            </button>
          </div>
          {events.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {events.map((event) => (
                <li
                  key={event._id}
                  className="bg-[#2D2D2D] rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <p className="text-2xl font-serif text-[#F4B8A5] mb-3">
                    {event.name}
                  </p>
                  <p className="text-lg text-[#D1D1D1] mb-2">
                    📅 {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="text-lg text-[#4ECDC4] font-semibold">
                    ⏳ Countdown: {countdowns[event._id] || "Calculating..."}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleShowDetails(event)}
                      className="bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-[#3BB5AA] hover:to-[#217E7C] transform hover:scale-105 transition-all duration-300"
                    >
                      Show Details
                    </button>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="bg-gradient-to-r from-[#FFBB3B] to-[#FF8C00] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-[#E0A731] hover:to-[#CC7600] transform hover:scale-105 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-gradient-to-r from-[#FF6B6B] to-[#FF4A4A] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-[#E05555] hover:to-[#CC3B3B] transform hover:scale-105 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-2xl text-[#D1D1D1] font-light">
              You don’t have any events yet.
            </p>
          )}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="relative bg-[#2D2D2D] p-10 rounded-2xl shadow-xl w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-3xl font-serif text-[#F4B8A5] mb-6 text-center">
                  Event Details
                </h3>
                <p className="text-xl text-[#F4B8A5] mb-4">
                  {selectedEvent.name}
                </p>
                <p className="text-lg text-[#D1D1D1] mb-4">
                  📅 {new Date(selectedEvent.date).toLocaleString()}
                </p>
                <div className="text-lg text-[#D1D1D1] mb-4 overflow-y-auto max-h-40 pr-2 scrollbar-thin scrollbar-thumb-[#444444] scrollbar-track-[#2D2D2D]">
                  📝 {selectedEvent.description}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleCloseModal}
                    className="bg-[#444444] text-white py-3 px-6 rounded-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="relative bg-[#2D2D2D] p-10 rounded-2xl shadow-xl w-96">
                <h3 className="text-3xl font-serif text-[#F4B8A5] mb-6 text-center">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h3>
                <label className="block text-[#D1D1D1] font-medium mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full p-4 rounded-lg bg-[#333333] text-[#D1D1D1]"
                />
                <label className="block text-[#D1D1D1] font-medium mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-4 rounded-lg bg-[#333333] text-[#D1D1D1]"
                />
                <label className="block text-[#D1D1D1] font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-4 rounded-lg bg-[#333333] text-[#D1D1D1]"
                ></textarea>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-[#444444] text-white py-3 px-6 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="bg-[#4ECDC4] text-white py-3 px-6 rounded-full"
                  >
                    {editingEvent ? "Save Changes" : "Add Event"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventList;
