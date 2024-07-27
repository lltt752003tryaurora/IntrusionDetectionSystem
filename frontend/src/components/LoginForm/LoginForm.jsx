import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { message } from "antd";
import { manageUserServ } from "../../service/manageUser";
import { isLoggedIn, saveLocalStore } from "../../util/localStore";
import { TOKEN, USER_LOGIN } from "../../util/constant/settingSystem";
import { useDispatch, useSelector } from "react-redux";
import { storePassWord } from "../../redux/userSlice";
import Password from "antd/es/input/Password";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { passWord } = useSelector((state) => state.userSlice);
  console.log(passWord)

  if (isLoggedIn()) {
    navigate("/manage-project/dashboard");
    window.location.reload(true);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values.password);
      manageUserServ
        .signin(values)
        .then((res) => {
          console.log(res);
          // lưu mật khẩu trên redux
          dispatch(storePassWord(values.password));
          saveLocalStore(USER_LOGIN, res.data.content);
          saveLocalStore(TOKEN, res.data.content.accessToken);
          console.log(passWord)
          messageApi.success("Login successed");
          setTimeout(() => {
            navigate("/manage-project/dashboard");
            window.location.reload(true);
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          messageApi.error("Login failed");
        });
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Data must be entered in this field.")
        .email("Email is invalid."),
      password: Yup.string().required("Data must be entered in this field."),
    }),
  });

  const { handleSubmit, handleChange, handleBlur, errors, touched } = formik;
  return (
    <>
      {contextHolder}
      <section className="dark:bg-brown-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            to={"/"}
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            rel="noreferrer"
          >
            <i className="fa-solid fa-diagram-project text-white-500 hover:text-slate-400">
              {" "}
              Project Jira
            </i>
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 border-amber-600 shadow-2xl">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in with your email
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    <i className="fa-regular fa-user"></i>
                    <span className="text-base"> Email</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter the email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email ? (
                    <p className="text-red-500 mt-2">{errors.email}</p>
                  ) : null}
                </div>
                <div className="md:col-span-5 relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    <i className="fa-solid fa-lock"></i>
                    <span className="text-base"> Password</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 relative z-0"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div
                    className="absolute top-9 right-4 cursor-pointer z-10"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <i class="fa-regular fa-eye hover:text-green-500 transition-all ease-in"></i>
                    ) : (
                      <i class="fa-regular fa-eye-slash hover:text-red-500 transition-all ease-in"></i>
                    )}
                  </div>
                  {touched.password && errors.password ? (
                    <p className="text-red-500 mt-2">{errors.password}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800 ease-in duration-300"
                >
                  Sign in
                </button>
                <p className="text-sm font-medium text-white">
                  Don’t have an account yet?{" "}
                  <Link
                    to={"/sign-up"}
                    className="font-medium text-primary-600 underline dark:text-primary-500 hover:text-green-300 duration-100"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;
