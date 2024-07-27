import React from "react";
import Lottie from "lottie-react";

// import animation vào component
import * as loginAnimation from "../../asset/Animation/loginAnimation.json";

const LoginAnimation = () => {
	const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie
	    loop={true}
      autoplay={true}
    	animationData={loginAnimation}
      options={defaultOptions}
      height={400}
      width={400}
      // isStopped={this.state.isStopped}
      // isPaused={this.state.isPaused}
    />
  );
};

export default LoginAnimation;
