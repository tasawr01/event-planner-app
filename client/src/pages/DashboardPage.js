import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [totalEvents, setTotalEvents] = useState(0);
  const [passedEvents, setPassedEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [totalChecklistItems, setTotalChecklistItems] = useState(0);
  const [checkedChecklistItems, setCheckedChecklistItems] = useState(0);

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);

    if (user._id) {
      // Fetch total events and passed events
      const fetchEventData = async () => {
        try {
          const eventResponse = await API.get(`/events/events/${user._id}`);
          setTotalEvents(eventResponse.data.length);

          const passedEventResponse = eventResponse.data.filter((event) => new Date(event.date) < new Date());
          setPassedEvents(passedEventResponse.length);

          // Get upcoming events
          const upcoming = eventResponse.data.filter((event) => new Date(event.date) > new Date());
          setUpcomingEvents(upcoming);
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      };

      // Fetch checklist items data
      const fetchChecklistData = async () => {
        try {
          const checklistResponse = await API.get(`/checklists/checklists/${user._id}`);
          setTotalChecklistItems(checklistResponse.data.length);

          const checkedItems = checklistResponse.data.filter((item) => item.completed);
          setCheckedChecklistItems(checkedItems.length);
        } catch (err) {
          console.error("Error fetching checklists:", err);
        }
      };

      fetchEventData();
      fetchChecklistData();
    }
  }, [user._id]);

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

  const calculateChecklistCompletionPercentage = () => {
    return totalChecklistItems === 0 ? 0 : Math.round((checkedChecklistItems / totalChecklistItems) * 100);
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#121212] py-12 px-6 mt-10">
        <div className="max-w-6xl mx-auto bg-[#1D1D1D] rounded-2xl shadow-lg p-6">
          <h2 className="text-4xl font-serif text-[#F4B8A5] text-center mb-10">
            Welcome, {user.username} 👋
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Events Card */}
            <div className="bg-[#2D2D2D] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#4ECDC4]">Total Events</h3>
              <p className="text-3xl text-[#F4B8A5]">{totalEvents}</p>
            </div>

            {/* Passed Events Card */}
            <div className="bg-[#2D2D2D] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#4ECDC4]">Passed Events</h3>
              <p className="text-3xl text-[#F4B8A5]">{passedEvents}</p>
            </div>

            {/* Total Checklist Items Card */}
            <div className="bg-[#2D2D2D] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#4ECDC4]">Total Checklist Tasks</h3>
              <p className="text-3xl text-[#F4B8A5]">{totalChecklistItems}</p>
            </div>

            {/* Checked Checklist Items Card */}
            <div className="bg-[#2D2D2D] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#4ECDC4]">Completed Checklist Items</h3>
              <p className="text-3xl text-[#F4B8A5]">{checkedChecklistItems}</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-[#2D2D2D] p-6 rounded-xl shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-[#4ECDC4]">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <ul className="text-[#F4B8A5]">
                {upcomingEvents.map((event) => (
                  <li key={event._id} className="text-lg mb-2">
                    <span>{event.name}</span> - <span>{new Date(event.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#F4B8A5]">No upcoming events.</p>
            )}
          </div>

          {/* Checklist Progress */}
          <div className="bg-[#2D2D2D] p-6 rounded-xl shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-[#4ECDC4]">Checklist Completion</h3>
            <p className="text-3xl text-[#F4B8A5]">{checkedChecklistItems} / {totalChecklistItems}</p>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#4ECDC4]">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#4ECDC4]">
                    {calculateChecklistCompletionPercentage()}%
                  </span>
                </div>
              </div>
              <div className="flex mb-2">
                <div className="w-full bg-gray-200 rounded-full">
                  <div
                    className="bg-[#4ECDC4] text-xs font-medium text-center p-0.5 leading-none rounded-l-full"
                    style={{ width: `${calculateChecklistCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
