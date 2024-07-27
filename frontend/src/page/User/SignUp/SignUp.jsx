import React from "react";
import SignUpAnimation from "../../../components/SignUpAnimation/SignUpAnimation";
import SignUpForm from "../../../components/SignUpForm/SignUpForm";

const SignUp = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      {/* animation */}
      <div className="layout_animation flex justi items-center bg-slate-500">
        <SignUpAnimation />
      </div>
      {/* sign up form */}
      <div className="layout_signupForm">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
