import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDrawerOpen: false,
    DrawerContent: null,
};

const drawerSlice = createSlice({
    name: "drawerSlice",
    initialState,
    reducers: {
        handleDrawerOpen: (state, action) => {
            state.DrawerContent = action.payload.Component;
            state.isDrawerOpen = true;
        },
        closeDrawer: (state) => {
            state.isDrawerOpen = false;
            state.DrawerContent = null;
        },
    },
});

export const { handleDrawerOpen, closeDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
