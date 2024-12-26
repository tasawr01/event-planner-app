import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "signup") {
        const res = await API.post("/auth/signup", formData);
        navigate('/login');
      } else {
        const response = await API.post("/auth/login", formData);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Authentication failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {type === "signup" && (
          <div className="input-group">
            <label className="text-sm font-medium text-[#B1B1B1] mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 rounded-lg border border-[#444444] bg-[#2A2A2A] text-[#D1D1D1] shadow-sm focus:ring-2 focus:ring-[#F4B8A5] focus:outline-none"
            />
          </div>
        )}
        <div className="input-group">
          <label className="text-sm font-medium text-[#B1B1B1] mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-6 py-3 rounded-lg border border-[#444444] bg-[#2A2A2A] text-[#D1D1D1] shadow-sm focus:ring-2 focus:ring-[#F4B8A5] focus:outline-none"
          />
        </div>
        <div className="input-group">
          <label className="text-sm font-medium text-[#B1B1B1] mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-6 py-3 rounded-lg border border-[#444444] bg-[#2A2A2A] text-[#D1D1D1] shadow-sm focus:ring-2 focus:ring-[#F4B8A5] focus:outline-none"
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v12m0 4v2m0 0h2m-2 0h-2" />
            </svg>
            <span>{error}</span>
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white text-lg font-semibold py-4 px-12 rounded-lg shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-[#3bb9b0] hover:to-[#217f7b]"
        >
          {type === "signup" ? "Sign Up" : "Log In"}
        </button>
        {type === "login" && (
          <p className="text-sm text-center text-[#B1B1B1] mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#F4B8A5] hover:underline">
              Sign Up
            </a>
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
