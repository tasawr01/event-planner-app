import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import EventList from "./components/EventList";
import Checklist from "./components/Checklist";
import NotificationList from "./components/NotificationList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route exact path="/" element={<DashboardPage />} />
        <Route exact path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;
