import React from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const onSignupSuccess = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#1D1D1D] via-[#121212] to-[#0A0A0A] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#1F1F1F] p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-[#D1D1D1] mb-4">Create Your Account</h1>
        <p className="text-sm text-center text-[#B1B1B1] mb-6">Sign up and start using your personalized dashboard</p>
        <AuthForm type="signup" onSuccess={onSignupSuccess} />
      </div>
    </div>
  );
};

export default SignupPage;
