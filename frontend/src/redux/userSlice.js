import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_LOGIN } from "../util/constant/settingSystem";
import { manageUserServ } from "../service/manageUser";

let dataUserLocal = "null";
if (USER_LOGIN) {
  dataUserLocal = JSON.parse(localStorage.getItem(USER_LOGIN));
}

const initialState = {
  user: dataUserLocal,
  userSearch: [],
  arrUser: [],
  passWord: "rongtoet"
};

export const getUserSearchAPI = createAsyncThunk(
  "user/getUserSearchAPI",
  async (idProject) => {
    const res = await manageUserServ.getUser(idProject)
    return res.data.content;
  }
);

export const getUserByIdProjectAPI = createAsyncThunk(
  "user/getUserByIdProjectAPI",
  async (idProject) => {
    const res = await manageUserServ.getUserByProjectId(idProject)
    return res.data.content;
  }
);

export const editUserAPI = createAsyncThunk(
  "user/editUserAPI",
  async (data) => {
    const res = await manageUserServ.editUser(data)
    return res.data.content;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDataUser: (state, action) => {
      state.user = action.payload;
    },
    storePassWord: (state, action) => {
      state.passWord = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserSearchAPI.fulfilled, (state, action) => {
      state.userSearch = action.payload;
    }).addCase(getUserByIdProjectAPI.fulfilled, (state, action) => {
      state.arrUser = action.payload;
    }).addCase(editUserAPI.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setDataUser, storePassWord } = userSlice.actions;

export default userSlice.reducer;
