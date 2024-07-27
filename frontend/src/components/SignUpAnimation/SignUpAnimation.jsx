import Lottie from "lottie-react";

// import animation vào component
import * as signupAnimation from "./../../asset/Animation/signupAnimation.json";

const SignUpAnimation = () => {
  const defaultOptions = {
    loop: true, // lặp lại vô tận
    autoplay: true, // auto chạy
    animationData: signupAnimation, // animation muốn chạy thì thêm vào đây
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie
	  loop={true}
      autoplay={true}
	  animationData= {signupAnimation}
      options={defaultOptions}
      height={400}
      width={400}
      // isStopped={this.state.isStopped}
      // isPaused={this.state.isPaused}
    />
  );
};

export default SignUpAnimation;
