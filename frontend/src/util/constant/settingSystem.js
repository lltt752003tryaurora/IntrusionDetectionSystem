export const TokenCybersoft =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA0OCIsIkhldEhhblN0cmluZyI6IjEwLzAyLzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcwNzUyMzIwMDAwMCIsIm5iZiI6MTY3OTY3NzIwMCwiZXhwIjoxNzA3NjcwODAwfQ.N-naoH9C9l_9p7kMChk45-IrJfIqEYyMlZijuzHsXsI";

// token authorization
export const TOKEN = "access_token";
export const USER_LOGIN = "USER_LOGIN";

// api text editor
export const API_KEY_TINY = "80kjrawez62oz9tf55pg9dn5gcvm0m0lcacj5o8zx71l1dl1";

// BASE-API
export const URL_DOMAIN = "https://jiranew.cybersoft.edu.vn";

// ENDPOINT-API

// API Manage about project
const GET_ALL_PROJECT = "/api/Project/getAllProject"
const GET_PROJECT_CATEGORY = "/api/ProjectCategory"
const CREATE_PROJECT_AUTHORIZE = "/api/Project/createProjectAuthorize"
const UPDATE_PROJECT_AUTHORIZE = "/api/Project/updateProject?projectId="
const DELETE_PROJECT_AUTHORIZE = "/api/Project/deleteProject?projectId="
const GET_PROJECT_DETAIL = "/api/Project/getProjectDetail?id="
const ADD_MEMBER_PROJECT = "/api/Project/assignUserProject"
const DEL_MEMBER_PROJECT = "/api/Project/removeUserFromProject"

// API Manage about user
const SIGN_IN = "/api/Users/signin"
const SIGN_UP = "/api/Users/signup"
const GET_USER = "/api/Users/getUser?keyword="
const DELETE_USER = "/api/Users/deleteUser?id="
const EDIT_USER = "/api/Users/editUser"
const GET_USER_BY_PROJECT_ID = "/api/Users/getUserByProjectId?idProject="


// API about task
const GET_ALL_TASK_TYPES = "/api/TaskType/getAll"
const GET_ALL_PRIORITIES = "/api/Priority/getAll"
const CREATE_TASK = "/api/Project/createTask"
const GET_TASK_DETAIL = "/api/Project/getTaskDetail?taskId="
const UPDATE_STATUS_TASK = "/api/Project/updateStatus"
const GET_ALL_STATUS = "/api/Status/getAll"
const UPDATE_TASK = "/api/Project/updateTask"
const UPDATE_ASSIGN_TASK = "/api/Project/assignUserTask"
const DELETE_TASK = "/api/Project/removeTask?taskId="


export { GET_ALL_PROJECT, GET_PROJECT_CATEGORY, DELETE_PROJECT_AUTHORIZE, UPDATE_PROJECT_AUTHORIZE, CREATE_PROJECT_AUTHORIZE, SIGN_IN, SIGN_UP, GET_USER, ADD_MEMBER_PROJECT, DEL_MEMBER_PROJECT, GET_PROJECT_DETAIL, GET_ALL_TASK_TYPES, GET_ALL_PRIORITIES, CREATE_TASK, GET_ALL_STATUS, GET_USER_BY_PROJECT_ID, GET_TASK_DETAIL, UPDATE_STATUS_TASK, DELETE_USER, EDIT_USER, UPDATE_TASK, UPDATE_ASSIGN_TASK, DELETE_TASK }