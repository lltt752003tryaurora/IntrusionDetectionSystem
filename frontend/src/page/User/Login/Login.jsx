import React from "react";
import LoginAnimation from "../../../components/LoginAnimation/LoginAnimation";
import LoginForm from "../../../components/LoginForm/LoginForm";

const Login = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      {/* animation */}
      <div className="layout_animation flex justi items-center bg-slate-500">
        <LoginAnimation />
      </div>
      {/* login form */}
      <div className="layout_loginForm bg-slate-800">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
