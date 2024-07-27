import React, { useEffect, useRef, useState } from "react";
import Background1 from "../../../asset/img/rainBg.jpg";
import { Editor } from "@tinymce/tinymce-react";
import {
  API_KEY_TINY,
  TOKEN,
  USER_LOGIN,
} from "../../../util/constant/settingSystem";
import { useFormik } from "formik";
import { message, Popconfirm } from "antd";
import { getProjectCategoryAPI } from "../../../redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { manageProjectServ } from "../../../service/manageProject";
import * as Yup from "yup";
import { manageUserServ } from "../../../service/manageUser";
import { useNavigate } from "react-router-dom";
import { editUserAPI, setDataUser } from "../../../redux/userSlice";
import { saveLocalStore } from "../../../util/localStore";

const CreateProject = () => {
  const userData = JSON.parse(localStorage.getItem(USER_LOGIN));
  console.log(userData);
  const { passWord } = useSelector((state) => state.userSlice);

  const [messageApi, contextHolder] = message.useMessage();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!userData) {
    messageApi.error("You must login to use this field 🤬.");
    setTimeout(() => {
      navigate("/manage-project/project-manage");
    });
  }
  useEffect(() => {
    dispatch(getProjectCategoryAPI());
  }, []);

  const editorRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      id: userData?.id,
      email: userData?.email,
      name: userData?.name,
      phoneNumber: userData?.phoneNumber,
      passWord: "",
    },
    onSubmit: (values) => {
      manageUserServ
        .editUser(values)
        .then((res) => {
          console.log(res);
          messageApi.success("Update successfully.");
          let updateUser = { ...userData, ...values };
          console.log("update", updateUser);
          dispatch(setDataUser(updateUser));
          saveLocalStore(USER_LOGIN, updateUser);
          saveLocalStore(TOKEN, updateUser.accessToken);
        })
        .catch((err) => {
          console.log(err);
          messageApi.error("Update failed.");
        });
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Data must be entered in this field."),
      passWord: Yup.string().required("Data must be entered in this field."),
      phoneNumber: Yup.string()
        .required("Data must be entered in this field.")
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Phone number is invalid."),
    }),
  });
  const {
    handleBlur,
    handleChange,
    errors,
    handleSubmit,
    setFieldValue,
    handleReset,
    values,
    touched,
  } = formik;
  return (
    <>
      {contextHolder}
      <div
        className="container mx-auto rounded-3xl"
        style={{ backgroundImage: `url(${Background1})` }}
      >
        <h1 className="font-bold text-2xl text-white pl-5 pt-4">
          User details
        </h1>
        <form className="space-y-3 p-5" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="id"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ID
              <span className="text-red-500">*</span>
            </label>
            <input
              name="id"
              type="id"
              id="id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="id"
              onChange={handleChange}
              value={userData?.id}
              onBlur={handleBlur}
              onClick={() => {
                messageApi.error("This field can not edit.");
              }}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
              <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="email"
              onChange={handleChange}
              value={userData?.email}
              onBlur={handleBlur}
              onClick={() => {
                messageApi.error("This field can not be edit.");
              }}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
              <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name"
              onChange={handleChange}
              value={values?.name}
              onBlur={handleBlur}
            />
            {touched.name && errors.name ? (
                <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                  {errors.name}
                </p>
            ) : null}
          </div>
          <div className="mb-6 relative md:col-span-5">
            <label
              htmlFor="passWord"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
              <span className="text-red-500">*</span>
            </label>
            <input
              name="passWord"
              type={showPassword ? "text" : "password"}
              id="passWord"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 relative z-0"
              placeholder="••••••••"
              onChange={handleChange}
              // value={values?.passWord}
              onBlur={handleBlur}
            />
            <div
              className="absolute top-9 right-4 cursor-pointer z-10"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <i className="fa-regular fa-eye hover:text-green-500 transition-all ease-in"></i>
              ) : (
                <i className="fa-regular fa-eye-slash hover:text-red-500 transition-all ease-in"></i>
              )}
            </div>
            {touched.passWord && errors.passWord ? (
              <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.passWord}
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone number
              <span className="text-red-500">*</span>
            </label>
            <input
              name="phoneNumber"
              type="phoneNumber"
              id="phoneNumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="phoneNumber"
              onChange={handleChange}
              value={values?.phoneNumber}
              onBlur={handleBlur}
            />
            {touched.phoneNumber && errors.phoneNumber ? (
              <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.phoneNumber}
              </p>
            ) : null}
          </div>

          <div className="flex gap-3 justify-end">
            <Popconfirm
              title="Delete Account"
              description="Are you sure you want to delete?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                manageUserServ
                  .deleteUser(values.id)
                  .then((res) => {
                    console.log(res);
                    messageApi.success("Delete successfully");
                    messageApi.success("Delete successfully");
                    localStorage.removeItem(TOKEN);
                    localStorage.removeItem(USER_LOGIN);
                    navigate("/");
                    window.location.reload();
                  })
                  .catch((err) => {
                    console.log(err);
                    if (err.response.data.content) {
                      messageApi.error(
                        "You have created a project. If you want to delete this account, please delete all of your projects."
                      );
                    } else if (
                      err.response.status === 401 &&
                      err.response.statusText === "Unauthorized"
                    ) {
                      messageApi.error("You must login to use these function.");
                    } else {
                      messageApi.error("Delete failed.");
                    }
                  });
              }}
              okButtonProps={{
                style: { backgroundColor: "red", color: "white" },
              }}
            >
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-500 dark:hover:red-300 dark:focus:ring-red-800 duration-300 hover:text-red-400"
              >
                Delete Account Permanently
              </button>
            </Popconfirm>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:slate-200 dark:focus:ring-blue-800 duration-300 hover:text-blue-400"
            >
              Update profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
