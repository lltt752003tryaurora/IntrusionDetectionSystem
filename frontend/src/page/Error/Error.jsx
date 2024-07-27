import React from "react";
import "./Error.scss";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div id="Error-Page">
      <div className="mars" />
      <img
        src="https://assets.codepen.io/1538474/404.svg"
        className="logo-404"
        alt=""
      />
      <img
        src="https://assets.codepen.io/1538474/meteor.svg"
        className="meteor"
        alt=""
      />
      <p className="title">Oh no!!</p>
      <p className="subtitle">
        Sorry, you are not allowed to access this page <br /> or requesting a
        page that's no longer here.
      </p>
      <div align="center" className="relative px-2 py-6">
        <Link to={"/"} className="bg-blue-500 px-2 py-5 rounded-2xl font-bold text-white no-underline hover:bg-white hover:text-blue-400 duration-300">
          Back to previous page
        </Link>
      </div>
      <img
        src="https://assets.codepen.io/1538474/astronaut.svg"
        className="astronaut"
        alt=""
      />
      <img
        src="https://assets.codepen.io/1538474/spaceship.svg"
        className="spaceship"
        alt=""
      />
    </div>
  );
};

export default Error;
