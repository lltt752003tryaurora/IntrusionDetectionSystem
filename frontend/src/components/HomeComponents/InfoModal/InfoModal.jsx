import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { API_KEY_TINY } from "../../../util/constant/settingSystem";

import {
  changeTaskModel,
  changeTaskModelAssignMember,
  changeTaskModelDescription,
  getAllStatusAPI,
  getTaskDetailAPI,
  removeUserFromAssignessInTask,
  updateStatusTaskAPI,
  updateTaskAPI,
} from "../../../redux/taskSlice";
import { Tag, Avatar, Slider, Select, message, Popconfirm } from "antd";
import { isVisible } from "@testing-library/user-event/dist/utils";
import { DownOutlined } from "@ant-design/icons";
import { getDetailProjectAPI } from "../../../redux/projectSlice";
import { manageTaskServ } from "../../../service/manageTask";
import { DeleteOutlined } from "@ant-design/icons";

const InfoModal = ({ projectDetail }) => {
  const { taskDetail, arrStatus, taskUpdate } = useSelector(
    (state) => state.taskSlice
  );
  const dispatch = useDispatch();
  console.log("taskdetail", taskDetail);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    taskName,
    taskId,
    description,
    statusId,
    assigness,
    priorityId,
    originalEstimate,
    timeTrackingSpent,
    timeTrackingRemaining,
    typeId,
    projectId,
  } = taskDetail;
  const [timeTracking, setTimeTracking] = useState({
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0,
  });

  const MAX_COUNT = 1;
  const [value, setValue] = React.useState(["hihi"]);
  const suffix = (
    <>
      <span>
        {value.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  const userOptions = projectDetail.members
    ?.filter((mem) => {
      // check những user chưa được thêm thì hiện ra ở Add Member
      let index = assigness?.findIndex((assign) => assign.id === mem.userId);
      return index === -1; // Trả về true nếu thành viên không nằm trong danh sách assigness
    })
    .map((item) => {
      return {
        value: item.userId,
        label: item.name,
      };
    });

  const [visiableEditor, setVisiableEditor] = useState(false);
  const [contentEditor, setContentEditor] = useState(description);
  const editorRef = useRef(null);

  useEffect(() => {
    dispatch(getDetailProjectAPI(projectDetail.id));
  }, [taskDetail]);

  const renderDescription = () => {
    return (
      <>
        {contextHolder}
        <div>
          {visiableEditor ? (
            <div className="mt-2">
              <Editor
                apiKey={API_KEY_TINY}
                initialValue={description}
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
                  // setFieldValue("description", value);
                  console.log(value);
                  setContentEditor(value);
                  const newTaskDetail = {
                    listUserAsign: assigness.map((assign) => assign.id),
                    taskId: taskId.toString(),
                    taskName: taskName,
                    description: value,
                    statusId: statusId,
                    originalEstimate: originalEstimate,
                    timeTrackingSpent: timeTrackingSpent,
                    timeTrackingRemaining: timeTrackingRemaining,
                    projectId: projectId,
                    typeId: typeId,
                    priorityId: priorityId,
                  };
                  dispatch(updateTaskAPI(newTaskDetail));
                }}
                // value={description}
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="bg-slate-300 text-black rounded-md p-2 mr-2 font-bold duration-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => {
                    setVisiableEditor(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white rounded-md p-2 font-bold duration-300 hover:bg-slate-400 hover:text-black"
                  onClick={() => {
                    dispatch(changeTaskModelDescription(contentEditor));
                    setVisiableEditor(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              className="hover:cursor-pointer border-4 border-slate-500 mt-3 rounded-lg hover:border-slate-400 duration-300"
              onClick={() => {
                setVisiableEditor(!visiableEditor);
              }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </>
    );
  };

  const handleChange = (e) => {
    // thay đôi trạng thái ở thẻ select
    const { name, value } = e.target; // lấy giá trị user chọn
    dispatch(changeTaskModel({ name, value }));
  };

  useEffect(() => {
    dispatch(getTaskDetailAPI());
    dispatch(getAllStatusAPI());
  }, [taskDetail]);

  return (
    <div
      className="modal fade"
      id="infoModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="infoModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-info">
        <div className="modal-content">
          <div className="modal-header">
            <div className="task-title">
              <i className="fa fa-bookmark" />
              <span className="font-bold">
                <Tag color="cyan">TASK: {taskName}</Tag> ➖
                <Tag color="green">{taskId}</Tag>
              </span>
            </div>

            <div className="task-click flex">
              <div>
                <i className="fab fa-telegram-plane" />
                <span style={{ paddingRight: 20 }}>Give feedback</span>
              </div>
              <div>
                <i className="fa fa-link" />
                <span style={{ paddingRight: 20 }}>Copy link</span>
              </div>
              <Popconfirm
                title="Delete task"
                description="Are you sure to delete this task?"
                onConfirm={() => {
                  manageTaskServ
                    .deleteTask(taskId)
                    .then((res) => {
                      messageApi.success("Deleted task successfully.");
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                      console.log(res);
                    })
                    .catch((err) => {
                      messageApi.error("Deleted task failed.");
                      console.log(err);
                    });
                  dispatch(getTaskDetailAPI(taskId));
                }}
                //   onCancel={cancel}
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <DeleteOutlined
                  className="hover:text-slate-500 duration"
                  style={{ color: "red" }}
                  title="Delete"
                />
              </Popconfirm>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>

          <div className="modal-body">
            <div className="container-fluid">
              <div>
                <select
                  id="typeId"
                  type="number"
                  name="typeId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[130px] p-2.5 dark:bg-slate-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    handleChange(e);
                    const newTaskDetail = {
                      listUserAsign: assigness.map((assign) => assign.id),
                      taskId: taskId.toString(),
                      taskName: taskName,
                      description: description,
                      statusId: statusId,
                      originalEstimate: originalEstimate,
                      timeTrackingSpent: timeTrackingSpent,
                      timeTrackingRemaining: timeTrackingRemaining,
                      projectId: projectId,
                      typeId: e.target.value,
                      priorityId: priorityId,
                    };
                    dispatch(updateTaskAPI(newTaskDetail));
                  }}
                  value={typeId}
                >
                  <option value="1">⚠️ Bug</option>
                  <option value="2">✅ New Task</option>
                </select>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="description">
                    <Tag color="green" className="font-bold text-xs mt-4">
                      DESCRIPTION
                    </Tag>
                    {renderDescription()}
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: 10 }}>
                    Jira Software (software projects) issue types:
                  </div>
                  <div className="title-content">
                    <div>
                      <span>
                        BUG <i className="fa-solid fa-bug"></i>
                      </span>
                    </div>
                    <div>
                      <span>
                        STORY <i className="fa-solid fa-book-open-reader"></i>
                      </span>
                    </div>
                    <div>
                      <span>
                        TASK <i className="fa-solid fa-list-check"></i>
                      </span>
                    </div>
                  </div>
                  <div className="comment">
                    <h6>Comment</h6>
                    <div className="block-comment flex">
                      <div className="avatar">
                        <img
                          src={require("../../../asset/img/download (1).jfif")}
                          alt=""
                        />
                      </div>
                      <div className="input-comment">
                        <input type="text" placeholder="Add a comment ..." />
                        <p>
                          <span style={{ fontWeight: 500, color: "gray" }}>
                            Protip:
                          </span>
                          <span>
                            press
                            <span
                              style={{
                                fontWeight: "bold",
                                background: "#ecedf0",
                                color: "#b4bac6",
                              }}
                            >
                              M
                            </span>
                            to comment
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="lastest-comment flex">
                      <div className="avatar h-10 w-20 mr-4">
                        <img
                          src={require("../../../asset/img/download (1).jfif")}
                          alt=""
                        />
                      </div>
                      <div>
                        <p style={{ marginBottom: 5 }}>
                          Lord Gaben <span>a month ago</span>
                        </p>
                        <p style={{ marginBottom: 5 }}>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Repellendus tempora ex voluptatum saepe ab
                          officiis alias totam ad accusamus molestiae?
                        </p>
                        <div>
                          <span style={{ color: "#929398" }}>Edit</span>•
                          <span style={{ color: "#929398" }}>Delete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="status">
                    <h6 className="font-bold text-lg mb-3">
                      <Tag color="processing">STATUS</Tag>
                    </h6>
                    <select
                      name="statusId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => {
                        const newTaskDetail = {
                          listUserAsign: assigness.map((assign) => assign.id),
                          taskId: taskId.toString(),
                          taskName: taskName,
                          description: description,
                          statusId: e.target.value,
                          originalEstimate: originalEstimate,
                          timeTrackingSpent: timeTrackingSpent,
                          timeTrackingRemaining: timeTrackingRemaining,
                          projectId: projectId,
                          typeId: typeId,
                          priorityId: priorityId,
                        };
                        dispatch(updateTaskAPI(newTaskDetail));
                        // console.log("new", newTaskDetail);
                        // const action = {
                        //   taskId: taskId,
                        //   statusId: e.target.value,
                        // };
                        // dispatch(updateStatusTaskAPI(action));
                        handleChange(e);
                      }}
                      value={statusId}
                    >
                      {/* <option value="0">📊 Select status</option> */}
                      {arrStatus?.map((item, index) => {
                        return (
                          <option value={item.statusId} key={index}>
                            {item.statusName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="assignees">
                    <h6 className="font-bold text-lg my-3">
                      <Tag color="cyan">ASSIGNES MEMBER</Tag>
                    </h6>
                    <div className="flex items-center text-center">
                      {assigness?.map((user, index) => {
                        return (
                          <div
                            key={index}
                            className="rounded-xl bg-slate-200 p-1 mr-1"
                          >
                            <Avatar
                              alt={user}
                              src={
                                <img
                                  src={user.avatar}
                                  title={user.name}
                                  alt={user.avatar}
                                />
                              }
                            />
                            <i
                              className="fa fa-times p-1 ml-1 hover:cursor-pointer hover:bg-slate-300 duration-300 hover:rounded-lg"
                              onClick={() => {
                                let assignessNew = assigness.filter(
                                  (mem) => mem.id !== user.id
                                );
                                let assignessNewId = assignessNew.map(
                                  (user, index) => {
                                    return user.id;
                                  }
                                );
                                dispatch(removeUserFromAssignessInTask(user));

                                console.log(assignessNewId);
                                const newTaskDetail = {
                                  listUserAsign: assignessNewId,
                                  taskId: taskId.toString(),
                                  taskName: taskName,
                                  description: description,
                                  statusId: statusId,
                                  originalEstimate: originalEstimate,
                                  timeTrackingSpent: timeTrackingSpent,
                                  timeTrackingRemaining: timeTrackingRemaining,
                                  projectId: projectId,
                                  typeId: typeId,
                                  priorityId: priorityId,
                                };
                                dispatch(updateTaskAPI(newTaskDetail));
                              }}
                            ></i>
                          </div>
                        );
                      })}
                    </div>

                    <Select
                      mode="multiple"
                      placeholder="Add member"
                      options={userOptions}
                      maxCount={MAX_COUNT}
                      // defaultValue={}
                      // optionFilterProp="label"
                      suffixIcon={suffix}
                      // value={value}
                      onChange={(e) => {
                        // console.log("gias tri them vao", e);
                        setValue(e);
                        // tìm ra user được chọn
                        let userSelected = projectDetail.members?.find(
                          (mem) => mem.userId == e
                        );
                        let userSelectedNew = {
                          ...userSelected,
                          id: userSelected?.userId,
                        }; // thêm thuộc tính id cho userSelect
                        // console.log("selec", userSelected);

                        // update sự thay đổi trên api dữ liệu, chống reload
                        let listUserAssignId = taskDetail.assigness?.map(
                          (user, index) => {
                            return user.id;
                          }
                        );

                        if (userSelected) {
                          listUserAssignId.push(e[0]);
                        }

                        // dùng spread operator để thêm thành viên vào task
                        const newTaskDetail = {
                          listUserAsign: listUserAssignId,
                          taskId: taskId.toString(),
                          taskName: taskName,
                          description: description,
                          statusId: statusId,
                          originalEstimate: originalEstimate,
                          timeTrackingSpent: timeTrackingSpent,
                          timeTrackingRemaining: timeTrackingRemaining,
                          projectId: projectId,
                          typeId: typeId,
                          priorityId: priorityId,
                        };

                        dispatch(updateTaskAPI(newTaskDetail));
                        // dispatch để thay đổi giao diện thêm member vào task => thay đổi taskDetail
                        dispatch(changeTaskModelAssignMember(userSelectedNew));
                      }}
                      className="w-full hover:cursor-pointer mt-2"
                    />
                  </div>
                  <div className="priority" style={{ marginBottom: 20 }}>
                    <h6 className="font-bold text-lg my-3">
                      <Tag color="geekblue">PRIORITY</Tag>
                    </h6>
                    <select
                      name="priorityId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={priorityId}
                      onChange={(e) => {
                        console.log(e.target.value);
                        handleChange(e);
                        const newTaskDetail = {
                          listUserAsign: assigness.map((assign) => assign.id),
                          taskId: taskId.toString(),
                          taskName: taskName,
                          description: description,
                          statusId: statusId,
                          originalEstimate: originalEstimate,
                          timeTrackingSpent: timeTrackingSpent,
                          timeTrackingRemaining: timeTrackingRemaining,
                          projectId: projectId,
                          typeId: typeId,
                          priorityId: e.target.value,
                        };
                        dispatch(updateTaskAPI(newTaskDetail));
                      }}
                    >
                      <option value="1">⬆️ High</option>
                      <option value="2">➖ Medium</option>
                      <option value="3">↘️ Low</option>
                      <option value="4">⬇ Lowest</option>
                    </select>
                  </div>
                  <div className="estimate">
                    <h6 className="font-bold text-lg my-3">
                      <Tag color="purple">ORIGINAL ESTIMATE</Tag>
                    </h6>
                    <input
                      type="number"
                      name="originalEstimate"
                      id="originalEstimate"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={originalEstimate}
                      onChange={(e) => {
                        console.log(e.target.value);
                        handleChange(e);
                        const newTaskDetail = {
                          listUserAsign: assigness.map((assign) => assign.id),
                          taskId: taskId.toString(),
                          taskName: taskName,
                          description: description,
                          statusId: statusId,
                          originalEstimate: e.target.value,
                          timeTrackingSpent: timeTrackingSpent,
                          timeTrackingRemaining: timeTrackingRemaining,
                          projectId: projectId,
                          typeId: typeId,
                          priorityId: priorityId,
                        };
                        dispatch(updateTaskAPI(newTaskDetail));
                      }}
                    />
                  </div>
                  <div className="time-tracking">
                    <h6 className="font-bold text-lg mt-3 mb-1">
                      <Tag color="magenta">TIME TRACKING</Tag>
                    </h6>
                    <div className="flex text-center items-center">
                      <i className="fa fa-clock" />
                      <div className="w-full">
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
                          <Tag color="cyan">
                            {timeTracking.timeTrackingSpent}h logged
                          </Tag>
                          <Tag color="magenta">
                            {timeTracking.timeTrackingRemaining}h remaining
                          </Tag>
                        </div>
                      </div>
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
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          name="timeTrackingSpent"
                          onChange={(e) => {
                            handleChange(e);
                            console.log(e.target.value);
                            const newTaskDetail = {
                              listUserAsign: assigness.map(
                                (assign) => assign.id
                              ),
                              taskId: taskId.toString(),
                              taskName: taskName,
                              description: description,
                              statusId: statusId,
                              originalEstimate: originalEstimate,
                              timeTrackingSpent: e.target.value,
                              timeTrackingRemaining: timeTrackingRemaining,
                              projectId: projectId,
                              typeId: typeId,
                              priorityId: priorityId,
                            };
                            dispatch(updateTaskAPI(newTaskDetail));
                            const numberValue = Number(e.target.value);
                            setTimeTracking({
                              ...timeTracking,
                              timeTrackingSpent: numberValue,
                            });
                          }}
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
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={(e) => {
                            handleChange(e);
                            const numberValue = Number(e.target.value);
                            setTimeTracking({
                              ...timeTracking,
                              timeTrackingRemaining: numberValue,
                            });
                            const newTaskDetail = {
                              listUserAsign: assigness.map(
                                (assign) => assign.id
                              ),
                              taskId: taskId.toString(),
                              taskName: taskName,
                              description: description,
                              statusId: statusId,
                              originalEstimate: originalEstimate,
                              timeTrackingSpent: timeTrackingSpent,
                              timeTrackingRemaining: e.target.value,
                              projectId: projectId,
                              typeId: typeId,
                              priorityId: priorityId,
                            };
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ color: "#929398" }}>Create at a month ago</div>
                  <div style={{ color: "#929398" }}>
                    Update at a few seconds ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
