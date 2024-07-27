import { ADD_MEMBER_PROJECT, DEL_MEMBER_PROJECT, GET_USER, GET_USER_BY_PROJECT_ID, SIGN_IN, SIGN_UP, DELETE_USER, EDIT_USER } from "../util/constant/settingSystem";
import { https } from "./config";

export const manageUserServ = {
  // sign in
  signin: (data) => {
    return https.post(SIGN_IN, data);
  },
  // sign up
  signup: (data) => {
    return https.post(SIGN_UP, data);
  },
  // get all user
  getUser: (idProject) => {
    return https.get(GET_USER + idProject);
  },
  deleteUser: (userID) => {
    return https.delete(DELETE_USER + userID, userID);
  },
  // add member in project 
  addMemberInProject: (userProject) => {
    return https.post(ADD_MEMBER_PROJECT, userProject);
  },
  // delete member in project
  deleteMemberInProject: (userProject) => {
    return https.post(DEL_MEMBER_PROJECT, userProject);
  },
  // get user by project id
  getUserByProjectId: (projectId) => {
    return https.get(GET_USER_BY_PROJECT_ID + projectId);
  },

  // edit user 
  editUser: (data) => {
    return https.put(EDIT_USER, data);
  }
};
