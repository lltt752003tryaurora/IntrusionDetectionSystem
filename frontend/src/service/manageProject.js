import { CREATE_PROJECT_AUTHORIZE, DELETE_PROJECT_AUTHORIZE, GET_ALL_PROJECT, GET_PROJECT_CATEGORY, GET_PROJECT_DETAIL, UPDATE_PROJECT_AUTHORIZE } from "../util/constant/settingSystem";
import { https } from "./config";

export const manageProjectServ = {
  // Get all categories
  getProjectCategory: () => {
    return https.get(GET_PROJECT_CATEGORY);
  },

  // Get all project
  getAllProject: () => {
    return https.get(GET_ALL_PROJECT);
  },

  // Create project
  createProjectAuthorize: (data) => {
    return https.post(CREATE_PROJECT_AUTHORIZE, data);
  },

  // Update project
  updateProjectAuthorize: (projectUpdate) => {
    return https.put(UPDATE_PROJECT_AUTHORIZE + projectUpdate.id, projectUpdate);
  },

  // Delete project
  deleteProjectAuthorize: (projectDelete) => {
    return https.delete(DELETE_PROJECT_AUTHORIZE + projectDelete.id, projectDelete);
  },

  // Get project detail
  getProjectDetail: (projectId) => {
    return https.get(GET_PROJECT_DETAIL + projectId);
  },

};
