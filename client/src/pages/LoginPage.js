import React from "react";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  return (

    <div className="min-h-screen p-10 bg-gradient-to-br from-[#1D1D1D] via-[#121212] to-[#0A0A0A] flex items-center justify-center">
      <div className="bg-[#1F1F1F] rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#D1D1D1] mb-4 tracking-wide">Welcome Back!</h1>
        <p className="text-base text-[#B1B1B1] mb-6">Sign in to continue</p>
        <AuthForm type="login" />
      </div>
    </div>
  );
};

export default LoginPage;
