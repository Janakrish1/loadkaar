import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: "",
        password: "",
        role: ""
    },
    reducers: {
        setUser: (state, action) => {
            return { ...state, ...action.payload};
        },
        clearUser: (state) => {
            state.email = "";
            state.password = "";
            state.role = "";
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;