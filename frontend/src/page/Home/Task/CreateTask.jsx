import React, { useEffect, useRef, useState } from "react";
import Background1 from "../../../asset/img/cloud-cloudscape-sky-puffy.jpg";
import { Editor } from "@tinymce/tinymce-react";
import { API_KEY_TINY } from "../../../util/constant/settingSystem";
import { useFormik } from "formik";
import { Input, message, Popconfirm, Select, Slider, Tag } from "antd";
import { BugFilled, PlusCircleFilled } from "@ant-design/icons";
import {
  getAllProjectAPI,
  getDetailProjectAPI,
  getProjectCategoryAPI,
} from "../../../redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { closeDrawer } from "../../../redux/drawerSlice";
import { isVisible } from "@testing-library/user-event/dist/utils";
import {
  getAllPrioritiesAPI,
  getAllStatusAPI,
  getAllTaskTypesAPI,
} from "../../../redux/taskSlice";
import {
  getUserByIdProjectAPI,
  getUserSearchAPI,
} from "../../../redux/userSlice";
import { manageTaskServ } from "../../../service/manageTask";
const CreateTask = ({ project }) => {
  const { arrUser } = useSelector((state) => state.userSlice);
  // Hàm biến đổi option trong thẻ Select
  const userOptions = arrUser?.map((item, index) => {
    return {
      value: item.userId,
      label: item.name,
    };
  });

  const { arrCategories } = useSelector((state) => state.projectSlice);
  const { arrAllTaskTypes, arrPriorities, arrStatus } = useSelector(
    (state) => state.taskSlice
  );
  const { id, description } = project;
  const [messageApi, contextHolder] = message.useMessage();
  const [timeTracking, setTimeTracking] = useState({
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    // rerender after update
    dispatch(getAllProjectAPI());
    dispatch(getProjectCategoryAPI());
    dispatch(getAllTaskTypesAPI());
    dispatch(getAllPrioritiesAPI());
    dispatch(getUserSearchAPI(""));
    dispatch(getAllStatusAPI());
    dispatch(getUserByIdProjectAPI(id));
  }, [project]);

  const handleReset = () => {
    formik.resetForm({
      values: {
        taskName: "",
        description: "",
        statusId: "0",
        originalEstimate: 0,
        timeTrackingSpent: 0,
        timeTrackingRemaining: 0,
        projectId: id,
        typeId: 0,
        priorityId: 0,
        // listUserAsign: [],
      },
    });
  };
  const editorRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      taskName: "",
      description: "",
      statusId: "",
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: id,
      typeId: 0,
      priorityId: 0,
      listUserAsign: [],
    },
    onSubmit: (values) => {
      console.log(values);
      manageTaskServ
        .createTask(values)
        .then((res) => {
          console.log(res);
          dispatch(getDetailProjectAPI(id));
          messageApi.success("Create task successed");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.statusCode == 500) {
            messageApi.error(err.response.data.content);
          } else if (err.response.data.statusCode == 404) {
            messageApi.error(err.response.data.content);
          } else {
            messageApi.error("lỗi");
          }
        });
      setTimeout(() => {
        dispatch(closeDrawer());
      }, 2000);
    },
    validationSchema: Yup.object().shape({
      taskName: Yup.string().required("Data must be entered in this field."),
      description: Yup.string().required("Data must be entered in this field."),
      typeId: Yup.number().notOneOf([0], "Please, select the type task."),
      priorityId: Yup.number().notOneOf(
        [0],
        "Please, select the priority task."
      ),
      statusId: Yup.number()
        .required("Please, select the status task.")
        .notOneOf([0], "Please, select the status task."),
    }),
  });
  const {
    handleBlur,
    handleChange,
    errors,
    handleSubmit,
    setFieldValue,
    values,
    touched,
  } = formik;
  return (
    <>
      {contextHolder}
      <div
        className="container mx-auto rounded-3xl"
        style={{
          backgroundImage: `url(${Background1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1 className="font-bold text-2xl pl-5 pt-4">Create your task</h1>
        <form className="space-y-3 p-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-1">
              <label
                htmlFor="taskName"
                className="block mb-2 text-sm font-medium text-slate-700"
              >
                Task Name
                <span className="text-red-500">*</span>
              </label>
              <input
                name="taskName"
                type="id"
                id="taskName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Name Task"
                value={values.taskName}
                onChange={handleChange}
              />
              {touched.taskName && errors.taskName ? (
                <span className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                  {errors.taskName}
                </span>
              ) : null}
            </div>
            <div className="mb-1">
              <label
                htmlFor="typeId"
                className="block mb-2 text-sm font-medium text-slate-700 hover:cursor-pointer"
              >
                Task type
                <span className="text-red-500">*</span>
              </label>
              <select
                id="typeId"
                type="number"
                name="typeId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(event) => {
                  setFieldValue("typeId", Number(event.target.value));
                }}
                value={values.typeId}
                onBlur={handleBlur}
              >
                <option value="0">✏ Select your task type</option>
                <option value="1">⚠️ Bug</option>
                <option value="2">✅ New Task</option>
              </select>
              {touched.typeId && errors.typeId ? (
                <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                  {errors.typeId}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div classname="mb-6">
              <label
                htmlFor="priorityId"
                className="block mb-2 text-sm font-medium text-slate-700 hover:cursor-pointer"
              >
                Priority
                <span className="text-red-500">*</span>
              </label>
              <select
                id="priorityId"
                name="priorityId"
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(event) => {
                  setFieldValue("priorityId", Number(event.target.value));
                }}
                onBlur={handleBlur}
              >
                <option value="0">🌳 Select Priority</option>
                <option value="1">⬆️ High</option>
                <option value="2">➖ Medium</option>
                <option value="3">↘️ Low</option>
                <option value="4">⬇ Lowest</option>
              </select>
              {touched.priorityId && errors.priorityId ? (
                <p className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                  {errors.priorityId}
                </p>
              ) : null}
            </div>
            <div classname="mb-6">
              <label
                htmlFor="originalEstimate"
                className="block mb-2 text-sm font-medium text-slate-700"
              >
                originalEstimate
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue="0"
                name="originalEstimate"
                id="originalEstimate"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleChange}
                value={values.originalEstimate}
                onBlur={handleBlur}
              />
              {touched.projectName && errors.projectName ? (
                <span className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                  {errors.projectName}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="listUserAsign"
              className="block mb-2 text-sm font-medium text-slate-700 hover:cursor-pointer"
            >
              Assignes Members
              <span className="text-red-500">*</span>
            </label>
            <Select
              mode="multiple"
              placeholder="Please select"
              defaultValue={userOptions}
              options={userOptions}
              optionFilterProp="label"
              onChange={(values) => {
                // set lại giá trị cho lstUserAsign
                setFieldValue("listUserAsign", values);
              }}
              onSelect={(value) => {
                //default search theo value chứ ko search theo label => optionFilterProp
                console.log("valuesearch", value);
              }}
              style={{
                width: "100%",
              }}
              onBlur={handleBlur}
            />
          </div>
          <div classname="mb-6">
            <label
              htmlFor="originalEstimate"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Status
              <span className="text-red-500">*</span>
            </label>
            <select
              id="statusId"
              type="number"
              name="statusId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(event) => {
                setFieldValue("statusId", event.target.value);
              }}
              onBlur={handleBlur}
            >
              <option value="0">📊 Select status</option>
              {arrStatus?.map((item, index) => {
                return (
                  <option value={item.statusId} key={index}>
                    {item.statusName}
                  </option>
                );
              })}
            </select>
            {touched.statusId && errors.statusId ? (
              <span className="text-white bg-red-400 mt-5 inline-block rounded-md py-1 px-2">
                {errors.statusId}
              </span>
            ) : null}
          </div>

          <div className="mb-6">
            <p className="text-white">Time tracking</p>
            <Slider
              onChange={handleChange}
              tooltip={isVisible}
              value={timeTracking.timeTrackingSpent}
              max={
                Number(timeTracking.timeTrackingSpent) +
                Number(timeTracking.timeTrackingRemaining)
              }
            />
            <div className="flex grid-cols-2 gap-4 justify-between mb-3">
              <Tag color="cyan">{timeTracking.timeTrackingSpent}h logged</Tag>
              <Tag color="magenta">
                {timeTracking.timeTrackingRemaining}h remaining
              </Tag>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-6">
                <label
                  htmlFor="timeTrackingSpent"
                  className="block mb-2 text-sm font-medium text-slate-700 hover:cursor-pointer"
                >
                  Time Spent
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  defaultValue="0"
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="timeTrackingSpent"
                  onChange={(event) => {
                    const numberValue = Number(event.target.value);
                    setFieldValue("timeTrackingSpent", numberValue);
                    setTimeTracking({
                      ...timeTracking,
                      timeTrackingSpent: numberValue,
                    });
                  }}
                  onBlur={handleBlur}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="timeTrackingRemaining"
                  className="block mb-2 text-sm font-medium text-slate-700 hover:cursor-pointer"
                >
                  Time Remaining
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  defaultValue="0"
                  min="0"
                  name="timeTrackingRemaining"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(event) => {
                    const numberValue = Number(event.target.value);
                    setFieldValue("timeTrackingRemaining", numberValue);
                    setTimeTracking({
                      ...timeTracking,
                      timeTrackingRemaining: numberValue,
                    });
                  }}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>
          <div classname="mb-6">
            <h1 className="text-white font-semibold mb-3">
              Description<span className="text-red-500">*</span>
            </h1>
            <Editor
              apiKey={API_KEY_TINY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              on
              init={{
                height: 200,
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
              description="Are you sure to reset?"
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
            <Popconfirm
              title="Create task"
              description="Are you sure to create task?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleSubmit}
              okButtonProps={{
                style: { backgroundColor: "green", color: "white" },
              }}
            >
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-700 dark:hover:slate-200 dark:focus:ring-green-800 duration-300 hover:text-green-400"
              >
                Create task
              </button>
            </Popconfirm>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTask;
