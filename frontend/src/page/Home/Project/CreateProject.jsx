import React, { useEffect, useRef, useState } from "react";
import Background1 from "../../../asset/img/rainBg.jpg";
import { Editor } from "@tinymce/tinymce-react";
import { API_KEY_TINY } from "../../../util/constant/settingSystem";
import { useFormik } from "formik";
import { message, Popconfirm } from "antd";
import { getProjectCategoryAPI } from "../../../redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { manageProjectServ } from "../../../service/manageProject";
import * as Yup from "yup";

const CreateProject = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { arrCategories } = useSelector((state) => state.projectSlice);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjectCategoryAPI());
  }, []);

  const editorRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      projectName: "",
      description: "",
      categoryId: "",
      alias: "",
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      manageProjectServ
        .createProjectAuthorize(values)
        .then((res) => {
          console.log(res);
            messageApi.success("Create successfully.");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.content) {
            messageApi.error(err.response.data.content);
          } else if (
            err.response.status === 401 &&
            err.response.statusText === "Unauthorized"
          ) {
            messageApi.error("You must login to use these function.");
          } else {
              messageApi.error("Create failed.");
          }
        });
      resetForm();
    },
    validationSchema: Yup.object().shape({
      projectName: Yup.string().required("Data must be entered in this field."),
      description: Yup.string().required("Data must be entered in this field."),
      categoryId: Yup.string().required("You must select project."),
      alias: Yup.string().required("Data must be entered in this field."),
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
          Create Your Project
        </h1>
        <form className="space-y-3 p-5" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="projectName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Project Name
              <span className="text-red-500">*</span>
            </label>
            <input
              name="projectName"
              type="projectName"
              id="projectName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Name Project"
              onChange={handleChange}
              value={values.projectName}
              onBlur={handleBlur}
            />
            {touched.projectName && errors.projectName ? (
              <span className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.projectName}
              </span>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              htmlFor="alias"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Summary
              <span className="text-red-500">*</span>
            </label>
            <input
              name="alias"
              type="alias"
              id="alias"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Summary Project"
              onChange={handleChange}
              value={values.alias}
              onBlur={handleBlur}
            />
            {touched.alias && errors.alias ? (
              <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.alias}
              </p>
            ) : null}
          </div>
          <div classname="mb-6">
            <label
              htmlFor="categoryId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Project Categories
              <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChange}
              value={values.categoryId}
              onBlur={handleBlur}
            >
              <option value="0">Select your project</option>
              {arrCategories?.map((item, index) => {
                return (
                  <option value={item.id} key={index}>
                    {item.projectCategoryName}
                  </option>
                );
              })}
            </select>
            {touched.categoryId && errors.categoryId ? (
              <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.categoryId}
              </p>
            ) : null}
          </div>
          <div classname="mb-6">
            <h1 className="text-white font-semibold mb-3">
              Description<span className="text-red-500">*</span>
            </h1>
            <Editor
              apiKey={API_KEY_TINY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue="This is the initial content of the editor."
              on
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(value) => {
                setFieldValue("description", value);
              }}
              value={values.description}
              onBlur={handleBlur}
            />
            {touched.description && errors.description ? (
              <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.description}
              </p>
            ) : null}
          </div>

          <div className="flex gap-3 justify-end">
            <Popconfirm
              title="Reset form"
              description="Are you sure you want to reset?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleReset}
              okButtonProps={{
                style: { backgroundColor: "red", color: "white" },
              }}
            >
              <button
                type="button"
                className="text-black bg-white hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-white dark:focus:ring-white-800 duration-300 hover:text-slate-100"
              >
                Reset
              </button>
            </Popconfirm>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:slate-200 dark:focus:ring-blue-800 duration-300 hover:text-blue-400"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
