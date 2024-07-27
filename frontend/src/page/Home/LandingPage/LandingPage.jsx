import React, { useEffect } from "react";
import CircleIcon from "../../../asset/icons/CircleIcon";
import Logo from "../../../components/Header/Logo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDataUser } from "../../../redux/userSlice";
import { isLoggedIn } from "../../../util/localStore";
import SettingOffCanvas from "../../User/SettingOffCanvas/SettingOffCanvas";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("USER_LOGIN"));
    if (userLocal) {
      dispatch(setDataUser(userLocal));
    }
  }, []);
  return (
    <div className="h-full ">
      <div
        className={
          "bg-[url('/src/asset/img/landing.png')] bg-cover dark:bg-[url('/src/asset/img/landing_dark.png')] h-full bg-opacity-80 dark:bg-opacity-60"
        }
      >
        <div className="h-full flex flex-col">
          <div className="w-full py-6 flex flex-wrap justify-between items-center mx-auto px-10 select-none">
            <div className="">
              <Logo />
            </div>
            <div className="flex items-center lg:order-2">
              {!user ? (
                <>
                  <Link
                    to={"/sign-in"}
                    className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                  >
                    Log in
                  </Link>
                  <Link
                    to={"/sign-up"}
                    className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <SettingOffCanvas />
              )}
            </div>
          </div>

          <div className="flex flex-1">
            <div className="flex w-full">
              <div className="flex flex-col flex-1 justify-center items-center">
                <div className=" text-[5rem] lg:text-[6rem] leading-none font-bold bg-gradient-to-r inline-block from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Jira TrieAurora
                </div>
                <div className="text-gray-600 dark:text-gray-400 max-w-screen-md py-4 text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus eu purus arcu. Suspendisse dictum, mi a aliquet porta,
                  mi justo scelerisque arcu, at molestie odio enim in tortor.
                  Orci varius natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus
                </div>
                <div className="flex flex-col items-center">
                  {
                    isLoggedIn() ? 
                    <Link
                      to={"/manage-project/dashboard"}
                      className="bg-slate-700 dark:bg-sky-500 text-white px-5 py-3 rounded-lg font-semibold no-underline select-none"
                    >
                      Go to Dashboard
                    </Link>
                    :
                    <Link
                      to={"/sign-up"}
                      className="bg-slate-700 dark:bg-sky-500 text-white px-5 py-3 rounded-lg font-semibold no-underline select-none"
                    >
                      Getting Started
                    </Link>
                  }
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
