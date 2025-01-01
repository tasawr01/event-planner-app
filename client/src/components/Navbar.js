import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api"; // Your API utility to handle requests

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handlePasswordUpdate = async () => {
    if (!oldPassword.trim() || !newPassword.trim() || !reEnterPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== reEnterPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await API.post(`users/update-password/${user._id}`, { oldPassword, newPassword });
      if (response.status === 200) {
        alert(response.data.message);
        setIsUpdatingPassword(false);
        setOldPassword("");
        setNewPassword("");
        setReEnterPassword("");
        setError("");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#1D1D1D] to-[#121212] text-[#D1D1D1] shadow-lg fixed top-0 left-0 w-full z-20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Hamburger Button for Mobile Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white text-3xl focus:outline-none"
        >
          ☰
        </button>

        {/* Logo */}
        <div className="text-2xl font-extrabold mx-auto lg:mx-0">
          <Link to="/" className="hover:text-[#F4B8A5] transition-colors duration-300">
            Task Sync Solutions
          </Link>
        </div>

        {/* Center Navigation Links (Hidden on small screens) */}
        <div className="hidden lg:flex space-x-4">
          <Link to="/events" className="text-[#D1D1D1] hover:text-[#4ECDC4] px-4 py-2 transition-colors duration-300">
            Events
          </Link>
          <Link to="/checklist" className="text-[#D1D1D1] hover:text-[#4ECDC4] px-4 py-2 transition-colors duration-300">
            Checklist
          </Link>
          <Link to="/notifications" className="text-[#D1D1D1] hover:text-[#4ECDC4] px-4 py-2 transition-colors duration-300">
            Notifications
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          {isAuthenticated && (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white px-3 py-2 rounded-full text-sm"
              >
                <span className="mr-2 font-bold text-lg">{user.username}</span>
                <span className="material-icons-outlined text-3xl">account_circle</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#1D1D1D] text-[#D1D1D1] border border-[#4ECDC4] rounded-lg shadow-lg w-64 z-30">
                  <div className="px-4 py-2 border-b border-[#4ECDC4]">
                    <h4 className="text-lg font-bold">{user.username}</h4>
                    <p className="text-sm text-[#A1A1A1]">{user.email}</p>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2 gap-x-2">
                    <button
                      onClick={() => setIsUpdatingPassword(true)}
                      className="bg-gradient-to-r from-[#FFBB3B] to-[#FF8C00] text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={onLogout}
                      className="bg-gradient-to-r from-[#FF6B6B] to-[#FF4A4A] text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}

              {isUpdatingPassword && (
                <div className="absolute top-full right-0 mt-2 bg-[#1D1D1D] text-[#D1D1D1] border border-[#4ECDC4] rounded-lg shadow-lg w-64 z-30 px-4 py-2">
                  <h4 className="text-lg font-bold mb-2">Update Password</h4>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="mb-2">
                    <label className="block text-sm">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#444444] bg-[#2A2A2A] text-[#D1D1D1] shadow-sm focus:ring-2 focus:ring-[#F4B8A5] focus:outline-none"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#444444] bg-[#2A2A2A] text-[#D1D1D1] shadow-sm focus:ring-2 focus:ring-[#F4B8A5] focus:outline-none"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Re-Enter New Password</label>
                    <input
                      type="password"
                      value={reEnterPassword}
                      onChange={(e) => setReEnterPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#444444] bg-[#2A2A2A] text-[#D1D1D1] shadow-sm focus:ring-2 focus:ring-[#F4B8A5] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePasswordUpdate}
                    className="bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white font-semibold py-2 px-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 text-sm w-full"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setIsUpdatingPassword(false)}
                    className="text-sm text-red-500 mt-2 w-full"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#1D1D1D] text-[#D1D1D1] px-6 py-4 space-y-2">
          <Link
            to="/events"
            className="block text-[#D1D1D1] hover:text-[#4ECDC4] px-4 py-2 transition-colors duration-300"
          >
            Events
          </Link>
          <Link
            to="/checklist"
            className="block text-[#D1D1D1] hover:text-[#4ECDC4] px-4 py-2 transition-colors duration-300"
          >
            Checklist
          </Link>
          <Link
            to="/notifications"
            className="block text-[#D1D1D1] hover:text-[#4ECDC4] px-4 py-2 transition-colors duration-300"
          >
            Notifications
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;