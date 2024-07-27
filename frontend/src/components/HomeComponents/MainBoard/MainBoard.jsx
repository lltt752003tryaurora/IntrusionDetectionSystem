import React, { useEffect, useState } from "react";
import { Button, Modal, Tooltip, Avatar, Empty } from "antd";
import Background from "../../../asset/img/rainBg.jpg";
import { MenuFoldOutlined, PlusSquareFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleDrawerOpen } from "../../../redux/drawerSlice";
import CreateTask from "../../../page/Home/Task/CreateTask";
import {
  getAllProjectAPI,
  getDetailProjectAPI,
} from "../../../redux/projectSlice";
import { getTaskDetailAPI } from "../../../redux/taskSlice";

const MainBoard = ({ projectDetail }) => {
  const dispatch = useDispatch();
  const { taskDetail } = useSelector((state) => state.taskSlice);
  const { members, projectName, lstTask, description } = projectDetail;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getDetailProjectAPI(projectDetail.id));
  }, [taskDetail]);

  return (
    <div
      className="main space-y-3 rounded-3xl p-5"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="flex justify-between">
        <div className="text-2xl font-bold text-white pt-5 pb-3">
          {projectName}
        </div>
        <div className="flex justify-center mr-3">
          <Tooltip title="Content project" className="mr-2">
            <div className="text-2xl font-bold text-white pt-5 pb-3">
              <button
                className="border-gray-400 bg-blue-500 rounded-lg p-2 text-lg hover:bg-gray-500 duration-300"
                onClick={showModal}
              >
                <MenuFoldOutlined />
              </button>
              <Modal
                title={projectName}
                open={isModalOpen}
                okType="default"
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </Modal>
            </div>
          </Tooltip>

          <Tooltip title="Create task" className="">
            <button
              onClick={() => {
                // Connect component form create task
                dispatch(
                  handleDrawerOpen({
                    Component: <CreateTask project={projectDetail} />,
                  })
                );
              }}
            >
              <span className="p-2 rounded inline-flex justify-center items-center bg-green-500 hover:bg-green-400 text-base text-white transition duration-300 cursor-pointer">
                <PlusSquareFilled />
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="info flex items-center py-2">
        <div className="search-block">
          <input className="search" />
          <i className="fa fa-search" />
        </div>
        <div className="avatar-group flex space-x-1">
          {members?.map((user, index) => {
            return (
              <div key={index} className="avatar hover:cursor-pointer">
                <img
                  className="hover:h-12 hover:w-12"
                  src={user.avatar}
                  alt={user.avatar}
                  title={user.name}
                />
              </div>
            );
          })}
        </div>

        <div className="text">Recently Updated</div>
      </div>
      <div className="content grid grid-cols-4 gap-4 py-5 rounded-lg">
        {lstTask?.map((task, index) => {
          return (
            <>
              <div
                key={index}
                className="card w-65 border-0 rounded-xl bg-slate-400 h-96"
              >
                <div className="card-header font-bold rounded-t-xl text-black bg-red-300">
                  {task.statusName}
                </div>
                {task.lstTaskDeTail.length != 0 ? (
                  <ul className="list-group rounded-b-xl list-group-flush bg-slate-400 py-2 max-h-15 overflow-y-auto">
                    {task.lstTaskDeTail?.map((taskInf, index) => {
                      return (
                        <li
                          className="list-group-item cursor-pointer p-2 rounded-lg"
                          data-toggle="modal"
                          data-target="#infoModal"
                          key={index}
                          onClick={() => {
                            dispatch(getTaskDetailAPI(taskInf.taskId));
                          }}
                        >
                          <p className="font-bold mb-2">{taskInf.taskName}</p>
                          <div className="block flex justify-between text-center items-center gap-11">
                            <div className="block-left">
                              {taskInf.taskTypeDetail.id === 1 ? (
                                <span className="mr-1">⚠️</span>
                              ) : taskInf.taskTypeDetail.id === 2 ? (
                                <span className="mr-1">✅</span>
                              ) : (
                                "❌"
                              )}
                              {taskInf.priorityTask.priorityId === 1 ? (
                                <span className="">⬆️</span>
                              ) : taskInf.priorityTask.priorityId === 2 ? (
                                <span className="">➖</span>
                              ) : taskInf.priorityTask.priorityId === 3 ? (
                                <span className="">↘️</span>
                              ) : taskInf.priorityTask.priorityId === 4 ? (
                                <span className="">⬇</span>
                              ) : (
                                "❌"
                              )}
                            </div>
                            <div className="block-right">
                              <div className="avatar-group flex">
                                {taskInf.assigness?.map((mem, index) => {
                                  return (
                                    <Avatar
                                      key={index}
                                      alt={mem.name}
                                      src={
                                        <img
                                          src={mem.avatar}
                                          title={mem.name}
                                          alt={mem.avatar}
                                        />
                                      }
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className="list-group list-group-flush bg-slate-400 py-2">
                    <li className="list-group-item cursor-pointer p-2 rounded-lg">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </li>
                  </ul>
                )}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default MainBoard;
