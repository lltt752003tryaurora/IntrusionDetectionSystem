import { CREATE_TASK, DELETE_TASK, GET_ALL_PRIORITIES, GET_ALL_STATUS, GET_ALL_TASK_TYPES, GET_TASK_DETAIL, UPDATE_ASSIGN_TASK, UPDATE_STATUS_TASK, UPDATE_TASK } from "../util/constant/settingSystem";
import { https } from "./config";

export const manageTaskServ = {
    // Get all task types
    getAllTaskTypes: () => {
        return https.get(GET_ALL_TASK_TYPES);
    },

    // Get all priorities
    getAllPriorities: () => {
        return https.get(GET_ALL_PRIORITIES);
    },

    // create a new task
    createTask: (data) => {
        return https.post(CREATE_TASK, data);
    },

    // get all status task
    getAllStatus: () => {
        return https.get(GET_ALL_STATUS);
    },

    // get task detail 
    getTaskDetail: (taskId) => {
        return https.get(GET_TASK_DETAIL + taskId);
    },

    // update status task
    updateStatusTask: (data) => {
        return https.put(UPDATE_STATUS_TASK, data);
    },

    // update status task
    updateAssignTask: (data) => {
        return https.post(UPDATE_ASSIGN_TASK, data);
    },

    // update status task
    updateTask: (data) => {
        return https.post(UPDATE_TASK, data);
    },

    // delete task
    deleteTask: (taskId) => {
        return https.delete(DELETE_TASK + taskId, taskId);
    },
};
