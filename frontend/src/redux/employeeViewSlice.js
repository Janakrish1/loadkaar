import { createSlice } from "@reduxjs/toolkit";

const employeeView = createSlice({
    name: "employeeSlice",
    initialState: {
        curretView: "default",
        activeMenu: "Current Tasks",
    },
    reducers: {
        setView: (state, action) => {
            state.currentView = typeof action.payload === "string" ? action.payload : action.payload.currentView;
            state.activeMenu = typeof action.payload === "string" ? action.payload : action.payload.activeMenu;
        },
        clearView: (state) => {
            state.curretView = "default";
            state.activeMenu = "Current Tasks";
        },
    },
});

export const { setView, clearView } = employeeView.actions;

export default employeeView.reducer;