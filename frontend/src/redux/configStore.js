import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import projectSlice from "./projectSlice";
import drawerSlice from "./drawerSlice";
import taskSlice from "./taskSlice";

const store = configureStore({
  reducer: {
    userSlice,
    projectSlice,
    drawerSlice,
    taskSlice,
  },
  devTools: true
});

export default store;
