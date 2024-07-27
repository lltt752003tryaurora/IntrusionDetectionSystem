import React, { useEffect, useState } from "react";
// import antd components
import {
  DeleteOutlined,
  FormOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { message, Popconfirm, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { handleDrawerOpen } from "../../../redux/drawerSlice";
import ProjectFormEdit from "./ProjectFormEdit";
import { editArrProjects, getAllProjectAPI } from "../../../redux/projectSlice";
import { manageProjectServ } from "../../../service/manageProject";

export default function ProjectActionButtons({ project }) {
  let dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataChange, setDataChange] = useState({});

  useEffect(() => {
    dispatch(getAllProjectAPI());
  }, [dataChange]);

  const handleDeleteProject = () => {
    manageProjectServ
      .deleteProjectAuthorize(project)
      .then((res) => {
        console.log(res);
        messageApi.success("Delete successfully");
        setDataChange(project);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.statusCode === 403) {
          messageApi.error("This project is not authorized by you");
        }
      });
  };

  return (
    <>
      {contextHolder}
      <div
        id="form-edit"
        className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800"
        tabIndex={-1}
        aria-labelledby="drawer-right-label"
      ></div>
      <div className="space-x-2">
        <Tooltip title="Edit Project">
          <button
            onClick={() => {
              // Connect component form edit
              dispatch(
                handleDrawerOpen({
                  Component: <ProjectFormEdit project={project} />,
                })
              );
              // update new form
              dispatch(editArrProjects(project));
            }}
          >
            <span className="p-2 rounded inline-flex justify-center items-center bg-green-500 hover:bg-green-400 text-base text-white transition duration-300 cursor-pointer">
              <FormOutlined />
            </span>
          </button>
        </Tooltip>
        <Popconfirm
          title="Are you sure you want to delete this project ?"
          onConfirm={handleDeleteProject}
          okText="Yes"
          okButtonProps={{
            danger: true,
            type: "default",
            size: "large",
            className: "btn-delete-ok",
          }}
          cancelText="No"
          cancelButtonProps={{
            size: "large",
            className: "btn-delete-cancel",
          }}
        >
          <Tooltip title="Delete Project">
            <span className="p-2 rounded inline-flex justify-center items-center bg-red-500 hover:bg-red-600 text-base text-white transition duration-300 cursor-pointer">
              <DeleteOutlined />
            </span>
          </Tooltip>
        </Popconfirm>
      </div>
    </>
  );
}
